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

/** 첨부 엑셀 양식에 맞춘 D02 워크북 생성 */
export function buildD02Workbook(pack: StudentTimetablePack, sheetName = '수강생시간표'): ArrayBuffer {
  const cells: Record<number, Record<number, XlsxCell>> = {};
  const merges: string[] = [];
  const rowHeights: Record<number, number> = {};
  const COLS = 6; // D~I
  const START_COL = 3; // C
  const END_COL = START_COL + COLS; // I = 9

  const title = pack.title_lines.join('\n');
  setCell(cells, 1, START_COL, {
    v: title,
    merge: `C1:I1`,
    align: 'center',
    valign: 'center',
    wrap: true,
    fontSize: 16,
    bold: true,
  });
  merges.push('C1:I1');
  rowHeights[1] = 72;

  setCell(cells, 2, START_COL, {
    v: pack.classroom_label,
    merge: 'C2:I2',
    align: 'center',
    valign: 'center',
    fontSize: 14,
  });
  merges.push('C2:I2');
  rowHeights[2] = 28;

  setCell(cells, 3, START_COL, {
    v: pack.period_summary,
    merge: 'C3:I3',
    align: 'center',
    valign: 'center',
    wrap: true,
    bold: true,
    fontSize: 11,
    fill: 'DDEBF7',
  });
  merges.push('C3:I3');
  rowHeights[3] = 36;

  let row = 4;
  for (const block of pack.blocks) {
    const days = block.days;
    // 일차 번호
    for (let i = 0; i < COLS; i++) {
      const d = days[i];
      setCell(cells, row, START_COL + 1 + i, {
        v: d ? d.day_no_label : '',
        align: 'center',
        fontSize: 10,
      });
    }
    rowHeights[row] = 16;
    row += 1;

    // 시간 | 날짜들
    setCell(cells, row, START_COL, {
      v: '시간',
      align: 'center',
      bold: true,
      fill: 'F2F2F2',
      fontSize: 10,
    });
    for (let i = 0; i < COLS; i++) {
      const d = days[i];
      setCell(cells, row, START_COL + 1 + i, {
        v: d ? d.date_display : '',
        align: 'center',
        fill: 'F2F2F2',
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
      wrap: true,
      merge: `C${subjRow}:C${subjRow + 1}`,
      fontSize: 10,
      fill: 'F2F2F2',
    });
    merges.push(`C${subjRow}:C${subjRow + 1}`);
    for (let i = 0; i < COLS; i++) {
      const d = days[i];
      const fill = d && d.subject_name ? pack.subject_colors[d.subject_name] || 'FFC000' : undefined;
      const colLetter = String.fromCharCode(68 + i); // D=68
      setCell(cells, subjRow, START_COL + 1 + i, {
        v: d ? d.subject_name : '',
        align: 'center',
        valign: 'center',
        wrap: true,
        fill,
        merge: `${colLetter}${subjRow}:${colLetter}${subjRow + 1}`,
        fontSize: 9,
      });
      merges.push(`${colLetter}${subjRow}:${colLetter}${subjRow + 1}`);
    }
    rowHeights[subjRow] = 28;
    rowHeights[subjRow + 1] = 28;
    row += 2;

    // 훈련교사
    setCell(cells, row, START_COL, {
      v: '훈련교사',
      align: 'center',
      fill: 'F2F2F2',
      fontSize: 10,
    });
    for (let i = 0; i < COLS; i++) {
      const d = days[i];
      setCell(cells, row, START_COL + 1 + i, {
        v: d ? d.instructor_name : '',
        align: 'center',
        fontSize: 10,
      });
    }
    rowHeights[row] = 18;
    row += 1;
  }

  // 하단 안내
  row += 1;
  const footerStart = row;
  const footerEnd = row + 6;
  setCell(cells, footerStart, START_COL, {
    v: pack.footer_notes,
    merge: `C${footerStart}:I${footerEnd}`,
    align: 'left',
    valign: 'top',
    wrap: true,
    fontSize: 10,
  });
  merges.push(`C${footerStart}:I${footerEnd}`);
  for (let r = footerStart; r <= footerEnd; r++) rowHeights[r] = 18;
  rowHeights[footerStart] = 28;
  rowHeights[footerEnd] = 40;

  const sheet: XlsxSheetSpec = {
    name: sheetName.slice(0, 31),
    cells,
    merges,
    rowHeights,
    colWidths: {
      1: 2.5,
      2: 1.5,
      3: 16,
      4: 15,
      5: 15,
      6: 15,
      7: 15,
      8: 15,
      9: 15,
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
