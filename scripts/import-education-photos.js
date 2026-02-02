/**
 * 구 사이트 교육사진 → 새 사이트 교육사진 갤러리 일괄 등록
 *
 * 사용법:
 *   1. scripts/education-photos-backup.json 에 제목·이미지 URL 목록 작성 (형식은 education-photos-import.md 참고)
 *   2. 새 사이트에 관리자로 로그인 후, 브라우저 Local Storage의 token 값을 복사
 *   3. 아래 BASE_URL, TOKEN 을 설정하거나 환경변수로 지정 후 실행
 *
 *   BASE_URL=https://3dcookiehd.pages.dev TOKEN=your_token node scripts/import-education-photos.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'https://3dcookiehd.pages.dev';
const TOKEN = process.env.TOKEN || '';
const JSON_PATH = process.env.JSON_PATH || path.join(__dirname, 'education-photos-backup.json');

async function main() {
  if (!TOKEN) {
    console.error('TOKEN이 없습니다. 환경변수 TOKEN을 설정하거나 스크립트 내 TOKEN을 입력하세요.');
    console.error('예: TOKEN=eyJ... node scripts/import-education-photos.js');
    process.exit(1);
  }

  let list;
  try {
    const raw = fs.readFileSync(JSON_PATH, 'utf8');
    list = JSON.parse(raw);
  } catch (e) {
    console.error('JSON 파일을 읽지 못했습니다:', JSON_PATH);
    console.error(e.message);
    process.exit(1);
  }

  if (!Array.isArray(list) || list.length === 0) {
    console.error('목록이 비어 있거나 배열이 아닙니다.');
    process.exit(1);
  }

  console.log('등록 대상:', list.length, '건');
  console.log('API:', BASE_URL + '/api/posts');
  console.log('---');

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const title = (item.title || '').trim();
    if (!title) {
      console.log(`[${i + 1}/${list.length}] 건너뜀 (제목 없음)`);
      fail++;
      continue;
    }

    const images = [];
    if (item.imageUrl) images.push(String(item.imageUrl).trim());
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((u) => {
        const url = String(u).trim();
        if (url && !images.includes(url)) images.push(url);
      });
    }
    if (images.length === 0) {
      console.log(`[${i + 1}/${list.length}] "${title.substring(0, 30)}..." 건너뜀 (이미지 URL 없음)`);
      fail++;
      continue;
    }

    const body = {
      title,
      content: (item.content || '').trim() || '',
      category: 'education_photo',
      status: 'published',
      images,
      pinned: false,
    };

    try {
      const res = await fetch(BASE_URL + '/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + TOKEN,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        console.log(`[${i + 1}/${list.length}] OK: ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}`);
        ok++;
      } else {
        console.log(`[${i + 1}/${list.length}] 실패: ${title.substring(0, 30)}...`, json.error || res.status);
        fail++;
      }
    } catch (err) {
      console.log(`[${i + 1}/${list.length}] 오류: ${title.substring(0, 30)}...`, err.message);
      fail++;
    }

    // 부하 완화
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('---');
  console.log('완료: 성공', ok, '건, 실패/건너뜀', fail, '건');
}

main();
