import { layoutHtml } from './components/layout';

export type PublicFaq = {
    title: string;
    answer: string;
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function faqPageHtml(items: PublicFaq[]): string {
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.title,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
    const structuredData = items.length
        ? `<script type="application/ld+json">${JSON.stringify(faqJsonLd).replace(/</g, '\\u003c')}</script>`
        : '';
    const cards = items.length
        ? items.map((item, index) => `
            <details class="group rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden bento-card">
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 font-black tracking-tight text-slate-900">
                    <span><span class="mr-3 text-indigo-600">Q${index + 1}.</span>${escapeHtml(item.title)}</span>
                    <i class="fas fa-chevron-down text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true"></i>
                </summary>
                <div class="border-t border-slate-100 px-5 py-5 sm:px-6 text-slate-700 leading-7 whitespace-pre-line">${escapeHtml(item.answer)}</div>
            </details>
        `).join('')
        : `
            <div class="rounded-[2.5rem] border border-slate-200/60 bg-white p-10 text-center shadow-sm">
                <i class="fas fa-circle-question mb-4 text-4xl text-slate-300" aria-hidden="true"></i>
                <p class="font-bold text-slate-600">등록된 자주 묻는 질문이 없습니다.</p>
                <a href="/online-consulting" class="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">온라인 상담하기</a>
            </div>
        `;

    return layoutHtml(
        '자주 묻는 질문',
        `
        <div class="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] py-12 sm:py-16">
            <div class="mx-auto max-w-4xl px-4 sm:px-6">
                <header class="mb-8 rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10">
                    <p class="mb-3 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">FAQ</p>
                    <h1 class="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">자주 묻는 질문</h1>
                    <p class="mt-4 max-w-2xl leading-7 text-slate-600">국비지원, 내일배움카드, 3D프린터 국가자격증(기능사), 무료교육 오해, 홍대·구미·전주 센터에 대해 자주 문의하시는 내용을 답변드립니다.</p>
                    <div class="mt-5 flex flex-wrap gap-2">
                        <a href="/guides/national-support" class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">국비지원</a>
                        <a href="/guides/craftsman-license" class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">기능사·국가자격</a>
                        <a href="/tomorrow-learning-card" class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">내일배움카드</a>
                        <a href="/guides/hongdae-3d-printing" class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">홍대</a>
                    </div>
                </header>
                <section class="space-y-4" aria-label="자주 묻는 질문과 답변">
                    ${cards}
                </section>
            </div>
        </div>
        `,
        'board',
        structuredData,
    );
}
