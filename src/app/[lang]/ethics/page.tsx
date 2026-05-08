import React from 'react';
import { Metadata } from 'next';
import { translations, Locale } from '@/utils/translations';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = "https://bond.az";
    
    const titles: Record<string, string> = {
        az: "Etika Siyasəti - Bond.az Redaksiya Prinsipləri",
        en: "Ethics Policy - Bond.az Editorial Principles",
        ru: "Этическая политика - Редакционные принципы Bond.az"
    };

    const descriptions: Record<string, string> = {
        az: "Bond.az-ın redaksiya fəaliyyətində tətbiq olunan etika qaydaları, dürüstlük və müstəqillik prinsipləri haqqında ətraflı məlumat.",
        en: "Detailed information about the ethical rules, integrity, and independence principles applied in Bond.az's editorial activities.",
        ru: "Подробная информация об этических правилах, принципах честности и независимости, применяемых в редакционной деятельности Bond.az."
    };

    return {
        title: titles[lang] || titles.az,
        description: descriptions[lang] || descriptions.az,
        alternates: {
            canonical: `${siteUrl}/${lang}/ethics`,
        }
    };
}

export default async function EthicsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = translations[lang as Locale] || translations.az;

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-8 bg-red-600"></div>
                        <span className="text-[12px] font-bold tracking-[0.3em] text-red-600 uppercase">
                            {lang === 'az' ? 'Redaksiya Standartları' : lang === 'ru' ? 'Редакционные стандарты' : 'Editorial Standards'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                        {lang === 'az' ? 'Etika Siyasəti' : lang === 'ru' ? 'Этическая политика' : 'Ethics Policy'}
                    </h1>
                </header>

                <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">1. Giriş</h2>
                        <p>
                            Bond.az olaraq biz peşəkar jurnalistikanın ən yüksək standartlarına sadiqik. Bizim əsas məqsədimiz oxucularımıza dürüst, qərəzsiz və yoxlanılmış məlumatlar təqdim etməkdir. Bu Etika Siyasəti redaksiya heyətimizin fəaliyyətini tənzimləyən əsas sənəddir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">2. Müstəqillik və Qərəzsizlik</h2>
                        <p>
                            Bond.az tamamilə müstəqil media resursudur. Bizim xəbərlərimiz heç bir siyasi qüvvənin, kommersiya qrupunun və ya şəxsi maraqların təsiri altında deyil. Jurnalistlərimiz hər hansı bir mövzunu işıqlandırarkən şəxsi qərəzlərdən uzaq durmalı və bütün tərəflərin mövqeyini əks etdirməlidir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">3. Maraqların Münaqişəsi</h2>
                        <p>
                            Redaksiya heyətinin üzvləri maraqların münaqişəsinə səbəb ola biləcək hər hansı bir fəaliyyətdən qaçmalıdırlar. Biz xəbər obyektlərindən hədiyyə, xüsusi imtiyaz və ya maddi vəsait qəbul etmirik. Sponsorlu məzmunlar hər zaman aydın şəkildə "Reklam" və ya "Sponsorlu" etiketi ilə qeyd olunur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">4. Mənbələrlə İş</h2>
                        <p>
                            Biz məlumatların dəqiqliyini təmin etmək üçün etibarlı mənbələrdən istifadə edirik. Məxfi mənbələrdən istifadə yalnız istisna hallarda, məlumatın ictimai əhəmiyyəti yüksək olduqda və digər yollarla əldə edilməsi mümkün olmadıqda icazə verilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">5. Plagiat və Müəllif Hüquqları</h2>
                        <p>
                            Bond.az-da plagiat qəti qadağandır. Digər mənbələrdən istifadə olunan hər bir məlumat, sitat və ya şəkil mütləq şəkildə müvafiq istinadla müşayiət olunmalıdır. Biz intellektual mülkiyyət hüquqlarına hörmətlə yanaşırıq.
                        </p>
                    </section>
                </article>

                <footer className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500">
                    <p>Son yenilənmə: 8 May 2026</p>
                </footer>
            </div>
        </main>
    );
}
