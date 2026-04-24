import React from 'react';
import { posts } from '@/data/posts';
import { translations, Locale } from '@/utils/translations';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, category: string }> }): Promise<Metadata> {
    const { lang, category } = await params;
    const siteUrl = "https://bond.az";
    const currentUrl = lang === 'az' ? `${siteUrl}/${category}` : `${siteUrl}/${lang}/${category}`;

    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${categoryName} - Bond.az`,
        description: `${categoryName} xəbərləri və ən son məlumatlar Bond.az saytında.`,
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
            description: `${categoryName} xəbərləri - Bond.az`,
            url: currentUrl,
            type: 'website',
        }
    };
}

import { getPosts } from '@/utils/postFetcher';

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, category: string }> }) {
    const { lang, category } = await params;
    const t = translations[lang as Locale] || translations.az;
    const categoryPosts = await getPosts(lang, category);

    const getLocalizedPath = (path: string) => {
        if (lang === 'az') return path;
        return `/${lang}${path === '/' ? '' : path}`;
    };

    return (
        <main className="category-page max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-black uppercase mb-10 border-b-4 border-red-600 inline-block pb-2">
                {category} {lang === 'az' ? 'Xəbərləri' : lang === 'ru' ? 'Новости' : 'News'}
            </h1>

            <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {categoryPosts.map(post => (
                    <Link key={post.id} href={getLocalizedPath(`/${post.categorySlug}/${post.slug}`)} className="group">
                        <div className="relative overflow-hidden rounded-2xl aspect-[16/10] mb-5">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h2 className="text-xl font-bold leading-tight group-hover:text-red-600 transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 line-clamp-2">
                            {post.summary}
                        </p>
                    </Link>
                ))}
            </div>

            {categoryPosts.length === 0 && (
                <div className="py-20 text-center text-slate-500">
                    <p>{t.noPosts}</p>
                </div>
            )}
        </main>
    );
}
