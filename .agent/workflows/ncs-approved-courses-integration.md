---
description: NCS 승인과정 정보 API 연동 — 승인받은과정 입력에 NCS 정보 적극 활용
---

# NCS 승인과정 정보 연동 제안

첨부 이미지와 같은 **NCS 훈련과정 승인정보(과정개요, 훈련직종 검색)** 를 우리 플랫폼의 **승인받은과정** 등록·수정 화면에 연동해, NCS 정보를 끌어와 입력을 보조하는 방안입니다.

---

## 1. 목표

- **승인받은과정** 입력 시 NCS 훈련직종(개발분류 → 대분류 → 중분류 → 소분류) 선택으로 **NCS 코드·직종명** 자동 반영
- NCS 훈련과정정보 API에서 **훈련목표, 훈련시간** 등을 가져와 과정명·훈련시간 등 입력에 활용
- 기존 `/admin/ncs` 능력단위 검색과 구분해, **승인과정용 NCS 정보 전용 API**를 두어 재사용

---

## 2. 활용할 공공데이터 API

### 2.1 NCS 훈련과정정보 (공공데이터포털)

| 항목 | 내용 |
|------|------|
| **데이터셋** | [한국산업인력공단_NCS 훈련과정정보](https://www.data.go.kr/data/15086447/openapi.do) |
| **요청 URL** | `http://apis.data.go.kr/B490007/ncsTrainingCource` (openapi18) |
| **인증** | 공공데이터포털 인증키(`serviceKey`) |
| **요청변수** | `serviceKey`, `pageNo`, `numOfRows`, `returnType`(xml), **`ncsLclasCd`**(대분류 2자리, 필수), **`cdName`**(능력단위명, 옵션) |
| **출력** | 대/중/소/세분류 코드·명, **능력단위분류번호**(ncsClCd), **능력단위명칭**, **훈련목표**, **훈련시간**, 훈련시설, 훈련방법 |
| **트래픽** | 개발 10,000건/일 |

- **대분류코드(`ncsLclasCd`)**: 2자리(예: 01, 15). 대분류만 넣고 조회하면 해당 대분류 내 중·소·세분류 및 능력단위 목록을 받을 수 있음.
- 이미지의 **“훈련직종 검색”** 플로우(개발분류 → 대 → 중 → 소)와 맞추려면, **대분류 목록**이 필요함. NCS 대분류는 보통 01~24 등 고정 목록으로 제공하거나, 첫 페이지만 조회해 대분류 목록을 캐시하는 방식 사용 가능.

### 2.2 NCS 기준정보 (ncs.go.kr)

| 항목 | 내용 |
|------|------|
| **데이터셋** | [한국산업인력공단_국가직무능력표준 정보](https://www.data.go.kr/data/3072161/openapi.do) |
| **요청 URL** | `http://www.ncs.go.kr/api/openapi5.do` |
| **요청변수** | `ServiceKey`, `pageNo`, `numOfRows`, `returnType`(json), **`dutyCd`**(직무코드 8자리), `compUnitCd`(옵션) |
| **출력** | NCS분류코드, 능력단위코드·명, 능력단위요소, KSA 등 |

- 직무코드(대중소 8자리) 기준 상세 정보 조회용. 훈련과정정보 API와 조합해 **코드로 상세 보강**할 때 활용 가능.

---

## 3. 제안 API 설계 (우리 서버)

아래는 **우리 백엔드에 새로 두는 NCS 승인과정용 API** 제안입니다. 기존 `GET /api/ncs/search`(키워드 검색)와 역할을 나누고, 승인받은과정 폼 전용으로 사용합니다.

### 3.1 대분류 목록 (훈련직종 1단계)

- **`GET /api/ncs/approved/large-classes`**
- **역할**: 이미지의 “개발분류선택” 다음에 나오는 **대분류** 목록 제공.
- **구현 옵션**
  - **A**: NCS 훈련과정정보 API에 대분류코드 01~24(또는 문서/캐시 목록)를 순차 조회해 중복 제거한 대분류 목록 반환(또는 고정 JSON 반환).
  - **B**: 공공데이터에 “대분류만 목록” API가 없다면, **고정 목록**(또는 주기적으로 갱신하는 캐시)을 JSON으로 제공.

**응답 예시:**

```json
{
  "success": true,
  "data": [
    { "code": "01", "name": "사업관리" },
    { "code": "15", "name": "기계" },
    ...
  ]
}
```

### 3.2 훈련과정 목록 (대분류 + 키워드)

- **`GET /api/ncs/approved/training?ncsLclasCd=15&cdName=3D&pageNo=1&numOfRows=20`**
- **역할**: 선택한 **대분류**와(와) **능력단위명 키워드**로 NCS 훈련과정정보 API를 호출해, 중·소·세분류 및 능력단위 목록 반환.
- **파라미터**: `ncsLclasCd`(필수), `cdName`(옵션), `pageNo`, `numOfRows`.
- **구현**: 공공데이터 `B490007/ncsTrainingCource` 호출 → XML 수신 → JSON 변환 후 그대로 또는 가공해 반환.
- **응답**: 공공 API와 동일한 구조 또는 아래처럼 단순화 가능.

```json
{
  "success": true,
  "data": {
    "list": [
      {
        "ncsLclasCd": "15",
        "ncsLclasCdnm": "기계",
        "ncsMclasCd": "03",
        "ncsMclasCdnm": "...",
        "ncsSclasCd": "01",
        "ncsSclasCdnm": "기계요소설계",
        "ncsSubdCd": "01",
        "ncsSubdCdnm": "...",
        "ncsClCd": "15010201_19v3",
        "compeUnitName": "기계요소설계",
        "trainTime": "80",
        "trainGoal": "..."
      }
    ],
    "totalCount": 100
  }
}
```

- **캐시**: 동일 `ncsLclasCd`+`cdName`+`pageNo` 조합을 일정 시간(예: 1시간) 캐시하면 트래픽 절감 가능.

### 3.3 코드로 훈련과정 상세 (선택)

- **`GET /api/ncs/approved/training/by-code?code=15010201`**
- **역할**: 능력단위분류번호(또는 8자리 코드)로 **한 건 상세** 조회. 승인받은과정에서 “이 과정은 NCS 훈련과정 (15010201. 기계요소설계) 입니다”처럼 표시·자동채우기할 때 사용.
- **구현**: 훈련과정정보 API에서 해당 코드가 포함된 대분류로 검색해 매칭하거나, NCS 기준정보 API(`dutyCd` 등)와 조합.

---

## 4. DB·화면 연동

### 4.1 DB 확장 (approved_courses)

승인받은과정이 **어떤 NCS 훈련직종에 해당하는지** 저장할 컬럼을 추가합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `ncs_code` | TEXT | 능력단위분류번호(예: 15010201_19v3) 또는 8자리 직무코드 |
| `ncs_job_name` | TEXT | NCS 직종/능력단위명(예: 기계요소설계) |

- **마이그레이션**: `migrations/0037_add_approved_courses_ncs.sql` 등으로 추가.

### 4.2 승인받은과정 등록·수정 폼

- **위치**: `/admin/courses/approved/register`, `/admin/courses/approved/register/:id` (기존 승인받은과정 등록/수정 페이지).
- **추가 UI (이미지와 유사하게)**  
  - **“과정개요 및 직종선택”** 블록 추가  
    - 1) **대분류 선택**: `GET /api/ncs/approved/large-classes` 로 셀렉트 채움.  
    - 2) **훈련직종 검색**: 대분류 선택 후 `GET /api/ncs/approved/training?ncsLclasCd=...&cdName=...` 호출해 목록 표시(중·소·세분류, 능력단위명, 훈련시간 등).  
    - 3) 목록에서 **한 행 선택** 시  
      - `ncs_code`, `ncs_job_name`을 hidden/일반 입력에 채우고  
      - 필요 시 **훈련시간**을 `training_time_start`/`training_time_end` 또는 과정 설명에 반영(규칙은 정책에 따라 결정).  
  - **과정명**: 기존처럼 수동 입력 유지. 선택한 NCS 능력단위명을 과정명 기본값으로 넣어주는 정도만 자동화해도 활용도 높음.
- **기존 필드**: NCS교과 URL, 교수계획서 URL 등은 그대로 두고, NCS 연동은 **보조 정보**로만 사용해도 됨.

### 4.3 API 권한

- `GET /api/ncs/approved/*` 는 **관리자(또는 승인받은과정 관리 권한)** 만 호출 가능하도록 기존 admin 미들웨어 적용.

---

## 5. 환경변수·키 관리

- **공공데이터 인증키**: 이미 `.agent/workflows/ncs-api-setup.md` 에서 **`NCS_API_KEY`** 로 Cloudflare Pages 환경변수 설정을 안내하고 있음.
- **NCS 훈련과정정보 API**는 공공데이터포털 **별도 활용신청**이 필요할 수 있음(데이터셋 15086447). 동일 인증키로 사용 가능한지 포털에서 확인.
- **키 미설정 시**:  
  - `GET /api/ncs/approved/large-classes` → 고정 대분류 목록(또는 Mock) 반환.  
  - `GET /api/ncs/approved/training` → Mock 목록 반환 또는 “API 키를 설정해 주세요” 메시지.  
  이렇게 하면 키 없이도 UI·플로우는 동작하게 할 수 있음.

---

## 6. 구현 순서 제안

| 단계 | 내용 |
|------|------|
| **1** | `GET /api/ncs/approved/large-classes` 구현(고정 목록 또는 공공 API 연동). |
| **2** | `GET /api/ncs/approved/training` 구현(B490007 호출, XML→JSON, 캐시 선택). |
| **3** | 마이그레이션으로 `approved_courses`에 `ncs_code`, `ncs_job_name` 추가. |
| **4** | `approved_courses` API에서 두 필드 읽기/쓰기 반영. |
| **5** | 승인받은과정 등록·수정 페이지에 “과정개요 및 직종선택” 블록 + 위 API 호출 및 자동채우기. |
| **6** | (선택) `GET /api/ncs/approved/training/by-code` 로 코드 기준 상세 보강. |

---

## 7. 정리

- **NCS 훈련과정정보 API**로 대분류·능력단위명 기준 목록을 가져오고,  
- 우리 서버에 **`/api/ncs/approved/large-classes`**, **`/api/ncs/approved/training`** (및 선택적으로 **by-code**) 를 두어  
- **승인받은과정** 등록 시 이미지와 같은 “훈련직종 검색 → NCS 코드·직종명 선택” 플로우를 제공하면,  
NCS 승인과정 정보를 끌어와 승인받은과정 입력에 적극 활용할 수 있습니다.  
- 트래픽 제한(일 1,000~10,000건)을 고려해 대분류·키워드별 **캐시**를 두는 것을 권장합니다.
