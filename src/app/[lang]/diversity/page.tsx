import React from 'react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: "Müxtəliflik Siyasəti - Bond.az",
        description: "Bond.az-ın iş mühitində və xəbər istehsalında müxtəliflik, bərabərlik və inklüzivlik prinsipləri.",
        alternates: {
            canonical: `https://bond.az/${lang}/diversity`,
        }
    };
}

export default async function DiversityPage({ params }: { params: Promise<{ lang: string }> }) {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-8 bg-red-600"></div>
                        <span className="text-[12px] font-bold tracking-[0.3em] text-red-600 uppercase">
                            Bərabər İmkanlar
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                        Müxtəliflik Siyasəti
                    </h1>
                </header>

                <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Bizim Baxışımız</h2>
                        <p>
                            Bond.az müxtəlifliyin cəmiyyətin və jurnalistikanın ən böyük zənginliyi olduğuna inanır. Bizim redaksiyamız fərqli baxış bucaqlarını, təcrübələri və səsləri birləşdirən bir məkandır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">İş Mühiti və İnklüzivlik</h2>
                        <p>
                            Biz irqindən, etnik mənsubiyyətindən, cinsindən, dinindən, yaşından və ya fiziki imkanlarından asılı olmayaraq hər kəs üçün bərabər imkanlar yaradırıq. Bond.az-da işə qəbul və karyera inkişafı yalnız fərdi bacarıqlara və peşəkarlığa əsaslanır.
                        </p>
                    </section>
                </article>
            </div>
        </main>
    );
}
