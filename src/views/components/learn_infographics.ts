import { escapeAttr } from '../../utils/seo';

/* ───────────────────────── 용어 사전 ───────────────────────── */

type GlossaryEntry = { id: string; def: string };

export const GLOSSARY: Record<string, GlossaryEntry> = {
    '적층 제조': { id: 'additive-manufacturing', def: '재료를 한 층씩 쌓아 형상을 만드는 제조 방식. 3D프린팅의 공식 용어(Additive Manufacturing)입니다.' },
    레이어: { id: 'layer', def: '3D 모델을 수평으로 얇게 자른 한 층. 레이어 높이가 낮을수록 표면이 매끈하지만 출력 시간이 늘어납니다.' },
    메시: { id: 'mesh', def: '3D 표면을 이루는 작은 삼각형 면들의 집합입니다.' },
    STL: { id: 'stl', def: '입체 표면을 삼각형 면(메시)으로 표현하는, 가장 널리 쓰이는 3D프린팅 파일 형식입니다.' },
    '3MF': { id: '3mf', def: '형상과 함께 색상·재질·출력 설정까지 담을 수 있는 3D프린팅 파일 형식입니다.' },
    슬라이싱: { id: 'slicing', def: '3D 모델을 레이어로 자르고 노즐 이동 경로를 계산해 프린터용 명령 파일을 만드는 과정입니다.' },
    슬라이서: { id: 'slicer', def: '슬라이싱을 하는 프로그램. Cura, PrusaSlicer, Bambu Studio 등이 있습니다.' },
    'G-code': { id: 'g-code', def: '노즐의 이동 경로·속도·온도 등을 한 줄씩 지시하는 프린터용 명령어 파일입니다.' },
    인필: { id: 'infill', def: '출력물 내부를 채우는 격자 구조와 그 비율. 높을수록 단단하지만 시간과 재료가 늘어납니다.' },
    서포트: { id: 'support', def: '공중에 뜬 부분이 처지지 않도록 함께 출력하는 임시 받침 구조. 출력 후 제거합니다.' },
    후가공: { id: 'post-processing', def: '서포트 제거, 샌딩, 세척, 2차 경화, 도색 등 출력 후 진행하는 마감 작업입니다.' },
    이방성: { id: 'anisotropy', def: '방향에 따라 강도 등 성질이 달라지는 특성. 3D프린팅 출력물은 쌓는 방향(Z축)이 상대적으로 약합니다.' },
    '빌드 볼륨': { id: 'build-volume', def: '프린터가 한 번에 출력할 수 있는 최대 크기(가로×세로×높이)입니다.' },
    필라멘트: { id: 'filament', def: 'FDM 프린터에 쓰는 실 형태의 플라스틱 재료. 지름 1.75mm 규격이 가장 일반적입니다.' },
    레진: { id: 'resin', def: '빛을 받으면 굳는 액체 광경화성 수지. SLA·DLP·LCD 프린터의 재료입니다.' },
    노즐: { id: 'nozzle', def: 'FDM 프린터에서 녹인 필라멘트를 짜내는 끝부분. 지름 0.4mm가 가장 일반적입니다.' },
    히트베드: { id: 'heated-bed', def: '출력물이 놓이는 바닥판을 데워, 첫 층이 잘 붙고 식으며 들뜨는 것을 막는 장치입니다.' },
    '빌드 플레이트': { id: 'build-plate', def: '출력물이 붙어 만들어지는 판. 광중합 프린터에서는 거꾸로 매달린 채 한 층씩 위로 올라갑니다.' },
    광중합: { id: 'vat-photopolymerization', def: '액체 레진에 빛(레이저·프로젝터·LCD)을 비춰 원하는 부분만 굳히는 방식입니다.' },
    소결: { id: 'sintering', def: '분말을 완전히 녹이지 않고 열로 입자끼리 붙이는 것. SLS가 대표적인 방식입니다.' },
    리코터: { id: 'recoater', def: '분말 방식 프린터에서 한 층을 만들 때마다 새 분말을 얇고 평평하게 깔아 주는 롤러·블레이드입니다.' },
    '2차 경화': { id: 'post-curing', def: '레진 출력물을 세척한 뒤 UV 빛을 추가로 쬐어 끝까지 단단하게 굳히는 작업입니다.' },
    IPA: { id: 'ipa', def: '이소프로필 알코올. 레진 출력물 표면에 남은 미경화 레진을 씻어 내는 세척액입니다.' },
    스트링: { id: 'stringing', def: '노즐이 이동할 때 녹은 필라멘트가 거미줄처럼 늘어져 남는 현상입니다.' },
    흡습성: { id: 'hygroscopic', def: '공기 중의 습기를 빨아들이는 성질. 나일론·PETG·TPU 필라멘트에서 특히 큽니다.' },
    '래피드 프로토타이핑': { id: 'rapid-prototyping', def: '제품을 양산하기 전에 시제품을 빠르게 만들어 형태와 기능을 확인하는 일. 초기 3D프린팅의 주된 용도였습니다.' },
    '오픈소스 하드웨어': { id: 'open-source-hardware', def: '설계도·부품 목록·소프트웨어를 공개해 누구나 만들고 고칠 수 있게 한 하드웨어. RepRap이 대표적입니다.' },
    FFF: { id: 'fff', def: 'Fused Filament Fabrication. 필라멘트를 녹여 쌓는 방식을 상표(FDM) 없이 부르는 이름으로, 원리는 FDM과 같습니다.' },
};

/** 본문 속 용어에 툴팁을 붙인다. 정의 문장은 data 속성에만 두고, 본문 텍스트에는 섞지 않는다. */
export function term(key: keyof typeof GLOSSARY | string, label?: string): string {
    const entry = GLOSSARY[key];
    if (!entry) return label || key;
    return `<a href="#gl-${entry.id}" class="gl-term" data-gl="${escapeAttr(key)}" data-tip="${escapeAttr(entry.def)}">${label || key}</a>`;
}

export function collectGlossaryKeys(html: string): string[] {
    const keys: string[] = [];
    const re = /data-gl="([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
        const key = m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
        if (GLOSSARY[key] && !keys.includes(key)) keys.push(key);
    }
    return keys;
}

export function glossarySectionHtml(keys: string[]): string {
    if (!keys.length) return '';
    const items = keys
        .map((k, i) => `
            <div id="gl-${GLOSSARY[k].id}" class="gl-entry scroll-mt-28 rounded-2xl border border-slate-200/60 bg-white p-4" data-reveal style="--d:${Math.min(i, 8) * 50}ms">
                <dt class="text-sm font-black text-slate-900">${k}</dt>
                <dd class="mt-1 text-[13px] leading-6 text-slate-600">${GLOSSARY[k].def}</dd>
            </div>`)
        .join('');
    return `
        <section class="mt-8 rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md sm:p-8" aria-label="용어 사전">
            <h2 class="mb-1 text-lg font-black tracking-tight text-slate-900"><i class="fas fa-book mr-2 text-indigo-500" aria-hidden="true"></i>이 페이지의 용어 사전</h2>
            <p class="mb-4 text-xs text-slate-400">본문의 <span class="border-b border-dashed border-indigo-400 font-bold text-slate-500">점선 밑줄 용어</span>에 마우스를 올리거나 탭하면 뜻을 바로 볼 수 있습니다.</p>
            <dl class="grid gap-3 sm:grid-cols-2">${items}</dl>
        </section>`;
}

export function glossaryJsonLd(url: string, keys: string[]): Record<string, unknown> | null {
    if (!keys.length) return null;
    return {
        '@type': 'DefinedTermSet',
        '@id': `${url}#glossary`,
        name: '3D프린팅 용어 사전',
        inLanguage: 'ko-KR',
        hasDefinedTerm: keys.map((k) => ({
            '@type': 'DefinedTerm',
            '@id': `${url}#gl-${GLOSSARY[k].id}`,
            name: k,
            description: GLOSSARY[k].def,
        })),
    };
}

/* ───────────────────────── 인포그래픽 블록 ───────────────────────── */

type Tone = 'indigo' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet';

const TONES: Record<Tone, { chip: string; icon: string; bar: string; text: string; hex: string }> = {
    indigo: { chip: 'bg-indigo-50 border-indigo-100', icon: 'bg-indigo-600 text-white', bar: 'bg-indigo-500', text: 'text-indigo-700', hex: '#6366f1' },
    sky: { chip: 'bg-sky-50 border-sky-100', icon: 'bg-sky-500 text-white', bar: 'bg-sky-500', text: 'text-sky-700', hex: '#0ea5e9' },
    emerald: { chip: 'bg-emerald-50 border-emerald-100', icon: 'bg-emerald-500 text-white', bar: 'bg-emerald-500', text: 'text-emerald-700', hex: '#10b981' },
    amber: { chip: 'bg-amber-50 border-amber-100', icon: 'bg-amber-500 text-white', bar: 'bg-amber-500', text: 'text-amber-700', hex: '#f59e0b' },
    rose: { chip: 'bg-rose-50 border-rose-100', icon: 'bg-rose-500 text-white', bar: 'bg-rose-500', text: 'text-rose-700', hex: '#f43f5e' },
    violet: { chip: 'bg-violet-50 border-violet-100', icon: 'bg-violet-500 text-white', bar: 'bg-violet-500', text: 'text-violet-700', hex: '#8b5cf6' },
};

export type MethodCard = {
    visual: 'subtractive' | 'formative' | 'additive';
    name: string;
    en: string;
    summary: string;
    facts: Array<[string, string]>;
    highlight?: boolean;
};
export type FlowStep = { icon: string; title: string; desc: string; chips?: string[] };
export type BalanceItem = { icon: string; title: string; desc: string };
export type BalanceLabels = { good: string; bad: string; goodIcon?: string; badIcon?: string; hideCount?: boolean };
export type IconItem = { icon: string; tone: Tone; title: string; desc: string; href?: string; linkLabel?: string };

export type SchematicLabel = { title: string; desc: string };
export type ProcessGroup = { form: string; icon: string; items: Array<{ name: string; tech: string; how: string; highlight?: boolean }> };
export type RatingRow = { name: string; sub?: string; tone: Tone; scores: number[] };
export type DecisionOption = { when: string; pick: string; why: string; icon: string; tone: Tone };
export type RangeRow = { name: string; ranges: Array<[number, number]> };
export type TimelineEvent = { year: string; title: string; desc?: string; turning?: boolean };
export type TimelineEra = { period: string; title: string; icon: string; tone: Tone; summary: string; events: TimelineEvent[] };

export type Infographic =
    | { kind: 'methods'; caption: string; items: MethodCard[] }
    | { kind: 'flow'; caption: string; steps: FlowStep[] }
    | {
          kind: 'balance';
          caption: string;
          pros: BalanceItem[];
          cons: BalanceItem[];
          labels?: BalanceLabels;
      }
    | { kind: 'iconGrid'; caption: string; items: IconItem[] }
    | { kind: 'schematic'; caption: string; visual: 'fdm' | 'vat' | 'powder'; labels: SchematicLabel[] }
    | { kind: 'fdmSettings'; caption: string }
    | { kind: 'processMap'; caption: string; groups: ProcessGroup[] }
    | { kind: 'ratings'; caption: string; metrics: string[]; rows: RatingRow[] }
    | { kind: 'decision'; caption: string; options: DecisionOption[] }
    | { kind: 'range'; caption: string; min: number; max: number; step: number; unit: string; series: Array<{ label: string; color: string }>; rows: RangeRow[] }
    | { kind: 'timeline'; caption: string; eras: TimelineEra[] };

function figure(caption: string, inner: string): string {
    return `
        <figure class="mt-6" data-reveal>
            ${inner}
            <figcaption class="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-400"><i class="fas fa-circle-info mt-0.5" aria-hidden="true"></i><span>${caption}</span></figcaption>
        </figure>`;
}

const METHOD_SVG: Record<MethodCard['visual'], string> = {
    subtractive: `
        <svg viewBox="0 0 160 100" class="h-24 w-full" role="img" aria-label="공구로 덩어리 재료를 깎아 내는 절삭 가공 그림">
            <rect x="28" y="46" width="104" height="40" rx="4" fill="#cbd5e1"/>
            <path d="M64 46 Q80 70 96 46 Z" fill="#fff" stroke="#94a3b8" stroke-dasharray="3 3"/>
            <g class="mv-tool"><rect x="74" y="6" width="12" height="34" rx="2" fill="#64748b"/><rect x="76" y="40" width="8" height="10" fill="#475569"/></g>
            <rect class="mv-chip" style="--cx:-14px" x="66" y="48" width="5" height="3" rx="1" fill="#94a3b8"/>
            <rect class="mv-chip" style="--cx:16px;animation-delay:.5s" x="90" y="48" width="5" height="3" rx="1" fill="#94a3b8"/>
            <rect class="mv-chip" style="--cx:-6px;animation-delay:1s" x="78" y="50" width="4" height="3" rx="1" fill="#94a3b8"/>
        </svg>`,
    formative: `
        <svg viewBox="0 0 160 100" class="h-24 w-full" role="img" aria-label="금형에 녹인 재료를 채워 굳히는 성형 가공 그림">
            <path d="M70 6 h20 l-6 14 h-8 Z" fill="#94a3b8"/>
            <path d="M34 26 h36 v8 h-24 v40 h68 v-40 h-24 v-8 h36 v62 h-92 Z" fill="#94a3b8"/>
            <rect class="mv-fill" x="46" y="34" width="68" height="40" fill="#f59e0b" opacity=".85"/>
            <rect class="mv-pour" x="78" y="20" width="4" height="14" fill="#f59e0b"/>
        </svg>`,
    additive: `
        <svg viewBox="0 0 160 100" class="h-24 w-full" role="img" aria-label="노즐이 재료를 한 층씩 쌓아 올리는 적층 제조 그림">
            <rect x="24" y="86" width="112" height="6" rx="2" fill="#cbd5e1"/>
            <rect x="40" y="76" width="80" height="10" rx="2" fill="#6366f1"/>
            <rect x="44" y="66" width="72" height="10" rx="2" fill="#818cf8"/>
            <rect x="48" y="56" width="64" height="10" rx="2" fill="#6366f1"/>
            <rect class="mv-grow" x="52" y="46" width="56" height="10" rx="2" fill="#a5b4fc"/>
            <g class="mv-noz"><rect x="44" y="18" width="16" height="14" rx="3" fill="#334155"/><path d="M48 32 h8 l-2 12 h-4 Z" fill="#f59e0b"/></g>
        </svg>`,
};

function methodsHtml(items: MethodCard[]): string {
    return `<div class="grid gap-4 md:grid-cols-3">${items
        .map((m, i) => `
            <div class="relative flex flex-col rounded-[1.75rem] border p-5 ${m.highlight ? 'border-indigo-200 bg-gradient-to-b from-indigo-50 to-white shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200/60 bg-slate-50/60'}" data-reveal style="--d:${i * 120}ms">
                ${m.highlight ? '<span class="absolute -top-3 left-5 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black tracking-wider text-white shadow-sm">3D프린팅</span>' : ''}
                ${METHOD_SVG[m.visual]}
                <p class="mt-3 text-base font-black text-slate-900">${m.name} <span class="text-xs font-bold text-slate-400">${m.en}</span></p>
                <p class="mt-1 text-sm leading-6 text-slate-600">${m.summary}</p>
                <dl class="mt-3 space-y-1.5 border-t border-slate-200/70 pt-3">${m.facts
                    .map(([k, v]) => `<div class="flex justify-between gap-3 text-xs"><dt class="font-bold text-slate-400">${k}</dt><dd class="text-right font-bold text-slate-700">${v}</dd></div>`)
                    .join('')}</dl>
            </div>`)
        .join('')}</div>`;
}

function flowHtml(steps: FlowStep[]): string {
    const cards = steps.map((s, i) => `
        <li class="flow-step relative flex min-w-0 flex-1 items-start gap-3 rounded-[1.5rem] border border-slate-200/60 bg-white p-4 text-left shadow-sm lg:flex-col lg:items-center lg:gap-0 lg:text-center" data-reveal style="--d:${i * 110}ms">
            <span class="absolute -top-2.5 right-4 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-black text-white lg:left-1/2 lg:right-auto lg:-translate-x-1/2">STEP ${i + 1}</span>
            <span class="flow-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg text-white shadow-lg shadow-indigo-500/30 lg:mt-2 lg:h-12 lg:w-12"><i class="fas ${s.icon}" aria-hidden="true"></i></span>
            <span class="min-w-0 lg:flex lg:flex-col lg:items-center">
                <span class="block text-sm font-black text-slate-900 lg:mt-3">${s.title}</span>
                <span class="mt-1 block text-xs leading-5 text-slate-500">${s.desc}</span>
                ${s.chips?.length ? `<span class="mt-2 flex flex-wrap gap-1 lg:justify-center">${s.chips.map((c) => `<span class="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700">${c}</span>`).join('')}</span>` : ''}
            </span>
        </li>`);
    return `<ol class="flex flex-col items-stretch gap-0 lg:flex-row lg:items-stretch">${cards
        .map((c, i) => (i < cards.length - 1 ? `${c}<li class="flow-conn" aria-hidden="true"></li>` : c))
        .join('')}</ol>`;
}

function balanceHtml(
    pros: BalanceItem[],
    cons: BalanceItem[],
    labels: BalanceLabels = { good: '장점', bad: '한계' }
): string {
    const col = (title: string, icon: string, items: BalanceItem[], good: boolean) => `
        <div class="rounded-[1.75rem] border p-5 ${good ? 'border-emerald-100 bg-emerald-50/60' : 'border-amber-100 bg-amber-50/60'}" data-reveal style="--d:${good ? 0 : 150}ms">
            <p class="mb-4 flex items-center gap-2 text-sm font-black ${good ? 'text-emerald-700' : 'text-amber-700'}">
                <span class="flex h-8 w-8 items-center justify-center rounded-xl ${good ? 'bg-emerald-500' : 'bg-amber-500'} text-white"><i class="fas ${icon}" aria-hidden="true"></i></span>${title}
                ${labels.hideCount ? '' : `<span class="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] ${good ? 'text-emerald-600' : 'text-amber-600'}">${items.length}가지</span>`}
            </p>
            <ul class="space-y-3">${items
                .map((it) => `
                <li class="flex gap-3 rounded-2xl bg-white/80 p-3">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${good ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}"><i class="fas ${it.icon}" aria-hidden="true"></i></span>
                    <span><span class="block text-sm font-black text-slate-900">${it.title}</span><span class="mt-0.5 block text-xs leading-5 text-slate-600">${it.desc}</span></span>
                </li>`)
                .join('')}</ul>
        </div>`;
    return `
        <div class="relative grid gap-4 md:grid-cols-2">
            ${col(labels.good, labels.goodIcon || 'fa-thumbs-up', pros, true)}
            ${col(labels.bad, labels.badIcon || 'fa-triangle-exclamation', cons, false)}
            <span class="balance-badge absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-lg md:flex" aria-hidden="true"><i class="fas fa-scale-balanced"></i></span>
        </div>`;
}

function iconGridHtml(items: IconItem[]): string {
    return `<div class="grid gap-3 sm:grid-cols-2 ${items.length === 4 ? '' : 'lg:grid-cols-3'}">${items
        .map((it, i) => {
            const t = TONES[it.tone];
            const inner = `
                <span class="icon-pop flex h-11 w-11 items-center justify-center rounded-2xl ${t.icon} shadow-sm"><i class="fas ${it.icon}" aria-hidden="true"></i></span>
                <span class="mt-3 block text-sm font-black text-slate-900">${it.title}</span>
                <span class="mt-1 block text-xs leading-5 text-slate-600">${it.desc}</span>
                ${it.href ? `<span class="mt-2 inline-flex items-center gap-1 text-xs font-black text-indigo-600">${it.linkLabel || '자세히'} <i class="fas fa-arrow-right text-[9px]" aria-hidden="true"></i></span>` : ''}`;
            const cls = `group block rounded-[1.5rem] border p-4 transition ${t.chip}`;
            return it.href
                ? `<a href="${it.href}" class="${cls} hover:-translate-y-0.5 hover:shadow-md" data-reveal style="--d:${i * 70}ms">${inner}</a>`
                : `<div class="${cls}" data-reveal style="--d:${i * 70}ms">${inner}</div>`;
        })
        .join('')}</div>`;
}

const badge = (x: number, y: number, n: number) =>
    `<g transform="translate(${x},${y})"><circle r="10" fill="#0f172a"/><text y="4" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">${n}</text></g>`;

const SCHEMATIC_SVG: Record<'fdm' | 'vat' | 'powder', { label: string; svg: string }> = {
    fdm: {
        label: '필라멘트가 핫엔드에서 녹아 노즐로 나오고, 히트베드가 앞뒤로 움직이며 한 층씩 쌓이는 FDM 프린터 구조',
        svg: `
            <rect x="4" y="4" width="292" height="212" rx="24" fill="#f8fafc"/>
            <g class="sc-spin" style="transform-origin:54px 52px">
                <circle cx="54" cy="52" r="28" fill="#e0e7ff" stroke="#818cf8" stroke-width="3"/>
                <circle cx="54" cy="52" r="9" fill="#fff" stroke="#818cf8" stroke-width="2"/>
                <line x1="54" y1="24" x2="54" y2="80" stroke="#a5b4fc" stroke-width="2"/>
                <line x1="26" y1="52" x2="82" y2="52" stroke="#a5b4fc" stroke-width="2"/>
            </g>
            <path d="M74 30 C110 6 152 14 160 62" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
            <rect x="142" y="62" width="36" height="28" rx="6" fill="#334155"/>
            <rect x="148" y="70" width="24" height="5" rx="2" fill="#f43f5e" class="sc-heat"/>
            <path d="M151 90 H169 L163 108 H157 Z" fill="#f59e0b"/>
            <g class="sc-bed">
                <rect x="124" y="141" width="72" height="9" rx="2" fill="#6366f1"/>
                <rect x="128" y="132" width="64" height="9" rx="2" fill="#818cf8"/>
                <rect x="132" y="123" width="56" height="9" rx="2" fill="#6366f1"/>
                <rect x="136" y="114" width="48" height="9" rx="2" fill="#a5b4fc"/>
                <rect x="84" y="150" width="152" height="10" rx="3" fill="#94a3b8"/>
                <path class="sc-heat" d="M100 170 q6 -6 12 0 t12 0 M140 170 q6 -6 12 0 t12 0 M180 170 q6 -6 12 0 t12 0" fill="none" stroke="#fb7185" stroke-width="2" stroke-linecap="round"/>
            </g>
            ${badge(24, 22, 1)}${badge(196, 70, 2)}${badge(184, 106, 3)}${badge(262, 156, 4)}`,
    },
    vat: {
        label: '레진 수조 아래의 광원이 빛을 비춰 한 층을 굳히면, 빌드 플레이트가 출력물을 매단 채 위로 올라가는 광중합 프린터 구조',
        svg: `
            <rect x="4" y="4" width="292" height="212" rx="24" fill="#f8fafc"/>
            <rect x="256" y="16" width="8" height="160" rx="3" fill="#cbd5e1"/>
            <g class="sc-lift">
                <rect x="150" y="40" width="112" height="8" rx="3" fill="#94a3b8"/>
                <rect x="108" y="48" width="104" height="9" rx="3" fill="#64748b"/>
                <rect x="126" y="57" width="68" height="20" rx="3" fill="#6366f1"/>
                <rect x="132" y="77" width="56" height="20" rx="3" fill="#818cf8"/>
                <rect x="138" y="97" width="44" height="20" rx="3" fill="#6366f1"/>
                <rect x="144" y="117" width="32" height="20" rx="3" fill="#818cf8"/>
                <rect x="150" y="137" width="20" height="24" rx="3" fill="#a5b4fc"/>
            </g>
            <rect x="82" y="112" width="156" height="56" fill="#93c5fd" opacity=".4"/>
            <path d="M80 104 V170 H240 V104" fill="none" stroke="#64748b" stroke-width="3"/>
            <rect x="140" y="194" width="40" height="14" rx="4" fill="#334155"/>
            <g class="sc-scan" style="transform-origin:160px 194px">
                <line x1="160" y1="194" x2="160" y2="171" stroke="#a855f7" stroke-width="3" stroke-linecap="round"/>
                <circle cx="160" cy="171" r="4" fill="#c084fc" opacity=".8"/>
            </g>
            ${badge(94, 50, 1)}${badge(62, 138, 2)}${badge(198, 202, 3)}${badge(214, 128, 4)}`,
    },
    powder: {
        label: '레이저가 분말 베드 위에 단면을 그려 녹이고, 리코터 롤러가 새 분말을 펴 바르기를 반복하는 분말 융접 프린터 구조',
        svg: `
            <defs><pattern id="scPowder" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f1f5f9"/><circle cx="3" cy="3" r="1.3" fill="#cbd5e1"/></pattern></defs>
            <rect x="4" y="4" width="292" height="212" rx="24" fill="#f8fafc"/>
            <rect x="30" y="118" width="80" height="78" fill="url(#scPowder)"/>
            <rect x="130" y="114" width="140" height="82" fill="url(#scPowder)"/>
            <path d="M28 104 V198 H112 V104 M128 104 V198 H272 V104" fill="none" stroke="#64748b" stroke-width="3"/>
            <rect x="30" y="190" width="80" height="8" fill="#94a3b8"/>
            <rect x="130" y="190" width="140" height="8" fill="#94a3b8"/>
            <rect x="168" y="146" width="66" height="14" rx="3" fill="#818cf8"/>
            <rect x="178" y="132" width="46" height="14" rx="3" fill="#6366f1"/>
            <rect x="174" y="160" width="54" height="14" rx="3" fill="#6366f1"/>
            <rect x="160" y="114" width="80" height="3" fill="#f59e0b" opacity=".9" class="sc-heat"/>
            <rect x="186" y="16" width="28" height="16" rx="4" fill="#334155"/>
            <g class="sc-scan" style="transform-origin:200px 32px">
                <line x1="200" y1="32" x2="200" y2="114" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="200" cy="114" r="4" fill="#f87171"/>
            </g>
            <g class="sc-roll"><circle cx="46" cy="106" r="9" fill="#475569"/><circle cx="46" cy="106" r="3" fill="#cbd5e1"/></g>
            ${badge(236, 24, 1)}${badge(30, 86, 2)}${badge(282, 132, 3)}${badge(250, 168, 4)}`,
    },
};

function schematicHtml(visual: 'fdm' | 'vat' | 'powder', labels: SchematicLabel[]): string {
    const s = SCHEMATIC_SVG[visual];
    return `
        <div class="grid items-center gap-5 md:grid-cols-2">
            <div class="rounded-[1.75rem] border border-slate-200/60 bg-white p-3 shadow-sm">
                <svg viewBox="0 0 300 220" class="h-auto w-full" role="img" aria-label="${s.label}">${s.svg}</svg>
            </div>
            <ol class="space-y-2.5">${labels
                .map((l, i) => `
                <li class="flex gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/70 p-3" data-reveal style="--d:${i * 90}ms">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">${i + 1}</span>
                    <span><span class="block text-sm font-black text-slate-900">${l.title}</span><span class="mt-0.5 block text-xs leading-5 text-slate-600">${l.desc}</span></span>
                </li>`)
                .join('')}</ol>
        </div>`;
}

function fdmSettingsHtml(): string {
    const R = 54;
    const dome = (n: number) => {
        const h = R / n;
        const steps = Array.from({ length: n }, (_, i) => {
            const half = Math.sqrt(R * R - ((i + 0.5) * h) ** 2);
            return `<rect x="${(62 - half).toFixed(1)}" y="${(62 - (i + 1) * h).toFixed(1)}" width="${(half * 2).toFixed(1)}" height="${h.toFixed(1)}" fill="${i % 2 ? '#818cf8' : '#6366f1'}"/>`;
        }).join('');
        return `<svg viewBox="0 0 124 68" class="h-auto w-full" aria-hidden="true">${steps}<path d="M${62 - R} 62 A${R} ${R} 0 0 1 ${62 + R} 62" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="2" y1="62.5" x2="122" y2="62.5" stroke="#94a3b8"/></svg>`;
    };
    const infill = (gap: number) => {
        const lines: string[] = [];
        for (let p = 9 + gap; p < 61; p += gap) {
            lines.push(`<line x1="${p.toFixed(1)}" y1="9" x2="${p.toFixed(1)}" y2="61"/><line x1="9" y1="${p.toFixed(1)}" x2="61" y2="${p.toFixed(1)}"/>`);
        }
        return `<svg viewBox="0 0 70 70" class="mx-auto h-auto w-full max-w-[5.5rem]" aria-hidden="true"><rect x="6" y="6" width="58" height="58" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="4"/><g stroke="#818cf8" stroke-width="1.6">${lines.join('')}</g></svg>`;
    };
    const cell = (visual: string, value: string, desc: string, i: number) => `
        <div class="rounded-2xl bg-slate-50 p-2.5 text-center" data-reveal style="--d:${i * 90}ms">
            ${visual}
            <p class="mt-1.5 text-sm font-black text-slate-900">${value}</p>
            <p class="text-[11px] leading-4 text-slate-500">${desc}</p>
        </div>`;
    return `
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-[1.75rem] border border-slate-200/60 bg-white p-4 shadow-sm">
                <p class="mb-3 text-sm font-black text-slate-900"><i class="fas fa-bars-staggered mr-1.5 text-indigo-500" aria-hidden="true"></i>${term('레이어', '레이어 높이')} — 곡면이 얼마나 매끈할까?</p>
                <div class="grid grid-cols-3 gap-2">
                    ${cell(dome(14), '0.1mm', '매끈함 · 느림', 0)}
                    ${cell(dome(7), '0.2mm', '표준 설정', 1)}
                    ${cell(dome(4), '0.3mm', '거침 · 빠름', 2)}
                </div>
                <p class="mt-2 text-[11px] text-slate-400">주황 점선 = 원래 설계한 곡면</p>
            </div>
            <div class="rounded-[1.75rem] border border-slate-200/60 bg-white p-4 shadow-sm">
                <p class="mb-3 text-sm font-black text-slate-900"><i class="fas fa-border-all mr-1.5 text-indigo-500" aria-hidden="true"></i>${term('인필', '인필 밀도')} — 속을 얼마나 채울까?</p>
                <div class="grid grid-cols-3 gap-2">
                    ${cell(infill(17), '10%', '가벼움 · 모형용', 0)}
                    ${cell(infill(10), '20%', '일반 용도', 1)}
                    ${cell(infill(4.5), '50%', '튼튼함 · 무거움', 2)}
                </div>
                <p class="mt-2 text-[11px] text-slate-400">굵은 테두리 = 외벽, 안쪽 격자 = 인필</p>
            </div>
        </div>`;
}

function processMapHtml(groups: ProcessGroup[]): string {
    let n = 0;
    return `<div class="space-y-3">${groups
        .map((g, gi) => `
            <div class="grid gap-3 rounded-[1.75rem] border border-slate-200/60 bg-slate-50/60 p-3 sm:grid-cols-[8.5rem_1fr] sm:items-stretch" data-reveal style="--d:${gi * 90}ms">
                <div class="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 sm:flex-col sm:justify-center sm:text-center">
                    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"><i class="fas ${g.icon}" aria-hidden="true"></i></span>
                    <span class="text-xs font-black leading-4 text-slate-700">${g.form}</span>
                </div>
                <div class="grid gap-2 ${g.items.length > 1 ? 'sm:grid-cols-2' : ''}">${g.items
                    .map((it) => {
                        n += 1;
                        return `
                    <div class="relative rounded-2xl border p-3.5 ${it.highlight ? 'border-indigo-200 bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'border-slate-200/60 bg-white'}">
                        <span class="absolute right-3 top-3 text-[10px] font-black ${it.highlight ? 'text-indigo-200' : 'text-slate-300'}">${String(n).padStart(2, '0')}</span>
                        <p class="text-sm font-black ${it.highlight ? 'text-white' : 'text-slate-900'}">${it.name}</p>
                        <p class="mt-0.5 font-mono text-[11px] font-bold ${it.highlight ? 'text-indigo-100' : 'text-indigo-600'}">${it.tech}</p>
                        <p class="mt-1.5 text-xs leading-5 ${it.highlight ? 'text-indigo-50' : 'text-slate-600'}">${it.how}</p>
                    </div>`;
                    })
                    .join('')}</div>
            </div>`)
        .join('')}</div>`;
}

function ratingsHtml(metrics: string[], rows: RatingRow[]): string {
    return `<div class="grid grid-cols-2 gap-2.5 sm:gap-3 ${rows.length > 4 ? 'xl:grid-cols-3' : ''}">${rows
        .map((r, ri) => {
            const t = TONES[r.tone];
            return `
            <div class="rounded-[1.5rem] border border-slate-200/60 bg-white p-3 shadow-sm sm:p-4" data-reveal style="--d:${ri * 80}ms">
                <p class="text-sm font-black text-slate-900 sm:text-base">${r.name}${r.sub ? ` <span class="block text-[11px] font-bold text-slate-400 sm:inline sm:text-xs">${r.sub}</span>` : ''}</p>
                <dl class="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">${metrics
                    .map((m, mi) => {
                        const v = Math.max(0, Math.min(5, r.scores[mi] ?? 0));
                        return `
                    <div class="grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:items-center sm:gap-2">
                        <dt class="text-[11px] font-bold text-slate-500">${m}</dt>
                        <dd class="flex gap-1" aria-label="${m} 5단계 중 ${v}">${Array.from({ length: 5 }, (_, k) =>
                            `<span class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">${k < v ? `<span class="rt-on block h-full ${t.bar}" style="--d:${ri * 80 + k * 60}ms"></span>` : ''}</span>`
                        ).join('')}</dd>
                    </div>`;
                    })
                    .join('')}</dl>
            </div>`;
        })
        .join('')}</div>`;
}

function decisionHtml(options: DecisionOption[]): string {
    return `<ul class="space-y-2.5">${options
        .map((o, i) => {
            const t = TONES[o.tone];
            return `
            <li class="grid items-center gap-2 rounded-[1.5rem] border border-slate-200/60 bg-white p-3 shadow-sm sm:grid-cols-[1fr_auto_minmax(0,1.1fr)] sm:gap-3" data-reveal style="--d:${i * 90}ms">
                <span class="flex items-center gap-3">
                    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}"><i class="fas ${o.icon}" aria-hidden="true"></i></span>
                    <span class="text-sm font-bold text-slate-700">${o.when}</span>
                </span>
                <span class="hidden text-slate-300 sm:block" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>
                <span class="rounded-2xl border px-3.5 py-2 ${t.chip}">
                    <span class="block text-sm font-black ${t.text}">${o.pick}</span>
                    <span class="block text-xs leading-5 text-slate-600">${o.why}</span>
                </span>
            </li>`;
        })
        .join('')}</ul>`;
}

function rangeHtml(b: Extract<Infographic, { kind: 'range' }>): string {
    const pct = (v: number) => (((v - b.min) / (b.max - b.min)) * 100).toFixed(2);
    const ticks: number[] = [];
    for (let v = b.min; v <= b.max; v += b.step) ticks.push(v);
    const legend = b.series
        .map((s) => `<span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-5 rounded-full" style="background:${s.color}"></span>${s.label}</span>`)
        .join('');
    const rows = b.rows
        .map(
            (r, ri) => `
        <div class="grid grid-cols-[4rem_1fr] items-center gap-3 sm:grid-cols-[5rem_1fr]" data-reveal style="--d:${ri * 70}ms">
            <span class="text-sm font-black text-slate-900">${r.name}</span>
            <div class="relative space-y-1.5 py-1">${r.ranges
                .map(([lo, hi], si) => {
                    const l = Number(pct(lo));
                    const h = Number(pct(hi));
                    const labelPos = h > 72 ? `right:calc(${(100 - l).toFixed(2)}% + 6px)` : `left:calc(${h.toFixed(2)}% + 6px)`;
                    return `
                <div class="relative h-4 rounded-full bg-slate-100">
                    <span class="rg-bar absolute inset-y-0 rounded-full shadow-sm" style="left:${l}%;width:${(h - l).toFixed(2)}%;background:${b.series[si]?.color};--d:${ri * 70 + si * 120}ms"></span>
                    <span class="absolute inset-y-0 flex items-center whitespace-nowrap text-[10px] font-black text-slate-600" style="${labelPos}">${lo}~${hi}${b.unit}</span>
                </div>`;
                })
                .join('')}</div>
        </div>`
        )
        .join('');
    return `
        <div class="rounded-[1.75rem] border border-slate-200/60 bg-white p-4 shadow-sm sm:p-5">
            <div class="mb-3 flex flex-wrap gap-4 text-xs font-bold text-slate-500">${legend}</div>
            <div class="space-y-2.5">${rows}</div>
            <div class="mt-2 grid grid-cols-[4rem_1fr] gap-3 sm:grid-cols-[5rem_1fr]">
                <span></span>
                <div class="relative h-4 border-t border-slate-200">${ticks
                    .map((v) => `<span class="absolute top-1 -translate-x-1/2 text-[10px] font-bold text-slate-400" style="left:${pct(v)}%">${v}</span>`)
                    .join('')}</div>
            </div>
        </div>`;
}

export function renderInfographic(block: Infographic): string {
    switch (block.kind) {
        case 'methods':
            return figure(block.caption, methodsHtml(block.items));
        case 'flow':
            return figure(block.caption, flowHtml(block.steps));
        case 'balance':
            return figure(block.caption, balanceHtml(block.pros, block.cons, block.labels));
        case 'iconGrid':
            return figure(block.caption, iconGridHtml(block.items));
        case 'schematic':
            return figure(block.caption, schematicHtml(block.visual, block.labels));
        case 'fdmSettings':
            return figure(block.caption, fdmSettingsHtml());
        case 'processMap':
            return figure(block.caption, processMapHtml(block.groups));
        case 'ratings':
            return figure(block.caption, ratingsHtml(block.metrics, block.rows));
        case 'decision':
            return figure(block.caption, decisionHtml(block.options));
        case 'range':
            return figure(block.caption, rangeHtml(block));
        case 'timeline':
            return figure(block.caption, timelineHtml(block.eras));
    }
}

function timelineHtml(eras: TimelineEra[]): string {
    const ribbon = `
        <ol class="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="시대 구분">${eras
            .map((e, i) => {
                const t = TONES[e.tone];
                return `
            <li data-reveal style="--d:${i * 90}ms">
                <a href="#tl-era-${i + 1}" class="tl-chip flex h-full items-center gap-2.5 rounded-2xl px-3 py-2.5 shadow-sm ${t.icon}">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20"><i class="fas ${e.icon}" aria-hidden="true"></i></span>
                    <span class="min-w-0"><span class="block text-[10px] font-bold opacity-80">${e.period}</span><span class="block text-[13px] font-black leading-tight">${e.title}</span></span>
                </a>
            </li>`;
            })
            .join('')}</ol>`;

    const blocks = eras
        .map((e, i) => {
            const t = TONES[e.tone];
            const events = e.events
                .map((ev, k) => `
                <li class="relative" data-reveal style="--d:${k * 90}ms">
                    <span class="tl-dot absolute -left-[1.85rem] top-4 h-4 w-4 rounded-full border-[3px] border-white shadow ${t.bar}" aria-hidden="true"></span>
                    <div class="rounded-2xl border p-3.5 ${ev.turning ? t.chip : 'border-slate-200/60 bg-white shadow-sm'}">
                        <p class="flex flex-wrap items-center gap-2">
                            <time class="text-xs font-black tracking-tight ${t.text}">${ev.year}</time>
                            ${ev.turning ? `<span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-black ${t.text}"><i class="fas fa-bolt mr-1" aria-hidden="true"></i>전환점</span>` : ''}
                        </p>
                        <p class="mt-1 text-sm font-black text-slate-900">${ev.title}</p>
                        ${ev.desc ? `<p class="mt-0.5 text-xs leading-5 text-slate-600">${ev.desc}</p>` : ''}
                    </div>
                </li>`)
                .join('');
            return `
            <div id="tl-era-${i + 1}" class="grid scroll-mt-28 gap-3 lg:grid-cols-[14rem_1fr] lg:gap-6" data-reveal>
                <div class="self-start rounded-[1.5rem] border p-4 lg:sticky lg:top-28 ${t.chip}">
                    <span class="flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm ${t.icon}"><i class="fas ${e.icon}" aria-hidden="true"></i></span>
                    <p class="mt-3 text-[11px] font-black ${t.text}">${e.period}</p>
                    <p class="text-base font-black tracking-tight text-slate-900">${e.title}</p>
                    <p class="mt-1 text-xs leading-5 text-slate-600">${e.summary}</p>
                </div>
                <ol class="tl-list relative space-y-3 pl-8" style="--tl-c:${t.hex}">${events}</ol>
            </div>`;
        })
        .join('');

    return `${ribbon}<div class="mt-6 space-y-8">${blocks}</div>`;
}

/* ───────────────────────── 히어로: 적층 애니메이션 ───────────────────────── */

const LAYER_COUNT = 8;
const LAYER_H = 13;
const BED_Y = 196;
const LAYER_WIDTHS = [150, 138, 128, 122, 122, 128, 138, 150];
const CYCLE_S = 9.6;

function layerHeroKeyframes(): string {
    const seg = 10;
    const layerKf = LAYER_WIDTHS.map(
        (_, i) => `@keyframes lgL${i}{0%,${i * seg}%{transform:scaleX(0);opacity:1}${i * seg + seg - 0.1}%,90%{transform:scaleX(1);opacity:1}97%,100%{transform:scaleX(1);opacity:0}}`
    ).join('');
    const nozzleStops: string[] = [];
    LAYER_WIDTHS.forEach((w, i) => {
        const left = 180 - w / 2;
        const right = 180 + w / 2;
        const y = BED_Y - (i + 1) * LAYER_H;
        const [from, to] = i % 2 === 0 ? [left, right] : [right, left];
        nozzleStops.push(`${i * seg}%{transform:translate(${from}px,${y}px)}`);
        nozzleStops.push(`${i * seg + seg - 0.1}%{transform:translate(${to}px,${y}px)}`);
    });
    nozzleStops.push(`88%,100%{transform:translate(180px,62px)}`);
    return `${layerKf}@keyframes lgNozzle{${nozzleStops.join('')}}`;
}

export function layerHeroSvg(): string {
    const layers = LAYER_WIDTHS.map((w, i) => {
        const x = 180 - w / 2;
        const y = BED_Y - (i + 1) * LAYER_H;
        const origin = i % 2 === 0 ? 'left' : 'right';
        return `<rect class="lg-layer" x="${x}" y="${y}" width="${w}" height="${LAYER_H - 1}" rx="3" fill="${i % 2 ? '#818cf8' : '#6366f1'}" style="transform-origin:${origin} center;animation:lgL${i} ${CYCLE_S}s linear infinite"/>`;
    }).join('');
    const topY = BED_Y - LAYER_COUNT * LAYER_H;
    return `
        <figure class="relative" aria-labelledby="lg-hero-cap">
            <svg viewBox="0 0 360 240" class="lg-anim h-auto w-full" role="img" aria-label="3D프린터 노즐이 좌우로 움직이며 재료를 한 층씩 쌓아 형상을 만드는 과정">
                <defs>
                    <linearGradient id="lgBg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#eef2ff"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
                </defs>
                <rect x="8" y="8" width="344" height="224" rx="28" fill="url(#lgBg)"/>
                <ellipse cx="180" cy="${BED_Y + 18}" rx="120" ry="7" fill="#e2e8f0"/>
                <rect x="70" y="${BED_Y}" width="220" height="10" rx="3" fill="#cbd5e1"/>
                ${layers}
                <g class="lg-dim" stroke="#94a3b8" stroke-width="1.2">
                    <line x1="300" y1="${BED_Y - LAYER_H}" x2="300" y2="${BED_Y}"/>
                    <line x1="295" y1="${BED_Y - LAYER_H}" x2="305" y2="${BED_Y - LAYER_H}"/>
                    <line x1="295" y1="${BED_Y}" x2="305" y2="${BED_Y}"/>
                </g>
                <text x="310" y="${BED_Y - 3}" font-size="10" font-weight="700" fill="#64748b">레이어</text>
                <text x="30" y="36" font-size="11" font-weight="800" fill="#6366f1">적층 원리</text>
                <text x="30" y="50" font-size="9" font-weight="600" fill="#94a3b8">한 층 그리고 → 한 칸 위로</text>
                <text x="74" y="${BED_Y + 2}" font-size="9" font-weight="700" fill="#64748b" text-anchor="end">베드</text>
                <g class="lg-nozzle" transform="translate(180,62)" style="animation:lgNozzle ${CYCLE_S}s linear infinite">
                    <line x1="0" y1="-48" x2="0" y2="-80" stroke="#a5b4fc" stroke-width="3" stroke-linecap="round"/>
                    <rect x="-16" y="-48" width="32" height="26" rx="6" fill="#334155"/>
                    <rect x="-10" y="-42" width="20" height="4" rx="2" fill="#f43f5e" class="lg-heat"/>
                    <path d="M-8 -22 H8 L3 -3 H-3 Z" fill="#f59e0b"/>
                </g>
            </svg>
            <figcaption id="lg-hero-cap" class="sr-only">노즐이 한 층을 그린 뒤 한 칸 위로 올라가 다음 층을 쌓는 적층 원리 애니메이션</figcaption>
        </figure>`;
}

/* ───────────────────────── 스타일·스크립트 ───────────────────────── */

export function learnHeadAssets(): string {
    return `
    <script>(function(){if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){document.documentElement.classList.add('reveal-ready')}})();</script>
    <style>
        .lg-layer,.mv-fill,.mv-grow{transform-box:fill-box}
        ${layerHeroKeyframes()}
        .lg-heat{animation:lgHeat 1.2s ease-in-out infinite}
        @keyframes lgHeat{50%{opacity:.35}}
        .mv-tool{animation:mvBob 1.6s ease-in-out infinite}
        @keyframes mvBob{50%{transform:translateY(5px)}}
        .mv-chip{opacity:0;animation:mvChip 1.6s ease-in infinite}
        @keyframes mvChip{0%{opacity:0;transform:translate(0,0)}25%{opacity:1}100%{opacity:0;transform:translate(var(--cx),26px) rotate(90deg)}}
        .mv-fill{transform-origin:bottom;animation:mvFill 3s ease-in-out infinite}
        @keyframes mvFill{0%{transform:scaleY(0)}60%,88%{transform:scaleY(1);opacity:.85}100%{transform:scaleY(1);opacity:0}}
        .mv-pour{animation:mvPour 3s linear infinite}
        @keyframes mvPour{0%,60%{opacity:1}64%,100%{opacity:0}}
        .mv-grow{transform-origin:left;animation:mvGrow 2.4s linear infinite}
        @keyframes mvGrow{0%{transform:scaleX(0)}80%,100%{transform:scaleX(1)}}
        .mv-noz{animation:mvNoz 2.4s linear infinite}
        @keyframes mvNoz{0%{transform:translateX(0)}80%{transform:translateX(56px)}100%{transform:translateX(56px)}}

        .flow-conn{list-style:none;align-self:flex-start;margin-left:2.35rem;flex:none;width:2px;height:22px;background:repeating-linear-gradient(180deg,#818cf8 0 5px,transparent 5px 10px);background-size:2px 20px;animation:flowY 1s linear infinite}
        @keyframes flowY{to{background-position:0 20px}}
        @keyframes flowX{to{background-position:20px 0}}
        @media (min-width:1024px){.flow-conn{align-self:center;margin-left:0;width:18px;height:2px;background:repeating-linear-gradient(90deg,#818cf8 0 5px,transparent 5px 10px);background-size:20px 2px;animation-name:flowX}}
        .flow-step:hover .flow-icon,.group:hover .icon-pop{transform:translateY(-3px) rotate(-6deg)}
        .flow-icon,.icon-pop{transition:transform .35s cubic-bezier(.34,1.56,.64,1)}

        .sc-spin{animation:scSpin 6s linear infinite}
        @keyframes scSpin{to{transform:rotate(360deg)}}
        .sc-heat{animation:lgHeat 1.4s ease-in-out infinite}
        .sc-bed{animation:scBed 2.6s ease-in-out infinite alternate}
        @keyframes scBed{from{transform:translateX(-26px)}to{transform:translateX(26px)}}
        .sc-lift{animation:scLift 3.4s ease-in-out infinite}
        @keyframes scLift{0%,55%{transform:translateY(0)}72%{transform:translateY(-10px)}100%{transform:translateY(0)}}
        .sc-scan{animation:scScan 1.8s ease-in-out infinite alternate}
        @keyframes scScan{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
        .sc-roll{animation:scRoll 4s ease-in-out infinite}
        @keyframes scRoll{0%,8%{transform:translateX(0)}48%,58%{transform:translateX(196px)}100%{transform:translateX(0)}}
        .rt-on,.rg-bar{transform-origin:left;transition:transform .6s cubic-bezier(.2,.7,.2,1) var(--d,0ms)}
        .reveal-ready [data-reveal]:not(.is-visible) .rt-on,.reveal-ready [data-reveal]:not(.is-visible) .rg-bar{transform:scaleX(0)}
        .tl-list::before{content:'';position:absolute;left:.6rem;top:.6rem;bottom:.6rem;width:3px;border-radius:3px;background:linear-gradient(180deg,var(--tl-c),color-mix(in srgb,var(--tl-c) 25%,transparent));transform-origin:top;transition:transform 1.2s cubic-bezier(.2,.7,.2,1) .15s}
        .reveal-ready [data-reveal]:not(.is-visible) .tl-list::before{transform:scaleY(0)}
        .tl-dot{transition:transform .45s cubic-bezier(.34,1.56,.64,1) calc(var(--d,0ms) + 200ms)}
        .reveal-ready [data-reveal]:not(.is-visible) > .tl-dot{transform:scale(0)}
        .tl-chip{transition:transform .25s,box-shadow .25s}
        .tl-chip:hover{transform:translateY(-2px);box-shadow:0 10px 20px -10px rgb(15 23 42/.35)}

        .reveal-ready [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .75s cubic-bezier(.2,.7,.2,1) var(--d,0ms),transform .75s cubic-bezier(.2,.7,.2,1) var(--d,0ms)}
        .reveal-ready [data-reveal].is-visible{opacity:1;transform:none}

        .gl-term{position:relative;cursor:help;color:inherit;font-weight:700;text-decoration:none;border-bottom:1.5px dashed #818cf8}
        .gl-term::after{content:attr(data-tip);position:absolute;left:50%;bottom:calc(100% + 10px);z-index:40;width:max-content;max-width:min(18rem,80vw);padding:.65rem .8rem;border-radius:.9rem;background:#0f172a;color:#f8fafc;font-size:12.5px;font-weight:500;line-height:1.6;white-space:normal;text-align:left;box-shadow:0 14px 30px -10px rgb(15 23 42/.45);opacity:0;pointer-events:none;transform:translate(-50%,6px);transition:opacity .18s,transform .18s}
        .gl-term:focus-visible::after,.gl-term.is-open::after{opacity:1;transform:translate(-50%,0)}
        @media (hover:hover){.gl-term:hover::after{opacity:1;transform:translate(-50%,0)}}
        @media (hover:none){html .bento-card:hover{transform:none}}
        @media (max-width:640px){.gl-term::after{position:fixed;left:1rem;right:1rem;bottom:5.5rem;max-width:none;width:auto;transform:translateY(8px)}.gl-term.is-open::after{transform:none}}
        .gl-entry:target{border-color:#818cf8;box-shadow:0 0 0 4px rgb(129 140 248/.2)}

        @media (prefers-reduced-motion:reduce){
            .lg-anim *,.mv-tool,.mv-chip,.mv-fill,.mv-pour,.mv-grow,.mv-noz,.flow-conn,.lg-heat,.sc-spin,.sc-heat,.sc-bed,.sc-lift,.sc-scan,.sc-roll{animation:none!important}
            .mv-chip{opacity:0}
        }
    </style>`;
}

export function learnScript(): string {
    return `
    <script>
    (function(){
        if(document.documentElement.classList.contains('reveal-ready')){
            var io=new IntersectionObserver(function(entries){
                entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
            },{rootMargin:'0px 0px -6% 0px',threshold:0.06});
            document.querySelectorAll('[data-reveal]').forEach(function(el){ io.observe(el); });
        }
        var touch=window.matchMedia('(hover: none)');
        document.addEventListener('click',function(ev){
            var t=ev.target&&ev.target.closest?ev.target.closest('.gl-term'):null;
            document.querySelectorAll('.gl-term.is-open').forEach(function(el){ if(el!==t) el.classList.remove('is-open'); });
            if(t&&touch.matches&&!t.classList.contains('is-open')){ ev.preventDefault(); t.classList.add('is-open'); }
        });
    })();
    </script>`;
}
