-- 데이터베이스 스키마 정의

-- 사용자 테이블
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 웹 링크 테이블
CREATE TABLE web_link (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by VARCHAR(80) NOT NULL,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES user(username)
);

-- 공유 링크 테이블
CREATE TABLE shared_link (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER NOT NULL,
    shared_with VARCHAR(80) NOT NULL,
    can_write BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (link_id) REFERENCES web_link(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with) REFERENCES user(username)
);

-- 인덱스 생성
CREATE INDEX idx_web_link_created_by ON web_link(created_by);
CREATE INDEX idx_shared_link_shared_with ON shared_link(shared_with);
CREATE INDEX idx_shared_link_link_id ON shared_link(link_id);

-- 유니크 제약조건 (동일한 링크를 같은 사용자에게 중복 공유 방지)
CREATE UNIQUE INDEX idx_unique_share ON shared_link(link_id, shared_with); 