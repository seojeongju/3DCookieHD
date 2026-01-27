---
description: NCS API 키 설정 가이드
---

# NCS 공공데이터 API 키 설정 방법

## 1. API 키 발급받기

### 공공데이터포털에서 API 키 발급
1. [공공데이터포털](https://www.data.go.kr) 접속
2. 회원가입 및 로그인
3. "한국산업인력공단_NCS 기준정보 조회" API 검색
4. 활용신청 클릭
5. 승인 완료 후 "인증키(Encoding)" 복사

## 2. Cloudflare Pages 환경변수 설정

### Cloudflare 대시보드에서 설정
1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. Pages > `3dcookiehd` 프로젝트 선택
3. Settings > Environment variables 메뉴로 이동
4. "Add variable" 클릭
5. 다음 정보 입력:
   - **Variable name**: `NCS_API_KEY`
   - **Value**: 발급받은 API 키 입력
   - **Environment**: Production 및 Preview 모두 선택
6. "Save" 클릭

### 또는 wrangler CLI로 설정
```bash
# Production 환경
wrangler pages secret put NCS_API_KEY --project-name=3dcookiehd

# Preview 환경
wrangler pages secret put NCS_API_KEY --env=preview --project-name=3dcookiehd
```

## 3. 재배포
환경변수 설정 후 변경사항을 적용하려면 재배포가 필요합니다:
```bash
npm run deploy
```

## 4. API 동작 확인

### 테스트 방법
1. `/admin/ncs` 페이지 접속
2. "NCS 검색" 버튼 클릭
3. 키워드 입력 (예: "3D", "응용SW" 등)
4. 검색 버튼 클릭
5. 실제 공공데이터에서 결과가 표시되는지 확인

### API 엔드포인트
- 검색: `GET /api/ncs/search?keyword={검색어}`

## 5. API 사용 제한사항
- **일일 트래픽**: 1,000건 (기본)
- **초당 트래픽**: 제한 없음
- 더 높은 트래픽이 필요한 경우 공공데이터포털에 추가 신청 필요

## 6. 문제 해결

### API 호출 실패 시
- API 키가 올바르게 입력되었는지 확인
- API 승인 상태 확인 (공공데이터포털에서 확인)
- 일일 트래픽 제한 초과 여부 확인
- Cloudflare 환경변수가 올바르게 설정되었는지 확인

### Mock 데이터로 되돌리기
API 키 없이도 Mock 데이터로 기능 테스트가 가능합니다. 환경변수를 설정하지 않으면 자동으로 Mock 데이터가 사용됩니다.

## 참고사항
- 현재 코드는 API 키가 없어도 Mock 데이터로 정상 작동합니다
- API 키 설정 시 실제 NCS 데이터로 자동 전환됩니다
- Mock 데이터: 3D프린터개발, 응용SW엔지니어링 등 6개 샘플 포함
