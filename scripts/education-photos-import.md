# 구 사이트(3dcookiehd.co.kr) 교육사진 → 새 사이트 임포트 가이드

## 개요

구 사이트(https://3dcookiehd.co.kr/?c=7/17)의 **3D프린팅 교육사진** 목록을 새 사이트(3dcookiehd.pages.dev)의 **교육사진 갤러리**로 옮기는 방법입니다.

- **관리자 화면에서 CSV 일괄 등록**: 새 사이트 **관리자 > 교육사진 갤러리 관리**에서 **CSV 일괄 등록** 버튼을 누른 뒤, 구 사이트에서 다운받은 CSV 파일을 선택하면 바로 일괄 등록됩니다. (별도 스크립트 실행 불필요)
- **명령줄/스크립트로 진행**: **방법 0-2**에서 CSV를 JSON으로 변환한 뒤 `import-education-photos.js`로 일괄 등록할 수 있습니다.

---

## 방법 0: 구 사이트 아이디/비밀번호로 자동 추출 (권장)

구 사이트 **로그인 아이디와 비밀번호**를 알려주면, 스크립트가 자동으로 로그인한 뒤 교육사진 목록·상세(이미지 URL, 설명)를 추출해 JSON 파일로 저장합니다.

### 사전 준비

1. **Puppeteer 설치** (프로젝트 루트에서 한 번만 실행)
   ```bash
   npm install puppeteer
   ```

2. **보안**: 아이디/비밀번호는 **환경변수**로만 전달하세요. 코드나 파일에 직접 적지 마시고, Git에 커밋하지 마세요.

### 실행 방법

**Windows PowerShell 예시:**

```powershell
cd d:\Documents\program_DEV\3DCookieHD-education-platform

# 구 사이트 계정 (환경변수로 전달)
$env:OLD_SITE_URL="https://3dcookiehd.co.kr"
$env:OLD_SITE_USER="구사이트_아이디"
$env:OLD_SITE_PASSWORD="구사이트_비밀번호"

# 자동 추출 실행 (브라우저가 백그라운드로 뜹니다)
node scripts/scrape-education-photos.cjs
```

- 로그인 전용 URL이 따로 있으면: `$env:LOGIN_URL="https://3dcookiehd.co.kr/member/login"`
- 교육사진 목록 URL이 다르면: `$env:EDUCATION_PHOTOS_PATH="/?c=7/17"` 형태로 변경
- 브라우저 창을 보면서 진행하려면: `$env:HEADLESS="0"` 로 설정

실행이 끝나면 **scripts/education-photos-backup.json** 에 제목·이미지 URL·설명이 저장됩니다. 이어서 **방법 1**의 3단계(임포트 스크립트)로 새 사이트에 등록하면 됩니다.

- **로그인 폼을 못 찾을 때**: `HEADLESS=0` 으로 실행하면 브라우저가 보입니다. 직접 로그인한 뒤 터미널에서 Enter를 누르면 목록 추출이 이어집니다.
- 구 사이트 HTML 구조가 다르면 **scripts/scrape-education-photos.cjs** 안의 셀렉터(테이블 행, 링크, 상세 이미지 등)를 해당 사이트에 맞게 수정해야 할 수 있습니다.

---

## 방법 0-2: 구 사이트 관리자에서 CSV로 받은 데이터 사용

구 사이트 관리자(**3D프린팅 교육사진** 목록)에서 **CSV** 버튼으로 다운받은 파일을 새 사이트 형식(JSON)으로 바꾼 뒤 일괄 등록할 수 있습니다.

### 1단계: CSV 다운로드

- 구 사이트 관리자 로그인 → **홈페이지 > 게시판/페이지 > 기능별 > 3D프린팅 교육사진** 이동
- 목록 위 **CSV** 버튼 클릭 → 다운로드된 파일(예: `3D프린팅_교육사진.csv`)을 프로젝트 `scripts` 폴더에 넣거나 경로를 기억해 둡니다.

### 2단계: CSV → JSON 변환

터미널에서 아래 중 하나로 실행합니다.

```powershell
cd d:\Documents\program_DEV\3DCookieHD-education-platform

# CSV 파일 경로 지정 (파일이 scripts 폴더에 있으면)
node scripts/csv-to-education-photos.js scripts/다운로드한파일명.csv

# 또는 환경변수로 지정
$env:CSV_PATH="C:\Users\...\Downloads\3D프린팅_교육사진.csv"
node scripts/csv-to-education-photos.js
```

- 변환 결과는 **scripts/education-photos-backup.json** 에 저장됩니다.
- CSV에 **제목** 컬럼은 필수입니다. **등록자**, **등록일자**는 본문 설명(content)으로 넣습니다.
- **이미지 URL** 컬럼이 CSV에 있으면 자동으로 `imageUrl`로 매핑됩니다. 컬럼명이 다르면 `IMAGE_COLUMN=컬럼명` 으로 지정하세요.

### 3단계: 이미지 URL이 없는 경우

구 사이트 CSV에는 보통 **이미지 URL이 없고** no, 제목, 등록자, 등록일자, 조회만 있을 수 있습니다. 이 경우:

1. **방법 0(스크래퍼)** 을 먼저 실행해 구 사이트에서 제목·이미지 URL을 추출한 JSON을 만든 뒤, **방법 1** 3단계(임포트)를 실행하거나  
2. 위 2단계로 만든 JSON을 열어, 각 항목에 구 사이트 상세 페이지에서 복사한 이미지 주소를 **imageUrl** 로 추가한 뒤 **방법 1** 3단계(임포트)를 실행합니다.

이미지 URL이 비어 있는 항목은 import 스크립트가 **건너뜁니다**(등록되지 않음). 이미지를 채운 JSON으로 다시 import 하면 됩니다.

### 4단계: 새 사이트에 일괄 등록

JSON까지 준비되었으면 **방법 1**의 1단계(관리자 토큰 얻기)와 3단계(임포트 스크립트 실행)를 그대로 진행하면 됩니다.

---

## 방법 1: JSON 파일로 일괄 등록

### 1단계: 관리자 토큰 얻기

1. 새 사이트(https://3dcookiehd.pages.dev)에 **관리자**로 로그인합니다.
2. 브라우저 개발자 도구(F12) → **Application** (또는 **Storage**) → **Local Storage** → 해당 사이트 선택.
3. `token` 항목 값을 복사해 둡니다.

### 2단계: 데이터 준비 (JSON)

`scripts/education-photos-backup.json` 파일을 편집합니다. (같은 폴더에 예시 파일이 있습니다.) 아래 형식으로 작성합니다.

```json
[
  {
    "title": "퓨전(Fusion) 활용 고급 과정",
    "imageUrl": "https://3dcookiehd.co.kr/upload/photo1.jpg",
    "content": "구 사이트에서 가져온 설명 (선택)"
  },
  {
    "title": "마산대학교 3D프린터 운용기능사",
    "imageUrl": "https://3dcookiehd.co.kr/upload/photo2.jpg",
    "content": ""
  }
]
```

- **title**: 제목 (필수)
- **imageUrl**: 이미지 URL 한 개 (필수). 구 사이트 이미지 주소 또는 업로드 후 받은 URL.
- **content**: 본문 설명 (선택, HTML 가능)
- **images**: 여러 장이면 `"images": ["url1", "url2"]` 형태로도 가능 (imageUrl 대신 사용 가능)

**구 사이트에서 URL 얻는 방법**: 3dcookiehd.co.kr/?c=7/17 페이지에서 각 항목을 클릭해 상세로 들어간 뒤, 표시된 이미지에 마우스 오른쪽 클릭 → **이미지 주소 복사** (또는 "Copy image address")로 URL을 복사해 `imageUrl`에 넣으면 됩니다. 제목은 목록/상세 페이지에서 복사해 `title`에 넣습니다. 아래 **방법 2**로 목록만 추출한 뒤 JSON으로 정리해도 됩니다.

### 3단계: 임포트 스크립트 실행

```bash
cd d:\Documents\program_DEV\3DCookieHD-education-platform
node scripts/import-education-photos.js
```

실행 전에 스크립트 안의 **BASE_URL**, **TOKEN**을 설정하거나, 환경 변수로 넘깁니다.

```bash
# Windows PowerShell 예시
$env:BASE_URL="https://3dcookiehd.pages.dev"
$env:TOKEN="여기에_복사한_토큰_붙여넣기"
node scripts/import-education-photos.js
```

성공하면 새 사이트 **교육사진 갤러리**(/education-photos)와 **관리자 > 교육사진 갤러리 관리**에서 확인할 수 있습니다.

---

## 방법 2: 구 사이트에서 목록만 추출 (수동)

구 사이트 페이지 구조에 따라 다음 중 편한 방법을 쓰면 됩니다.

1. **브라우저에서 수동 복사**  
   - 3dcookiehd.co.kr/?c=7/17 에서 각 항목 제목·이미지 링크를 복사해 JSON 또는 엑셀에 정리 후, 위 JSON 형식으로 만듭니다.

2. **개발자 도구로 링크 추출**  
   - 해당 페이지에서 F12 → **Elements**에서 목록/이미지가 있는 HTML을 찾고, 제목/이미지 `src` 또는 `href`를 복사해 JSON으로 정리합니다.

3. **스크래퍼 사용 (선택)**  
   - 구 사이트 HTML이 고정된 경우, Node.js로 해당 URL을 `fetch`한 뒤 제목·이미지 URL만 파싱하는 짧은 스크립트를 만들어 JSON으로 저장할 수 있습니다. (사이트 구조가 바뀌면 수정 필요)

---

## 주의사항

- **아이디/비밀번호·토큰 보안**: `OLD_SITE_USER`, `OLD_SITE_PASSWORD`, `TOKEN` 은 환경변수로만 전달하고, 코드/파일에 적지 말며 Git에 커밋하지 마세요.
- **이미지 URL**: 구 사이트 이미지 주소(https://3dcookiehd.co.kr/...)를 그대로 쓰면, 구 사이트가 내려가거나 URL이 바뀌면 새 사이트에서 이미지가 깨질 수 있습니다. 가능하면 이미지를 다운로드한 뒤 **새 사이트 관리자 > 게시판 관리 또는 교육사진 갤러리 관리**에서 이미지 업로드로 올리고, 그 URL을 JSON의 `imageUrl`로 쓰는 것을 권장합니다.
- **대량 등록**: 한 번에 너무 많은 건을 등록하면 API 제한에 걸릴 수 있으므로, 필요 시 JSON을 나눠서 여러 번 실행하세요.
