/**
 * HRD Market(hrdmarket.co.kr) 로그인 후 3D프린팅 교육사진 목록·이미지 URL 자동 추출
 *
 * CSV에는 이미지 URL이 없으므로, 이 스크립트로 구 사이트 상세 페이지에서 이미지 URL을 뽑습니다.
 *
 * 사용 전:
 *   1. npm install puppeteer (프로젝트 루트에서 한 번만)
 *   2. 환경변수로 아이디/비밀번호 전달 (코드·Git에 넣지 마세요)
 *
 * 실행 예 (PowerShell):
 *   $env:HRD_USER="cookiehd2"
 *   $env:HRD_PASSWORD="wow1234"
 *   node scripts/scrape-education-photos-hrdmarket.cjs
 *
 * 출력: scripts/education-photos-backup.json → import-education-photos.js 로 새 사이트에 등록
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://hrdmarket.co.kr';
const LOGIN_URL = process.env.HRD_LOGIN_URL || BASE_URL + '/hrd/loginForm.do';
const LIST_URL = process.env.HRD_LIST_URL || BASE_URL + '/hrd/bbs/bbsList.do?bbsTypeId=additionBoard&bbsCategoryIdx=bbs_category_18040500002';
const HRD_USER = process.env.HRD_USER || '';
const HRD_PASSWORD = process.env.HRD_PASSWORD || '';
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(__dirname, 'education-photos-backup.json');
const HEADLESS = process.env.HEADLESS !== '0';

async function main() {
  if (!HRD_USER || !HRD_PASSWORD) {
    console.error('환경변수 HRD_USER, HRD_PASSWORD 를 설정하세요.');
    console.error('예: $env:HRD_USER="cookiehd2"; $env:HRD_PASSWORD="wow1234"; node scripts/scrape-education-photos-hrdmarket.cjs');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer가 설치되어 있지 않습니다. 프로젝트 루트에서: npm install puppeteer');
    process.exit(1);
  }

  console.log('HRD Market 로그인:', LOGIN_URL);
  console.log('교육사진 목록:', LIST_URL);
  console.log('헤드리스:', HEADLESS);
  console.log('---');

  const browser = await puppeteer.launch({
    headless: HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 1) 로그인
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});

    const userEl = await page.$('input[name="userId"], input[name="user_id"], input[name="id"], input#userId, input[type="text"]');
    const passEl = await page.$('input[name="password"], input[name="pwd"], input#password, input[type="password"]');
    let loggedIn = false;
    if (userEl && passEl) {
      await userEl.type(HRD_USER, { delay: 50 });
      await passEl.type(HRD_PASSWORD, { delay: 50 });
      const submitBtn = await page.$('input[type="submit"], button[type="submit"], .btn_login, input[value="Login"]');
      if (submitBtn) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {}),
          submitBtn.click(),
        ]);
      } else {
        await page.evaluate(() => {
          const form = document.querySelector('form');
          if (form) form.submit();
        });
        await page.waitForTimeout(3000);
      }
      loggedIn = true;
    }

    if (!loggedIn) {
      console.log('로그인 폼을 자동으로 찾지 못했습니다. HEADLESS=0 으로 실행한 뒤 수동 로그인 후 Enter를 누르세요.');
      if (!HEADLESS) {
        await new Promise((r) => process.stdin.once('data', r));
      }
    }

    // 2) 교육사진 목록으로 이동
    await page.goto(LIST_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 3) 목록에서 제목·상세 링크 추출 (테이블/리스트 공통)
    const items = await page.evaluate((base) => {
      const out = [];
      const rows = document.querySelectorAll('table tbody tr, .board-list tr, .list-table tr, table tr');
      rows.forEach((tr) => {
        const link = tr.querySelector('a[href*="bbsView"], a[href*="view"], a[href*="detail"], a[href*="bbsDetail"], td a');
        const titleEl = tr.querySelector('td:nth-child(2), .title, .subject, td a');
        const title = titleEl ? titleEl.textContent.trim() : '';
        if (!title || title.length < 2) return;
        let href = link ? link.getAttribute('href') : '';
        if (!href && titleEl && titleEl.tagName === 'A') href = titleEl.getAttribute('href') || '';
        const detailUrl = href ? (href.startsWith('http') ? href : base + (href.startsWith('/') ? href : '/hrd/' + href)) : '';
        out.push({ title, detailUrl });
      });
      if (out.length === 0) {
        document.querySelectorAll('a[href*="bbsView"], a[href*="view"], a[href*="bbsDetail"]').forEach((a) => {
          const title = a.textContent.trim();
          if (title.length < 2) return;
          const href = a.getAttribute('href') || '';
          const detailUrl = href.startsWith('http') ? href : base + (href.startsWith('/') ? href : '/hrd/' + href);
          if (!out.some((r) => r.title === title)) out.push({ title, detailUrl });
        });
      }
      return out;
    }, BASE_URL);

    console.log('목록 추출:', items.length, '건');

    const output = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let imageUrl = '';
      let content = '';

      if (item.detailUrl) {
        try {
          await page.goto(item.detailUrl, { waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
          await page.waitForTimeout(800);
          const detail = await page.evaluate((base) => {
            const imgs = document.querySelectorAll('.content img, .view-content img, .board-view img, article img, .bbs_content img, img[src*="upload"], img[src*="attach"], img[src*="file"]');
            let src = '';
            for (const img of imgs) {
              const s = img.getAttribute('src') || '';
              if (s && !s.includes('blank') && !s.includes('spacer')) {
                src = s;
                break;
              }
            }
            const textEl = document.querySelector('.content, .view-content, .bbs_content, .board-view .body, article .body');
            return {
              imageUrl: src,
              content: textEl ? textEl.innerText.trim().substring(0, 2000) : '',
            };
          }, BASE_URL);
          imageUrl = detail.imageUrl || '';
          content = detail.content || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = BASE_URL + (imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl);
          }
        } catch (e) {
          console.log('  상세 조회 실패:', item.title.substring(0, 30));
        }
      }

      output.push({
        title: item.title,
        imageUrl: imageUrl || undefined,
        content: content || undefined,
      });
      console.log(`  [${i + 1}/${items.length}] ${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}`);
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
    console.log('---');
    console.log('저장 완료:', OUTPUT_PATH);
    console.log('다음으로 새 사이트에 등록: TOKEN=관리자토큰 node scripts/import-education-photos.js');
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
