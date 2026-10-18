import { layoutHtml } from './components/layout';
import { getSeoHead, SITE_ORIGIN, toPlainMeta } from '../utils/seo';

export type PublicPostDetail = {
    id: number;
    title: string;
    content: string;
    category?: string | null;
    author_name?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

function escapeHtml(value: string): string {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function categoryLabel(category?: string | null): string {
    const map: Record<string, string> = {
        notice: '공지',
        news: '소식',
        event: '이벤트',
        education_photo: '교육 현장',
        faq: 'FAQ',
    };
    return map[String(category || '')] || '게시글';
}

/** 공개 게시글 상세 SSR (공지·소식·이벤트) */
export function postDetailHtml(post: PublicPostDetail): string {
    const title = toPlainMeta(post.title || `게시글 ${post.id}`, 80);
    const plain = toPlainMeta(post.content || '', 160);
    const path = `/posts/${post.id}`;
    const date = String(post.updated_at || post.created_at || '').slice(0, 10);
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: plain,
        datePublished: date || undefined,
        dateModified: date || undefined,
        author: { '@type': 'Organization', name: '와우쓰리디홍대센터' },
        publisher: { '@type': 'Organization', name: '와우쓰리디홍대센터', url: SITE_ORIGIN },
        mainEntityOfPage: `${SITE_ORIGIN}${path}`,
        inLanguage: 'ko-KR',
    };
    const seoHead = getSeoHead(SITE_ORIGIN, {
        title,
        description: plain || `${title} — 와우쓰리디 공지·게시판`,
        path,
        ogType: 'article',
        extraJsonLd: [articleLd],
    });
    // content가 HTML이면 그대로, 아니면 줄바꿈 보존
    const looksHtml = /<[a-z][\s\S]*>/i.test(post.content || '');
    const body = looksHtml
        ? post.content
        : `<p class="whitespace-pre-line leading-7 text-slate-700">${escapeHtml(post.content || '')}</p>`;

    return layoutHtml(
        title,
        `
        <div class="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] py-12 sm:py-16">
            <article class="mx-auto max-w-3xl px-4 sm:px-6">
                <header class="mb-8 rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-10">
                    <p class="mb-3 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">${escapeHtml(categoryLabel(post.category))}</p>
                    <h1 class="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">${escapeHtml(title)}</h1>
                    <p class="mt-4 text-sm font-bold text-slate-500">${escapeHtml(date)}${post.author_name ? ' · ' + escapeHtml(post.author_name) : ''}</p>
                    <p class="mt-4 max-w-2xl leading-7 text-slate-600">${escapeHtml(plain)}</p>
                </header>
                <div class="rounded-[2.5rem] border border-slate-200/60 bg-white p-7 sm:p-10 shadow-sm prose max-w-none prose-a:text-indigo-700">
                    ${body}
                </div>
                <div class="mt-8 flex flex-wrap gap-3">
                    <a href="/posts" class="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50">목록으로</a>
                    <a href="/online-consulting" class="inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">교육 상담</a>
                </div>
            </article>
        </div>
        `,
        'board',
        seoHead,
    );
}
