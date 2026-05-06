import { Metadata } from 'next';
import React from 'react';
import { translations, Locale } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import AdSlot from '@/components/AdSlot';
import '@/components/HeroSection.css';
import '@/components/AuthorsList.css';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const t = translations[lang as Locale] || translations.az;

    const baseUrl = "https://bond.az";
    const title = `${t.authors} | Bond.az`;
    const description = lang === 'az'
        ? "Bond.az xəbər portalının peşəkar müəllif heyəti və redaktorları ilə tanış olun. Ən son araşdırmalar və özəl təhlillər."
        : lang === 'ru'
            ? "Познакомьтесь с профессиональной командой авторов и редакторов новостного портала Bond.az. Последние исследования и эксклюзивный анализ."
            : "Meet the professional editorial team and authors of the Bond.az news portal. Latest research and exclusive analysis.";

    const ogUrl = lang === 'az' ? `${baseUrl}/authors` : `${baseUrl}/${lang}/authors`;

    return {
        title,
        description,
        alternates: {
            canonical: ogUrl,
        },
        openGraph: {
            title,
            description,
            url: ogUrl,
            siteName: "Bond.az",
            images: [
                {
                    url: `${baseUrl}/bond_logo_black.png`,
                    width: 1200,
                    height: 630,
                    alt: t.authors,
                },
            ],
            type: "website",
            locale: lang === 'az' ? 'az_AZ' : lang === 'ru' ? 'ru_RU' : 'en_US',
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${baseUrl}/bond_logo_black.png`],
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

async function getAllAuthors(lang: string) {
    const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('lang', lang)
        .order('name', { ascending: true });
    
    if (error) return [];
    return data;
}

export default async function AuthorsListPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const authors = await getAllAuthors(lang);
    const t = translations[lang as Locale] || translations.az;

    const getAuthorUrl = (slug: string) => {
        if (lang === 'az') return `/author/${slug}`;
        return `/${lang}/author/${slug}`;
    };

    // Schema.org ItemList for Authors
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t.authors,
        "description": "List of Bond.az professional authors and editors",
        "numberOfItems": authors.length,
        "itemListElement": authors.map((author, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Person",
                "name": author.name,
                "jobTitle": author.job_title || "Redaktor",
                "url": `https://bond.az${getAuthorUrl(author.slug)}`,
                "image": author.avatar || "https://bond.az/placeholder-user.png",
                "affiliation": {
                    "@type": "Organization",
                    "name": "Bond.az",
                    "url": "https://bond.az"
                }
            }
        }))
    };

    return (
        <main>
            <section className="hero-container">
                {/* Left Ads - Standardized with Home Page */}
                <aside className="side-ads left">
                    <AdSlot slotId="sidebar_left" width={160} height={600} className="ads-box" />
                </aside>

                <div className="hero-mid-wrapper">
                    <div className="authors-page-wrapper">
                        <header className="authors-header-premium">
                            <div className="authors-hero-bg">
                                <Image 
                                    src="/authors-hero-bg.webp" 
                                    alt="Bond.az Müəllifləri və Redaktor Heyəti" 
                                    title="Bond.az Müəllifləri"
                                    fill 
                                    className="object-cover"
                                    priority
                                />
                                <div className="authors-hero-overlay"></div>
                            </div>
                            <h1 className="authors-title-premium">{t.authors}</h1>
                        </header>

                        <div className="authors-list">
                            {authors.map((author) => (
                                <Link 
                                    key={author.id} 
                                    href={getAuthorUrl(author.slug)}
                                    className="author-list-card"
                                    data-initial={author.name.charAt(0)}
                                >
                                    <div className="author-list-avatar">
                                        <Image 
                                            src={author.avatar || "/placeholder-user.png"} 
                                            alt={author.name}
                                            title={author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="author-list-info">
                                        <span className="author-list-name">{author.name}</span>
                                    </div>
                                    <div className="author-list-arrow">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}


                            {authors.length === 0 && (
                                <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl">
                                    <p className="text-gray-400">{t.noAuthorsFound}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Ads - Standardized with Home Page */}
                <aside className="side-ads right">
                    <AdSlot slotId="sidebar_right" width={160} height={600} className="ads-box" />
                </aside>
            </section>

            {/* SEO Schema */}
            <Script
                id="authors-list-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
        </main>
    );
}
