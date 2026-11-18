import { buildXlsx, type XlsxCell, type XlsxSheetSpec } from './minimal_xlsx';
import type { HrdTimetablePack, HrdTimetablePage } from './opening_docs_hrd_timetable';

function setCell(
  cells: Record<number, Record<number, XlsxCell>>,
  r: number,
  c: number,
  cell: XlsxCell
) {
  if (!cells[r]) cells[r] = {};
  cells[r][c] = cell;
}

function colLetter(n: number): string {
  let s = '';
  let x = n;
  while (x > 0) {
    const m = (x - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

/** 인쇄화면(.hrd-page)과 동일한 레이아웃의 한 페이지(최대 9일) 블록 기록. 반환: 다음 시작 행 */
function writePageBlock(
  cells: Record<number, Record<number, XlsxCell>>,
  merges: string[],
  rowHeights: Record<number, number>,
  pack: HrdTimetablePack,
  page: HrdTimetablePage,
  startRow: number
): number {
  const days = page.days;
  const dayCount = Math.max(days.length, 1);
  const lastDayCol = 2 + dayCount * 2; // A=1(교시), B=2(시간), C~=일차(각 2열)
  const endCol = Math.max(lastDayCol, 20); // 최소 T열(20)
  const endColLetter = colLetter(endCol);

  let r = startRow;

  // 1. 상단 메타 표 (인쇄화면 .hrd-meta 5행 구조와 동일)
  // Row 0: 교육과정 | course_name (C~N) | sheet_title (O~endCol, 2행 병합)
  setCell(cells, r, 1, { v: '교육과정', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 10, merge: `A${r}:B${r}` });
  merges.push(`A${r}:B${r}`);
  setCell(cells, r, 3, { v: pack.course_name, bold: true, align: 'left', wrap: true, fontSize: 10, merge: `C${r}:N${r}` });
  merges.push(`C${r}:N${r}`);
  setCell(cells, r, 15, {
    v: pack.sheet_title || '훈련시간표',
    bold: true,
    align: 'center',
    valign: 'center',
    wrap: true,
    fontSize: 12,
    fill: 'E0F2FE',
    merge: `O${r}:${endColLetter}${r + 1}`,
  });
  merges.push(`O${r}:${endColLetter}${r + 1}`);
  const courseLines = Math.max(String(pack.course_name || '').split('\n').length, 1);
  rowHeights[r] = Math.max(26, courseLines * 17 + 8);

  // Row 1: 훈련기간 | period_label (C~N)
  const r1 = r + 1;
  setCell(cells, r1, 1, { v: '훈련기간', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 10, merge: `A${r1}:B${r1}` });
  merges.push(`A${r1}:B${r1}`);
  setCell(cells, r1, 3, { v: pack.period_label, align: 'center', fontSize: 10, merge: `C${r1}:N${r1}` });
  merges.push(`C${r1}:N${r1}`);
  rowHeights[r1] = 20;

  // Row 2: 훈련회차 | session_number (C~F) | 훈련시간 (G~H) | time_range_label (I~N) | institution_name (O~endCol, 3행 병합)
  const r2 = r + 2;
  setCell(cells, r2, 1, { v: '훈련회차', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 10, merge: `A${r2}:B${r2}` });
  merges.push(`A${r2}:B${r2}`);
  setCell(cells, r2, 3, {
    v: pack.session_number != null ? String(pack.session_number) : '',
    align: 'center',
    fontSize: 10,
    merge: `C${r2}:F${r2}`,
  });
  merges.push(`C${r2}:F${r2}`);
  setCell(cells, r2, 7, { v: '훈련시간', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 10, merge: `G${r2}:H${r2}` });
  merges.push(`G${r2}:H${r2}`);
  setCell(cells, r2, 9, { v: pack.time_range_label, align: 'center', fontSize: 10, merge: `I${r2}:N${r2}` });
  merges.push(`I${r2}:N${r2}`);
  setCell(cells, r2, 15, {
    v: pack.institution_name || '',
    bold: true,
    align: 'center',
    valign: 'center',
    wrap: true,
    fontSize: 12,
    fill: 'E0F2FE',
    merge: `O${r2}:${endColLetter}${r + 4}`,
  });
  merges.push(`O${r2}:${endColLetter}${r + 4}`);
  rowHeights[r2] = 20;

  // Row 3: 훈련강사 | instructor_label (C~N)
  const r3 = r + 3;
  setCell(cells, r3, 1, { v: '훈련강사', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 10, merge: `A${r3}:B${r3}` });
  merges.push(`A${r3}:B${r3}`);
  setCell(cells, r3, 3, { v: pack.instructor_label, align: 'center', fontSize: 10, merge: `C${r3}:N${r3}` });
  merges.push(`C${r3}:N${r3}`);
  rowHeights[r3] = 20;

  // Row 4: 훈련장소 | location_label (C~N)
  const r4 = r + 4;
  setCell(cells, r4, 1, { v: '훈련장소', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 10, merge: `A${r4}:B${r4}` });
  merges.push(`A${r4}:B${r4}`);
  setCell(cells, r4, 3, { v: pack.location_label, align: 'center', fontSize: 10, merge: `C${r4}:N${r4}` });
  merges.push(`C${r4}:N${r4}`);
  rowHeights[r4] = 20;

  r += 5;
  rowHeights[r] = 8; // 여백
  r += 1;

  // 2. 기관 배너 (.hrd-banner)
  setCell(cells, r, 1, {
    v: pack.banner_title,
    align: 'center',
    valign: 'center',
    bold: true,
    fontSize: 11,
    fill: 'FFF7ED',
    merge: `A${r}:${endColLetter}${r}`,
  });
  merges.push(`A${r}:${endColLetter}${r}`);
  rowHeights[r] = 24;
  r += 1;
  rowHeights[r] = 8; // 여백
  r += 1;

  // 3. 시간표 헤더: 교시 | 시간 | 일차들
  setCell(cells, r, 1, { v: '교시', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 9 });
  setCell(cells, r, 2, { v: '시간', bold: true, align: 'center', fill: 'F3F4F6', fontSize: 9 });
  for (let i = 0; i < days.length; i++) {
    const c = 3 + i * 2;
    setCell(cells, r, c, {
      v: String(days[i].day_no),
      bold: true,
      align: 'center',
      fill: 'F3F4F6',
      fontSize: 9,
      merge: `${colLetter(c)}${r}:${colLetter(c + 1)}${r}`,
    });
    merges.push(`${colLetter(c)}${r}:${colLetter(c + 1)}${r}`);
  }
  rowHeights[r] = 18;
  r += 1;

  // 날짜 행
  setCell(cells, r, 1, { v: '', fill: 'F3F4F6' });
  setCell(cells, r, 2, { v: '', fill: 'F3F4F6' });
  for (let i = 0; i < days.length; i++) {
    const c = 3 + i * 2;
    setCell(cells, r, c, {
      v: days[i].date_display,
      bold: true,
      align: 'center',
      fill: 'E2EFDA',
      fontSize: 8,
      merge: `${colLetter(c)}${r}:${colLetter(c + 1)}${r}`,
    });
    merges.push(`${colLetter(c)}${r}:${colLetter(c + 1)}${r}`);
  }
  rowHeights[r] = 16;
  r += 1;

  // 4. 교시 블록 (교시당 3행: 과목/능력단위/장소 + 강사 세로병합)
  for (const period of pack.periods) {
    const blockStart = r;
    const blockEnd = r + 2;
    const timeLabel = `${period.start_time} ~ ${period.end_time}`;

    setCell(cells, blockStart, 1, {
      v: period.period_number,
      align: 'center',
      valign: 'center',
      bold: true,
      fontSize: 10,
      merge: `A${blockStart}:A${blockEnd}`,
    });
    merges.push(`A${blockStart}:A${blockEnd}`);

    setCell(cells, blockStart, 2, {
      v: timeLabel,
      align: 'center',
      valign: 'center',
      wrap: true,
      fontSize: 8,
      merge: `B${blockStart}:B${blockEnd}`,
    });
    merges.push(`B${blockStart}:B${blockEnd}`);

    for (let i = 0; i < days.length; i++) {
      const cSubj = 3 + i * 2;
      const cInst = cSubj + 1;
      const slot = days[i].slots[period.period_number] || null;
      const subj = slot?.subject_name || '';
      const unit = slot?.ability_unit_name || '';
      const loc = slot?.location || '';
      const inst = slot?.instructor_name || '';

      setCell(cells, blockStart, cSubj, {
        v: subj,
        align: 'center',
        valign: 'center',
        bold: true,
        wrap: true,
        fontSize: 8.5,
        fill: subj ? 'FFF7ED' : undefined,
      });
      setCell(cells, blockStart + 1, cSubj, {
        v: unit,
        align: 'center',
        valign: 'center',
        wrap: true,
        fontSize: 8,
        color: '334155',
      });
      setCell(cells, blockStart + 2, cSubj, {
        v: loc,
        align: 'center',
        valign: 'center',
        wrap: true,
        fontSize: 8,
        fill: 'E0F2FE',
      });

      setCell(cells, blockStart, cInst, {
        v: inst,
        align: 'center',
        valign: 'center',
        bold: true,
        wrap: true,
        fontSize: 8.5,
        merge: `${colLetter(cInst)}${blockStart}:${colLetter(cInst)}${blockEnd}`,
      });
      merges.push(`${colLetter(cInst)}${blockStart}:${colLetter(cInst)}${blockEnd}`);
    }

    rowHeights[blockStart] = 26;
    rowHeights[blockStart + 1] = 24;
    rowHeights[blockStart + 2] = 20;
    r = blockEnd + 1;
  }

  return r + 2; // 페이지 간격
}

/** HRD 신고용 시간표 xlsx */
export function buildD03Workbook(pack: HrdTimetablePack, sheetName = '시간표(출력)'): ArrayBuffer {
  const cells: Record<number, Record<number, XlsxCell>> = {};
  const merges: string[] = [];
  const rowHeights: Record<number, number> = {};

  let row = 1;
  for (const page of pack.pages) {
    row = writePageBlock(cells, merges, rowHeights, pack, page, row);
  }

  const colWidths: Record<number, number> = {
    1: 4.5, // 교시
    2: 11.5, // 시간
  };
  for (let i = 0; i < 9; i++) {
    colWidths[3 + i * 2] = 13.5; // 과목/단위/장소
    colWidths[4 + i * 2] = 4.5; // 강사
  }

  const sheet: XlsxSheetSpec = {
    name: sheetName,
    cells,
    merges,
    rowHeights,
    colWidths,
    landscape: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };
  return buildXlsx([sheet]);
}

/** 구글시트용 CSV */
export function buildD03Csv(pack: HrdTimetablePack): string {
  const escape = (v: string | number) => {
    const s = String(v ?? '');
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines: string[] = [];
  lines.push(['교육과정', pack.course_name].map(escape).join(','));
  lines.push(['훈련기간', pack.period_label].map(escape).join(','));
  lines.push(['훈련회차', pack.session_number != null ? pack.session_number : ''].map(escape).join(','));
  lines.push(['훈련시간', pack.time_range_label].map(escape).join(','));
  lines.push(['훈련강사', pack.instructor_label].map(escape).join(','));
  lines.push(['훈련장소', pack.location_label].map(escape).join(','));
  lines.push(escape(pack.banner_title));
  lines.push('');

  for (const page of pack.pages) {
    const days = page.days;
    lines.push(['교시', '시간', ...days.map((d) => `${d.day_no}일차`)].map(escape).join(','));
    lines.push(['', '', ...days.map((d) => d.date_display)].map(escape).join(','));
    for (const period of pack.periods) {
      const timeLabel = `${period.start_time} ~ ${period.end_time}`;
      lines.push(
        [
          period.period_number,
          timeLabel,
          ...days.map((d) => {
            const s = d.slots[period.period_number];
            if (!s) return '';
            return [s.subject_name, s.ability_unit_name, s.instructor_name, s.location]
              .filter(Boolean)
              .join(' / ');
          }),
        ]
          .map(escape)
          .join(',')
      );
    }
    lines.push('');
  }
  return `\uFEFF${lines.join('\r\n')}`;
}
