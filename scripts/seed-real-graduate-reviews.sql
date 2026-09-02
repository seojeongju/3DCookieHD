-- 실제 수강생(회차 등록) 기반 공개 수강후기 10건
-- 기존 author_id 없는 시드 후기는 제거 후 등록합니다.

DELETE FROM posts WHERE category = 'review' AND author_id IS NULL;

INSERT INTO posts (
  category, title, content, author_id, author_name, course_id, session_id, rating, status, pinned, views, likes, created_at, updated_at
) VALUES
(
  'review',
  'Fusion 실습 위주라 업무에 바로 썼어요',
  '퓨전360 고급심화 과정을 수료했습니다. 어셈블리·파라미트릭 설계를 반복 연습했고, 수업 중 만든 모델을 포트폴리오로 정리할 수 있어서 좋았습니다. 강사님 피드백이 구체적이었습니다.',
  44, '문소연', 18, 8, 5, 'published', 0, 14, 4,
  datetime('now', '-28 days'), datetime('now', '-28 days')
),
(
  'review',
  '기능사 집중문제풀이, 실기 자신감이 생겼습니다',
  '3D프린터운용기능사 집중문제풀이 과정을 들었습니다. 출제 유형별로 모델링·슬라이싱·출력까지 반복하니 시험장에서 당황하지 않을 것 같아요. 장비 사용 대기 시간도 거의 없었습니다.',
  95, '곽제은', 32, 30, 5, 'published', 0, 11, 3,
  datetime('now', '-25 days'), datetime('now', '-25 days')
),
(
  'review',
  '스마트 제품개발 과정, 아두이노 연동이 인상적이었어요',
  '3D프린팅과 아두이노·3D설계를 함께 배우는 과정이었습니다. 아이디어를 시제품까지 연결하는 흐름을 처음부터 경험할 수 있어서 만족스러웠습니다. 팀 프로젝트 피드백도 도움이 됐습니다.',
  97, '김송이', 24, 17, 5, 'published', 0, 9, 2,
  datetime('now', '-22 days'), datetime('now', '-22 days')
),
(
  'review',
  '주말반 기능사 과정, 직장인도 따라갈 만했습니다',
  '3D프린터운용기능사 실기대비 7회차 주말반을 수강했습니다. 주말 집중 수업이라 밀도는 높지만, 실습 비중이 커서 이해가 잘 됐습니다. 슬라이서 설정과 후처리 팁을 많이 배웠습니다.',
  60, '이세은', 31, 33, 4, 'published', 0, 8, 2,
  datetime('now', '-20 days'), datetime('now', '-20 days')
),
(
  'review',
  '평일 저녁반도 꾸준히 관리해 주셔서 수료했습니다',
  '기능사 실기대비 평일 저녁반을 선택했는데, 출·퇴근 후에도 실습량을 채울 수 있게 일정을 잘 짜 주셨습니다. 모르는 부분은 수업 후에도 질문할 수 있어서 좋았습니다.',
  83, '고예림', 30, 31, 5, 'published', 0, 10, 3,
  datetime('now', '-18 days'), datetime('now', '-18 days')
),
(
  'review',
  '집중문제풀이 4회차, 실기 시간이 넉넉했어요',
  '실기 시험 형식에 맞춘 문제를 여러 번 풀어볼 수 있었습니다. 출력물 품질 점검과 후가공까지 같이 복습할 수 있어서 시험 준비에 실질적으로 도움이 됐습니다.',
  34, '홍인엽', 27, 16, 5, 'published', 0, 7, 1,
  datetime('now', '-16 days'), datetime('now', '-16 days')
),
(
  'review',
  '교강사 과정, 현장 강의 준비에 도움이 됐습니다',
  '3D프린팅 전문교강사 과정을 수료했습니다. 교육 설계와 실습 지도 방법, 평가 기준 정리까지 배워 현장에서 강의할 때 자신감이 생겼습니다. 실습 시연 연습 시간도 충분했습니다.',
  80, '이창훈', 25, 18, 5, 'published', 0, 12, 4,
  datetime('now', '-14 days'), datetime('now', '-14 days')
),
(
  'review',
  '퓨전 고급심화, 도면·어셈블리까지 한 번에',
  '2회차 주말반으로 수강했습니다. 단순 모델링을 넘어 어셈블리와 도면 작성까지 다뤄서 회사 프로젝트에 바로 적용 중입니다. 수강생 수가 적어 질문하기 편했습니다.',
  46, '오윤경', 18, 8, 5, 'published', 0, 6, 2,
  datetime('now', '-12 days'), datetime('now', '-12 days')
),
(
  'review',
  '기능사 실기, 출력·후처리 연습이 알찼습니다',
  '6회차 평일 저녁반 수강생입니다. 시험에서 자주 나오는 유형을 중심으로 프린팅 후 사포·접착까지 연습했습니다. 처음 3D프린터를 접했지만 끝까지 따라갈 수 있었습니다.',
  84, '박유혁', 30, 31, 4, 'published', 0, 5, 1,
  datetime('now', '-10 days'), datetime('now', '-10 days')
),
(
  'review',
  '스마트 제품개발, 팀 프로젝트가 가장 기억에 남아요',
  '3D프린팅·아두이노·설계를 묶어 제품 아이디어를 구현해 봤습니다. 중간·최종 발표 피드백을 통해 부족한 부분을 바로 보완할 수 있었고, 수료 후에도 자료를 다시 볼 수 있어 좋았습니다.',
  102, '정안복', 24, 17, 5, 'published', 0, 8, 2,
  datetime('now', '-7 days'), datetime('now', '-7 days')
);

-- 과정별 평점·후기 수 갱신
UPDATE courses SET
  rating = (SELECT ROUND(AVG(rating), 1) FROM posts WHERE category = 'review' AND status = 'published' AND course_id = courses.id),
  review_count = (SELECT COUNT(*) FROM posts WHERE category = 'review' AND status = 'published' AND course_id = courses.id)
WHERE id IN (18, 32, 24, 31, 30, 27, 25);
