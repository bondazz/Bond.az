import React from 'react';
import { translations, Locale } from '@/utils/translations';
import { Metadata } from 'next';
import Image from 'next/image';
import InfiniteScroll from '@/components/InfiniteScroll';
import { getPosts, getCategoryBySlug } from '@/utils/postFetcher';
import '@/components/HeroSection.css';
import Script from 'next/script';
import { ChevronRight, TrendingUp, Users, Tag, Clock } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string }> }): Promise<Metadata> {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/${category}` : `${siteUrl}/${lang}/${category}`;

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
        openGraph: { title, description, url: currentUrl, type: 'website', images: ['/bond_brand.webp'] },
        twitter: { card: 'summary_large_image', title, description, images: ['/bond_brand.webp'] }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, category: string }> }) {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    
    const dbCategory = await getCategoryBySlug(category, lang);
    const categoryPosts = await getPosts(lang, category);
    const trendingPosts = categoryPosts.slice(0, 5).sort((a, b) => (b.views || 0) - (a.views || 0));

    const staticInfo = (t.categories as any)?.[category] || { name: category.charAt(0).toUpperCase() + category.slice(1), desc: "" };
    const newsSuffix = lang === 'az' ? 'xəbərləri' : lang === 'ru' ? 'новости' : 'news';
    const rawTitle = dbCategory?.name || staticInfo.name;
    const displayTitle = lang === 'ru' ? `${newsSuffix.charAt(0).toUpperCase() + newsSuffix.slice(1)} ${rawTitle}` : `${rawTitle} ${newsSuffix}`;
    const displayDesc = dbCategory?.seo_description || staticInfo.desc;

    // Schema for Category Page
    const schemas: any[] = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${displayTitle} - Bond.az`,
            "description": displayDesc,
            "url": lang === 'az' ? `https://bond.az/${category}` : `https://bond.az/${lang}/${category}`,
            "publisher": { "@type": "Organization", "name": "Bond.az", "logo": { "@type": "ImageObject", "url": "https://bond.az/bond_logo_black.png" } }
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": t.home, "item": "https://bond.az" },
                { "@type": "ListItem", "position": 2, "name": rawTitle, "item": lang === 'az' ? `https://bond.az/${category}` : `https://bond.az/${lang}/${category}` }
            ]
        }
    ];

    if (dbCategory?.faq_data && Array.isArray(dbCategory.faq_data)) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": dbCategory.faq_data.map((item: any) => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
        });
    }

    // Mock subcategories if not in DB yet
    const subcats = lang === 'az' ? ['Banklar', 'Kriptovalyuta', 'Analiz', 'Vergilər'] : ['Banks', 'Crypto', 'Analysis', 'Taxes'];

    return (
        <main className="category-hub-root">
            <style dangerouslySetInnerHTML={{ __html: `
                .category-hub-root { --accent-color: #e11d48; --sidebar-w: 320px; }
                .breadcrumb-nav { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--meta-text); margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
                
                .subcat-chips { display: flex; gap: 8px; margin-bottom: 30px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
                .subcat-chips::-webkit-scrollbar { display: none; }
                .subcat-chip { padding: 6px 14px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 4px; font-size: 12px; font-weight: 700; color: var(--title-text); white-space: nowrap; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
                .subcat-chip:hover { border-color: var(--accent-color); color: var(--accent-color); }

                /* NEW 2-COLUMN LAYOUT: MAIN(3-COLS) + SIDEBAR */
                .hub-layout { display: flex; gap: 40px; align-items: flex-start; }
                .hub-main { flex: 1; min-width: 0; }
                .hub-sidebar { width: var(--sidebar-w); position: sticky; top: 100px; display: flex; flex-direction: column; gap: 40px; flex-shrink: 0; }
                
                /* 3-COLUMN GRID INSIDE MAIN */
                .category-news-grid .latest-posts-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 20px; 
                }

                .sidebar-block { border-top: 1px solid var(--title-text); padding-top: 20px; }
                .sidebar-title { font-size: 13px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; letter-spacing: 1px; }
                
                .trending-item-sidebar { display: flex; gap: 15px; margin-bottom: 18px; text-decoration: none; border-bottom: 1px solid var(--card-border); padding-bottom: 12px; }
                .trending-rank-sidebar { font-size: 20px; font-weight: 900; color: var(--card-border); line-height: 1; min-width: 25px; }
                .trending-text-sidebar { font-size: 14px; font-weight: 800; color: var(--title-text); line-height: 1.3; }
                
                .seo-intro-box { background: var(--bg-color); border-top: 1px solid var(--card-border); padding: 40px 0; margin-top: 60px; }
                .seo-intro-box h2 { font-size: 22px; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
                .seo-intro-content { font-size: 14px; line-height: 1.7; color: var(--meta-text); }
                
                @media (max-width: 1200px) {
                    .category-news-grid .latest-posts-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 1024px) {
                    .hub-layout { flex-direction: column; }
                    .hub-sidebar { width: 100%; position: static; }
                    .category-news-grid .latest-posts-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .category-news-grid .latest-posts-grid { grid-template-columns: 1fr; }
                }
            `}} />
            
            <Script id="category-schemas" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

            <section className="hero-container" style={{ paddingTop: '30px' }}>
                <div className="hero-mid-wrapper" style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    
                    <nav className="breadcrumb-nav">
                        <a href={`/${lang}`} style={{ color: 'inherit', textDecoration: 'none' }}>{t.home}</a>
                        <ChevronRight size={10} />
                        <span style={{ color: 'var(--title-text)' }}>{rawTitle}</span>
                    </nav>

                    <div className="hub-layout">
                        <div className="hub-main">
                            <header style={{ marginBottom: '35px' }}>
                                <h1 style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', margin: '0 0 15px 0', letterSpacing: '-2px', lineHeight: 0.9 }}>
                                    {displayTitle}
                                </h1>
                                <p style={{ fontSize: '16px', color: 'var(--meta-text)', lineHeight: '1.5', maxWidth: '800px', fontWeight: 500 }}>
                                    {displayDesc}
                                </p>
                            </header>

                            <div className="subcat-chips">
                                {subcats.map(sc => (
                                    <div key={sc} className="subcat-chip">{sc}</div>
                                ))}
                            </div>

                            <div className="category-news-grid">
                                <InfiniteScroll initialPosts={categoryPosts} lang={lang} categorySlug={category} showTimeline={false} isSmall={true} />
                            </div>

                            {/* SEO & FAQ MOVED HERE */}
                            {(dbCategory?.content || dbCategory?.faq_data) && (
                                <div className="seo-intro-box">
                                    {dbCategory?.content && (
                                        <>
                                            <h2>{rawTitle} {lang === 'az' ? 'haqqında dərindən analiz' : 'in-depth analysis'}</h2>
                                            <div className="seo-intro-content" dangerouslySetInnerHTML={{ __html: dbCategory.content }} />
                                        </>
                                    )}
                                    {dbCategory?.faq_data && Array.isArray(dbCategory.faq_data) && (
                                        <div style={{ marginTop: '40px', borderTop: '1px solid var(--card-border)', paddingTop: '30px' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', textTransform: 'uppercase' }}>{lang === 'az' ? 'Tez-tez Verilən Suallar' : 'FAQ'}</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {dbCategory.faq_data.map((item: any, i: number) => (
                                                    <details key={i} style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '15px' }}>
                                                        <summary style={{ fontWeight: 800, cursor: 'pointer', fontSize: '14px', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            {item.question}
                                                            <span style={{ fontSize: '18px', opacity: 0.5 }}>+</span>
                                                        </summary>
                                                        <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.6', color: 'var(--meta-text)' }}>{item.answer}</p>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <aside className="hub-sidebar">
                            {/* TRENDING */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title"><TrendingUp size={16} color="var(--accent-color)" /> {lang === 'az' ? 'Trend Xəbərlər' : 'Trending'}</h3>
                                {trendingPosts.slice(0, 6).map((post, idx) => (
                                    <a key={post.id} href={`/${lang}/${post.categorySlug}/${post.slug}`} className="trending-item-sidebar">
                                        <span className="trending-rank-sidebar">{idx + 1}</span>
                                        <span className="trending-text-sidebar">{post.title}</span>
                                    </a>
                                ))}
                            </div>

                            {/* TOP AUTHORS */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title"><Users size={16} /> {lang === 'az' ? 'Müəlliflər' : 'Authors'}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {Array.from(new Set(categoryPosts.map(p => p.author))).slice(0, 5).map((authorName, idx) => {
                                        const post = categoryPosts.find(p => p.author === authorName);
                                        return (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--card-border)', overflow: 'hidden' }}>
                                                    {post?.authorAvatar && <Image src={post.authorAvatar} alt="" width={36} height={36} />}
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 800 }}>{authorName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* TAGS */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title"><Tag size={16} /> {lang === 'az' ? 'Etiketlər' : 'Tags'}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {['iqtisadiyyat', 'analiz', 'reytinq', 'proqnoz', 'investisiya'].map(tag => (
                                        <span key={tag} style={{ padding: '4px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', fontSize: '11px', fontWeight: 700, borderRadius: '4px' }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="sidebar-block" style={{ border: 'none' }}>
                                <div style={{ background: 'var(--card-bg)', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--meta-text)', fontSize: '12px', border: '1px dashed var(--card-border)' }}>
                                    ADVERTISEMENT
                                </div>
                            </div>
                        </aside>
                    </div>

                    {categoryPosts.length === 0 && (
                        <div className="py-20 text-center text-slate-500">
                            <p>{t.noPosts}</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

