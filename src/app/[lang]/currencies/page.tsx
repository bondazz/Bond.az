import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { translations, Locale } from '@/utils/translations';
import { getCurrencyRates } from '@/utils/currencyFetcher';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { currencySEOContent } from '@/data/currencySEOContent';
import AdSlot from '@/components/AdSlot';
import '@/components/StaticPage.css'; // Reuse the static page styles
import './Currencies.css'; // Additional overrides if needed
import '@/components/HeroSection.css'; // Sidebars layout

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const t = translations[lang as Locale] || translations.az;
    
    const titles = {
        az: "Gündəlik Valyuta Məzənnələri - Canlı USD, EUR, RUB Kursları | Bond.az",
        ru: "Курсы валют на сегодня - Живой курс USD, EUR, RUB в Азербайджане | Bond.az",
        en: "Daily Currency Exchange Rates - Live USD, EUR, RUB in Azerbaijan | Bond.az"
    };

    const descriptions = {
        az: "Azərbaycan Mərkəzi Bankının (CBAR) rəsmi valyuta məzənnələrini canlı izləyin. Dollar, Avro, Rubl və digər valyutaların ən son kursları, arxiv və analizlər.",
        ru: "Следите за официальными курсами валют Центрального банка Азербайджана (ЦБА) в прямом эфире. Последние курсы доллара, евро, рубля и других валют.",
        en: "Follow the official exchange rates of the Central Bank of Azerbaijan (CBAR) live. Latest rates for Dollar, Euro, Ruble and other currencies."
    };

    return {
        title: titles[lang as Locale] || titles.az,
        description: descriptions[lang as Locale] || descriptions.az,
        alternates: {
            canonical: `https://bond.az/${lang}/currencies`,
            languages: {
                'az-AZ': 'https://bond.az/az/currencies',
                'ru-RU': 'https://bond.az/ru/currencies',
                'en-US': 'https://bond.az/en/currencies',
            },
        },
        openGraph: {
            title: titles[lang as Locale] || titles.az,
            description: descriptions[lang as Locale] || descriptions.az,
            url: `https://bond.az/${lang}/currencies`,
            type: 'website',
            images: [{ url: 'https://bond.az/assets/currencies-hero-exact.jpg' }]
        },
        twitter: {
            card: 'summary_large_image',
            title: titles[lang as Locale] || titles.az,
            description: descriptions[lang as Locale] || descriptions.az,
            images: ['https://bond.az/assets/currencies-hero-exact.jpg']
        }
    };
}

export default async function CurrenciesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = translations[lang as Locale] || translations.az;
    const seo = currencySEOContent[lang as Locale] || currencySEOContent.az;
    const initialRates = await getCurrencyRates();
    const currentDate = new Date().toLocaleDateString(lang === 'az' ? 'az-AZ' : lang === 'ru' ? 'ru-RU' : 'en-US');

    // Structured Data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": t.currencyRates,
        "description": seo.h2,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": initialRates.slice(0, 10).map((rate, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": `${rate.code} - ${rate.name}`,
                "description": `Current exchange rate for ${rate.code} is ${rate.rate} AZN`
            }))
        }
    };

    return (
        <div className="static-page-wrapper">
            <section className="hero-container">
                {/* Left Ads - Standardized with Home Page */}
                <aside className="side-ads left">
                    <AdSlot slotId="sidebar_left" width={160} height={600} className="ads-box" />
                </aside>

                <div className="hero-mid-wrapper">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                    <header className="static-hero-premium">
                        <div className="static-hero-bg">
                            <Image 
                                src="/assets/currencies-hero-exact.jpg" 
                                alt={t.currencyRates}
                                fill 
                                className="object-cover"
                                priority
                            />
                            <div className="static-hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--background) 95%)' }}></div>
                        </div>
                        <div className="hero-content">
                            <div className="hero-logo-wrapper">
                                {/* Standardized theme-aware logo switching */}
                                <div className="logo-wrapper">
                                    <Image 
                                        src="/bond_logo_white.png" 
                                        alt="Bond.az Logo" 
                                        width={140} 
                                        height={25}
                                        className="site-logo-img logo-dark-mode"
                                        priority
                                    />
                                    <Image 
                                        src="/bond_logo_black.png" 
                                        alt="Bond.az Logo" 
                                        width={140} 
                                        height={25}
                                        className="site-logo-img logo-light-mode"
                                        priority
                                    />
                                </div>
                            </div>
                            <h1 className="hero-title-premium">{t.currencyRates}</h1>
                            <p className="hero-subtitle">{t.lastUpdated}: {currentDate}</p>
                        </div>
                    </header>

                    <main className="static-body-container">
                        <div className="currencies-main-card">
                            <CurrencyDisplay initialRates={initialRates} lang={lang} />
                        </div>
                        
                        <div className="market-disclaimer premium-disclaimer">
                            <p>
                                <strong>{lang === 'az' ? 'Qeyd:' : lang === 'ru' ? 'Примечание:' : 'Note:'}</strong> {lang === 'az' ? 'Valyuta məzənnələri avtomatik yenilənir. Məlumatlar Azərbaycan Respublikası Mərkəzi Bankının (CBAR) rəsmi məlumatlarına əsaslanır. Bəzi banklarda alış-satış qiymətləri rəsmi məzənnədən fərqlənə bilər.' : lang === 'ru' ? 'Курсы валют обновляются автоматически. Данные основаны на официальной информации Центрального банка Азербайджанской Республики (ЦБА). Цены покупки и продажи в некоторых банках могут отличаться от официального курса.' : 'Currency exchange rates are updated automatically. Data is based on official information from the Central Bank of the Republic of Azerbaijan (CBAR). Buying and selling prices in some banks may differ from the official rate.'}
                            </p>
                        </div>

                        <div className="currency-seo-footer">
                            <h2>{seo.h2}</h2>
                            <div className="seo-rich-text" dangerouslySetInnerHTML={{ __html: seo.content }}></div>
                            <div className="seo-sub-headers">
                                <h3>{seo.h3}</h3>
                                <h4>{seo.h4}</h4>
                                <h5>{seo.h5}</h5>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Right Ads - Standardized with Home Page */}
                <aside className="side-ads right">
                    <AdSlot slotId="sidebar_right" width={160} height={600} className="ads-box" />
                </aside>
            </section>
        </div>
    );
}
