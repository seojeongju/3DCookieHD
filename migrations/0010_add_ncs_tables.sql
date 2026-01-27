-- NCS 능력단위 관리 테이블
CREATE TABLE ncs_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE, -- 능력단위 코드 (예: 1903020101_14v1)
    name TEXT NOT NULL,        -- 능력단위 명칭 (예: 3D형상모델링)
    level INTEGER,             -- 수준 (1~8)
    category TEXT,             -- 분류 (예: 3D프린터개발)
    description TEXT,          -- 설명
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 과정별 NCS 편성 관리 테이블
CREATE TABLE course_ncs_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    ncs_unit_id INTEGER NOT NULL,
    training_hours INTEGER DEFAULT 0, -- 배정 훈련 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (ncs_unit_id) REFERENCES ncs_units(id) ON DELETE CASCADE
);

-- 초기 기초 데이터 (샘플) - 3D프린터 관련
INSERT INTO ncs_units (code, name, level, category, description) VALUES 
('1503050101_19v3', '3D프린터 제품 스캐닝', 3, '3D프린터개발', '스캐너를 사용하여 대상물의 형상 정보를 취득하는 능력'),
('1503050102_19v3', '3D형상모델링', 4, '3D프린터개발', '3D CAD 프로그램을 활용하여 제품 형상을 모델링하는 능력'),
('1503050103_19v3', '3D프린터 SW설정', 3, '3D프린터개발', '슬라이싱 프로그램을 사용하여 출력 방식을 설정하는 능력'),
('1503050104_19v3', '3D프린터 HW설정', 3, '3D프린터개발', '장비의 상태를 점검하고 출력을 준비하는 능력'),
('1503050105_19v3', '3D프린터 출력용 데이터 확정', 2, '3D프린터개발', '오류를 검증하고 G-Code를 생성하는 능력'),
('1503050106_19v3', '3D프린터 출력', 2, '3D프린터개발', '장비를 조작하여 제품을 출력하는 능력'),
('1503050107_19v3', '3D프린터 안전관리', 2, '3D프린터개발', '작업장의 안전과 환경을 관리하는 능력');
