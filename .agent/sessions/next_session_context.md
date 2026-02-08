# Next Session Context: 교육사진·포트폴리오 갤러리

**백업 일자**: 2026-02-06  
**브랜치**: `education-platform`  
**백업 태그**: `backup-20260206` (이 시점으로 복원 가능)

---

## 오늘 세션에서 완료한 작업

### 1. 관리자 포트폴리오 갤러리
- **경로**: `/admin/portfolio-gallery`
- **내용**: 교육사진 갤러리와 동일 구조, 카테고리 `portfolio`. 등록/수정/삭제, 다중 이미지 업로드, TinyMCE. CSV·일괄 URL 입력 기능은 제외.
- **파일**: `src/views/admin_portfolio_gallery.ts` (신규), `src/index.tsx` (라우트), `src/views/components/hrd_sidebar.ts` (메뉴 "포트폴리오 갤러리" 추가).
- **공개 미리보기**: `/portfolios`

### 2. 교육사진 공개 페이지 ↔ 관리자 데이터 연동
- **공개 URL**: https://3dcookiehd.pages.dev/education-photos?filter=education_photo
- **API**: `/api/posts?category=education_photo&status=published` (동일 데이터 사용).
- **수정**: `src/views/education_gallery.ts`
  - 요청 개수: `limit=100` → `limit=2000` (관리자 1075건 등 전체 표시).
  - 이미지 없는 항목도 리스트에 포함 (`educationList = eduRaw`, 기존 필터 제거).

### 3. 배포
- 커밋 푸시 및 Cloudflare Pages 배포 완료 (두 번: 포트폴리오 갤러리 추가 → 교육사진 리스트 수정).

---

## 현재 상태

- **Working tree**: clean (미커밋 변경 없음).
- **원격**: `origin/education-platform` 최신 푸시 완료.
- **백업 태그**: `backup-20260206` 로컬 생성됨. 다음에 `git push origin backup-20260206` 하면 원격 백업 완료.

---

## 다음 세션에서 이어서 할 수 있는 것

1. **포트폴리오 공개 페이지 연동 (선택)**  
   `/portfolios` 페이지에서 관리자 포트폴리오 갤러리(category=portfolio) 게시글도 함께 표시하려면 `src/views/portfolios.ts`의 `loadPortfolios()`에서 `/api/posts?category=portfolio&status=published` 추가 후 결과 병합.

2. **교육사진·포트폴리오 갤러리**  
   추가 필터, 정렬, 검색 또는 UI 개선.

3. **기타**  
   회차 과정, NCS, 강사/학생 대시보드 등 기존 영역 이어서 작업.

---

## 복원 방법 (필요 시)

```bash
git fetch --tags
git checkout backup-20260206   # 태그 시점으로 되돌리기
# 또는
git checkout education-platform
git reset --hard backup-20260206
```
