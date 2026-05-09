import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import '@/components/StaticPage.css';
import '@/components/HeroSection.css';

const factContent = {
    az: {
        title: "Fakt-yoxlama Siyasəti",
        subtitle: "İnformasiya Verifikasiyası üzrə Peşəkar Metodologiyamız",
        intro: "Bond.az olaraq bizim ən böyük missiyamız oxucularımızı dürüst və yoxlanılmış məlumatla təmin etməkdir. Bizim fakt-yoxlama prosesimiz Reuters-in verifikasiya standartlarına tam uyğundur.",
        sections: [
            {
                h2: "1. Verifikasiya Prosesinin Əsasları",
                content: `Hər bir məlumat dərc olunmazdan əvvəl 'çoxmərhələli yoxlama' süzgəcindən keçir. Biz hər bir iddianı rəsmi sənədlər və statistik məlumatlarla qarşılaşdırırıq.`
            },
            {
                h2: "2. Mənbələrin Etibarlılığı",
                content: `Biz rəsmi dövlət qurumları, beynəlxalq təşkilatlar və kimliyi təsdiqlənmiş şahidlərdən gələn məlumatları əsas götürürük.`
            }
        ]
    }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const content = (factContent as any)[lang] || factContent.az;
    return { title: `${content.title} - Bond.az`, description: content.intro };
}

export default async function FactCheckingPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const content = (factContent as any)[lang] || factContent.az;

    return (
        <div className="static-page-wrapper">
            <style dangerouslySetInnerHTML={{ __html: `
                .force-black { color: #000000 !important; }
                .dark .force-black { color: #ffffff !important; }
                .force-gray { color: #444444 !important; }
                .dark .force-gray { color: #bbbbbb !important; }
            `}} />
            
            <section className="hero-container max-w-[1440px] mx-auto flex gap-8 px-6 py-12">
                <aside className="side-ads left hidden xl:block w-[160px] shrink-0">
                    <div className="sticky top-32">
                        <AdSlot slotId="sidebar_left" width={160} height={600} />
                    </div>
                </aside>

                <div className="hero-mid-wrapper flex-grow max-w-[850px] mx-auto">
                    <header className="mb-10">
                        <h1 className="text-2xl md:text-3xl font-black mb-4 tracking-tight force-black">
                            {content.title}
                        </h1>
                        <p className="text-base font-bold force-gray">
                            {content.subtitle}
                        </p>
                    </header>

                    <main>
                        <div className="text-[16px] leading-relaxed mb-10 border-l-4 border-red-600 pl-8 font-medium force-black opacity-90">
                            {content.intro}
                        </div>

                        <div className="space-y-12">
                            {content.sections.map((section: any, idx: number) => (
                                <section key={idx}>
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-tight force-black">
                                        {section.h2}
                                    </h2>
                                    <div className="text-[15px] leading-relaxed font-normal force-black">
                                        {section.content.split('\n\n').map((paragraph: string, pIdx: number) => (
                                            <p key={pIdx} className="mb-4">{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </main>
                </div>

                <aside className="side-ads right hidden xl:block w-[160px] shrink-0">
                    <div className="sticky top-32">
                        <AdSlot slotId="sidebar_right" width={160} height={600} />
                    </div>
                </aside>
            </section>
        </div>
    );
}
