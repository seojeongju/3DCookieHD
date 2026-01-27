# Cloudflare Pages R2 바인딩 추가 문제 해결

## 🔍 문제 상황

Cloudflare Pages 대시보드에서 R2 바인딩을 추가할 수 없는 경우, 다음 방법들을 시도해보세요.

## ✅ 해결 방법

### 방법 1: R2 버킷 먼저 생성 (필수)

R2 바인딩을 추가하기 전에 **반드시 R2 버킷이 먼저 생성되어 있어야 합니다**.

```bash
# Wrangler CLI로 버킷 생성
wrangler r2 bucket create education-platform-files
```

또는 Cloudflare 대시보드에서:
1. **R2** 메뉴로 이동
2. **Create bucket** 클릭
3. 버킷 이름: `education-platform-files`
4. Location 선택 후 생성

### 방법 2: Wrangler 설정 파일 사용

Cloudflare Pages는 `wrangler.toml` 또는 `wrangler.json` 파일을 통해 바인딩을 자동으로 인식할 수 있습니다.

#### 현재 설정 확인

프로젝트 루트에 다음 파일들이 있는지 확인:
- `wrangler.toml` ✅ (이미 설정됨)
- `wrangler.json` ✅ (이미 설정됨)

#### 설정 파일 동기화

```bash
# 현재 Pages 설정을 다운로드
npx wrangler pages download config

# wrangler.toml 파일 확인 및 수정
# R2 바인딩이 제대로 설정되어 있는지 확인

# 설정 업로드 (선택사항)
# Pages는 자동으로 wrangler.toml을 읽습니다
```

### 방법 3: 대시보드에서 직접 추가

1. **Cloudflare 대시보드** → **Pages** → **3dcookiehd** 프로젝트
2. **Settings** → **Build** → **Bindings**
3. **+ Add** 버튼 클릭
4. **R2 bucket** 선택
5. 다음 정보 입력:
   - **Variable name**: `R2`
   - **Bucket**: `education-platform-files` (드롭다운에서 선택)
6. **Save** 클릭

**주의사항:**
- R2 버킷이 먼저 생성되어 있어야 드롭다운에 나타납니다
- 버킷 이름이 정확히 일치해야 합니다

### 방법 4: GitHub Actions를 통한 자동 배포

GitHub Actions를 사용하는 경우, 배포 시 자동으로 바인딩이 적용됩니다.

`.github/workflows/deploy.yml` 파일 확인:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: 3dcookiehd
    directory: dist
    # wrangler.toml이 자동으로 인식됩니다
```

### 방법 5: Wrangler CLI로 직접 배포

대시보드에서 추가가 안 되는 경우, Wrangler CLI로 직접 배포:

```bash
# 빌드
npm run build

# Pages에 배포 (wrangler.toml 설정 자동 적용)
npx wrangler pages deploy dist --project-name=3dcookiehd
```

## 🔧 문제 해결 체크리스트

### 1. R2 버킷 생성 확인
```bash
# 버킷 목록 확인
wrangler r2 bucket list

# 또는 대시보드에서 확인
# R2 → Buckets → education-platform-files 존재 확인
```

### 2. wrangler.toml 설정 확인

현재 `wrangler.toml` 파일:

```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "education-platform-files"
```

이 설정이 올바른지 확인하세요.

### 3. Pages Functions 활성화 확인

- Pages 프로젝트가 **Functions**를 사용하는지 확인
- `functions/` 디렉토리가 있거나
- `_worker.js` 또는 `_worker.ts` 파일이 있어야 합니다

현재 프로젝트는 Hono를 사용하므로 Functions가 활성화되어 있습니다.

### 4. 권한 확인

- Cloudflare 계정에 **Pages 편집 권한**이 있는지 확인
- **R2 읽기/쓰기 권한**이 있는지 확인

## 🚀 권장 해결 순서

1. **R2 버킷 생성** (가장 중요!)
   ```bash
   wrangler r2 bucket create education-platform-files
   ```

2. **wrangler.toml 확인**
   - R2 바인딩 설정이 올바른지 확인

3. **대시보드에서 바인딩 추가**
   - Settings → Build → Bindings → + Add
   - R2 bucket 선택
   - Variable name: `R2`
   - Bucket: `education-platform-files` 선택

4. **배포 후 테스트**
   ```bash
   npm run build
   npm run deploy:prod
   ```

5. **코드에서 확인**
   ```typescript
   // src/api/upload.ts에서
   const { R2 } = c.env;
   if (!R2) {
     // R2가 undefined면 바인딩이 제대로 안 된 것
   }
   ```

## ⚠️ 주의사항

1. **버킷 이름 일치**: `wrangler.toml`의 `bucket_name`과 실제 생성한 버킷 이름이 정확히 일치해야 합니다
2. **대소문자 구분**: 버킷 이름은 대소문자를 구분합니다
3. **배포 필요**: 설정 변경 후 배포가 필요할 수 있습니다
4. **캐시**: 브라우저 캐시를 지우고 다시 시도해보세요

## 📝 대안: 환경 변수 사용 (임시)

바인딩이 작동하지 않는 경우, 임시로 환경 변수를 사용할 수 있습니다:

```typescript
// R2 버킷 이름을 환경 변수로 저장
// 대시보드 → Settings → Variables and Secrets
// R2_BUCKET_NAME = education-platform-files

// 코드에서 직접 R2 API 사용
const bucketName = c.env.R2_BUCKET_NAME;
// R2 API 직접 호출 (복잡하지만 작동함)
```

하지만 바인딩을 사용하는 것이 더 간단하고 권장됩니다.

## 🔗 참고 링크

- [Cloudflare Pages Bindings 문서](https://developers.cloudflare.com/pages/functions/bindings/)
- [R2 바인딩 가이드](https://developers.cloudflare.com/workers/runtime-apis/bindings/r2/)
- [Wrangler 설정 파일](https://developers.cloudflare.com/workers/wrangler/configuration/)

---

**가장 가능성 높은 원인**: R2 버킷이 아직 생성되지 않았을 가능성이 높습니다. 먼저 버킷을 생성한 후 바인딩을 추가해보세요!
