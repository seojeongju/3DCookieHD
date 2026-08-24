import { footerHtml } from './footer';
import { navigationHtml } from './components/navigation';
import { buildHowTo } from '../utils/seo';

const TLC_FAQ = [
    {
        q: '내일배움카드로 3D프린팅을 배울 수 있나요?',
        a: '가능합니다. 와우쓰리디는 국민내일배움카드(국비지원) 3D프린팅·3D모델링 직업훈련을 홍대·구미·전주센터에서 운영합니다. 모집 회차는 교육과정 목록에서 확인하세요.',
    },
    {
        q: '내일배움카드는 어떻게 발급받나요?',
        a: '고용24(워크넷)에서 회원가입·로그인 후 상담·심사를 거쳐 국민내일배움카드를 발급받습니다. 자격·한도는 연도별 고시와 개인 심사 결과에 따릅니다.',
    },
    {
        q: '내일배움카드로 3D프린터 무료교육이 가능한가요?',
        a: '완전 무료 여부는 회차·자격에 따라 다릅니다. 내일배움카드로 훈련비 부담을 크게 줄일 수 있으며, 자기부담금은 상담 시 해당 회차 기준으로 안내합니다.',
    },
    {
        q: '기능사·국가자격 과정도 내일배움카드로 들을 수 있나요?',
        a: '개설 회차에 따라 다릅니다. 3D프린터운용기능사(3D프린터 국가자격증) 대비 과정 중 국비 적용 회차가 있으면 내일배움카드로 수강할 수 있습니다.',
    },
] as const;

/** 내일배움카드 발급 안내 (고용노동부 청년 직업훈련 바우처 — 세부 기준은 매년 고시를 확인하세요) */
export function tomorrowLearningCardHtml() {
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: TLC_FAQ.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };
    const howTo = buildHowTo(
        '국민내일배움카드 발급 후 3D프린팅 수강하기',
        '고용24에서 내일배움카드를 발급받고 와우쓰리디 3D프린팅 국비지원 과정에 등록하는 일반적인 절차입니다.',
        [
            { name: '고용24 가입', text: '고용24(워크넷)에서 회원가입 및 로그인을 합니다.' },
            { name: '상담·심사', text: '청년 취업상담 등 지침에 따른 상담·심사 절차를 진행합니다.' },
            { name: '카드 발급', text: '적격 판정 시 국민내일배움카드를 발급받고 훈련비 한도를 확인합니다.' },
            { name: '과정 신청', text: '와우쓰리디 모집 과정에 상담·등록하거나 고용24에서 훈련과정을 신청·수강합니다.' },
        ],
    );
    const faqCards = TLC_FAQ.map(
        (item, index) => `
            <details class="group rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden bento-card">
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 font-black tracking-tight text-slate-900">
                    <span><span class="mr-3 text-emerald-600">Q${index + 1}.</span>${item.q}</span>
                    <i class="fas fa-chevron-down text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true"></i>
                </summary>
                <div class="border-t border-slate-100 px-5 py-5 sm:px-6 text-slate-700 leading-7">${item.a}</div>
            </details>`
    ).join('');

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내일배움카드 3D프린팅 국비지원 - 와우쓰리디홍대센터</title>
    <meta name="description" content="내일배움카드로 3D프린팅·3D프린터 국비지원 교육을 수강하는 방법과 발급 절차를 안내합니다. 와우쓰리디 홍대·구미·전주.">
    <link rel="stylesheet" href="/static/tailwind-app.css">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script type="application/ld+json">${JSON.stringify(faqJsonLd).replace(/</g, '\\u003c')}</script>
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...howTo }).replace(/</g, '\\u003c')}</script>
    <style>
      .dot-grid-bg {
        background-color: #f8fafc;
        background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
        background-size: 20px 20px;
      }
      .bento-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }
      .bento-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
      }
      .hero-pattern {
        background-image: linear-gradient(135deg, rgba(255,255,255,0.08) 25%, transparent 25%),
          linear-gradient(225deg, rgba(255,255,255,0.08) 25%, transparent 25%);
        background-size: 24px 24px;
      }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col dot-grid-bg custom-scrollbar">
    ${navigationHtml('consulting')}

    <header class="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white py-16 md:py-20 overflow-hidden">
        <div class="hero-pattern absolute inset-0 opacity-40"></div>
        <div class="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-emerald-100/90 text-sm font-semibold tracking-widest uppercase mb-3">National Tomorrow Learning Card</p>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                <i class="fas fa-id-card-alt mr-3 opacity-90"></i>내일배움카드로 3D프린팅 배우기
            </h1>
            <p class="text-lg md:text-xl text-emerald-50/95 max-w-2xl mx-auto leading-relaxed">
                국민내일배움카드로 3D프린팅·3D모델링 국비지원 과정을 준비하는 분을 위한 발급·수강 안내입니다.
            </p>
        </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p class="text-center text-sm text-slate-500 mb-10 max-w-3xl mx-auto">
            아래 내용은 이해를 돕기 위한 요약이며, <strong class="text-slate-700">자격·한도·절차는 매년 고시 및 고용24(워크넷) 공지가 우선</strong>합니다. 신청 전 반드시 최신 공지를 확인해 주세요.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
            <section class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white shadow-sm p-8 md:p-10">
                <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                    <i class="fas fa-lightbulb text-2xl"></i>
                </div>
                <h2 class="text-xl font-black tracking-tight text-slate-900 mb-4">내일배움카드란?</h2>
                <p class="text-slate-600 leading-relaxed text-[15px]">
                    고용노동부가 운영하는 <strong class="text-slate-800">청년 등 대상자에게 직업훈련비를 지원</strong>하기 위한 제도로,
                    발급 후 지정된 한도 내에서 훈련기관의 국민내일배움카드 훈련과정 수강에 활용할 수 있습니다.
                    와우쓰리디홍대센터의 <a href="/course-sessions" class="text-primary-600 font-semibold hover:underline">국비지원 과정</a>과 연계하여 상담·신청 준비를 도와드립니다.
                </p>
            </section>

            <section class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white shadow-sm p-8 md:p-10">
                <div class="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                    <i class="fas fa-user-check text-2xl"></i>
                </div>
                <h2 class="text-xl font-black tracking-tight text-slate-900 mb-4">대상·요건 (요약)</h2>
                <ul class="space-y-3 text-slate-600 text-[15px] leading-relaxed">
                    <li class="flex gap-2"><span class="text-primary-500 font-bold">·</span> 일반적으로 <strong class="text-slate-800">만 15세 이상 34세 미만</strong> 등 연령 요건이 있습니다. (연도별 고시 반영)</li>
                    <li class="flex gap-2"><span class="text-primary-500 font-bold">·</span> 취업·실업 등 <strong class="text-slate-800">고용 상태</strong>에 따른 세부 조건이 있습니다.</li>
                    <li class="flex gap-2"><span class="text-primary-500 font-bold">·</span> 정확한 자격은 <a href="https://www.work.go.kr" target="_blank" rel="noopener noreferrer" class="text-primary-600 font-semibold hover:underline">고용24</a>에서 확인하세요.</li>
                </ul>
            </section>

            <section class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white shadow-sm p-8 md:p-10 md:col-span-2">
                <div class="flex flex-col lg:flex-row lg:items-start gap-8">
                    <div class="flex-1">
                        <div class="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-6">
                            <i class="fas fa-list-ol text-2xl"></i>
                        </div>
                        <h2 class="text-xl font-black tracking-tight text-slate-900 mb-4">발급·이용 절차 (일반적인 흐름)</h2>
                        <ol class="space-y-4 text-slate-600 text-[15px] leading-relaxed list-decimal list-inside marker:font-bold marker:text-primary-600">
                            <li><strong class="text-slate-800">고용24(워크넷)</strong> 회원가입 및 로그인</li>
                            <li>청년 취업상담 등 <strong class="text-slate-800">상담·심사</strong> 절차 진행 (지침에 따라 상이)</li>
                            <li>적격 판정 시 <strong class="text-slate-800">국민내일배움카드 발급</strong> 및 한도 확인</li>
                            <li>희망하는 <strong class="text-slate-800">훈련과정 신청·수강</strong> (기관·과정은 고용24에서 검색·신청)</li>
                        </ol>
                    </div>
                    <div class="lg:w-80 shrink-0 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6">
                        <h3 class="font-bold text-slate-800 mb-3 flex items-center gap-2"><i class="fas fa-link text-primary-500"></i> 공식 안내</h3>
                        <p class="text-sm text-slate-600 mb-4">카드 신청 메뉴·FAQ·한도는 고용24에서 가장 정확합니다.</p>
                        <a href="https://www.work.go.kr" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full rounded-xl bg-primary-600 text-white font-semibold py-3 hover:bg-primary-700 transition shadow-sm">
                            고용24 바로가기 <i class="fas fa-external-link-alt ml-2 text-xs opacity-90"></i>
                        </a>
                    </div>
                </div>
            </section>

            <section class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white shadow-sm p-8 md:p-10 md:col-span-2">
                <h2 class="text-xl font-black tracking-tight text-slate-900 mb-2">자주 묻는 질문</h2>
                <p class="text-sm text-slate-500 mb-6">내일배움카드·3D프린팅 국비지원·무료교육에 대해 자주 묻는 내용입니다.</p>
                <div class="space-y-3" aria-label="내일배움카드 자주 묻는 질문">${faqCards}</div>
                <div class="mt-6 flex flex-wrap gap-3">
                    <a href="/guides/free-education" class="text-sm font-bold text-emerald-700 hover:underline">3D프린터 무료·국비 안내</a>
                    <a href="/guides/craftsman-license" class="text-sm font-bold text-emerald-700 hover:underline">3D프린터 국가자격증·기능사</a>
                    <a href="/faq" class="text-sm font-bold text-emerald-700 hover:underline">전체 FAQ</a>
                </div>
            </section>

            <section class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-white shadow-sm p-8 md:p-10">
                <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
                    <i class="fas fa-exclamation-circle text-2xl"></i>
                </div>
                <h2 class="text-xl font-black tracking-tight text-slate-900 mb-4">꼭 확인하세요</h2>
                <ul class="space-y-2.5 text-slate-600 text-[15px] leading-relaxed">
                    <li class="flex gap-2"><i class="fas fa-check text-amber-600 mt-1 shrink-0"></i> 훈련과정·훈련비 지원 한도는 <strong class="text-slate-800">연도·개인별 심사 결과</strong>에 따라 달라질 수 있습니다.</li>
                    <li class="flex gap-2"><i class="fas fa-check text-amber-600 mt-1 shrink-0"></i> 본 페이지는 법적 효력이 없으며, 분쟁 시 관계 법령·고시가 적용됩니다.</li>
                </ul>
            </section>

            <section class="bento-card rounded-[2.5rem] border border-slate-200/60 bg-gradient-to-br from-primary-50 to-white shadow-sm p-8 md:p-10 flex flex-col justify-center">
                <h2 class="text-xl font-black tracking-tight text-slate-900 mb-3">와우쓰리디에서 상담받기</h2>
                <p class="text-slate-600 text-[15px] leading-relaxed mb-6">
                    국비지원 과정 선택·일정·센터별 수강 문의는 온라인 상담 또는 유선으로 연락 주시면 안내해 드립니다.
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                    <a href="/online-consulting" class="inline-flex items-center justify-center rounded-xl bg-primary-600 text-white font-bold px-6 py-3.5 hover:bg-primary-700 transition shadow-sm">
                        <i class="fas fa-comments mr-2"></i> 온라인 상담 신청
                    </a>
                    <a href="/course-sessions" class="inline-flex items-center justify-center rounded-xl border-2 border-primary-200 bg-white text-primary-700 font-bold px-6 py-3.5 hover:border-primary-400 hover:bg-primary-50/80 transition">
                        과정 안내 보기
                    </a>
                </div>
            </section>
        </div>
    </main>

    ${footerHtml()}
</body>
</html>
`;
}
