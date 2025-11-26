# 와우쓰리디홍대센터 교육 플랫폼 - 프로젝트 요약

## 📌 프로젝트 정보

**프로젝트명**: 와우쓰리디홍대센터 교육 플랫폼  
**기술 스택**: Hono + TypeScript + Cloudflare Workers + D1 Database + TailwindCSS  
**GitHub 저장소**: https://github.com/seojeongju/3DCookieHD  
**작업 브랜치**: education-platform  
**마지막 업데이트**: 2025-10-27

## 🎯 최근 작업 완료 내역

### 1. 센터소개 메뉴 구현 (2025-10-27)
- **"캠퍼스" 메뉴 → "센터소개" 드롭다운 메뉴로 변경**
- 4개 서브메뉴 페이지 구현:
  - ✅ 인사말 (`/greeting`)
  - ✅ 교육사진 (`/education-photos`) 
  - ✅ 시설현황 (`/facilities`)
  - ✅ 지점안내 (`/locations`)

### 2. 네비게이션 레이아웃 최적화 (2025-10-27)
- 센터명을 로고 아래로 이동 (작은 폰트)
- 메뉴 간격 축소 및 텍스트 크기 최적화
- 모든 메뉴 항목에 줄바꿈 방지 적용
- 메뉴명 간소화 (과정안내, 수강후기 등)

### 3. 원장 정보 업데이트 (2025-10-27)
- 직책: 센터장 → 원장
- 이름: 이준우 → 김순희 / 서정주

## 📂 프로젝트 구조

```
/home/user/webapp/
├── src/
│   └── index.tsx              # 메인 애플리케이션 (모든 라우트 포함)
├── public/
│   └── static/                # 정적 파일 (이미지, CSS 등)
├── dist/                      # 빌드 결과물
├── migrations/                # D1 데이터베이스 마이그레이션
├── wrangler.json             # Cloudflare 설정
├── ecosystem.config.cjs      # PM2 설정
├── package.json              # 의존성 및 스크립트
└── README.md                 # 프로젝트 문서

```

## 🚀 주요 기능

### 구현된 페이지 목록
1. **메인 페이지** (`/`)
   - 히어로 섹션 (5개 슬라이드, 각기 다른 색상 테마)
   - 과정 안내 섹션 (데이터베이스 연동)
   - 수강 후기
   - 게시판
   - 협력기관 (한국산업인력공단 포함)

2. **센터소개 메뉴**
   - 원장 인사말 (`/greeting`)
   - 교육사진 갤러리 (`/education-photos`)
   - 시설현황 (`/facilities`)
   - 지점안내 (`/locations`) - 서울/구미/전주 3개 지점

3. **상담센터 메뉴**
   - 온라인상담신청 (`/online-consulting`)
   - 기업단체교육 (`/corporate-education`)
   - 대학맞춤교육 (`/university-education`)

4. **학사관리시스템**
   - 학생학사행정시스템 (`/student-admin`)
   - 강사학사행정시스템 (`/teacher-admin`)

5. **기타 페이지**
   - 수강 일정 (`/schedule`)
   - 이용약관 (`/terms`)
   - 개인정보처리방침 (`/privacy`)
   - 제휴문의 (`/partnership`)
   - 사이트맵 (`/sitemap`)

## 🗄️ 데이터베이스 스키마

### courses (과정 테이블)
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration_months INTEGER,
  duration_hours INTEGER,
  price INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### reviews (후기 테이블)
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  student_name TEXT NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
)
```

### boards (게시판 테이블)
```sql
CREATE TABLE boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🛠️ 개발 환경 설정

### 필수 도구
- Node.js (v18+)
- npm
- wrangler CLI
- PM2 (개발 서버 관리)

### 개발 서버 실행
```bash
cd /home/user/webapp

# 빌드
npm run build

# 개발 서버 시작 (PM2)
pm2 start ecosystem.config.cjs

# 서버 상태 확인
pm2 list

# 로그 확인
pm2 logs webapp --nostream

# 서버 재시작
pm2 restart webapp

# 서버 중지
pm2 delete webapp
```

### 데이터베이스 관리
```bash
# 로컬 마이그레이션 실행
npx wrangler d1 migrations apply education-platform-db --local

# 로컬 데이터베이스 쿼리
npx wrangler d1 execute education-platform-db --local --command="SELECT * FROM courses"

# 프로덕션 마이그레이션
npx wrangler d1 migrations apply education-platform-db
```

## 🌐 배포 정보

### Cloudflare Pages 배포
```bash
# 빌드 후 배포
npm run build
npx wrangler pages deploy dist --project-name 3dcookiehd

# 또는 package.json 스크립트 사용
npm run deploy:prod
```

### 환경 변수 설정
```bash
# Cloudflare 시크릿 추가
npx wrangler pages secret put API_KEY --project-name 3dcookiehd

# 시크릿 목록 확인
npx wrangler pages secret list --project-name 3dcookiehd
```

## 📦 백업 정보

**백업 파일**: wow3d-education-platform-final.tar.gz  
**다운로드 URL**: https://page.gensparksite.com/project_backups/wow3d-education-platform-final.tar.gz  
**백업 크기**: 12.5 MB  
**백업 일시**: 2025-10-27

### 백업 복원 방법
```bash
# 백업 다운로드
wget https://page.gensparksite.com/project_backups/wow3d-education-platform-final.tar.gz

# 압축 해제 (절대 경로로 복원됨)
tar -xzf wow3d-education-platform-final.tar.gz -C /

# 프로젝트 디렉토리로 이동
cd /home/user/webapp

# 의존성 설치 (필요시)
npm install

# 빌드 및 실행
npm run build
pm2 start ecosystem.config.cjs
```

## 🔗 중요 링크

- **GitHub 저장소**: https://github.com/seojeongju/3DCookieHD
- **작업 브랜치**: education-platform
- **Cloudflare 프로젝트**: 3dcookiehd
- **D1 Database**: education-platform-db

## 📋 다음 세션 작업 시 체크리스트

### 시작 전 확인사항
- [ ] 백업 파일 다운로드 및 복원 완료
- [ ] GitHub 저장소 최신 상태 확인 (`git pull origin education-platform`)
- [ ] 의존성 설치 확인 (`npm install`)
- [ ] 개발 서버 실행 확인 (`npm run build && pm2 start ecosystem.config.cjs`)
- [ ] 데이터베이스 마이그레이션 확인

### 진행 중인 작업
- ✅ 센터소개 메뉴 4개 페이지 완성
- ✅ 네비게이션 레이아웃 최적화
- ✅ 원장 정보 업데이트

### 향후 개선 제안
1. **갤러리 이미지 업로드 시스템**
   - 교육사진 페이지의 실제 이미지 업로드 기능
   - 관리자 페이지에서 이미지 관리

2. **협력기관 링크 업데이트**
   - 플레이스홀더 링크를 실제 URL로 교체

3. **반응형 모바일 메뉴**
   - 햄버거 메뉴 구현
   - 모바일 드롭다운 최적화

4. **검색 기능**
   - 과정 검색
   - 게시판 검색

5. **관리자 대시보드**
   - 과정 관리
   - 수강생 관리
   - 통계 대시보드

## 💡 개발 팁

### Git 작업 플로우
```bash
# 최신 변경사항 가져오기
git pull origin education-platform

# 변경사항 커밋
git add .
git commit -m "작업 내용"

# GitHub에 푸시
git push origin education-platform
```

### 디버깅
```bash
# PM2 로그 실시간 확인
pm2 logs webapp

# 빌드 에러 확인
npm run build

# 포트 3000 사용 중인 프로세스 종료
fuser -k 3000/tcp
```

### 성능 최적화
- 이미지는 WebP 포맷 사용 권장
- 정적 파일은 Cloudflare CDN 활용
- D1 쿼리는 인덱스 활용

## 🎉 완료된 주요 기능

1. ✅ 전체 페이지 구조 및 네비게이션
2. ✅ 데이터베이스 설계 및 마이그레이션
3. ✅ 동적 과정 안내 드롭다운
4. ✅ 센터소개 메뉴 (인사말, 교육사진, 시설현황, 지점안내)
5. ✅ 상담센터 메뉴 (온라인상담, 기업교육, 대학교육)
6. ✅ 학사관리시스템 (학생/강사 행정시스템)
7. ✅ 푸터 페이지 (약관, 개인정보, 제휴, 사이트맵)
8. ✅ 협력기관 섹션 (한국산업인력공단 포함)
9. ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
10. ✅ 네비게이션 레이아웃 최적화

---

**작성일**: 2025-10-27  
**마지막 커밋**: 851d729 - Update greeting page: Change director name to co-directors  
**백업 상태**: ✅ 완료
