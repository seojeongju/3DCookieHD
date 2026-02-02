# NCS(국가직무능력표준) API 비교 및 활용 방법

## 1. 두 API의 차이

| 구분 | 우리가 사용 중 (훈련과정정보) | ncs.go.kr 분류보기와 같은 계열 |
|------|------------------------------|--------------------------------|
| **목적** | 훈련과정 목록 조회 (훈련목표, 훈련시간 등) | NCS **분류체계** + 능력단위 상세 |
| **공공데이터포털** | [NCS 훈련과정정보](https://www.data.go.kr/data/15086447/openapi.do) | [국가직무능력표준 정보](https://www.data.go.kr/data/3072161/openapi.do) / [NCS 기준정보조회](https://www.data.go.kr/data/15128213/openapi.do) |
| **요청 주소** | `https://apis.data.go.kr/B490007/ncsTrainingCource/openapi18` | `http://www.ncs.go.kr/api/openapi5.do` (3072161) / NCS 기준정보조회(15128213)는 별도 엔드포인트 |
| **요청 예시** | `ncsLclasCd`(대분류코드)로 훈련과정 목록 조회 | **직무코드(dutyCd)** 8자리 필수 (대2+중2+소2+세2) |
| **응답** | 대·중·소·세분류 + 능력단위 (구조·필드명이 API마다 다를 수 있음) | dutyCd, ncsClCd, compUnitName, 능력단위요소, KSA 등 |

즉, **ncs.go.kr** 에서 보는 “분류보기”(중→소→세분류→능력단위)는 **국가직무능력표준 정보 / NCS 기준정보조회** 계열 API와 같은 데이터이고,  
우리가 쓰는 **NCS 훈련과정정보 API**는 “훈련과정 목록”용이라 응답 구조·필드가 다를 수 있습니다.

---

### 왜 우리 사이트와 ncs.go.kr NCS 분류보기가 다르게 보일 수 있나요?

| 구분 | ncs.go.kr NCS 분류보기 | 우리 사이트 (훈련직종 검색) |
|------|-------------------------|-----------------------------|
| **쓰는 데이터** | NCS **분류체계 전체** (대·중·소·세·능력단위 전부) | **훈련과정정보 API**가 주는 데이터만 (실제 훈련과정에 쓰인 분류만) |
| **의미** | "NCS에 등록된 모든 분류"를 보여줌 | "훈련과정으로 등록된 NCS 분류"만 보여줌 |
| **결과** | 소분류·세분류가 더 많고, 순서/구성도 공식 분류표와 동일 | API에 훈련과정이 있는 분류만 나오므로, 개수·순서가 ncs.go.kr과 다를 수 있음 |

정리하면, **같은 NCS 표준이어도 "어디서 가져오느냐"가 다릅니다.**

- **ncs.go.kr** = NCS **분류체계 전체**를 보여주는 API(기준정보조회 등) 사용 → 공식 분류표와 동일.
- **우리 사이트** = **훈련과정정보 API**만 사용 → "훈련과정 데이터에 한 번이라도 등장한" 대·중·소·세·능력단위만 표시.

그래서 특정 소분류/세분류가 ncs.go.kr에는 있는데 우리 쪽에는 없거나, 순서가 다르게 보이는 현상이 생길 수 있습니다.

### 우리 사이트에서의 기준정보 API 연동 (구현됨)

- **훈련직종 검색** (`/admin/ncs/approved/1`) 에서 대분류를 선택하면, 서버는 **NCS 기준정보조회 API**(15128213)를 **먼저** 호출해 전체 분류체계(중·소·세·능력단위)를 가져오도록 되어 있습니다.
- 기준정보 API 호출이 실패하거나 항목이 0건이면, 기존처럼 **훈련과정정보 API**로 폴백합니다.
- **같은 인증키**(`NCS_API_KEY`)로 두 API를 모두 사용합니다. 기준정보 API(15128213)는 공공데이터포털에서 별도 활용신청이 필요할 수 있습니다.
- **기준정보 API base URL** 이 제공처와 다르면 환경변수 `NCS_CLASSIFICATION_API_BASE` 에 올바른 URL을 넣으면 됩니다. (미설정 시 `https://api.data.go.kr/openapi/15128213/v1` 사용)
- **테스트용** 엔드포인트: `GET /api/ncs/approved/classification?ncsLclasCd=19` — 기준정보 API만 호출한 결과를 반환합니다.
- **실패 시 원인 확인**: 같은 요청이 실패하면 응답 `_meta.diagnose` 에 첫 요청 URL·HTTP 상태·응답 본문 일부가 포함됩니다. 또는 `GET /api/ncs/approved/classification-debug?ncsLclasCd=19` 로 진단 전용 응답을 볼 수 있습니다.
- **"기준정보 API 조회 실패"** 가 나오면: 공공데이터포털에서 **15128213 (한국산업인력공단_NCS 기준정보조회)** 를 검색해 **별도 활용신청**을 한 뒤, 같은 인증키로 다시 시도하세요. 훈련과정정보 API(B490007)만 신청한 경우 기준정보 API는 사용할 수 없을 수 있습니다.

---

## 2. ncs.go.kr 쪽 API를 받는 방법

- **ncs.go.kr에서 별도 API 키를 발급받는 방식은 없습니다.**  
  모두 **공공데이터포털(data.go.kr)** 에서 같은 종류의 인증키(일반 인증키/서비스키)로 사용합니다.

### (1) 공공데이터포털에서 활용신청

1. **공공데이터포털** 접속: https://www.data.go.kr  
2. 로그인 후 아래 API 중 필요한 것을 검색해서 **활용신청**  
   - **한국산업인력공단_국가직무능력표준 정보**  
     - https://www.data.go.kr/data/3072161/openapi.do  
     - 서비스 URL: `http://www.ncs.go.kr/api/openapi5.do`  
     - 요청: `ServiceKey`, `dutyCd`(8자리 직무코드) 등  
   - **한국산업인력공단_NCS 기준정보조회**  
     - https://www.data.go.kr/data/15128213/openapi.do  
     - NCS **대분류, 중분류, 소분류, 세분류**, 능력단위 등 **7개 오퍼레이션**  
     - 데이터포맷: JSON, 트래픽: 개발 10,000/일  
3. 승인 후 **마이페이지 → 인증키(일반 인증키)** 에서 **서비스키(ServiceKey)** 확인  
4. 이 **같은 서비스키**로  
   - 기존처럼 `B490007/ncsTrainingCource` (훈련과정정보) 호출  
   - 필요 시 `ncs.go.kr/api/openapi5.do` 또는 NCS 기준정보조회 API 호출  
   둘 다 사용 가능합니다. (API별로 활용신청은 각각 해야 할 수 있음)

### (2) 인증키 사용

- **인증키는 공공데이터포털에서 받은 것 하나**를 쓰면 됩니다.  
- ncs.go.kr 전용 “사이트 API 키”는 없고, data.go.kr 활용신청으로 받은 키를 그대로 사용합니다.

---

## 3. 참고 링크

- **공공데이터포털**  
  - https://www.data.go.kr  
- **국가직무능력표준 정보 API (openapi5.do)**  
  - https://www.data.go.kr/data/3072161/openapi.do  
- **NCS 기준정보조회 API (대·중·소·세·능력단위 등)**  
  - https://www.data.go.kr/data/15128213/openapi.do  
- **한국산업인력공단 오픈 API**  
  - https://openapi.hrdkorea.or.kr/main  

훈련직종 검색 화면을 ncs.go.kr “분류보기”와 동일하게 맞추려면, **NCS 기준정보조회(15128213)** 의 대분류/중분류/소분류/세분류/능력단위 오퍼레이션 명세를 확인해 연동하는 것이 좋습니다.

---

## 4. 한국산업인력공단 API 키 다시 설정하기

발급받은 **공공데이터포털 인증키(서비스키)** 를 이 프로젝트에 넣을 때는 **환경변수 이름 `NCS_API_KEY`** 를 사용합니다.

### 방법 A: Cloudflare 대시보드에서 설정 (권장)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. **Workers & Pages** → **3dcookiehd** 프로젝트 선택
3. **Settings** → **Environment variables** 이동
4. **Production** / **Preview** 중 사용할 환경에서:
   - 이미 `NCS_API_KEY`가 있으면 **Edit** → 새 키 값 입력 후 저장
   - 없으면 **Add variable** → **Encrypt** 선택 후:
     - **Variable name**: `NCS_API_KEY`
     - **Value**: 공공데이터포털에서 복사한 인증키(일반 인증키/서비스키)
     - **Environment**: Production, Preview 필요 시 둘 다 선택
5. **Save** 클릭

### 방법 B: Wrangler CLI로 설정

터미널에서 프로젝트 루트로 이동한 뒤:

```bash
# Production
wrangler pages secret put NCS_API_KEY --project-name=3dcookiehd

# Preview도 동일 키로 설정할 때
wrangler pages secret put NCS_API_KEY --project-name=3dcookiehd --env=preview
```

실행 후 나오는 프롬프트에 **발급받은 API 키**를 붙여넣고 Enter.

### 적용: 재배포

환경변수/시크릿은 **배포가 일어날 때** 적용됩니다. 키만 바꿨다면 한 번 다시 배포하세요.

```bash
npm run deploy
```

이미 최근에 배포했다면, Cloudflare 쪽에서 **재배포(Redeploy)** 만 해도 새 키가 반영됩니다. (Workers & Pages → 3dcookiehd → Deployments → 최신 배포 옆 … → Retry deployment)

### 동작 확인

- **훈련직종 검색**: `/admin/ncs/approved/1` 에서 대분류 선택 후 중·소·세분류·직종 목록이 공공 API로 채워지는지 확인
- **API 상태 확인**: 배포된 사이트에서 `/api/ncs/approved/check` 링크를 열어 `publicApi: "ok"`, `itemCount` 등이 나오는지 확인

키가 없거나 잘못되면 Mock 데이터만 나오거나, "NCS_API_KEY가 설정되지 않았습니다" 메시지가 표시됩니다.
