import React from 'react';
import SinglePost from '@/components/SinglePost';
import { getPostBySlug, getPosts, getRelatedPostsByCommonId } from '@/utils/postFetcher';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import InfiniteScroll from '@/components/InfiniteScroll';
import { translations, Locale } from '@/utils/translations';
import Image from 'next/image';
import '@/components/HeroSection.css'; // Reuse some layout styles

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string, slug: string }> }): Promise<Metadata> {
    const { lang, category, slug } = await params;
    const post = await getPostBySlug(slug, lang);
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/${category}/${slug}` : `${siteUrl}/${lang}/${category}/${slug}`;

    if (!post) return { title: 'Xəbər tapılmadı - Bond.az' };

    // Optimize title for Google (max 60-65 chars)
    const seoTitle = post.title.length > 65 ? post.title.substring(0, 62) + "..." : post.title;

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
        title: `${seoTitle} - Bond.az`,
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
    const allPosts = await getPosts(lang, undefined, 1, 15);
    const initialMorePosts = allPosts.filter(p => p.slug !== slug).slice(0, 10);

    return (
        <main>
            <section className="hero-container">
                {/* Left Ads */}
                <aside className="side-ads left">
                    <div className="ads-box placeholder-ads">
                        <Image src="/sidebar-ads.webp" alt="Sidebar Ad" width={160} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </aside>

                <div className="hero-mid-wrapper">
                    <SinglePost post={post} />
                    
                    {/* SEO: NewsArticle Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "NewsArticle",
                                "headline": post.title,
                                "image": [post.image],
                                "datePublished": post.date,
                                "dateModified": post.date,
                                "author": [{
                                    "@type": "Person",
                                    "name": post.author,
                                    "url": `https://bond.az/author/${post.authorSlug}`
                                }],
                                "publisher": {
                                    "@type": "NewsMediaOrganization",
                                    "name": "Bond.az",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://bond.az/logo.png",
                                        "width": 600,
                                        "height": 60
                                    }
                                },
                                "description": post.summary,
                                "mainEntityOfPage": {
                                    "@type": "WebPage",
                                    "@id": `https://bond.az/${lang}/${category}/${slug}`
                                },
                                "isAccessibleForFree": "http://schema.org/True"
                            })
                        }}
                    />

                    <div className="latest-news-section" style={{ marginTop: '60px' }}>
                        <div className="section-header">
                            <h2 className="section-title">
                                {lang === 'az' ? 'Ən Son Xəbərlər' : lang === 'ru' ? 'Последние новости' : 'Latest News'}
                            </h2>
                        </div>
                        <InfiniteScroll initialPosts={initialMorePosts} lang={lang} isSmall={true} />
                    </div>
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
