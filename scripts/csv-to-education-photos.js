/**
 * 구 사이트 관리자에서 CSV로 받은 교육사진 목록 → import용 JSON 변환
 *
 * 사용법:
 *   node scripts/csv-to-education-photos.js [CSV파일경로]
 *   또는 CSV_PATH=다운로드한파일.csv node scripts/csv-to-education-photos.js
 *
 * CSV 예시 (구 사이트 관리자에서 내보내기):
 *   no,제목,등록자,등록일자,조회
 *   556,마산대학교 3D프린터...,김순회,2026-01-31,19
 *
 * 이미지 URL 컬럼이 있으면 해당 컬럼명을 IMAGE_COLUMN 환경변수로 지정 (기본: 이미지, imageUrl, image 중 하나)
 * 변환 결과는 scripts/education-photos-backup.json 에 저장됩니다.
 * 이미지 URL이 없는 행은 imageUrl 없이 저장되며, import 시 해당 항목은 건너뜁니다(이미지 채운 뒤 다시 import).
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = process.env.CSV_PATH || process.argv[2] || path.join(__dirname, 'education-photos.csv');
const OUTPUT_JSON = process.env.OUTPUT_JSON || path.join(__dirname, 'education-photos-backup.json');
const IMAGE_COLUMN = process.env.IMAGE_COLUMN || ''; // 비우면 '이미지','imageUrl','image' 등 자동 감지

function parseCSVLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && (c === ',' || c === '\t')) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => {
      row[h] = values[j] !== undefined ? values[j] : '';
    });
    rows.push(row);
  }
  return { headers, rows };
}

function findColumn(headers, candidates) {
  const lower = (s) => String(s).toLowerCase();
  for (const c of candidates) {
    const found = headers.find((h) => lower(h) === lower(c) || h === c);
    if (found) return found;
  }
  return null;
}

function main() {
  let raw;
  try {
    raw = fs.readFileSync(CSV_PATH, 'utf8');
  } catch (e) {
    console.error('CSV 파일을 읽지 못했습니다:', CSV_PATH);
    console.error(e.message);
    process.exit(1);
  }

  const { headers, rows } = parseCSV(raw);
  if (headers.length === 0 || rows.length === 0) {
    console.error('CSV에 헤더 또는 데이터 행이 없습니다.');
    process.exit(1);
  }

  const titleCol = findColumn(headers, ['제목', 'title', 'Title']);
  if (!titleCol) {
    console.error('CSV에 "제목" 컬럼을 찾을 수 없습니다. 헤더:', headers.join(', '));
    process.exit(1);
  }

  const registrantCol = findColumn(headers, ['등록자', 'registrant', 'Registrant']);
  const dateCol = findColumn(headers, ['등록일자', '등록일', 'date', 'Date']);
  const imageCol = IMAGE_COLUMN && headers.includes(IMAGE_COLUMN)
    ? IMAGE_COLUMN
    : findColumn(headers, ['이미지', 'imageUrl', 'image', '이미지URL', 'img', 'url']);

  const list = [];
  for (const row of rows) {
    const title = String(row[titleCol] || '').trim();
    if (!title) continue;

    const contentParts = [];
    if (registrantCol && row[registrantCol]) contentParts.push('등록자: ' + row[registrantCol]);
    if (dateCol && row[dateCol]) contentParts.push('등록일: ' + row[dateCol]);
    const content = contentParts.length ? contentParts.join(', ') : '';

    const item = { title, content: content || '' };
    if (imageCol && row[imageCol]) {
      const url = String(row[imageCol]).trim();
      if (url) item.imageUrl = url;
    }
    list.push(item);
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(list, null, 2), 'utf8');
  console.log('변환 완료:', list.length, '건');
  console.log('저장 위치:', OUTPUT_JSON);
  const withoutImage = list.filter((i) => !i.imageUrl).length;
  if (withoutImage > 0) {
    console.log('이미지 URL 없는 항목:', withoutImage, '건 → import 시 건너뜀. 방법 0(스크래퍼) 또는 수동으로 imageUrl 추가 후 다시 import 하세요.');
  }
}

main();
