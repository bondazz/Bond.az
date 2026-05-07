import React from 'react';
import { translations, Locale } from '@/utils/translations';
import { Metadata } from 'next';
import Image from 'next/image';
import InfiniteScroll from '@/components/InfiniteScroll';
import { getPostsByTag, getTagBySlug } from '@/utils/postFetcher';
import AdSlot from '@/components/AdSlot';
import '@/components/HeroSection.css';
import Script from 'next/script';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params;
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/tag/${slug}` : `${siteUrl}/${lang}/tag/${slug}`;

    // --- FETCH FROM DB ---
    const dbTag = await getTagBySlug(slug, lang);
    const decodedTag = dbTag?.name || decodeURIComponent(slug);

    const title = dbTag?.seo_title || `#${decodedTag} - Son Xəbərlər və Analizlər | Bond.az`;
    const description = dbTag?.seo_desc || `${decodedTag} haqqında ən son xəbərlər, araşdırmalar və analitik materiallar Bond.az saytında.`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: currentUrl,
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

export default async function TagPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const t = translations[lang as Locale] || translations.az;
    
    // --- FETCH FROM DB ---
    const dbTag = await getTagBySlug(slug, lang);
    const decodedTag = dbTag?.name || decodeURIComponent(slug);
    
    // We fetch posts that contain this tag/slug in title or content
    const tagPosts = await getPostsByTag(decodedTag, lang);

    const displayTitle = dbTag?.name || decodedTag;
    const displayDesc = dbTag?.seo_desc || (lang === 'az' ? `${decodedTag} mövzusunda ən son xəbərlər və maraqlı məlumatlar.` : 
                         lang === 'ru' ? `Последние новости и интересная информация по теме ${decodedTag}.` : 
                         `Latest news and interesting information about ${decodedTag}.`);

    // Schema for Tag Page
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `#${displayTitle} - Bond.az`,
        "description": displayDesc,
        "url": lang === 'az' ? `https://bond.az/tag/${slug}` : `https://bond.az/${lang}/tag/${slug}`,
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
                id="tag-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <section className="hero-container" style={{ paddingTop: '40px' }}>
                {/* Left Ads */}
                <aside className="side-ads left">
                    <AdSlot slotId="sidebar_left" width={160} height={600} className="ads-box" />
                </aside>

                <div className="hero-mid-wrapper">
                    <div className="category-header-premium" style={{ marginBottom: '40px', borderBottom: '2px solid var(--card-border)', paddingBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <div style={{ width: '4px', height: '40px', backgroundColor: 'var(--accent-color)' }}></div>
                            <h1 style={{ fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', margin: 0, letterSpacing: '-1.5px' }}>
                                #{displayTitle}
                            </h1>
                        </div>
                        <p style={{ fontSize: '18px', color: 'var(--meta-text)', maxWidth: '800px', lineHeight: '1.6', margin: '0 0 0 20px' }}>
                            {displayDesc}
                        </p>
                    </div>

                    {/* --- DEEP-DIVE TAG CONTENT --- */}
                    {dbTag?.content && (
                        <div className="tag-seo-content" style={{ 
                            marginBottom: '40px', 
                            padding: '30px', 
                            background: 'var(--header-bottom-bg)', 
                            borderRadius: '12px',
                            border: '1px solid var(--card-border)',
                            lineHeight: '1.8',
                            fontSize: '16px'
                        }} dangerouslySetInnerHTML={{ __html: dbTag.content }} />
                    )}

                    <InfiniteScroll initialPosts={tagPosts} lang={lang} tag={decodedTag} />

                    {tagPosts.length === 0 && (
                        <div className="py-20 text-center text-slate-500">
                            <p>{t.noPosts}</p>
                        </div>
                    )}
                </div>

                {/* Right Ads */}
                <aside className="side-ads right">
                    <AdSlot slotId="sidebar_right" width={160} height={600} className="ads-box" />
                </aside>
            </section>
        </main>
    );
}
