import React from 'react';
import SinglePost from '@/components/SinglePost';
import { getPostBySlug, getPosts } from '@/utils/postFetcher';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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
        const allPosts = await getPosts();
        const relatedPosts = allPosts.filter(p => p.commonId === post.commonId);
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

    return (
        <main>
            <SinglePost post={post} />
        </main>
    );
}
