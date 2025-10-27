-- ============================================
-- 교육 플랫폼 초기 테스트 데이터
-- ============================================

-- 1. 관리자 및 테스트 사용자 추가
INSERT OR IGNORE INTO users (id, email, password, name, phone, role) VALUES 
  (1, 'admin@greenart.co.kr', '$2a$10$hash...', '관리자', '02-1234-5678', 'admin'),
  (2, 'teacher1@greenart.co.kr', '$2a$10$hash...', '김강사', '010-1111-2222', 'teacher'),
  (3, 'teacher2@greenart.co.kr', '$2a$10$hash...', '이강사', '010-3333-4444', 'teacher'),
  (4, 'student1@example.com', '$2a$10$hash...', '홍길동', '010-1234-5678', 'student'),
  (5, 'student2@example.com', '$2a$10$hash...', '김영희', '010-8765-4321', 'student');

-- 2. 캠퍼스 추가
INSERT OR IGNORE INTO campuses (id, name, region, address, phone, email, lat, lng, description, certifications) VALUES 
  (1, '강남본점', '서울', '서울시 강남구 테헤란로 123', '02-1234-5678', 'gangnam@greenart.co.kr', 37.5012, 127.0396, 
   '강남역 인근 최대 규모 캠퍼스', '{"2023": "5년 인증 우수 훈련기관", "awards": ["교육브랜드 대상"]}'),
  
  (2, '신도림', '서울', '서울시 구로구 신도림동 456', '02-2222-3333', 'sindorim@greenart.co.kr', 37.5084, 126.8912,
   '신도림역 도보 3분', '{"2023": "5년 인증 우수 훈련기관"}'),
  
  (3, '인천(부평)', '인천', '인천시 부평구 부평대로 789', '032-5555-6666', 'bupyeong@greenart.co.kr', 37.4896, 126.7226,
   '부평역 연결 쇼핑몰 내', '{"2023": "5년 인증 우수 훈련기관"}'),
  
  (4, '대전(둔산)', '대전', '대전시 서구 둔산로 321', '042-7777-8888', 'daejeon@greenart.co.kr', 36.3504, 127.3845,
   '둔산동 정부청사 인근', '{"2023": "5년 인증 우수 훈련기관"}');

-- 3. 과정 추가
INSERT OR IGNORE INTO courses (
  id, title, subtitle, category, description, curriculum, 
  duration_months, duration_hours, price, discount_price,
  campus_id, teacher_id, status, max_students, 
  start_date, end_date, schedule, tags, rating, review_count
) VALUES 
  -- 웹디자인 과정
  (1, 'UI/UX 반응형 웹디자인 & 웹퍼블리셔', 'HTML/CSS/JavaScript 실무 프로젝트', '웹디자인',
   '웹디자인의 기초부터 반응형 웹사이트 제작까지 실무 중심 교육',
   '{"week1": "HTML5 기초", "week2": "CSS3 스타일링", "week3": "JavaScript 기초", "week4": "반응형 레이아웃", "week5": "jQuery", "week6": "실전 프로젝트"}',
   6, 960, 5000000, 0, 1, 2, 'active', 20,
   '2024-12-01', '2025-05-31', '월~금 09:00-18:00', '["국비지원", "취업연계", "포트폴리오"]', 4.8, 45),

  (2, 'React 프론트엔드 개발자 양성', 'React + TypeScript 실무 과정', '프로그래밍',
   'React를 활용한 현대적인 프론트엔드 개발 완전 정복',
   '{"week1": "JavaScript ES6+", "week2": "React 기초", "week3": "React Hooks", "week4": "TypeScript", "week5": "상태관리(Redux)", "week6": "프로젝트"}',
   4, 640, 4000000, 0, 1, 3, 'active', 15,
   '2024-11-15', '2025-03-14', '월~금 14:00-18:00', '["국비지원", "실무중심"]', 4.9, 28),

  -- 영상편집 과정
  (3, '유튜브 크리에이터 영상편집', 'Premiere Pro & After Effects', '영상편집',
   '유튜브, 틱톡 등 SNS 영상 제작 전문가 양성',
   '{"week1": "Premiere Pro 기초", "week2": "영상 편집 실전", "week3": "After Effects", "week4": "모션그래픽", "week5": "유튜브 최적화"}',
   3, 480, 3000000, 0, 2, 2, 'active', 12,
   '2024-12-10', '2025-03-09', '화수목금 19:00-22:00', '["국비지원", "유튜브"]', 4.7, 31),

  -- 건축CAD 과정
  (4, 'AutoCAD & 건축설계 실무', '2D/3D CAD 도면 작성', '건축CAD',
   '건축 설계 도면 작성 전문가 양성 과정',
   '{"week1": "AutoCAD 기초", "week2": "2D 도면", "week3": "3D 모델링", "week4": "실무 도면", "week5": "프로젝트"}',
   3, 480, 2500000, 0, 3, 3, 'active', 18,
   '2024-11-20', '2025-02-19', '월~금 09:00-13:00', '["국비지원", "자격증"]', 4.6, 22),

  -- Python 과정
  (5, 'Python 데이터 분석 & 머신러닝', 'NumPy, Pandas, Scikit-learn', '프로그래밍',
   'Python을 활용한 데이터 분석 및 머신러닝 입문',
   '{"week1": "Python 기초", "week2": "NumPy & Pandas", "week3": "데이터 시각화", "week4": "머신러닝 기초", "week5": "실전 프로젝트"}',
   4, 640, 3500000, 0, 4, 2, 'active', 20,
   '2024-12-05', '2025-04-04', '월~금 09:00-18:00', '["국비지원", "데이터"]', 4.8, 36);

-- 4. 수강신청 추가 (테스트용)
INSERT OR IGNORE INTO enrollments (user_id, course_id, status, payment_status, payment_amount, progress) VALUES 
  (4, 1, 'approved', 'paid', 0, 45),
  (4, 2, 'approved', 'paid', 0, 20),
  (5, 1, 'approved', 'paid', 0, 68),
  (5, 3, 'pending', 'unpaid', 3000000, 0);

-- 5. 리뷰 추가
INSERT OR IGNORE INTO reviews (user_id, course_id, rating, title, content, approved) VALUES 
  (4, 1, 5, '정말 실무에 도움이 많이 됐어요!', 
   '웹디자인 기초부터 실전까지 체계적으로 배울 수 있었습니다. 강사님이 친절하시고 포트폴리오 지도도 꼼꼼하게 해주셔서 좋았어요.', 1),
  
  (5, 1, 5, '국비지원 과정 중 최고입니다', 
   '무료로 이렇게 퀄리티 높은 수업을 들을 수 있다니 정말 감사합니다. 취업까지 연계해주셔서 더욱 만족스러웠습니다.', 1),
  
  (4, 2, 5, 'React 마스터 완료!', 
   'React 기초부터 TypeScript까지 완벽하게 배웠습니다. 실무 프로젝트를 통해 실력이 많이 늘었어요.', 1);

-- 6. 공지사항 추가
INSERT OR IGNORE INTO posts (category, title, content, author_id, pinned) VALUES 
  ('notice', '2024년 12월 과정 개강 안내', 
   '2024년 12월에 개강하는 과정들의 일정을 안내드립니다. 수강 신청은 선착순으로 마감됩니다.', 1, 1),
  
  ('notice', '국비지원 신청 방법 안내', 
   '국비지원 과정 신청 시 필요한 서류와 절차를 안내드립니다.', 1, 1);

-- 7. FAQ 추가
INSERT OR IGNORE INTO posts (category, title, content, author_id) VALUES 
  ('faq', '국비지원 과정은 누구나 신청할 수 있나요?', 
   '네, 실업자, 재직자 모두 신청 가능하며, 정부 지원 조건에 따라 자부담금이 달라질 수 있습니다.', 1),
  
  ('faq', '수강료 환불 정책은 어떻게 되나요?', 
   '개강 전: 전액 환불 가능\n개강 후 1주일 이내: 80% 환불\n개강 후 2주일 이내: 50% 환불\n이후: 환불 불가', 1),
  
  ('faq', '수료증은 어떻게 받나요?', 
   '과정 수료 후 출석률 80% 이상 시 수료증이 자동 발급되며, 마이페이지에서 다운로드 가능합니다.', 1);

-- 8. 상담 예약 추가 (테스트용)
INSERT OR IGNORE INTO consultations (name, phone, email, campus_id, course_id, preferred_date, preferred_time, message, status) VALUES 
  ('박상담', '010-9999-8888', 'consult@example.com', 1, 1, '2024-11-15', '14:00', '웹디자인 과정 상담 희망합니다', 'pending'),
  ('최문의', '010-7777-6666', 'inquiry@example.com', 2, 3, '2024-11-16', '10:00', '영상편집 과정에 대해 궁금합니다', 'confirmed');

-- 9. 찜하기 추가 (테스트용)
INSERT OR IGNORE INTO bookmarks (user_id, course_id) VALUES 
  (4, 3),
  (4, 5),
  (5, 2),
  (5, 4);

-- 10. 강의 자료 추가 (테스트용)
INSERT OR IGNORE INTO course_materials (course_id, title, type, file_url, week, order_index) VALUES 
  (1, 'HTML5 기초 강의 자료', 'pdf', '/materials/html5-basics.pdf', 1, 1),
  (1, 'CSS3 스타일링 예제', 'pdf', '/materials/css3-examples.pdf', 2, 1),
  (1, 'JavaScript 기초 영상', 'video', '/materials/javascript-intro.mp4', 3, 1);
