# 시제품(prototype) 관련 현재 구조 파악

## 1. 요약

- **시제품**은 게시판(posts)의 **카테고리 중 하나**(`category=prototype`)로만 사용되고 있음.
- 공개 게시판 페이지(`/posts`)에는 **시제품 탭이 없고**, 홈에서만 "시제품·작품 더 보기"로 `/posts?category=prototype` 링크로 진입 가능.
- 관리자 게시판 관리(`/admin/posts`)에서만 "시제품" 탭으로 prototype 카테고리 게시글을 조회·작성·수정·삭제 가능.
- **별도 전용 페이지/파일은 없으며**, 이미지 업로드·갤러리 형태의 "시제품 제작 사진" 전용 관리도 없음.

---

## 2. 데이터 저장

| 항목 | 내용 |
|------|------|
| **테이블** | `posts` (게시판 공통) |
| **구분** | `posts.category = 'prototype'` |
| **스키마** | `migrations/0001_initial_schema.sql` – `posts.category`는 `TEXT NOT NULL`, 주석에는 `notice, faq, portfolio, qna`만 기재되어 있고 **prototype은 없음** (값은 자유 문자열로 저장 가능) |
| **타입** | `src/types/index.ts` – `PostCategory = 'notice' \| 'faq' \| 'portfolio' \| 'qna'` → **prototype 미포함** (런타임에서는 그냥 문자열로 사용) |

즉, 시제품은 **같은 posts 테이블 + category 값만 다른** 구조입니다.

---

## 3. API

| 위치 | 동작 |
|------|------|
| **`src/api/posts.ts`** | `GET /api/posts?category=prototype` 로 목록/상세 조회. `POST /api/posts` 시 body에 `category: 'prototype'` 넣어 작성. 카테고리 값에 대한 enum 검사 없음 → **prototype 저장/조회 가능**. |

- 공지/FAQ만 관리자 전용 작성 제한이 있고, **prototype은 별도 제한 없음** (인증된 사용자면 작성 가능).

---

## 4. 공개 쪽 (사용자 보는 페이지)

| 위치 | 내용 |
|------|------|
| **`src/views/posts.ts`** | 게시판 공개 페이지. **탭은 4개만 존재**: 공지사항, FAQ, Q&A, 포트폴리오. **시제품 탭 없음.** |
| **URL** | `/posts?category=prototype` 로 직접 접근하면 API는 `category=prototype`으로 필터링해 목록을 주지만, **상단 탭에는 "시제품"이 없어서** 탭 선택 UI와 불일치. |
| **표시 방식** | `posts.ts`에서 `currentCategory === 'portfolio'`일 때만 카드형(이미지 그리드)으로 렌더링. **prototype은 리스트형(텍스트+썸네일)**으로만 표시됨. |

즉, 시제품은 **쿼리로만 진입 가능하고**, 전용 탭·전용 레이아웃이 없음.

---

## 5. 관리자 쪽 (업로드/관리)

| 위치 | 내용 |
|------|------|
| **`src/views/admin_posts.ts`** | 게시판 관리. 탭: 전체, 공지사항, FAQ, 포트폴리오, **시제품**, Q&A. |
| **작성 모달** | 카테고리 select에 **`<option value="prototype">시제품</option>`** 있음. |
| **동작** | `filterCategory('prototype')` → `GET /api/posts?category=prototype` 로 목록 조회 후 테이블로 표시. 작성/수정 시 `category: 'prototype'`으로 저장. |

시제품의 **업로드·수정·삭제는 모두 "게시판 관리" 한 곳**에서만 이뤄짐. 시제품 전용 관리 화면이나 이미지 갤러리 전용 업로드 플로우는 없음.

---

## 6. 홈 및 네비게이션

| 위치 | 내용 |
|------|------|
| **`src/views/home.ts`** | "시제품 제작 사진" 섹션 (`#prototype-gallery`). 플레이스홀더 그리드(아이콘 4개) + **"시제품·작품 더 보기"** 링크 → **`/posts?category=prototype`** 로 연결. |
| **`src/views/components/navigation.ts`** | 게시판 드롭다운에 공지사항, FAQ, Q&A, 수강후기, 포트폴리오만 있음. **시제품/시제품 갤러리 메뉴 없음.** |
| **`src/index.tsx`** (푸터 등) | `/#prototype-gallery` 링크로 "시제품 갤러리" 언급 있음 (앵커). |

시제품은 **홈의 한 섹션 + "더 보기"로만** 노출되고, 상단 메뉴에는 없음.

---

## 7. 정리: 현재 한계

1. **전용 페이지 없음**  
   - 시제품은 `/posts?category=prototype` 한 경로에 묶여 있고, 전용 라우트(예: `/prototype`, `/prototype-gallery`)나 전용 뷰 파일이 없음.

2. **공개 게시판과 혼재**  
   - 같은 `posts` + `posts.ts`를 쓰기 때문에, 공지/FAQ/Q&A/포트폴리오와 UI·탭이 섞여 있고, 시제품만 갤러리/이미지 중심으로 다루기 어렵다.

3. **시제품 전용 업로드/관리 없음**  
   - "시제품 제작 사진" 업로드·관리는 **admin 게시판 관리에서 카테고리만 "시제품"으로 선택**하는 방식뿐.  
   - 시제품 전용 테이블, 전용 API, 전용 관리 페이지, 이미지 갤러리형 업로드 플로우는 없음.

4. **타입/스키마와 불일치**  
   - `PostCategory`와 스키마 주석에는 `prototype`이 없지만, 실제로는 저장·조회되고 있음.

---

## 8. 별도 페이지·통일 관리로 갈 때 참고할 점

- **별도 페이지**:  
  - 전용 라우트(예: `GET /prototype` 또는 `GET /prototype-gallery`) 추가.  
  - 전용 뷰 파일(예: `src/views/prototype_gallery.ts`)에서 **시제품만** 갤러리 형태로 표시.

- **시제품 제작 사진 업로드·관리 통일**:  
  - **옵션 A**: 기존 `posts` + `category=prototype` 유지하되,  
    - 공개: `/prototype` 전용 페이지에서 `GET /api/posts?category=prototype`만 사용.  
    - 관리: 기존 `/admin/posts`의 "시제품" 탭 유지하거나, **시제품 전용 관리 페이지**(`/admin/prototype-gallery`)를 만들어 거기서만 시제품 글 작성/수정/삭제.
  - **옵션 B**: 시제품 전용 테이블(예: `prototype_gallery` 또는 `prototype_items`)을 새로 만들고,  
    - 전용 API (CRUD + 이미지 업로드)  
    - 전용 관리 페이지 (업로드·순서·노출 관리)  
    - 공개 전용 페이지에서 해당 API만 사용해 갤러리 구성.

현재 구조는 **옵션 A에 가깝게** 이미 동작 중이며, "별도 파일·페이지로 관리"는 **전용 라우트 + 전용 뷰 파일**을 두고, "업로드·관리 통일"은 **관리 화면을 시제품 전용 하나로 모으는 쪽**으로 정리하면 됨.
