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

const TONES: Record<Tone, { chip: string; icon: string }> = {
    indigo: { chip: 'bg-indigo-50 border-indigo-100', icon: 'bg-indigo-600 text-white' },
    sky: { chip: 'bg-sky-50 border-sky-100', icon: 'bg-sky-500 text-white' },
    emerald: { chip: 'bg-emerald-50 border-emerald-100', icon: 'bg-emerald-500 text-white' },
    amber: { chip: 'bg-amber-50 border-amber-100', icon: 'bg-amber-500 text-white' },
    rose: { chip: 'bg-rose-50 border-rose-100', icon: 'bg-rose-500 text-white' },
    violet: { chip: 'bg-violet-50 border-violet-100', icon: 'bg-violet-500 text-white' },
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
export type IconItem = { icon: string; tone: Tone; title: string; desc: string; href?: string; linkLabel?: string };

export type Infographic =
    | { kind: 'methods'; caption: string; items: MethodCard[] }
    | { kind: 'flow'; caption: string; steps: FlowStep[] }
    | { kind: 'balance'; caption: string; pros: BalanceItem[]; cons: BalanceItem[] }
    | { kind: 'iconGrid'; caption: string; items: IconItem[] };

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

function balanceHtml(pros: BalanceItem[], cons: BalanceItem[]): string {
    const col = (title: string, icon: string, items: BalanceItem[], good: boolean) => `
        <div class="rounded-[1.75rem] border p-5 ${good ? 'border-emerald-100 bg-emerald-50/60' : 'border-amber-100 bg-amber-50/60'}" data-reveal style="--d:${good ? 0 : 150}ms">
            <p class="mb-4 flex items-center gap-2 text-sm font-black ${good ? 'text-emerald-700' : 'text-amber-700'}">
                <span class="flex h-8 w-8 items-center justify-center rounded-xl ${good ? 'bg-emerald-500' : 'bg-amber-500'} text-white"><i class="fas ${icon}" aria-hidden="true"></i></span>${title}
                <span class="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] ${good ? 'text-emerald-600' : 'text-amber-600'}">${items.length}가지</span>
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
            ${col('장점', 'fa-thumbs-up', pros, true)}
            ${col('한계', 'fa-triangle-exclamation', cons, false)}
            <span class="balance-badge absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-lg md:flex" aria-hidden="true"><i class="fas fa-scale-balanced"></i></span>
        </div>`;
}

function iconGridHtml(items: IconItem[]): string {
    return `<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">${items
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

export function renderInfographic(block: Infographic): string {
    switch (block.kind) {
        case 'methods':
            return figure(block.caption, methodsHtml(block.items));
        case 'flow':
            return figure(block.caption, flowHtml(block.steps));
        case 'balance':
            return figure(block.caption, balanceHtml(block.pros, block.cons));
        case 'iconGrid':
            return figure(block.caption, iconGridHtml(block.items));
    }
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
            .lg-anim *,.mv-tool,.mv-chip,.mv-fill,.mv-pour,.mv-grow,.mv-noz,.flow-conn,.lg-heat{animation:none!important}
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
