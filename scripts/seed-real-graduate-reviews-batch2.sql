-- 실제 수강생 기반 공개 수강후기 추가 20건 (batch 2)
-- author_id 없는 가짜/시드 후기는 노출하지 않습니다.

DELETE FROM posts WHERE category = 'review' AND author_id IS NULL;

INSERT INTO posts (
  category, title, content, author_id, author_name, course_id, session_id, rating, status, pinned, views, likes, created_at, updated_at
) VALUES
(
  'review',
  '퓨전360, 스케치부터 렌더까지 체계적으로 배웠어요',
  '2회차 주말반 수강했습니다. 기본 도형부터 시작해 실제 제품 형상을 모델링해 보니 감이 확 왔습니다. 수업 후 연습 파일을 받을 수 있어 복습하기도 편했습니다.',
  88, '이지유', 18, 8, 5, 'published', 0, 16, 3,
  datetime('now', '-89 days'), datetime('now', '-89 days')
),
(
  'review',
  '집중문제풀이 주말반, 실기 반복이 핵심이었습니다',
  '5회차 집중문제풀이 과정을 수료했습니다. 유형별로 모델링·슬라이싱·출력을 반복하다 보니 손이 익었고, 시험 전날에도 자신 있게 연습할 수 있었습니다.',
  89, '정수연', 32, 30, 5, 'published', 0, 13, 2,
  datetime('now', '-85 days'), datetime('now', '-85 days')
),
(
  'review',
  '기능사 집중반, 강사님 피드백이 빨랐어요',
  '출력물 품질을 매번 점검해 주셔서 어디를 고쳐야 하는지 바로 알 수 있었습니다. 후처리·접착 연습도 충분해서 실기 준비에 큰 도움이 됐습니다.',
  76, '오선희', 32, 30, 5, 'published', 0, 10, 2,
  datetime('now', '-82 days'), datetime('now', '-82 days')
),
(
  'review',
  '주말 집중 수업, 시간 대비 실습량이 많았습니다',
  '집중문제풀이 과정은 난이도가 있지만 실습 위주라 따라갈 수 있었습니다. 슬라이서 설정값을 직접 바꿔 보며 최적값을 찾는 방법을 배웠습니다.',
  106, '전지환', 32, 30, 4, 'published', 0, 9, 1,
  datetime('now', '-78 days'), datetime('now', '-78 days')
),
(
  'review',
  'Fusion 고급, 어셈블리 실습이 특히 유익했습니다',
  '부품 간 관계를 설정하는 연습을 많이 했습니다. 단순히 모델만 만드는 게 아니라 수정·치수 변경까지 같이 다뤄서 실무에 가깝게 느껴졌습니다.',
  105, '조서은', 18, 8, 5, 'published', 0, 11, 2,
  datetime('now', '-75 days'), datetime('now', '-75 days')
),
(
  'review',
  '퓨전 과정, 비전공자도 수료할 수 있었어요',
  '처음 CAD를 접했는데 기초부터 차근차근 진행해 주셔서 포기하지 않고 끝까지 수강했습니다. 수업 중 만든 모델을 포트폴리오로 정리하는 방법도 알려주셨습니다.',
  73, '김영아', 18, 8, 4, 'published', 0, 8, 1,
  datetime('now', '-72 days'), datetime('now', '-72 days')
),
(
  'review',
  '스마트 제품개발, 하드웨어 연동이 재미있었습니다',
  '3D프린팅과 아두이노를 연결해 동작하는 프로토타입을 만들어 봤습니다. 아이디어를 실물로 확인하는 과정이 인상 깊었고, 발표 피드백도 구체적이었습니다.',
  98, '류옌칭', 24, 17, 5, 'published', 0, 14, 3,
  datetime('now', '-68 days'), datetime('now', '-68 days')
),
(
  'review',
  '제품개발 과정, 팀 프로젝트가 성장에 도움됐어요',
  '팀원과 역할을 나눠 설계·출력·코딩을 진행했습니다. 중간 점검 때 부족한 부분을 바로 보완할 수 있어 완성도를 높일 수 있었습니다.',
  99, '박예진', 24, 17, 5, 'published', 0, 12, 2,
  datetime('now', '-65 days'), datetime('now', '-65 days')
),
(
  'review',
  '아두이노·3D설계 연계 수업, 난이도는 있지만 보람 있어요',
  '처음엔 회로 연결이 헷갈렸지만 반복 실습으로 익숙해졌습니다. 강사님이 예제를 단계별로 나눠 주셔서 이해하기 수월했습니다.',
  100, '신정은', 24, 17, 4, 'published', 0, 7, 1,
  datetime('now', '-62 days'), datetime('now', '-62 days')
),
(
  'review',
  '실무형 스마트 제품 과정, 포트폴리오 소재가 생겼습니다',
  '수료 작품을 이력서·포트폴리오에 넣을 수 있을 정도로 완성도를 맞출 수 있었습니다. 3D프린팅 후 조립·테스트까지 경험한 점이 좋았습니다.',
  101, '윤상호', 24, 17, 5, 'published', 0, 10, 2,
  datetime('now', '-58 days'), datetime('now', '-58 days')
),
(
  'review',
  '스마트 제품개발 1회차, 평일 저녁반도 알차게 진행됐어요',
  '직장인이라 걱정했는데 실습 비중이 높고 진도 관리를 잘해 주셔서 수료할 수 있었습니다. 아두이노 코드와 3D 모델을 함께 다루는 흐름이 체계적이었습니다.',
  103, '김희진', 24, 17, 5, 'published', 0, 9, 2,
  datetime('now', '-55 days'), datetime('now', '-55 days')
),
(
  'review',
  '기능사 7회차 주말반, 실기 연습량이 충분했습니다',
  '주말 오후반으로 수강했습니다. 시험 유형에 맞춘 문제를 여러 번 풀어볼 수 있어서 시험장에서 당황하지 않을 것 같습니다. 장비도 대기 없이 사용할 수 있었습니다.',
  96, '이아영', 31, 33, 5, 'published', 0, 15, 3,
  datetime('now', '-52 days'), datetime('now', '-52 days')
),
(
  'review',
  '7회차 기능사 과정, 슬라이서 설정을 확실히 익혔어요',
  '재료별·모델별 설정 차이를 직접 비교해 보며 학습했습니다. 출력 실패 원인을 스스로 찾는 방법까지 배워 실습 효율이 올랐습니다.',
  93, '김영일', 31, 33, 5, 'published', 0, 11, 2,
  datetime('now', '-48 days'), datetime('now', '-48 days')
),
(
  'review',
  '주말 기능사 반, 처음 프린터를 다뤄도 괜찮았습니다',
  '3D프린터가 처음이었는데 기본 조작부터 차근차근 알려주셨습니다. 후처리·사포 작업까지 같이 연습해 시험 형식에 맞게 준비할 수 있었습니다.',
  94, '김지성', 31, 33, 4, 'published', 0, 6, 1,
  datetime('now', '-45 days'), datetime('now', '-45 days')
),
(
  'review',
  '6회차 평일 저녁반, 출퇴근 후에도 실습 가능했어요',
  '저녁 시간대 수업이라 걱정했지만 실습 위주라 집중하기 좋았습니다. 모르는 부분은 수업 직후 질문할 수 있어서 이해가 잘 됐습니다.',
  85, '오동원', 30, 31, 5, 'published', 0, 13, 2,
  datetime('now', '-42 days'), datetime('now', '-42 days')
),
(
  'review',
  '기능사 실기대비, 출력·후처리 팁이 유용했습니다',
  '시험에서 자주 나오는 형태를 중심으로 연습했습니다. 출력물 마감과 접착 방법을 반복하니 손이 빨라졌고, 자신감도 생겼습니다.',
  86, '이소은', 30, 31, 5, 'published', 0, 8, 2,
  datetime('now', '-38 days'), datetime('now', '-38 days')
),
(
  'review',
  '평일 저녁 기능사 과정, 꾸준히 관리해 주셔서 좋았어요',
  '중간중간 진도 체크를 해 주셔서 놓치는 부분 없이 따라갈 수 있었습니다. 실습 시간이 넉넉해서 같은 문제를 여러 번 출력해 볼 수 있었습니다.',
  87, '이주영', 30, 31, 4, 'published', 0, 7, 1,
  datetime('now', '-35 days'), datetime('now', '-35 days')
),
(
  'review',
  '6회차 수강, 슬라이싱부터 후가공까지 한 번에',
  '모델링만이 아니라 슬라이서 설정·출력·사후 점검까지 전 과정을 연습했습니다. 강사님 설명이 명확해서 기록해 두고 복습하기 좋았습니다.',
  90, '조민영', 30, 31, 5, 'published', 0, 10, 2,
  datetime('now', '-32 days'), datetime('now', '-32 days')
),
(
  'review',
  '교강사 과정, 강의 설계 방법을 배울 수 있었습니다',
  '3D프린팅 전문교강사 과정 3회차를 수료했습니다. 실습 지도법과 평가 기준 정리, 시연 준비까지 배워 현장 강의에 바로 적용 중입니다.',
  81, '김준석', 25, 18, 5, 'published', 0, 12, 3,
  datetime('now', '-30 days'), datetime('now', '-30 days')
),
(
  'review',
  '집중문제풀이 4회차, 실기 시간이 넉넉해서 좋았어요',
  '문제 유형별로 시간을 재며 연습할 수 있었습니다. 출력물 품질 기준을 알려주셔서 시험 전 스스로 점검할 수 있게 됐습니다.',
  54, '박정옥', 27, 16, 5, 'published', 0, 9, 2,
  datetime('now', '-29 days'), datetime('now', '-29 days')
);

-- 과정별 평점·후기 수 갱신
UPDATE courses SET
  rating = COALESCE((SELECT ROUND(AVG(rating), 1) FROM posts WHERE category = 'review' AND status = 'published' AND course_id = courses.id), 0),
  review_count = (SELECT COUNT(*) FROM posts WHERE category = 'review' AND status = 'published' AND course_id = courses.id)
WHERE id IN (18, 32, 24, 31, 30, 25, 27);
