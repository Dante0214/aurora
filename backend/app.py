# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
# 설정
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///workportal.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # 실제 운영환경에서는 환경변수로 관리

db = SQLAlchemy(app)
jwt = JWTManager(app)


# 모델 정의
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class WebLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class SharedLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link_id = db.Column(db.Integer, db.ForeignKey("web_link.id"), nullable=False)
    shared_with = db.Column(db.String(80), nullable=False)
    can_write = db.Column(db.Boolean, default=False)


# 회원가입
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "이미 존재하는 사용자명입니다"}), 400

    hashed_password = generate_password_hash(data["password"])
    new_user = User(username=data["username"], password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "회원가입이 완료되었습니다"}), 201


# 로그인
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if user and check_password_hash(user.password, data["password"]):
        access_token = create_access_token(identity=user.username)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"message": "잘못된 인증정보입니다"}), 401


# 로그인 한 사용자 정보 가져오기
@app.route("/api/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    return jsonify({"username": user.username}), 200


# 웹 링크 생성
@app.route("/api/links", methods=["POST"])
@jwt_required()
def create_link():
    current_user = get_jwt_identity()
    data = request.get_json()

    new_link = WebLink(
        created_by=current_user,
        name=data["name"],
        url=data["url"],
        category=data["category"],
    )

    db.session.add(new_link)
    db.session.commit()

    return jsonify({"message": "링크가 생성되었습니다", "id": new_link.id}), 201


# 웹 링크 조회
@app.route("/api/links", methods=["GET"])
@jwt_required()
def get_links():
    current_user = get_jwt_identity()
    search = request.args.get("search", "")
    category = request.args.get("category", "")

    # 기본 쿼리: 사용자가 생성한 링크 + 공유받은 링크
    query = (
        db.session.query(WebLink)
        .distinct()
        .outerjoin(SharedLink, WebLink.id == SharedLink.link_id)
        .filter(
            (WebLink.created_by == current_user)
            | (SharedLink.shared_with == current_user)
        )
    )

    if search:
        query = query.filter(WebLink.name.like(f"%{search}%"))
    if category:
        query = query.filter(WebLink.category == category)

    links = query.all()
    result = []
    for link in links:
        # 소유자이거나 쓰기 권한이 있는 경우 can_edit = True
        can_edit = (link.created_by == current_user) or SharedLink.query.filter_by(
            link_id=link.id, shared_with=current_user, can_write=True
        ).first() is not None

        result.append(
            {
                "id": link.id,
                "name": link.name,
                "url": link.url,
                "category": link.category,
                "created_by": link.created_by,
                "can_edit": can_edit,
            }
        )

    return jsonify(result), 200


# 웹 링크 수정
@app.route("/api/links/<int:link_id>", methods=["PUT"])
@jwt_required()
def update_link(link_id):
    current_user = get_jwt_identity()
    link = WebLink.query.get_or_404(link_id)

    # 권한 확인
    if link.created_by != current_user:
        shared = SharedLink.query.filter_by(
            link_id=link_id, shared_with=current_user, can_write=True
        ).first()
        if not shared:
            return jsonify({"message": "수정 권한이 없습니다"}), 403

    data = request.get_json()
    link.name = data.get("name", link.name)
    link.url = data.get("url", link.url)
    link.category = data.get("category", link.category)

    db.session.commit()
    return jsonify({"message": "링크가 수정되었습니다"}), 200


# 웹 링크 삭제
@app.route("/api/links/<int:link_id>", methods=["DELETE"])
@jwt_required()
def delete_link(link_id):
    current_user = get_jwt_identity()
    link = WebLink.query.get_or_404(link_id)

    if link.created_by != current_user:
        return jsonify({"message": "삭제 권한이 없습니다"}), 403

    db.session.delete(link)
    db.session.commit()
    return jsonify({"message": "링크가 삭제되었습니다"}), 200


# 링크 공유
@app.route("/api/links/<int:link_id>/share", methods=["POST"])
@jwt_required()
def share_link(link_id):
    current_user = get_jwt_identity()
    link = WebLink.query.get_or_404(link_id)

    if link.created_by != current_user:
        return jsonify({"message": "공유 권한이 없습니다"}), 403

    data = request.get_json()
    shared_with = data["username"]
    can_write = data.get("can_write", False)

    # 이미 공유된 경우 권한 업데이트
    shared = SharedLink.query.filter_by(
        link_id=link_id, shared_with=shared_with
    ).first()

    if shared:
        shared.can_write = can_write
    else:
        shared = SharedLink(
            link_id=link_id, shared_with=shared_with, can_write=can_write
        )
        db.session.add(shared)

    db.session.commit()
    return jsonify({"message": "링크가 공유되었습니다"}), 200


# 사용자 목록 조회 API
@app.route("/api/users", methods=["GET"])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    users = User.query.filter(User.username != current_user).all()
    return jsonify([{"username": user.username} for user in users]), 200


# 공유된 링크 조회 API
@app.route("/api/links/<int:link_id>/shares", methods=["GET"])
@jwt_required()
def get_shares(link_id):
    current_user = get_jwt_identity()
    link = WebLink.query.get_or_404(link_id)

    if link.created_by != current_user:
        return jsonify({"message": "권한이 없습니다"}), 403

    shares = SharedLink.query.filter_by(link_id=link_id).all()
    return (
        jsonify(
            [
                {"username": share.shared_with, "can_write": share.can_write}
                for share in shares
            ]
        ),
        200,
    )


# 공유 권한 회수 API
@app.route("/api/links/<int:link_id>/unshare/<string:username>", methods=["DELETE"])
@jwt_required()
def unshare_link(link_id, username):
    current_user = get_jwt_identity()
    link = WebLink.query.get_or_404(link_id)

    if link.created_by != current_user:
        return jsonify({"message": "권한이 없습니다"}), 403

    share = SharedLink.query.filter_by(link_id=link_id, shared_with=username).first()
    if share:
        db.session.delete(share)
        db.session.commit()
        return jsonify({"message": "공유가 취소되었습니다"}), 200
    return jsonify({"message": "공유 정보를 찾을 수 없습니다"}), 404


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
