import React from 'react';
import { translations, Locale } from '@/utils/translations';
import { Metadata } from 'next';
import Image from 'next/image';
import InfiniteScroll from '@/components/InfiniteScroll';
import { getPosts } from '@/utils/postFetcher';
import '@/components/HeroSection.css';
import Script from 'next/script';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string }> }): Promise<Metadata> {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/${category}` : `${siteUrl}/${lang}/${category}`;

    const catInfo = (t.categories as any)?.[category] || { name: category.charAt(0).toUpperCase() + category.slice(1), desc: "" };
    const categoryName = catInfo.name;
    const categoryDesc = catInfo.desc || `${categoryName} xəbərləri və ən son məlumatlar Bond.az saytında.`;

    return {
        title: `${categoryName} - Son Xəbərlər və Analizlər | Bond.az`,
        description: categoryDesc,
        alternates: {
            canonical: currentUrl,
            languages: {
                'az-AZ': `${siteUrl}/${category}`,
                'en-US': `${siteUrl}/en/${category}`,
                'ru-RU': `${siteUrl}/ru/${category}`,
            },
        },
        openGraph: {
            title: `${categoryName} - Bond.az`,
            description: categoryDesc,
            url: currentUrl,
            type: 'website',
            images: ['/bond_brand.webp'],
        },
        twitter: {
            card: 'summary_large_image',
            images: ['/bond_brand.webp'],
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, category: string }> }) {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    const categoryPosts = await getPosts(lang, category);

    const catInfo = (t.categories as any)?.[category] || { name: category.charAt(0).toUpperCase() + category.slice(1), desc: "" };

    // Schema for Category Page
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${catInfo.name} - Bond.az`,
        "description": catInfo.desc,
        "url": lang === 'az' ? `https://bond.az/${category}` : `https://bond.az/${lang}/${category}`,
        "publisher": {
            "@type": "Organization",
            "name": "Bond.az",
            "logo": {
                "@type": "ImageObject",
                "url": "https://bond.az/bond_logo_black.webp"
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
                    <div className="category-header-premium" style={{ marginBottom: '40px', borderBottom: '2px solid var(--card-border)', paddingBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <div style={{ width: '4px', height: '40px', backgroundColor: 'var(--accent-color)' }}></div>
                            <h1 style={{ fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', margin: 0, letterSpacing: '-1.5px' }}>
                                {catInfo.name}
                            </h1>
                        </div>
                        <p style={{ fontSize: '18px', color: 'var(--meta-text)', maxWidth: '800px', lineHeight: '1.6', margin: '0 0 0 20px' }}>
                            {catInfo.desc}
                        </p>
                    </div>
                    
                    <InfiniteScroll initialPosts={categoryPosts} lang={lang} categorySlug={category} />

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
