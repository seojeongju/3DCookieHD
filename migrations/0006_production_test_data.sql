-- 프로덕션 DB 테스트 데이터 추가 스크립트
-- 관리자 계정, 샘플 과정, 학생, 시험 데이터 포함

-- 관리자 계정 (이미 있으면 무시)
INSERT OR IGNORE INTO users (id, email, password, name, role, created_at)
VALUES (100, 'admin@3dcookiehd.com', '$2a$10$YourHashedPasswordHere', '관리자', 'admin', CURRENT_TIMESTAMP);

-- 샘플 과정 데이터 (courses 스키마: title, category, description, teacher_id, duration_months, duration_hours, price, max_students, status, created_at)
INSERT OR IGNORE INTO courses (id, title, category, description, teacher_id, duration_months, duration_hours, price, max_students, status, created_at)
VALUES 
(101, '3D 모델링 기초', '국비지원', 'Maya와 3ds Max를 활용한 3D 모델링 기초 과정', NULL, 3, 120, 2500000, 20, 'active', CURRENT_TIMESTAMP),
(102, '언리얼 엔진 게임 개발', '국비지원', '언리얼 엔진을 활용한 게임 개발 실무 과정', NULL, 4, 160, 3200000, 15, 'active', CURRENT_TIMESTAMP),
(103, 'Unity 게임 프로그래밍', '일반과정', 'Unity를 활용한 모바일 게임 개발', NULL, 3, 140, 2800000, 18, 'active', CURRENT_TIMESTAMP);

-- 샘플 학생 데이터 (users.status는 0009에서 추가되므로 여기서는 제외)
INSERT OR IGNORE INTO users (id, email, password, name, phone, role, created_at)
VALUES 
(201, 'student1@test.com', '$2a$10$TestHash1', '김학생', '010-1111-2222', 'student', CURRENT_TIMESTAMP),
(202, 'student2@test.com', '$2a$10$TestHash2', '이학생', '010-2222-3333', 'student', CURRENT_TIMESTAMP),
(203, 'student3@test.com', '$2a$10$TestHash3', '박학생', '010-3333-4444', 'student', CURRENT_TIMESTAMP);

-- 수강 신청 데이터 (enrollments 스키마: enrolled_at)
INSERT OR IGNORE INTO enrollments (id, user_id, course_id, status, progress, enrolled_at)
VALUES 
(301, 201, 101, 'approved', 45, CURRENT_TIMESTAMP),
(302, 202, 102, 'pending', 0, CURRENT_TIMESTAMP),
(303, 203, 101, 'approved', 78, CURRENT_TIMESTAMP);

-- 샘플 시험 데이터 (exams 스키마: course_id, title, description, type, time_limit_minutes, is_active, created_at)
INSERT OR IGNORE INTO exams (id, course_id, title, description, type, time_limit_minutes, is_active, created_at)
VALUES
(401, 101, '3D 모델링 중간고사', 'Maya 기초 이론 및 실습 평가', 'midterm', 60, 1, CURRENT_TIMESTAMP),
(402, 102, '언리얼 엔진 최종 프로젝트', '게임 개발 종합 평가', 'final', 90, 1, CURRENT_TIMESTAMP);

-- 시험 문제 (exam_questions: exam_id, question_text, question_type, options, correct_answer, points, order_index)
INSERT OR IGNORE INTO exam_questions (id, exam_id, question_text, question_type, options, correct_answer, points, order_index)
VALUES
(501, 401, 'Maya에서 Polygon 모델링의 기본 단위는 무엇인가?', 'multiple_choice', 
 '["Vertex", "Edge", "Face", "모두 해당"]', '4', 10, 1),
(502, 401, '3D 모델의 UV 매핑이란 무엇인지 간단히 설명하시오.', 'short_answer', 
 NULL, '2D 텍스처를 3D 모델 표면에 적용하기 위한 좌표 시스템', 15, 2),
(503, 401, 'Subdivision Surface 모델링의 장점과 활용 예시를 설명하시오.', 'essay', 
 NULL, '부드러운 곡면 표현, 영화/게임 캐릭터 제작', 25, 3),
(504, 402, '언리얼 엔진에서 Blueprint란?', 'multiple_choice',
 '["비주얼 스크립팅 시스템", "3D 모델링 도구", "텍스처 에디터", "사운드 믹서"]', '1', 20, 1),
(505, 402, 'Level Blueprint와 Class Blueprint의 차이를 설명하시오.', 'essay',
 NULL, 'Level Blueprint는 특정 레벨에서만 작동, Class Blueprint는 재사용 가능한 오브젝트', 30, 2);

-- 상담 기록 샘플
INSERT OR IGNORE INTO consultations (id, user_id, name, phone, email, course_id, consultation_type, message, memo, status, consultant_id, completed_date, created_at)
VALUES
(601, 201, '김학생', '010-1111-2222', 'student1@test.com', 101, 'phone', 
 '3D 모델링 과정 문의', '수강 의지 높음, 포트폴리오 준비 중', 'completed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(602, 202, '이학생', '010-2222-3333', 'student2@test.com', 102, 'visit',
 '언리얼 엔진 과정 상담', '게임 업계 취업 희망, 기초 지식 있음', 'completed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(603, NULL, '최잠재', '010-9999-8888', 'potential@test.com', 103, 'online',
 'Unity 과정 문의', '회원가입 예정, 다음주 방문 예정', 'confirmed', 100, NULL, CURRENT_TIMESTAMP);
