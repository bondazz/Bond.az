import React from 'react';
import { Metadata } from 'next';
import { translations, Locale } from '@/utils/translations';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = "https://bond.az";
    
    const titles: Record<string, string> = {
        az: "Düzəliş Siyasəti - Səhvlərin Düzəldilməsi Qaydaları",
        en: "Corrections Policy - Rules for Correcting Errors",
        ru: "Политика исправлений - Правила исправления ошибок"
    };

    return {
        title: titles[lang] || titles.az,
        description: "Bond.az-da dərc olunan xəbərlərdə yol verilən texniki və ya faktiki səhvlərin düzəldilməsi prosedurları haqqında məlumat.",
        alternates: {
            canonical: `${siteUrl}/${lang}/corrections`,
        }
    };
}

export default async function CorrectionsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-8 bg-red-600"></div>
                        <span className="text-[12px] font-bold tracking-[0.3em] text-red-600 uppercase">
                            Məsuliyyətli Jurnalistika
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                        Düzəliş Siyasəti
                    </h1>
                </header>

                <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Şəffaflıq və Dəqiqlik</h2>
                        <p>
                            Bond.az oxucularına ən dəqiq məlumatı çatdırmağa sadiqdir. Lakin sürətli xəbər dövriyyəsində bəzən texniki və ya faktiki səhvlərə yol verilə bilər. Bizim siyasətimiz bu səhvləri dərhal və şəffaf şəkildə düzəltməkdən ibarətdir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Düzəliş Proseduru</h2>
                        <p>
                            Xəbərdə əhəmiyyətli bir faktiki səhv aşkar edildikdə, məqalə yenilənir və mətnin sonunda (və ya başında) nəyin və nə vaxt düzəldildiyi barədə aydın qeyd yerləşdirilir. Kiçik orfoqrafik və ya qrammatik səhvlər isə xüsusi qeyd olmadan düzəldilə bilər.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Səhvlər Barədə Bildiriş</h2>
                        <p>
                            Əgər saytımızda hər hansı bir səhv aşkar etmisinizsə, zəhmət olmasa bizimlə <strong>info@bond.az</strong> e-poçt ünvanı vasitəsilə əlaqə saxlayın. Daxil olan hər bir müraciət redaksiya heyəti tərəfindən ciddi şəkildə araşdırılır.
                        </p>
                    </section>
                </article>
            </div>
        </main>
    );
}
