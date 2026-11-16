/** 개강서류(훈련생 하위) 카탈로그 — 메뉴·허브·인쇄 공통 */

export type OpeningDocImplStatus = 'ready' | 'link' | 'planned';

/** 개강서류 대상: 전체 / 국비지원 / 일반 */
export type OpeningDocAudience = 'all' | 'gov' | 'general';

export type OpeningDocDef = {
  code: string;
  order: number;
  title: string;
  description: string;
  /** ready: 자체 인쇄 / link: 기존 화면 연결 / planned: 추후 구현 */
  status: OpeningDocImplStatus;
  /** link일 때 연결 종류 */
  linkType?: 'timetable' | 'attendance_trainee' | 'attendance_monthly';
  /** 서류 대상 수강생 구분 (기본 all) */
  audience?: OpeningDocAudience;
};

export const OPENING_DOCS: OpeningDocDef[] = [
  {
    code: 'D00',
    order: 0,
    title: '훈련생 등록현황 체크리스트',
    description: '구분·성명·연락처·OT참석·교육신청서·자부담 결제 현황을 확인합니다.',
    status: 'ready',
  },
  {
    code: 'D01',
    order: 1,
    title: '훈련생명단-훈련교사관리',
    description: '훈련과정·기간·시간·요일과 NO·성명·전화번호·생년월일·비고 명단을 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D02',
    order: 2,
    title: '수강생 배포용 시간표',
    description: '기존 회차 시간표 인쇄 화면으로 이동합니다.',
    status: 'link',
    linkType: 'timetable',
  },
  {
    code: 'D22',
    order: 3,
    title: '내일배움 훈련생서약서',
    description: '국비지원대상 수강생용 — 국민내일배움 훈련과정 서약서(일괄 인쇄)를 출력합니다.',
    status: 'ready',
    audience: 'gov',
  },
  {
    code: 'D23',
    order: 4,
    title: '개인정보활용동의서(일반)',
    description: '일반 수강생용 — 개인정보 수집·이용 동의 본문과 신청인 서명란을 출력합니다.',
    status: 'ready',
    audience: 'general',
  },
  {
    code: 'D31',
    order: 5,
    title: '오리엔테이션 수거용',
    description: '출결·인정일수 안내와 수강생 확인 서명란(수거용)을 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D32',
    order: 6,
    title: '오리엔테이션 배포용',
    description: '출결·인정일수 안내문(수강생 배포용)을 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D33',
    order: 7,
    title: '오리엔테이션 참여자명단',
    description: 'OT 과정·기간·담당자와 참여자 서명 명단을 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D40',
    order: 8,
    title: '미디어 촬영 동의서',
    description: 'CCTV·영상정보 촬영 동의서(수강생별)를 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D51',
    order: 9,
    title: '출석부(일반수강생용)',
    description: '일반 수강생용 출석부(훈련일·시작/종료·집계란)를 출력합니다.',
    status: 'ready',
    audience: 'general',
  },
  {
    code: 'D52',
    order: 10,
    title: '출석부(전체·훈련교사관리)',
    description: '기존 월간 출석부 인쇄로 이동합니다.',
    status: 'link',
    linkType: 'attendance_monthly',
  },
  {
    code: 'D53',
    order: 11,
    title: '출석입력요청대장(별지 제16호)',
    description: '국민내일배움카드 운영규정 별지 제16호 출석입력요청대장을 출력합니다.',
    status: 'ready',
    audience: 'gov',
  },
  {
    code: 'D70',
    order: 12,
    title: '교재지급대장',
    description: '교재명·배포일과 수강생 확인(정자체) 대장을 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D80',
    order: 13,
    title: 'SD카드 지급·반납 확인서 관리대장',
    description: '훈련일별 지급·반납·출력중 체크 대장을 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D90',
    order: 14,
    title: '업무수행평가(수업평가)',
    description: '훈련교사 본인 수업평가(15문항·건의사항·결재란)를 출력합니다.',
    status: 'ready',
  },
  {
    code: 'D91',
    order: 15,
    title: '강의 후 설문조사',
    description: '교육만족도·강사·교육내용 평가 설문지(수강생 배포용)를 출력합니다.',
    status: 'ready',
  },
];

export function getOpeningDoc(code: string): OpeningDocDef | undefined {
  return OPENING_DOCS.find((d) => d.code === code);
}

export function openingDocPrintPath(
  sessionId: number,
  code: string,
  funding?: OpeningDocAudience | null
): string {
  const base = `/admin/courses/sessions/${sessionId}/opening-docs/${code}/print`;
  if (funding === 'gov' || funding === 'general') {
    return `${base}?funding=${funding}`;
  }
  return base;
}

/** 서류 고정 audience와 요청 funding을 교차해 실제 필터 결정 */
export function resolveOpeningDocFunding(
  docAudience: OpeningDocAudience | undefined,
  requestFunding?: string | null
): OpeningDocAudience | 'none' {
  const doc = docAudience || 'all';
  const req = String(requestFunding || 'all').trim().toLowerCase();
  const funding: OpeningDocAudience =
    req === 'gov' || req === 'general' ? req : 'all';
  if (doc === 'all') return funding;
  if (funding === 'all') return doc;
  if (doc !== funding) return 'none';
  return doc;
}

export function openingDocExternalLink(sessionId: number, linkType?: string): string | null {
  if (linkType === 'timetable') {
    return `/admin/courses/sessions/${sessionId}/timetable/print`;
  }
  if (linkType === 'attendance_trainee') {
    return `/admin/attendance/print/trainee?sessionId=${sessionId}`;
  }
  if (linkType === 'attendance_monthly') {
    return `/admin/attendance/print?sessionId=${sessionId}`;
  }
  return null;
}
