import React from 'react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: "Fakt-yoxlama Siyasəti - Bond.az",
        description: "Bond.az-da xəbərlərin doğruluğunun yoxlanılması metodologiyası və prosedurları.",
        alternates: {
            canonical: `https://bond.az/${lang}/fact-checking`,
        }
    };
}

export default async function FactCheckingPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-8 bg-red-600"></div>
                        <span className="text-[12px] font-bold tracking-[0.3em] text-red-600 uppercase">
                            Yoxlanılmış Məlumat
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                        Fakt-yoxlama Siyasəti
                    </h1>
                </header>

                <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Metodologiyamız</h2>
                        <p>
                            Dəqiqlik bizim ən böyük dəyərimizdir. Bond.az-da hər bir xəbər dərc olunmazdan əvvəl ən azı iki müstəqil mənbə tərəfindən təsdiqlənməlidir. Biz rəsmi sənədlərə, ekspert rəylərinə və hadisə yerindən birbaşa məlumatlara üstünlük veririk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Yoxlama Proseduru</h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>İlkin məlumatın mənbəyi və etibarlılığı yoxlanılır.</li>
                            <li>Statistik məlumatlar rəsmi dövlət və ya beynəlxalq hesabatlarla müqayisə edilir.</li>
                            <li>Foto və video materialların saxta (deepfake) və ya köhnə olub-olmaması texniki üsullarla yoxlanılır.</li>
                            <li>Xəbər subyektlərinin cavab hüququ təmin edilir və onların rəsmi mövqeyi xəbərə əlavə olunur.</li>
                        </ul>
                    </section>
                </article>
            </div>
        </main>
    );
}
