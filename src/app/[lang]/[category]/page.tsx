import React from 'react';
import { translations, Locale } from '@/utils/translations';
import { Metadata } from 'next';
import Image from 'next/image';
import InfiniteScroll from '@/components/InfiniteScroll';
import { getPosts, getCategoryBySlug } from '@/utils/postFetcher';
import '@/components/HeroSection.css';
import Script from 'next/script';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string }> }): Promise<Metadata> {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/${category}` : `${siteUrl}/${lang}/${category}`;

    // --- FETCH FROM DB ---
    const dbCategory = await getCategoryBySlug(category, lang);
    
    const staticInfo = (t.categories as any)?.[category] || { name: category.charAt(0).toUpperCase() + category.slice(1), desc: "" };
    
    const title = dbCategory?.seo_title || `${staticInfo.name} - Son Xəbərlər və Analizlər | Bond.az`;
    const description = dbCategory?.seo_description || staticInfo.desc || `${staticInfo.name} xəbərləri və ən son məlumatlar Bond.az saytında.`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: currentUrl,
            languages: {
                'az-AZ': `${siteUrl}/${category}`,
                'en-US': `${siteUrl}/en/${category}`,
                'ru-RU': `${siteUrl}/ru/${category}`,
            },
        },
        openGraph: {
            title: title,
            description: description,
            url: currentUrl,
            type: 'website',
            images: ['/bond_brand.webp'],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: ['/bond_brand.webp'],
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, category: string }> }) {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    
    // --- FETCH FROM DB ---
    const dbCategory = await getCategoryBySlug(category, lang);
    const categoryPosts = await getPosts(lang, category);

    const staticInfo = (t.categories as any)?.[category] || { name: category.charAt(0).toUpperCase() + category.slice(1), desc: "" };
    
    // --- LOCALIZED NEWS SUFFIX ---
    const newsSuffix = lang === 'az' ? 'xəbərləri' : lang === 'ru' ? 'новости' : 'news';
    const rawTitle = dbCategory?.name || staticInfo.name;
    const displayTitle = lang === 'ru' ? `${newsSuffix.charAt(0).toUpperCase() + newsSuffix.slice(1)} ${rawTitle}` : `${rawTitle} ${newsSuffix}`;
    const displayDesc = dbCategory?.seo_description || staticInfo.desc;

    // Schema for Category Page
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${displayTitle} - Bond.az`,
        "description": displayDesc,
        "url": lang === 'az' ? `https://bond.az/${category}` : `https://bond.az/${lang}/${category}`,
        "publisher": {
            "@type": "Organization",
            "name": "Bond.az",
            "logo": {
                "@type": "ImageObject",
                "url": "https://bond.az/bond_logo_black.png"
            }
        }
    };

    return (
        <main>
            <Script
                id="category-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <section className="hero-container" style={{ paddingTop: '40px' }}>
                {/* Left Ads */}
                <aside className="side-ads left">
                    <div className="ads-box placeholder-ads">
                        <Image src="/sidebar-ads.webp" alt="Sidebar Ad" width={160} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </aside>

                <div className="hero-mid-wrapper">
                    <div className="category-header-premium" style={{ marginBottom: '40px', borderBottom: '1px solid var(--card-border)', paddingBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <div style={{ width: '4px', height: '40px', backgroundColor: 'var(--accent-color)' }}></div>
                            <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', margin: 0, letterSpacing: '-1px' }}>
                                {displayTitle}
                            </h1>
                        </div>
                        <p style={{ fontSize: '16px', color: 'var(--meta-text)', maxWidth: '800px', lineHeight: '1.6', margin: '0 0 0 20px', fontWeight: '400' }}>
                            {displayDesc}
                        </p>
                    </div>

                    <InfiniteScroll initialPosts={categoryPosts} lang={lang} categorySlug={category} />

                    {/* --- DEEP-DIVE CATEGORY CONTENT (MOVED TO BOTTOM) --- */}
                    {dbCategory?.content && (
                        <div className="category-seo-content" style={{ 
                            marginTop: '60px', 
                            padding: '20px 0', 
                            borderTop: '1px solid var(--card-border)',
                            lineHeight: '1.6',
                            fontSize: '0.8rem',
                            color: 'var(--meta-text)',
                            opacity: 0.8
                        }} dangerouslySetInnerHTML={{ __html: dbCategory.content }} />
                    )}

                    {categoryPosts.length === 0 && (
                        <div className="py-20 text-center text-slate-500">
                            <p>{t.noPosts}</p>
                        </div>
                    )}
                </div>

                {/* Right Ads */}
                <aside className="side-ads right">
                    <div className="ads-box placeholder-ads">
                        <Image src="/sidebar-ads.webp" alt="Sidebar Ad" width={160} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </aside>
            </section>
        </main>
    );
}
