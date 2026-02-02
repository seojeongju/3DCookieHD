/**
 * 구 사이트(3dcookiehd.co.kr) 로그인 후 교육사진 목록 자동 추출
 *
 * 사용 전:
 *   1. npm install puppeteer (프로젝트 루트에서 한 번만)
 *   2. 환경변수로 구 사이트 아이디/비밀번호 전달 (저장소에 커밋하지 마세요)
 *
 * 실행 예 (PowerShell):
 *   $env:OLD_SITE_URL="https://3dcookiehd.co.kr"
 *   $env:OLD_SITE_USER="your_id"
 *   $env:OLD_SITE_PASSWORD="your_password"
 *   node scripts/scrape-education-photos.cjs
 *
 * 출력: scripts/education-photos-backup.json (임포트 스크립트에서 사용)
 */

const fs = require('fs');
const path = require('path');

const OLD_SITE_URL = process.env.OLD_SITE_URL || 'https://3dcookiehd.co.kr';
const OLD_SITE_USER = process.env.OLD_SITE_USER || '';
const OLD_SITE_PASSWORD = process.env.OLD_SITE_PASSWORD || '';
const LOGIN_URL = process.env.LOGIN_URL || ''; // 비우면 OLD_SITE_URL + '/' 사용. 로그인 전용 페이지가 있으면 예: /member/login
const EDUCATION_PHOTOS_PATH = process.env.EDUCATION_PHOTOS_PATH || '/?c=7/17'; // 교육사진 목록 URL 경로
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(__dirname, 'education-photos-backup.json');
const HEADLESS = process.env.HEADLESS !== '0';

async function main() {
  if (!OLD_SITE_USER || !OLD_SITE_PASSWORD) {
    console.error('구 사이트 아이디/비밀번호가 필요합니다.');
    console.error('환경변수 OLD_SITE_USER, OLD_SITE_PASSWORD 를 설정하세요.');
    console.error('예: OLD_SITE_USER=myid OLD_SITE_PASSWORD=mypw node scripts/scrape-education-photos.cjs');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer가 설치되어 있지 않습니다. 프로젝트 루트에서 실행하세요:');
    console.error('  npm install puppeteer');
    process.exit(1);
  }

  const listUrl = OLD_SITE_URL.replace(/\/$/, '') + EDUCATION_PHOTOS_PATH;
  console.log('구 사이트:', OLD_SITE_URL);
  console.log('교육사진 목록 URL:', listUrl);
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

    // 1) 로그인 페이지로 이동 (LOGIN_URL 없으면 메인)
    const base = OLD_SITE_URL.replace(/\/$/, '');
    const loginUrl = LOGIN_URL ? (LOGIN_URL.startsWith('http') ? LOGIN_URL : base + (LOGIN_URL.startsWith('/') ? LOGIN_URL : '/' + LOGIN_URL)) : base + '/';
    await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});

    // 2) 로그인 폼 찾아서 입력 (일반적인 name/id 패턴 시도)
    const loginSelectors = [
      { user: 'input[name="user_id"], input[name="username"], input[name="id"], input#user_id, input#username', pass: 'input[name="password"], input[name="pwd"], input[name="pass"], input#password, input#pwd' },
      { user: 'input[type="text"]', pass: 'input[type="password"]' },
    ];

    let loggedIn = false;
    for (const sel of loginSelectors) {
      const userEl = await page.$(sel.user);
      const passEl = await page.$(sel.pass);
      if (userEl && passEl) {
        await userEl.type(OLD_SITE_USER, { delay: 50 });
        await passEl.type(OLD_SITE_PASSWORD, { delay: 50 });
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {}),
          page.evaluate((s) => {
            const form = document.querySelector('form');
            if (form) form.submit();
            else {
              const btn = document.querySelector('input[type="submit"], button[type="submit"], .btn_login, a[href*="login"]');
              if (btn) btn.click();
            }
          }, sel),
        ]);
        loggedIn = true;
        break;
      }
    }

    if (!loggedIn) {
      console.log('로그인 폼을 자동으로 찾지 못했습니다. 수동 로그인을 시도합니다.');
      console.log('브라우저가 열리면 직접 로그인한 뒤, 터미널에서 Enter를 누르세요.');
      if (!HEADLESS) {
        await new Promise((r) => process.stdin.once('data', r));
      }
    }

    // 3) 교육사진 목록 페이지로 이동
    await page.goto(listUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 4) 목록 추출 (테이블/리스트 구조에 맞게 셀렉터 조정)
    const items = await page.evaluate((baseUrl) => {
      const result = [];
      const base = (baseUrl || '').replace(/\/$/, '');

      // 테이블 행: table tbody tr
      const rows = document.querySelectorAll('table tbody tr, .board-list tbody tr, .list-table tbody tr, table tr');
      rows.forEach((tr) => {
        const link = tr.querySelector('a[href*="c="], a[href*="view"], a[href*="detail"], td a');
        const titleEl = tr.querySelector('td:nth-child(2), td.title, .title, a');
        const title = titleEl ? titleEl.textContent.trim() : '';
        if (!title || title.length < 2) return;
        const href = link ? link.getAttribute('href') : '';
        let detailUrl = href ? (href.startsWith('http') ? href : base + (href.startsWith('/') ? href : '/' + href)) : '';
        result.push({ title, detailUrl });
      });

      // 목록이 테이블이 아닌 경우: 링크 목록
      if (result.length === 0) {
        document.querySelectorAll('a[href*="c="], .list a, .board a, ul.list li a').forEach((a) => {
          const title = a.textContent.trim();
          if (title.length < 2) return;
          const href = a.getAttribute('href') || '';
          const detailUrl = href ? (href.startsWith('http') ? href : base + (href.startsWith('/') ? href : '/' + href)) : '';
          if (!result.some((r) => r.title === title)) result.push({ title, detailUrl });
        });
      }

      return result;
    }, OLD_SITE_URL);

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
          const detail = await page.evaluate(() => {
            const img = document.querySelector('.content img, .view-content img, .board-view img, article img, .detail img, img[src*="upload"], img[src*="photo"]');
            const text = document.querySelector('.content, .view-content, .board-view .body, article .body');
            return {
              imageUrl: img ? img.getAttribute('src') || '' : '',
              content: text ? text.innerText.trim().substring(0, 2000) : '',
            };
          });
          imageUrl = detail.imageUrl || '';
          content = detail.content || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            const base = OLD_SITE_URL.replace(/\/$/, '');
            imageUrl = base + (imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl);
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
    console.log('다음으로 새 사이트에 임포트하려면:');
    console.log('  TOKEN=새사이트_관리자_토큰 node scripts/import-education-photos.js');
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
