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

/** 한 페이지(최대 9일) 블록을 지정 시작 행에 기록. 반환: 다음 시작 행 */
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
  const lastDayCol = 4 + (dayCount - 1) * 2 + 1; // D=4, each day 2 cols
  const endColLetter = colLetter(Math.max(lastDayCol, 21)); // at least U

  let r = startRow;

  // 헤더 메타
  const meta: Array<[string, string]> = [
    ['교육과정', pack.course_name],
    ['훈련기간', pack.period_label],
    ['훈련회차', pack.session_number != null ? String(pack.session_number) : ''],
    ['훈련시간', pack.time_range_label],
    ['훈련강사', pack.instructor_label],
    ['훈련장소', pack.location_label],
  ];

  for (let i = 0; i < meta.length; i++) {
    const row = r + i;
    setCell(cells, row, 2, { v: meta[i][0], bold: true, align: 'center', fill: 'F2F2F2', fontSize: 10, merge: `B${row}:C${row}` });
    merges.push(`B${row}:C${row}`);
    setCell(cells, row, 4, {
      v: meta[i][1],
      align: i === 0 ? 'left' : 'center',
      wrap: i === 0,
      fontSize: i === 0 ? 11 : 10,
      bold: i === 0,
      merge: `D${row}:H${row}`,
    });
    merges.push(`D${row}:H${row}`);
    rowHeights[row] = i === 0 ? 32 : 18;
  }

  // 우측 제목 배너 (훈련시간~강사 행)
  const titleRow = r + 3;
  setCell(cells, titleRow, 12, {
    v: pack.sheet_title,
    align: 'center',
    valign: 'center',
    bold: true,
    wrap: true,
    fontSize: 12,
    fill: 'DDEBF7',
    merge: `L${titleRow}:U${titleRow + 1}`,
  });
  merges.push(`L${titleRow}:U${titleRow + 1}`);

  r += 6;
  // 빈 행
  r += 1;

  // 기관 배너
  setCell(cells, r, 2, {
    v: pack.banner_title,
    align: 'center',
    bold: true,
    fontSize: 11,
    fill: 'FFF2CC',
    merge: `B${r}:${endColLetter}${r}`,
  });
  merges.push(`B${r}:${endColLetter}${r}`);
  rowHeights[r] = 22;
  r += 2;

  // 헤더: 교시 | 시간 | 일차들
  setCell(cells, r, 2, { v: '교시', bold: true, align: 'center', fill: 'F2F2F2', fontSize: 9 });
  setCell(cells, r, 3, { v: '시간', bold: true, align: 'center', fill: 'F2F2F2', fontSize: 9 });
  for (let i = 0; i < days.length; i++) {
    const c = 4 + i * 2;
    setCell(cells, r, c, {
      v: String(days[i].day_no),
      bold: true,
      align: 'center',
      fill: 'F2F2F2',
      fontSize: 9,
      merge: `${colLetter(c)}${r}:${colLetter(c + 1)}${r}`,
    });
    merges.push(`${colLetter(c)}${r}:${colLetter(c + 1)}${r}`);
  }
  rowHeights[r] = 18;
  r += 1;

  // 날짜 행
  setCell(cells, r, 2, { v: '', fill: 'F2F2F2' });
  setCell(cells, r, 3, { v: '', fill: 'F2F2F2' });
  for (let i = 0; i < days.length; i++) {
    const c = 4 + i * 2;
    setCell(cells, r, c, {
      v: days[i].date_display,
      align: 'center',
      fill: 'E2EFDA',
      fontSize: 8,
      merge: `${colLetter(c)}${r}:${colLetter(c + 1)}${r}`,
    });
    merges.push(`${colLetter(c)}${r}:${colLetter(c + 1)}${r}`);
  }
  rowHeights[r] = 16;
  r += 1;

  // 교시 블록
  for (const period of pack.periods) {
    const blockStart = r;
    const blockEnd = r + 2;
    const timeLabel = `${period.start_time} ~ ${period.end_time}`;

    setCell(cells, blockStart, 2, {
      v: period.period_number,
      align: 'center',
      valign: 'center',
      bold: true,
      fontSize: 10,
      merge: `B${blockStart}:B${blockEnd}`,
    });
    merges.push(`B${blockStart}:B${blockEnd}`);

    setCell(cells, blockStart, 3, {
      v: timeLabel,
      align: 'center',
      valign: 'center',
      wrap: true,
      fontSize: 8,
      merge: `C${blockStart}:C${blockEnd}`,
    });
    merges.push(`C${blockStart}:C${blockEnd}`);

    for (let i = 0; i < days.length; i++) {
      const cSubj = 4 + i * 2;
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
        wrap: true,
        fontSize: 8,
        fill: subj ? 'FFF2CC' : undefined,
      });
      setCell(cells, blockStart + 1, cSubj, {
        v: unit,
        align: 'center',
        valign: 'center',
        wrap: true,
        fontSize: 7,
      });
      setCell(cells, blockStart + 2, cSubj, {
        v: loc,
        align: 'center',
        valign: 'center',
        fontSize: 7,
        fill: 'DEEBF7',
      });

      setCell(cells, blockStart, cInst, {
        v: inst,
        align: 'center',
        valign: 'center',
        wrap: true,
        fontSize: 8,
        merge: `${colLetter(cInst)}${blockStart}:${colLetter(cInst)}${blockEnd}`,
      });
      merges.push(`${colLetter(cInst)}${blockStart}:${colLetter(cInst)}${blockEnd}`);
    }

    rowHeights[blockStart] = 22;
    rowHeights[blockStart + 1] = 20;
    rowHeights[blockStart + 2] = 16;
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
    1: 2,
    2: 4,
    3: 11,
  };
  for (let i = 0; i < 9; i++) {
    colWidths[4 + i * 2] = 14;
    colWidths[5 + i * 2] = 4;
  }

  const sheet: XlsxSheetSpec = {
    name: sheetName.slice(0, 31),
    cells,
    merges,
    rowHeights,
    colWidths,
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
