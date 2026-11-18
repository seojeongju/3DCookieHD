/**
 * Cloudflare Workers용 최소 OOXML(.xlsx) 생성기 (ZIP STORE)
 * SheetJS 등 외부 의존성 없이 ArrayBuffer를 반환합니다.
 */

type CellValue = string | number | null | undefined;

export type XlsxCell = {
  v?: CellValue;
  /** 병합 범위 (시작 셀 기준) 예: 'C1:I1' */
  merge?: string;
  /** 배경색 hex (알파 없이) 예: FFC000 */
  fill?: string;
  /** 글자색 hex (알파 없이) 예: 1E293B */
  color?: string;
  /** 테두리 표시 여부 (기본 true) */
  border?: boolean;
  bold?: boolean;
  wrap?: boolean;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'center' | 'bottom';
  fontSize?: number;
  numFmt?: string;
};

export type XlsxSheetSpec = {
  name: string;
  /** 1-based row → 1-based col → cell */
  cells: Record<number, Record<number, XlsxCell>>;
  colWidths?: Record<number, number>;
  rowHeights?: Record<number, number>;
  merges?: string[];
  /** 인쇄 방향 (true = 가로, 기본 false = 세로) */
  landscape?: boolean;
  /** 페이지 맞춤 너비 (예: 1) */
  fitToWidth?: number;
  /** 페이지 맞춤 높이 (예: 0 = 자동, 1 = 1페이지) */
  fitToHeight?: number;
};

function xmlEscape(s: string): string {
  return String(s)
    // XML 1.0에서 허용되지 않는 제어문자 제거 (\t, \n, \r 제외)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Excel 시트명 금지 문자(\ / ? * [ ] :) 제거 및 31자 제한 */
function sanitizeSheetName(name: string, usedNames: Set<string>): string {
  let base = String(name || 'Sheet')
    .replace(/[\\/*?:\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^'+|'+$/g, '');
  if (!base) base = 'Sheet';
  let candidate = base.slice(0, 31).replace(/'+$/g, '') || 'Sheet';
  let idx = 2;
  while (usedNames.has(candidate.toLowerCase())) {
    const suffix = ` (${idx++})`;
    candidate = base.slice(0, Math.max(1, 31 - suffix.length)) + suffix;
  }
  usedNames.add(candidate.toLowerCase());
  return candidate;
}

function colToNum(letters: string): number {
  let n = 0;
  for (let i = 0; i < letters.length; i++) {
    n = n * 26 + (letters.charCodeAt(i) - 64);
  }
  return n;
}

function parseRange(ref: string): { r1: number; c1: number; r2: number; c2: number } | null {
  const m = String(ref).trim().match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i);
  if (!m) return null;
  const c1 = colToNum(m[1].toUpperCase());
  const r1 = parseInt(m[2], 10);
  const c2 = colToNum(m[3].toUpperCase());
  const r2 = parseInt(m[4], 10);
  return {
    r1: Math.min(r1, r2),
    c1: Math.min(c1, c2),
    r2: Math.max(r1, r2),
    c2: Math.max(c1, c2),
  };
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

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  return b;
}

function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  b[2] = (n >>> 16) & 0xff;
  b[3] = (n >>> 24) & 0xff;
  return b;
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function zipStore(files: { name: string; data: Uint8Array }[]): ArrayBuffer {
  const enc = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const crc = crc32(f.data);
    const local = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0), // store
      u16(0),
      u16(0),
      u32(crc),
      u32(f.data.length),
      u32(f.data.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
      f.data,
    ]);
    const central = concatBytes([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(f.data.length),
      u32(f.data.length),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }

  const centralDir = concatBytes(centrals);
  const end = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  ]);

  return concatBytes([...locals, centralDir, end]).buffer;
}

type StyleKey = string;

function styleKey(c: XlsxCell): StyleKey {
  return [
    c.fill || '',
    c.color || '',
    c.border === false ? '0' : '1',
    c.bold ? '1' : '0',
    c.wrap ? '1' : '0',
    c.align || 'center',
    c.valign || 'center',
    String(c.fontSize || 11),
    c.numFmt || '',
  ].join('|');
}

function buildStylesXml(styleList: XlsxCell[]): { xml: string; indexOf: (c: XlsxCell) => number } {
  // OOXML 규약: fillId 0 = none, fillId 1 = gray125 필수 예약
  const fills: string[] = ['none', 'gray125'];
  const fillIndex = new Map<string, number>();
  fillIndex.set('', 0);

  const xfMap = new Map<StyleKey, number>();
  const xfs: {
    fillId: number;
    color: string;
    border: boolean;
    bold: boolean;
    wrap: boolean;
    align: string;
    valign: string;
    fontSize: number;
    numFmt: string;
  }[] = [];

  // default xf (0)
  xfs.push({ fillId: 0, color: '', border: true, bold: false, wrap: false, align: 'center', valign: 'center', fontSize: 11, numFmt: '' });
  xfMap.set(styleKey({}), 0);

  for (const c of styleList) {
    const sk = styleKey(c);
    if (xfMap.has(sk)) continue;
    let fillId = 0;
    if (c.fill) {
      const hex = c.fill.replace(/^#/, '').toUpperCase();
      if (!fillIndex.has(hex)) {
        fillIndex.set(hex, fills.length);
        fills.push(hex.length === 6 ? `FF${hex}` : hex);
      }
      fillId = fillIndex.get(hex)!;
    }
    xfMap.set(sk, xfs.length);
    xfs.push({
      fillId,
      color: c.color ? c.color.replace(/^#/, '').toUpperCase() : '',
      border: c.border !== false,
      bold: !!c.bold,
      wrap: !!c.wrap,
      align: c.align || 'center',
      valign: c.valign || 'center',
      fontSize: c.fontSize || 11,
      numFmt: c.numFmt || '',
    });
  }

  // fonts: 0 default, then one per xf
  const fontsXml: string[] = [];
  fontsXml.push(`<font><sz val="11"/><color theme="1"/><name val="맑은 고딕"/><family val="3"/><charset val="129"/></font>`);
  for (let i = 1; i < xfs.length; i++) {
    const f = xfs[i];
    const colorXml = f.color
      ? `<color rgb="${f.color.length === 6 ? `FF${f.color}` : f.color}"/>`
      : `<color theme="1"/>`;
    fontsXml.push(
      `<font>${f.bold ? '<b/>' : ''}<sz val="${f.fontSize}"/>${colorXml}<name val="맑은 고딕"/><family val="3"/><charset val="129"/></font>`
    );
  }

  const fillsXml = fills
    .map((val, i) => {
      if (i === 0) return `<fill><patternFill patternType="none"/></fill>`;
      if (i === 1) return `<fill><patternFill patternType="gray125"/></fill>`;
      return `<fill><patternFill patternType="solid"><fgColor rgb="${val}"/><bgColor indexed="64"/></patternFill></fill>`;
    })
    .join('');

  // numFmts for dates if needed
  const numFmtXml: string[] = [];
  const numFmtIds = new Map<string, number>();
  let numFmtNext = 164;
  for (const xf of xfs) {
    if (xf.numFmt && !numFmtIds.has(xf.numFmt)) {
      numFmtIds.set(xf.numFmt, numFmtNext++);
      numFmtXml.push(`<numFmt numFmtId="${numFmtIds.get(xf.numFmt)}" formatCode="${xmlEscape(xf.numFmt)}"/>`);
    }
  }

  const cellXfs = xfs
    .map((xf, i) => {
      const fontId = i === 0 ? 0 : i;
      const numFmtId = xf.numFmt ? numFmtIds.get(xf.numFmt) || 0 : 0;
      const borderId = xf.border ? 1 : 0;
      return `<xf numFmtId="${numFmtId}" fontId="${fontId}" fillId="${xf.fillId}" borderId="${borderId}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${xf.align}" vertical="${xf.valign}"${xf.wrap ? ' wrapText="1"' : ''}/></xf>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${numFmtXml.length ? `<numFmts count="${numFmtXml.length}">${numFmtXml.join('')}</numFmts>` : ''}
  <fonts count="${fontsXml.length}">${fontsXml.join('')}</fonts>
  <fills count="${fills.length}">${fillsXml}</fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FF222222"/></left>
      <right style="thin"><color rgb="FF222222"/></right>
      <top style="thin"><color rgb="FF222222"/></top>
      <bottom style="thin"><color rgb="FF222222"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="${xfs.length}">${cellXfs}</cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

  return {
    xml,
    indexOf: (c: XlsxCell) => xfMap.get(styleKey(c)) || 0,
  };
}

function sheetToXml(sheet: XlsxSheetSpec, styleIndexOf: (c: XlsxCell) => number): string {
  const shared: string[] = [];
  const sharedIndex = new Map<string, number>();
  const takeShared = (s: string) => {
    if (sharedIndex.has(s)) return sharedIndex.get(s)!;
    const i = shared.length;
    shared.push(s);
    sharedIndex.set(s, i);
    return i;
  };

  // First pass: collect shared strings
  const rows = Object.keys(sheet.cells)
    .map(Number)
    .sort((a, b) => a - b);
  for (const r of rows) {
    const cols = sheet.cells[r] || {};
    for (const c of Object.keys(cols).map(Number)) {
      const cell = cols[c];
      if (cell && typeof cell.v === 'string') takeShared(cell.v);
    }
  }

  // Rebuild shared into global via closure — return both
  (sheet as any).__shared = shared;

  const rowXml: string[] = [];
  for (const r of rows) {
    const cols = sheet.cells[r] || {};
    const colNums = Object.keys(cols)
      .map(Number)
      .sort((a, b) => a - b);
    const cellsXml: string[] = [];
    for (const c of colNums) {
      const cell = cols[c];
      if (!cell || cell.v == null || cell.v === '') {
        // still emit empty styled cells if fill/border needed
        if (cell && (cell.fill || cell.wrap)) {
          const ref = `${colLetter(c)}${r}`;
          const s = styleIndexOf(cell);
          cellsXml.push(`<c r="${ref}" s="${s}"/>`);
        }
        continue;
      }
      const ref = `${colLetter(c)}${r}`;
      const s = styleIndexOf(cell);
      if (typeof cell.v === 'number') {
        cellsXml.push(`<c r="${ref}" s="${s}"><v>${cell.v}</v></c>`);
      } else {
        const si = takeShared(String(cell.v));
        cellsXml.push(`<c r="${ref}" s="${s}" t="s"><v>${si}</v></c>`);
      }
    }
    const ht = sheet.rowHeights?.[r];
    const htAttr = ht != null ? ` ht="${ht}" customHeight="1"` : '';
    rowXml.push(`<row r="${r}"${htAttr}>${cellsXml.join('')}</row>`);
  }

  const merges = [...(sheet.merges || [])];
  for (const r of rows) {
    const cols = sheet.cells[r] || {};
    for (const c of Object.keys(cols).map(Number)) {
      const cell = cols[c];
      if (cell?.merge) merges.push(cell.merge);
    }
  }
  const uniqMerges = [...new Set(merges)];
  const mergeXml = uniqMerges.length
    ? `<mergeCells count="${uniqMerges.length}">${uniqMerges.map((m) => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>`
    : '';

  const colsXmlParts: string[] = [];
  if (sheet.colWidths) {
    for (const [k, w] of Object.entries(sheet.colWidths)) {
      colsXmlParts.push(`<col min="${k}" max="${k}" width="${w}" customWidth="1"/>`);
    }
  }
  const colsXml = colsXmlParts.length ? `<cols>${colsXmlParts.join('')}</cols>` : '';

  (sheet as any).__shared = shared;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${colsXml}
  <sheetData>${rowXml.join('')}</sheetData>
  ${mergeXml}
</worksheet>`;
}

function sharedStringsXml(items: string[], totalCount: number): string {
  const body = items
    .map((s) => {
      const escaped = xmlEscape(s);
      // preserve leading/trailing spaces or newlines
      if (/^\s|\s$|[\n\r\t]/.test(s)) {
        return `<si><t xml:space="preserve">${escaped}</t></si>`;
      }
      return `<si><t>${escaped}</t></si>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${totalCount}" uniqueCount="${items.length}">${body}</sst>`;
}

export function buildXlsx(sheets: XlsxSheetSpec[]): ArrayBuffer {
  const enc = new TextEncoder();

  // 병합 범위 내 나머지 셀에 시작 셀의 테두리/배경 스타일 자동 복제 (Excel 병합 테두리 누락 방지)
  for (const sh of sheets) {
    const merges = [...(sh.merges || [])];
    for (const row of Object.values(sh.cells)) {
      for (const cell of Object.values(row)) {
        if (cell?.merge) merges.push(cell.merge);
      }
    }
    for (const m of new Set(merges)) {
      const range = parseRange(m);
      if (!range) continue;
      const master = sh.cells[range.r1]?.[range.c1];
      if (!master) continue;
      for (let r = range.r1; r <= range.r2; r++) {
        if (!sh.cells[r]) sh.cells[r] = {};
        for (let c = range.c1; c <= range.c2; c++) {
          if (r === range.r1 && c === range.c1) continue;
          if (!sh.cells[r][c]) {
            sh.cells[r][c] = {
              v: null,
              fill: master.fill,
              border: master.border,
              align: master.align,
              valign: master.valign,
              fontSize: master.fontSize,
            };
          }
        }
      }
    }
  }

  const allCells: XlsxCell[] = [];
  for (const sh of sheets) {
    for (const row of Object.values(sh.cells)) {
      for (const cell of Object.values(row)) allCells.push(cell);
    }
  }
  const styles = buildStylesXml(allCells);

  const sheetXmls: string[] = [];
  const allShared: string[] = [];
  const sharedIndex = new Map<string, number>();
  let totalSharedCount = 0;
  const takeShared = (s: string) => {
    totalSharedCount += 1;
    if (sharedIndex.has(s)) return sharedIndex.get(s)!;
    const i = allShared.length;
    allShared.push(s);
    sharedIndex.set(s, i);
    return i;
  };

  for (const sheet of sheets) {
    const rowSet = new Set<number>(Object.keys(sheet.cells).map(Number));
    if (sheet.rowHeights) {
      for (const rk of Object.keys(sheet.rowHeights)) rowSet.add(Number(rk));
    }
    const rows = [...rowSet].sort((a, b) => a - b);
    const rowXml: string[] = [];
    for (const r of rows) {
      const cols = sheet.cells[r] || {};
      const colNums = Object.keys(cols)
        .map(Number)
        .sort((a, b) => a - b);
      const cellsXml: string[] = [];
      for (const c of colNums) {
        const cell = cols[c];
        if (!cell) continue;
        const ref = `${colLetter(c)}${r}`;
        const s = styles.indexOf(cell);
        if (cell.v == null || cell.v === '') {
          if (cell.fill || cell.wrap || cell.bold || cell.border !== false) {
            cellsXml.push(`<c r="${ref}" s="${s}"/>`);
          }
          continue;
        }
        if (typeof cell.v === 'number') {
          cellsXml.push(`<c r="${ref}" s="${s}"><v>${cell.v}</v></c>`);
        } else {
          const si = takeShared(String(cell.v));
          cellsXml.push(`<c r="${ref}" s="${s}" t="s"><v>${si}</v></c>`);
        }
      }
      const ht = sheet.rowHeights?.[r];
      const htAttr = ht != null ? ` ht="${ht}" customHeight="1"` : '';
      if (cellsXml.length || htAttr) {
        rowXml.push(`<row r="${r}"${htAttr}>${cellsXml.join('')}</row>`);
      }
    }
    const merges = [...(sheet.merges || [])];
    for (const r of Object.keys(sheet.cells).map(Number)) {
      for (const cell of Object.values(sheet.cells[r] || {})) {
        if (cell.merge) merges.push(cell.merge);
      }
    }
    const uniqMerges = [...new Set(merges)];
    const mergeXml = uniqMerges.length
      ? `<mergeCells count="${uniqMerges.length}">${uniqMerges.map((m) => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>`
      : '';
    const colsXmlParts: string[] = [];
    if (sheet.colWidths) {
      const colKeys = Object.keys(sheet.colWidths).map(Number).sort((a, b) => a - b);
      for (const k of colKeys) {
        colsXmlParts.push(`<col min="${k}" max="${k}" width="${sheet.colWidths[k]}" customWidth="1"/>`);
      }
    }
    const colsXml = colsXmlParts.length ? `<cols>${colsXmlParts.join('')}</cols>` : '';

    const useFit = sheet.fitToWidth != null || sheet.fitToHeight != null;
    const sheetPrXml = useFit ? `<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>` : '';
    const pageMarginsXml = `<pageMargins left="0.35" right="0.35" top="0.4" bottom="0.4" header="0.2" footer="0.2"/>`;
    const orientation = sheet.landscape ? 'landscape' : 'portrait';
    const fitW = sheet.fitToWidth != null ? ` fitToWidth="${sheet.fitToWidth}"` : '';
    const fitH = sheet.fitToHeight != null ? ` fitToHeight="${sheet.fitToHeight}"` : '';
    const pageSetupXml = `<pageSetup paperSize="9" orientation="${orientation}"${fitW}${fitH}/>`;

    sheetXmls.push(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${sheetPrXml}
  ${colsXml}
  <sheetData>${rowXml.join('')}</sheetData>
  ${mergeXml}
  ${pageMarginsXml}
  ${pageSetupXml}
</worksheet>`);
  }

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  ${sheets
    .map(
      (_, i) =>
        `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join('')}
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheets
    .map(
      (_, i) =>
        `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
    )
    .join('')}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId${sheets.length + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

  const usedSheetNames = new Set<string>();
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${sheets
      .map(
        (sh, i) =>
          `<sheet name="${xmlEscape(sanitizeSheetName(sh.name, usedSheetNames))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`
      )
      .join('')}
  </sheets>
</workbook>`;

  const files: { name: string; data: Uint8Array }[] = [
    { name: '[Content_Types].xml', data: enc.encode(contentTypes) },
    { name: '_rels/.rels', data: enc.encode(rootRels) },
    { name: 'xl/workbook.xml', data: enc.encode(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: enc.encode(wbRels) },
    { name: 'xl/styles.xml', data: enc.encode(styles.xml) },
    { name: 'xl/sharedStrings.xml', data: enc.encode(sharedStringsXml(allShared, totalSharedCount)) },
  ];
  sheetXmls.forEach((xml, i) => {
    files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: enc.encode(xml) });
  });

  return zipStore(files);
}

/** 디버그용 — sheetToXml 미사용 경고 방지 */
void sheetToXml;
