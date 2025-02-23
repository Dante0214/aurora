## 주요 기능

- 사용자 인증 (로그인/회원가입)
- 웹 링크 CRUD (생성, 조회, 수정, 삭제)
- 링크 검색 및 카테고리 필터링
- 링크 공유 및 권한 관리 (읽기/쓰기)
- 공유된 링크 관리 (공유 취소, 권한 수정)

## 기술 스택

### 프론트엔드

- React
- Material-UI (MUI)
- React Router DOM
- Axios
- Vite

### 백엔드

- Flask
- SQLAlchemy
- Flask-JWT-Extended
- SQLite
- Flask-CORS

## 주요 컴포넌트 구조

### 대시보드 (Dashboard)

- 링크 목록 표시
- 링크 추가 폼
- 검색 및 필터링
- 공유 관리 모달

### 링크 관리

- AddLinkForm: 새 링크 추가
- LinkList: 링크 목록 표시
- LinkItem: 개별 링크 아이템
- EditLinkForm: 링크 수정

### 공유 관리

- ShareModal: 공유 설정 모달
- ShareList: 공유된 사용자 목록

## API 엔드포인트

### 인증

- POST `/api/login`: 로그인
- POST `/api/register`: 회원가입
- GET `/api/me`: 현재 사용자 정보

### 링크 관리

- GET `/api/links`: 링크 목록 조회
- POST `/api/links`: 링크 생성
- PUT `/api/links/<id>`: 링크 수정
- DELETE `/api/links/<id>`: 링크 삭제

### 공유 관리

- POST `/api/links/<id>/share`: 링크 공유
- GET `/api/links/<id>/shares`: 공유 정보 조회
- DELETE `/api/links/<id>/unshare/<username>`: 공유 취소
- GET `/api/users`: 사용자 목록 조회

## 데이터 모델

### User

- id: 사용자 ID
- username: 사용자명
- password: 암호화된 비밀번호
- created_at: 생성일시

### WebLink

- id: 링크 ID
- created_by: 생성자
- name: 링크 이름
- url: 링크 URL
- category: 카테고리
- created_at: 생성일시

### SharedLink

- id: 공유 ID
- link_id: 링크 ID (외래키)
- shared_with: 공유받은 사용자
- can_write: 쓰기 권한 여부

## 카테고리 종류

- personal: 개인 즐겨찾기
- work: 업무 활용 자료
- reference: 참고 자료
- education: 교육 및 학습자료

## 보안 기능

- 비밀번호 해싱
- JWT 기반 인증
- CORS 보안 설정
- 권한 기반 접근 제어

## 설치 및 실행 방법

1. 백엔드 설정
```{bash}
   cd backend
   python -m venv venv
   source venv/bin/activate # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

2. 프론트엔드 설정
```{bash}
   cd frontend
   npm install
   npm run dev
```
