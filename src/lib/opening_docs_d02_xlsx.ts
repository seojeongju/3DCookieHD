import { buildXlsx, type XlsxCell, type XlsxSheetSpec } from './minimal_xlsx';
import type { StudentTimetablePack } from './opening_docs_student_timetable';

function setCell(
  cells: Record<number, Record<number, XlsxCell>>,
  r: number,
  c: number,
  cell: XlsxCell
) {
  if (!cells[r]) cells[r] = {};
  cells[r][c] = cell;
}

/** 인쇄화면(.tt-*)과 동일한 레이아웃의 D02 워크북 생성 */
export function buildD02Workbook(pack: StudentTimetablePack, sheetName = '수강생시간표'): ArrayBuffer {
  const cells: Record<number, Record<number, XlsxCell>> = {};
  const merges: string[] = [];
  const rowHeights: Record<number, number> = {};
  const COLS = 6; // B~G (6일)
  const START_COL = 1; // A
  const endColLetter = String.fromCharCode(64 + START_COL + COLS); // G

  const title = pack.title_lines.join('\n');
  const titleLineCount = Math.max(pack.title_lines.length, 2);
  setCell(cells, 1, START_COL, {
    v: title,
    merge: `A1:${endColLetter}1`,
    align: 'center',
    valign: 'center',
    wrap: true,
    fontSize: 16,
    bold: true,
    border: false,
  });
  merges.push(`A1:${endColLetter}1`);
  rowHeights[1] = Math.max(48, titleLineCount * 24);

  setCell(cells, 2, START_COL, {
    v: pack.classroom_label,
    merge: `A2:${endColLetter}2`,
    align: 'center',
    valign: 'center',
    fontSize: 13,
    bold: true,
    border: false,
  });
  merges.push(`A2:${endColLetter}2`);
  rowHeights[2] = 24;

  const summaryLines = Math.max(String(pack.period_summary || '').split('\n').length, 1);
  setCell(cells, 3, START_COL, {
    v: pack.period_summary,
    merge: `A3:${endColLetter}3`,
    align: 'center',
    valign: 'center',
    wrap: true,
    bold: true,
    fontSize: 10,
    fill: 'EEF6FF',
  });
  merges.push(`A3:${endColLetter}3`);
  rowHeights[3] = Math.max(30, summaryLines * 17 + 10);

  // 안내문과 첫 블록 사이 여백
  rowHeights[4] = 8;
  let row = 5;

  for (const block of pack.blocks) {
    const days = block.days;
    // 일차 번호 (좌측 셀은 인쇄화면과 동일하게 테두리 없음)
    setCell(cells, row, START_COL, { v: '', border: false });
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      setCell(cells, row, START_COL + 1 + i, {
        v: d ? d.day_no_label : '',
        align: 'center',
        fontSize: 10,
      });
    }
    rowHeights[row] = 18;
    row += 1;

    // 시간 | 날짜들
    setCell(cells, row, START_COL, {
      v: '시간',
      align: 'center',
      bold: true,
      fill: 'F3F4F6',
      fontSize: 10,
    });
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      setCell(cells, row, START_COL + 1 + i, {
        v: d ? d.date_display : '',
        align: 'center',
        bold: true,
        fill: 'F3F4F6',
        fontSize: 10,
      });
    }
    rowHeights[row] = 20;
    row += 1;

    // 시간대 | 교과목 (2행 병합)
    const subjRow = row;
    setCell(cells, subjRow, START_COL, {
      v: pack.time_label,
      align: 'center',
      valign: 'center',
      bold: true,
      wrap: true,
      merge: `A${subjRow}:A${subjRow + 1}`,
      fontSize: 10,
      fill: 'F3F4F6',
    });
    merges.push(`A${subjRow}:A${subjRow + 1}`);
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      const fill = d && d.subject_name ? pack.subject_colors[d.subject_name] || 'FFC000' : undefined;
      const colL = String.fromCharCode(64 + START_COL + 1 + i); // B~G
      setCell(cells, subjRow, START_COL + 1 + i, {
        v: d ? d.subject_name : '',
        align: 'center',
        valign: 'center',
        wrap: true,
        fill,
        merge: `${colL}${subjRow}:${colL}${subjRow + 1}`,
        fontSize: 9,
      });
      merges.push(`${colL}${subjRow}:${colL}${subjRow + 1}`);
    }
    rowHeights[subjRow] = 26;
    rowHeights[subjRow + 1] = 26;
    row += 2;

    // 훈련교사
    setCell(cells, row, START_COL, {
      v: '훈련교사',
      align: 'center',
      bold: true,
      fill: 'F3F4F6',
      fontSize: 10,
    });
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      setCell(cells, row, START_COL + 1 + i, {
        v: d ? d.instructor_name : '',
        align: 'center',
        fontSize: 10,
      });
    }
    rowHeights[row] = 19;
    row += 1;

    // 블록 간 여백
    rowHeights[row] = 8;
    row += 1;
  }

  // 하단 안내
  const footerLines = Math.max(String(pack.footer_notes || '').split('\n').length, 4);
  const footerRows = Math.max(4, Math.min(8, footerLines));
  const footerStart = row;
  const footerEnd = row + footerRows - 1;
  setCell(cells, footerStart, START_COL, {
    v: pack.footer_notes,
    merge: `A${footerStart}:${endColLetter}${footerEnd}`,
    align: 'left',
    valign: 'top',
    wrap: true,
    fontSize: 10,
  });
  merges.push(`A${footerStart}:${endColLetter}${footerEnd}`);
  const totalFooterHeight = Math.max(84, footerLines * 16 + 16);
  const perRowH = Math.ceil(totalFooterHeight / footerRows);
  for (let r = footerStart; r <= footerEnd; r++) rowHeights[r] = perRowH;

  const sheet: XlsxSheetSpec = {
    name: sheetName,
    cells,
    merges,
    rowHeights,
    landscape: false,
    fitToWidth: 1,
    fitToHeight: 0,
    colWidths: {
      1: 15,
      2: 14.5,
      3: 14.5,
      4: 14.5,
      5: 14.5,
      6: 14.5,
      7: 14.5,
    },
  };

  return buildXlsx([sheet]);
}

/** CSV (구글 시트 가져오기용, UTF-8 BOM) */
export function buildD02Csv(pack: StudentTimetablePack): string {
  const escape = (v: string) => {
    const s = String(v ?? '');
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines: string[] = [];
  lines.push(escape(pack.title_lines.join(' / ')));
  lines.push(escape(pack.classroom_label));
  lines.push(escape(pack.period_summary.replace(/\n/g, ' | ')));
  lines.push('');

  for (const block of pack.blocks) {
    const days = block.days;
    lines.push(['', ...days.map((d) => d.day_no_label)].map(escape).join(','));
    lines.push(['시간', ...days.map((d) => d.date_display)].map(escape).join(','));
    lines.push([pack.time_label, ...days.map((d) => d.subject_name.replace(/\n/g, ' '))].map(escape).join(','));
    lines.push(['훈련교사', ...days.map((d) => d.instructor_name)].map(escape).join(','));
    lines.push('');
  }
  lines.push(escape(pack.footer_notes));
  return `\uFEFF${lines.join('\r\n')}`;
}
