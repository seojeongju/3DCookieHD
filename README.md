# 와우쓰리디쿠키홍대센터 교육 플랫폼

## 🎓 프로젝트 개요
- **이름**: 와우쓰리디쿠키홍대센터 교육 플랫폼
- **목표**: 3D 프린팅 교육을 위한 종합 온라인 플랫폼
- **기술 스택**: Hono + Cloudflare Workers + D1 Database + TypeScript

## 🌐 배포 URL
- **프로덕션**: https://education-platform-6wa.pages.dev
- **최근 배포**: https://fb5e1caf.education-platform-6wa.pages.dev
- **GitHub**: https://github.com/seojeongju/3DCookieHD (education-platform 브랜치)

## ✨ 현재 완료된 기능

### 1️⃣ 인증 시스템 (Authentication)
- ✅ 회원가입 (이메일, 비밀번호, 이름, 전화번호)
- ✅ 로그인 (JWT 기반)
- ✅ 역할 기반 접근 제어 (student, teacher, admin)

### 2️⃣ 과정 관리 (Courses)
- ✅ 과정 목록 조회 (카테고리, 레벨, 검색 필터)
- ✅ 과정 상세 정보
- ✅ 과정 CRUD (관리자 전용)
- ✅ 카테고리: 3D모델링, 3D프린팅, 자격증, 창업/실무

### 3️⃣ 캠퍼스 관리 (Campuses)
- ✅ 캠퍼스 목록 조회
- ✅ 캠퍼스 상세 정보
- ✅ 캠퍼스 CRUD (관리자 전용)

### 4️⃣ 수강 신청 (Enrollments)
- ✅ 수강 신청 (중복 체크, 정원 체크)
- ✅ 내 수강 목록 조회
- ✅ 수강 취소
- ✅ 수강 상태 관리 (pending, approved, rejected, completed, cancelled)
- ✅ 관리자 승인 시스템

### 5️⃣ 수강 후기 (Reviews)
- ✅ 후기 작성 (별점, 내용)
- ✅ 후기 목록 조회 (과정별, 사용자별)
- ✅ 후기 수정/삭제
- ✅ 관리자 승인 시스템
- ✅ 도움됨 기능
- ✅ 과정 평균 평점 자동 계산

### 6️⃣ 게시판 시스템 (Posts & Comments)
- ✅ 4개 게시판 (공지사항, FAQ, 포트폴리오, Q&A)
- ✅ 게시글 CRUD
- ✅ 댓글 시스템 (중첩 댓글 지원)
- ✅ 좋아요 기능
- ✅ 조회수 추적
- ✅ 검색 및 필터링

### 7️⃣ 프론트엔드 UI
- ✅ 반응형 네비게이션
- ✅ 인터랙티브 히어로 섹션 (5개 슬라이드, 마우스 호버 효과)
- ✅ 특징 섹션
- ✅ 푸터
- ✅ TailwindCSS + FontAwesome 아이콘
- ✅ 블루 컬러 테마

## 🎨 히어로 섹션 특징
- 5개의 고품질 3D 프린팅 테마 이미지
- 자동 슬라이드쇼 (5초 간격)
- 마우스 호버 시 인터랙티브 효과:
  - 배경 이미지 확대 (1.05배)
  - 오버레이 투명도 감소
  - 텍스트 애니메이션
  - 자동 슬라이드 일시정지
- 네비게이션 도트

## 📊 데이터 구조

### 주요 테이블:
1. **users** - 사용자 정보 (학생, 강사, 관리자)
2. **courses** - 과정 정보
3. **campuses** - 캠퍼스 정보
4. **enrollments** - 수강 신청 정보
5. **reviews** - 수강 후기
6. **posts** - 게시글
7. **comments** - 댓글
8. **post_likes** - 게시글 좋아요
9. **review_helpful** - 후기 도움됨

### 저장소:
- **Cloudflare D1** - SQLite 기반 엣지 데이터베이스
- **Database ID**: 28fc5bec-bc18-46a9-8aea-fc4a4f6e44db

## 🚀 자동 배포 설정

### GitHub Actions 자동 배포:
- ✅ `education-platform` 브랜치에 푸시 시 자동 배포
- ✅ Cloudflare Pages 연동
- ✅ 자동 빌드 및 배포

### 배포 프로세스:
```bash
git push origin education-platform
→ GitHub Actions 트리거
→ npm ci && npm run build
→ Cloudflare Pages 배포
→ 자동으로 https://education-platform-6wa.pages.dev 업데이트
```

## 🛠️ 로컬 개발

### 설치:
```bash
npm install
```

### 개발 서버 (샌드박스):
```bash
npm run build
pm2 start ecosystem.config.cjs
```

### 로컬 개발 (로컬 머신):
```bash
npm run dev
```

### 데이터베이스 마이그레이션:
```bash
# 로컬
npm run db:migrate:local

# 프로덕션 (권한 필요)
npm run db:migrate:prod
```

### 테스트:
```bash
curl http://localhost:3000
```

## 📝 API 엔드포인트

### 인증:
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 과정:
- `GET /api/courses` - 과정 목록
- `GET /api/courses/:id` - 과정 상세
- `POST /api/courses` - 과정 생성 (관리자)
- `PUT /api/courses/:id` - 과정 수정 (관리자)
- `DELETE /api/courses/:id` - 과정 삭제 (관리자)

### 캠퍼스:
- `GET /api/campuses` - 캠퍼스 목록
- `GET /api/campuses/:id` - 캠퍼스 상세
- `POST /api/campuses` - 캠퍼스 생성 (관리자)
- `PUT /api/campuses/:id` - 캠퍼스 수정 (관리자)
- `DELETE /api/campuses/:id` - 캠퍼스 삭제 (관리자)

### 수강 신청:
- `GET /api/enrollments` - 내 수강 목록 (인증 필요)
- `POST /api/enrollments` - 수강 신청 (인증 필요)
- `PUT /api/enrollments/:id/status` - 상태 변경 (관리자)
- `DELETE /api/enrollments/:id` - 수강 취소 (인증 필요)

### 수강 후기:
- `GET /api/reviews` - 후기 목록
- `POST /api/reviews` - 후기 작성 (인증 필요)
- `PUT /api/reviews/:id` - 후기 수정 (인증 필요)
- `DELETE /api/reviews/:id` - 후기 삭제 (인증 필요)
- `PUT /api/reviews/:id/approve` - 후기 승인 (관리자)
- `POST /api/reviews/:id/helpful` - 도움됨

### 게시판:
- `GET /api/posts` - 게시글 목록
- `POST /api/posts` - 게시글 작성 (인증 필요)
- `PUT /api/posts/:id` - 게시글 수정 (인증 필요)
- `DELETE /api/posts/:id` - 게시글 삭제 (인증 필요)
- `POST /api/posts/:id/like` - 좋아요
- `POST /api/posts/:id/comments` - 댓글 작성 (인증 필요)
- `DELETE /api/posts/:post_id/comments/:comment_id` - 댓글 삭제 (인증 필요)

## ⏭️ 다음 개발 단계

### Phase 2 - 프론트엔드 완성:
- [ ] 로그인/회원가입 모달
- [ ] 과정 목록 페이지
- [ ] 과정 상세 페이지
- [ ] 수강 신청 폼
- [ ] 마이페이지
- [ ] 수강 후기 섹션
- [ ] 게시판 UI

### Phase 3 - 관리자 대시보드:
- [ ] 관리자 페이지
- [ ] 과정 관리
- [ ] 수강 신청 승인
- [ ] 후기 관리
- [ ] 통계 대시보드

### Phase 4 - 추가 기능:
- [ ] 결제 시스템 (Stripe 연동)
- [ ] 이메일 알림 (SendGrid)
- [ ] 파일 업로드 (R2 Storage)
- [ ] 실시간 채팅 지원

## 🔒 환경 변수

프로덕션 배포 시 필요한 시크릿:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API 토큰 (GitHub Secrets에 저장)

## 📱 브라우저 지원
- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 📄 라이선스
© 2025 와우쓰리디쿠키홍대센터. All rights reserved.

## 👥 개발자
- **이메일**: jayseo36@gmail.com
- **GitHub**: https://github.com/seojeongju/3DCookieHD

---

**마지막 업데이트**: 2025-10-27
**버전**: 1.0.0
**배포 상태**: ✅ 자동 배포 활성화
