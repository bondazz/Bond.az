import React from 'react';
import SinglePost from '@/components/SinglePost';
import { getPostBySlug, getPosts, getRelatedPostsByCommonId } from '@/utils/postFetcher';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import InfiniteScroll from '@/components/InfiniteScroll';
import { translations, Locale } from '@/utils/translations';
import Image from 'next/image';
import Script from 'next/script';
import AdSlot from '@/components/AdSlot';
import SectionDivider from '@/components/SectionDivider';
import '@/components/HeroSection.css'; // Reuse some layout styles

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string, slug: string }> }): Promise<Metadata> {
    const { lang, category, slug } = await params;
    const post = await getPostBySlug(slug, lang);
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/${category}/${slug}` : `${siteUrl}/${lang}/${category}/${slug}`;

    if (!post) return { title: 'Xəbər tapılmadı - Bond.az' };

    // Optimize title for Google (max 60-65 chars)
    const seoTitle = post.seo_title || (post.title.length > 65 ? post.title.substring(0, 62) + "..." : `${post.title} | Bond.az`);

    const alternates: Record<string, string> = {};
    if (post.commonId) {
        const relatedPosts = await getRelatedPostsByCommonId(post.commonId);
        relatedPosts.forEach(rp => {
            const prefix = rp.lang === 'az' ? '' : `/${rp.lang}`;
            const locale = rp.lang === 'az' ? 'az-AZ' : rp.lang === 'ru' ? 'ru-RU' : 'en-US';
            alternates[locale] = `${siteUrl}${prefix}/${rp.categorySlug}/${rp.slug}`;
        });
    }

    return {
        title: seoTitle,
        description: post.summary.substring(0, 160),
        alternates: {
            canonical: currentUrl,
            languages: alternates,
        },
        openGraph: {
            title: post.title,
            description: post.summary,
            url: currentUrl,
            siteName: 'Bond.az',
            locale: lang === 'az' ? 'az_AZ' : lang === 'ru' ? 'ru_RU' : 'en_US',
            type: 'article',
            publishedTime: post.date,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [post.image],
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export async function generateStaticParams() {
    const allPosts = await getPosts();
    return allPosts.map((post) => ({
        lang: post.lang,
        category: post.categorySlug,
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: { params: Promise<{ lang: string, category: string, slug: string }> }) {
    const { lang, category, slug } = await params;
    const post = await getPostBySlug(slug, lang);

    if (!post || post.categorySlug !== category) {
        notFound();
    }

    const t = translations[lang as Locale] || translations.az;
    // Fetch posts strictly from the same category
    const categoryPosts = await getPosts(lang, category, 1, 15);
    const initialMorePosts = categoryPosts.filter(p => p.slug !== slug).slice(0, 12);

    return (
        <main>
            <section className="hero-container">
                {/* Left Ads */}
                <aside className="side-ads left">
                    <AdSlot slotId="sidebar_left" width={160} height={600} className="ads-box" />
                </aside>

                <div className="hero-mid-wrapper">
                    <SinglePost post={post} />

                    {/* SEO: NewsArticle Schema */}
                    <Script
                        id="post-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "NewsArticle",
                                "headline": post.title,
                                "image": [
                                    {
                                        "@type": "ImageObject",
                                        "url": post.image,
                                        "width": 1200,
                                        "height": 630
                                    }
                                ],
                                "datePublished": post.date,
                                "dateModified": post.updated_at || post.date,
                                "author": [{
                                    "@type": "Person",
                                    "name": post.author,
                                    "url": `https://bond.az/author/${post.authorSlug}`
                                }],
                                "publisher": {
                                    "@type": ["NewsMediaOrganization", "Organization"],
                                    "name": "Bond.az",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://bond.az/bond_logo_black.png",
                                        "width": 600,
                                        "height": 60
                                    }
                                },
                                "description": post.summary,
                                "video": {
                                    "@type": "VideoObject",
                                    "name": post.title,
                                    "description": post.summary,
                                    "thumbnailUrl": [post.image],
                                    "uploadDate": post.date,
                                    "contentUrl": `https://bond.az/${lang}/${category}/${slug}`
                                },
                                "mainEntityOfPage": {
                                    "@type": "WebPage",
                                    "@id": `https://bond.az/${lang}/${category}/${slug}`
                                },
                                "isAccessibleForFree": "http://schema.org/True"
                            })
                        }}
                    />

                    {/* SEO: Breadcrumb Schema */}
                    <Script
                        id="breadcrumb-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": t.home,
                                        "item": `https://bond.az/${lang}`
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": post.category,
                                        "item": `https://bond.az/${lang}/${category}`
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 3,
                                        "name": post.title,
                                        "item": `https://bond.az/${lang}/${category}/${slug}`
                                    }
                                ]
                            })
                        }}
                    />

                    <SectionDivider title={lang === 'az' ? 'Digər Xəbərlər' : lang === 'ru' ? 'Другие новости' : 'More News'} />

                    <div className="latest-news-section" style={{ marginTop: '30px' }}>
                        <InfiniteScroll initialPosts={initialMorePosts} lang={lang} categorySlug={category} isSmall={true} />
                    </div>
                </div>

                {/* Right Ads */}
                <aside className="side-ads right">
                    <AdSlot slotId="sidebar_right" width={160} height={600} className="ads-box" />
                </aside>
            </section>
        </main>
    );
}
