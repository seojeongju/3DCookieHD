# 배포 가이드 - 중복 배포 방지

## 🔍 문제 상황
동일한 커밋이 두 번 배포되는 현상이 발생하고 있습니다.

## 📋 원인 분석

### 가능한 원인들:
1. **Cloudflare Pages 자동 배포 활성화** + **수동 배포 실행**
   - GitHub에 push하면 자동 배포
   - 동시에 `npm run deploy:prod` 실행하면 수동 배포
   - 결과: 동일한 커밋이 두 번 배포됨

2. **배포 스크립트 중복 실행**
   - 실수로 `npm run deploy:prod`를 두 번 실행

3. **GitHub Actions 또는 다른 CI/CD**
   - `.github/workflows/`에 자동 배포 설정이 있을 수 있음

## ✅ 해결 방법

### 방법 1: 자동 배포만 사용 (권장)

**장점:**
- GitHub에 push하면 자동으로 배포
- 수동 작업 불필요
- 배포 히스토리 관리 용이

**설정 방법:**
1. Cloudflare Pages 대시보드 접속
2. 프로젝트 `3dcookiehd` 선택
3. Settings → Builds & deployments
4. "Automatic deployments" 확인
5. 연결된 GitHub 저장소 및 브랜치 확인 (`education-platform`)

**사용 방법:**
```bash
# 코드 변경 후
git add .
git commit -m "your message"
git push origin education-platform

# 자동으로 배포됨 - npm run deploy:prod 실행 불필요!
```

### 방법 2: 수동 배포만 사용

**장점:**
- 배포 시점을 직접 제어
- 필요할 때만 배포

**설정 방법:**
1. Cloudflare Pages 대시보드 접속
2. 프로젝트 `3dcookiehd` 선택
3. Settings → Builds & deployments
4. "Automatic deployments" 비활성화

**사용 방법:**
```bash
# 코드 변경 후
git add .
git commit -m "your message"
git push origin education-platform

# 수동으로 배포
npm run deploy:prod
```

### 방법 3: 배포 전 확인 스크립트 추가

`package.json`에 배포 전 확인 스크립트 추가:

```json
{
  "scripts": {
    "deploy:check": "echo '배포 전 확인: 최근 커밋 정보' && git log -1",
    "deploy:prod": "npm run deploy:check && npm run build && wrangler pages deploy dist --project-name 3dcookiehd --branch education-platform"
  }
}
```

## 🚨 현재 권장 사항

**현재 상황:**
- 이미지에서 "Automatic deployments enabled" 확인됨
- 동시에 수동 배포(`npm run deploy:prod`)도 실행 중

**권장 조치:**
1. **자동 배포 사용 시**: `npm run deploy:prod` 실행하지 않기
2. **수동 배포 사용 시**: Cloudflare 대시보드에서 자동 배포 비활성화

## 📝 배포 워크플로우 예시

### 자동 배포 사용 시:
```bash
# 1. 코드 수정
# 2. 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 3. 푸시 (자동 배포 트리거)
git push origin education-platform

# 4. Cloudflare 대시보드에서 배포 상태 확인
# npm run deploy:prod 실행하지 않음!
```

### 수동 배포 사용 시:
```bash
# 1. 코드 수정
# 2. 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 3. 푸시
git push origin education-platform

# 4. 수동 배포
npm run deploy:prod
```

## 🔧 배포 상태 확인

### Cloudflare Pages 대시보드에서:
1. 프로젝트 선택
2. "Deployments" 탭 확인
3. 동일한 커밋이 여러 번 배포되는지 확인

### 명령어로 확인:
```bash
# 최근 커밋 확인
git log --oneline -5

# 배포 전 확인
npm run deploy:check
```

## ⚠️ 주의사항

1. **자동 배포와 수동 배포를 동시에 사용하지 마세요**
2. **배포 전에 항상 커밋 상태 확인**
3. **불필요한 배포는 리소스 낭비**
