import React from 'react';
import { translations, Locale } from '@/utils/translations';
import { Metadata } from 'next';
import Image from 'next/image';
import InfiniteScroll from '@/components/InfiniteScroll';
import { getPostsByTag, getTagBySlug } from '@/utils/postFetcher';
import AdSlot from '@/components/AdSlot';
import '@/components/HeroSection.css';
import Script from 'next/script';
import { ChevronRight, TrendingUp, Users, Tag, Clock } from 'lucide-react';

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
        <main className="entity-hub-root">
            <style dangerouslySetInnerHTML={{ __html: `
                .entity-hub-root { --accent-color: #ed2127; }
                .breadcrumb-nav { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--meta-text); margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
                
                .hub-layout { display: flex; gap: 40px; align-items: flex-start; }
                .hub-main { flex: 1; min-width: 0; }
                .hub-sidebar { width: 320px; position: sticky; top: 100px; display: flex; flex-direction: column; gap: 30px; flex-shrink: 0; }

                /* 3-COLUMN GRID */
                .tag-news-grid .latest-posts-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 20px; 
                }

                /* MATCH CATEGORY SIDEBAR STYLE */
                .sidebar-block { border-top: 1px solid var(--title-text); padding-top: 15px; }
                .sidebar-title { font-size: 12px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; color: var(--title-text); }
                
                .trending-item-mini { display: flex; gap: 10px; margin-bottom: 12px; text-decoration: none; border-bottom: 1px solid var(--card-border); padding-bottom: 8px; }
                .trending-rank-mini { font-size: 16px; font-weight: 900; color: var(--card-border); line-height: 1; min-width: 20px; }
                .trending-text-mini { font-size: 13px; font-weight: 700; color: var(--title-text); line-height: 1.2; }

                .seo-intro-box { background: var(--bg-color); border-top: 1px solid var(--card-border); padding: 40px 0; margin-top: 60px; }
                .seo-intro-box h2 { font-size: 20px; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
                .seo-intro-content { font-size: 14px; line-height: 1.7; color: var(--meta-text); }
                
                @media (max-width: 1200px) {
                    .tag-news-grid .latest-posts-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 1024px) {
                    .hub-layout { flex-direction: column; }
                    .hub-sidebar { width: 100%; position: static; }
                }
                @media (max-width: 640px) {
                    .tag-news-grid .latest-posts-grid { grid-template-columns: 1fr; }
                }
            `}} />
            
            <Script id="tag-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <section className="hero-container" style={{ paddingTop: '30px' }}>
                <div className="hero-mid-wrapper" style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    
                    <nav className="breadcrumb-nav">
                        <a href={`/${lang}`} style={{ color: 'inherit', textDecoration: 'none' }}>{t.home}</a>
                        <ChevronRight size={10} />
                        <span style={{ color: 'var(--meta-text)' }}>TAGS</span>
                        <ChevronRight size={10} />
                        <span style={{ color: 'var(--title-text)' }}>{displayTitle}</span>
                    </nav>

                    <div className="hub-layout">
                        <div className="hub-main">
                            <header style={{ marginBottom: '35px' }}>
                                <h1 style={{ fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', margin: '0 0 10px 0', letterSpacing: '-2px', lineHeight: 0.9 }}>
                                    #{displayTitle}
                                </h1>
                                <p style={{ fontSize: '15px', color: 'var(--meta-text)', lineHeight: '1.5', maxWidth: '800px' }}>
                                    {dbTag?.summary || displayDesc}
                                </p>
                            </header>

                            <div className="tag-news-grid">
                                <InfiniteScroll initialPosts={tagPosts} lang={lang} tag={decodedTag} showTimeline={false} isSmall={true} />
                            </div>

                            {(dbTag?.content || dbTag?.faq_data) && (
                                <div className="seo-intro-box">
                                    {dbTag?.content && (
                                        <>
                                            <h2>{displayTitle} {lang === 'az' ? 'haqqında dərindən analiz' : 'in-depth analysis'}</h2>
                                            <div className="seo-intro-content" dangerouslySetInnerHTML={{ __html: dbTag.content }} />
                                        </>
                                    )}
                                    {dbTag?.faq_data && Array.isArray(dbTag.faq_data) && (
                                        <div style={{ marginTop: '40px', borderTop: '1px solid var(--card-border)', paddingTop: '30px' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', textTransform: 'uppercase' }}>{lang === 'az' ? 'Tez-tez Verilən Suallar' : 'FAQ'}</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {dbTag.faq_data.map((item: any, i: number) => (
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
                            {/* MATCHING CATEGORY SIDEBAR: TRENDING */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title"><TrendingUp size={14} color="var(--accent-color)" /> Trend xəbərlər</h3>
                                {tagPosts.slice(0, 5).map((post, idx) => (
                                    <a key={post.id} href={`/${lang}/${post.categorySlug}/${post.slug}`} className="trending-item-mini">
                                        <span className="trending-rank-mini">{idx + 1}</span>
                                        <span className="trending-text-mini">{post.title}</span>
                                    </a>
                                ))}
                            </div>

                            {/* MATCHING CATEGORY SIDEBAR: AUTHORS */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title"><Users size={14} /> Müəlliflər</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {Array.from(new Set(tagPosts.map(p => p.author))).slice(0, 4).map((authorName, idx) => {
                                        const post = tagPosts.find(p => p.author === authorName);
                                        return (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--card-border)', overflow: 'hidden' }}>
                                                    {post?.authorAvatar && <Image src={post.authorAvatar} alt="" width={24} height={24} />}
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 700 }}>{authorName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* MATCHING CATEGORY SIDEBAR: RELATED SEARCHES (FIXED) */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title">Əlaqəli axtarışlar</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        `${displayTitle} son xəbərləri`, 
                                        `${displayTitle} fəaliyyəti`, 
                                        `${displayTitle} haqqında analiz`
                                    ].map(s => (
                                        <a key={s} href="#" style={{ fontSize: '12px', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 700 }}>• {s}</a>
                                    ))}
                                </div>
                            </div>

                            {/* MATCHING CATEGORY SIDEBAR: TAGS */}
                            <div className="sidebar-block">
                                <h3 className="sidebar-title"><Tag size={14} /> Etiketlər</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {['iqtisadiyyat', 'analiz', 'reytinq', 'proqnoz'].map(tag => (
                                        <span key={tag} style={{ padding: '2px 8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', fontSize: '10px', fontWeight: 700, borderRadius: '2px' }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: 'var(--card-bg)', height: '250px', border: '1px dashed var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--meta-text)', fontSize: '12px' }}>
                                ADVERTISEMENT
                            </div>
                        </aside>
                    </div>

                    {tagPosts.length === 0 && (
                        <div className="py-20 text-center text-slate-500">
                            <p>{t.noPosts}</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
