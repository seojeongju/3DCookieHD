-- 메인/수강후기 페이지용 공개 후기 시드 (posts.category = review)
-- 실제 수강생 계정에 귀속하지 않고 author_name만 사용합니다.

INSERT INTO posts (
  category, title, content, author_id, author_name, course_id, rating, status, pinned, views, likes, created_at, updated_at
) VALUES
(
  'review',
  '비전공자도 3D모델링을 따라갈 수 있어요',
  '처음엔 CAD가 막막했는데, 강사님이 기초부터 차근차근 설명해 주셔서 끝까지 따라갔습니다. 수업 중 만든 작품을 포트폴리오로 정리하니 자신감이 많이 생겼어요.',
  NULL, '김서연', 12, 5, 'published', 0, 12, 3,
  datetime('now', '-3 days'), datetime('now', '-3 days')
),
(
  'review',
  '기능사 실기 대비에 정말 도움이 됐습니다',
  '3D프린터운용기능사 실기 위주로 반복 연습할 수 있어서 좋았습니다. 출제 경향에 맞춘 문제 풀이와 장비 세팅 팁이 특히 유익했어요.',
  NULL, '박준호', 13, 5, 'published', 0, 9, 2,
  datetime('now', '-6 days'), datetime('now', '-6 days')
),
(
  'review',
  '퓨전360 심화 과정이 알찼습니다',
  'Fusion을 업무에 바로 쓸 수 있을 정도로 실무 중심으로 진행됐습니다. 어셈블리와 도면 작성까지 다루어 줘서 회사에서도 바로 활용 중입니다.',
  NULL, '이하늘', 14, 5, 'published', 0, 15, 4,
  datetime('now', '-8 days'), datetime('now', '-8 days')
),
(
  'review',
  '주말반이라 직장 다니며 수강하기 좋았어요',
  '평일에는 시간이 없어 주말반을 선택했는데, 수업 밀도가 높고 과제 피드백도 꼼꼼했습니다. 장비 사용법도 충분히 익힐 수 있었습니다.',
  NULL, '최민지', 15, 4, 'published', 0, 7, 1,
  datetime('now', '-12 days'), datetime('now', '-12 days')
),
(
  'review',
  '교강사 과정으로 강의 자신감이 생겼습니다',
  '교육 설계와 실습 지도 방법을 함께 배워 현장에 바로 적용할 수 있었습니다. 교안 작성 팁과 평가 기준 설명이 특히 도움이 됐어요.',
  NULL, '정우성', 16, 5, 'published', 0, 11, 2,
  datetime('now', '-15 days'), datetime('now', '-15 days')
),
(
  'review',
  '소상공인 맞춤 과정이 실질적이었습니다',
  '쿠키틀·스텐실부터 제품화까지 바로 사업에 쓸 수 있는 내용이었습니다. 몰드와 프린팅 후처리 노하우를 알려주셔서 시행착오가 줄었습니다.',
  NULL, '한예린', 12, 5, 'published', 0, 8, 3,
  datetime('now', '-18 days'), datetime('now', '-18 days')
),
(
  'review',
  '장비와 시설이 잘 갖춰져 있어요',
  '실습용 프린터가 충분하고 작업 공간도 넓어서 대기 없이 연습할 수 있었습니다. 질문하면 바로 피드백을 받을 수 있어 좋았습니다.',
  NULL, '오세훈', 13, 4, 'published', 0, 6, 1,
  datetime('now', '-21 days'), datetime('now', '-21 days')
),
(
  'review',
  '상담부터 수료까지 케어가 좋았습니다',
  '과정 선택 상담이 친절했고, 수강 중에도 진도 관리를 잘해 주셨습니다. 국비지원 서류 안내도 차근차근 도와주셔서 부담이 덜했어요.',
  NULL, '윤서아', 14, 5, 'published', 0, 10, 2,
  datetime('now', '-25 days'), datetime('now', '-25 days')
);
