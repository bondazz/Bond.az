import { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { translations, Locale } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import Script from 'next/script';
import InfiniteScroll from '@/components/InfiniteScroll';
import AdSlot from '@/components/AdSlot';
import '@/components/HeroSection.css'; // Reklam və layout stilləri üçün

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params;
    const author = await getAuthorBySlug(slug);

    if (!author) return {};

    const baseUrl = "https://bond.az";
    const authorUrl = `${baseUrl}/${lang}/author/${slug}`;
    const title = `${author.name} | Bond.az`;
    const description = lang === 'az'
        ? `${author.name} tərəfindən paylaşılan ən son araşdırmalar, xəbərlər və özəl təhlillər - Bond.az xəbər portalında.`
        : lang === 'ru'
            ? `Последние исследования, новости и эксклюзивный анализ от ${author.name} на новостном портале Bond.az.`
            : `The latest research, news, and exclusive analysis from ${author.name} on the Bond.az news portal.`;

    return {
        title,
        description,
        alternates: {
            canonical: authorUrl,
        },
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            noarchive: true,
        },
        openGraph: {
            title,
            description,
            url: authorUrl,
            siteName: "Bond.az",
            images: [
                {
                    url: author.avatar || `${baseUrl}/logo.png`,
                    width: 1200,
                    height: 630,
                    alt: author.name,
                },
            ],
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [author.avatar || `${baseUrl}/logo.png`],
        },
    };
}

async function getAuthorBySlug(slug: string) {
    const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
    if (error) return null;
    return data;
}

async function getPostsByAuthor(authorId: number, authorName: string, lang: string) {
    // Simplified query to avoid potential join issues
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`author_id.eq.${authorId},author.eq."${authorName}"`)
        .eq('lang', lang)
        .order('id', { ascending: false });

    if (error) {
        console.error('Fetch posts error:', error);
        return [];
    }

    return data.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        categorySlug: p.category_slug,
        image: p.image,
        summary: p.summary,
        date: p.date,
        lang: p.lang,
        author: p.author,
        authorAvatar: null, // Will use author data from page level
        authorJobTitle: null,
        authorSlug: null,
        likes: p.likes || 0,
        dislikes: p.dislikes || 0,
        views: p.views || 0,
        commonId: p.commonId || null
    }));
}

export default async function AuthorPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const author = await getAuthorBySlug(slug);

    if (!author) notFound();

    const rawPosts = await getPostsByAuthor(author.id, author.name, lang);
    const authorPosts = rawPosts.map(p => ({
        ...p,
        authorAvatar: author.avatar,
        authorJobTitle: author.job_title,
        authorSlug: author.slug
    }));
    const t = translations[lang as Locale] || translations.az;

    return (
        <main>
            <section className="hero-container">
                {/* Left Ads - Standardized with Home Page */}
                <aside className="side-ads left">
                    <AdSlot slotId="sidebar_left" width={160} height={600} className="ads-box" />
                </aside>

                <div className="hero-mid-wrapper">
                    {/* Author Profile - Refined Editorial Layout */}
                    <div className="relative w-full py-8 mb-16 overflow-visible border-b border-zinc-100 dark:border-zinc-800/50 pb-16">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">

                            {/* Left: Artistic Profile Image (Slightly Smaller) */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-4 bg-red-600/5 dark:bg-red-600/10 rounded-full blur-2xl -z-10 animate-pulse"></div>
                                <div className="relative w-44 h-44 md:w-56 md:h-56">
                                    <div
                                        className="brush-container drop-shadow-xl dark:drop-shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='f'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23f)'%3E%3Cpath fill='%23000' d='M10,10 L190,15 L185,190 L15,185 Z M10,10 C30,5 60,15 90,10 C120,5 150,15 190,10 C185,40 195,70 190,100 C195,130 185,160 190,190 C160,185 130,195 100,190 C70,195 40,185 15,190 C20,160 10,130 15,100 C10,70 20,40 10,10' /%3E%3Cpath fill='%23000' d='M5,20 L15,15 L25,25 L35,10 L50,20 L70,5 L90,25 L110,10 L130,30 L150,5 L170,25 L190,10 L195,40 L185,60 L198,80 L188,110 L195,140 L182,170 L192,195 L160,188 L130,198 L100,185 L70,195 L40,182 L15,195 L5,160 L18,130 L8,100 L15,70 L5,40 Z' /%3E%3C/g%3E%3C/svg%3E")`,
                                            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='f'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23f)'%3E%3Cpath fill='%23000' d='M10,10 L190,15 L185,190 L15,185 Z M10,10 C30,5 60,15 90,10 C120,5 150,15 190,10 C185,40 195,70 190,100 C195,130 185,160 190,190 C160,185 130,195 100,190 C70,195 40,185 15,190 C20,160 10,130 15,100 C10,70 20,40 10,10' /%3E%3Cpath fill='%23000' d='M5,20 L15,15 L25,25 L35,10 L50,20 L70,5 L90,25 L110,10 L130,30 L150,5 L170,25 L190,10 L195,40 L185,60 L198,80 L188,110 L195,140 L182,170 L192,195 L160,188 L130,198 L100,185 L70,195 L40,182 L15,195 L5,160 L18,130 L8,100 L15,70 L5,40 Z' /%3E%3C/g%3E%3C/svg%3E")`,
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskPosition: 'center',
                                            WebkitMaskPosition: 'center'
                                        }}
                                    >
                                        <Image
                                            src={author.avatar || "/placeholder-user.png"}
                                            alt={author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Bold Typography & Social Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-3 mb-3">
                                    <div className="h-[2px] w-6 bg-red-600"></div>
                                    <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">
                                        {author.role ? t[author.role.toLowerCase() as keyof typeof t] : (author.job_title || 'REDAKTOR')}
                                    </span>
                                </div>
                                <h1 className="author-title text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-4">
                                    {author.name}
                                </h1>

                                {/* Stats & Expertise */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-6 text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-900 dark:text-zinc-100">{authorPosts.length}</span>
                                        <span>{lang === 'az' ? 'YAZI' : lang === 'ru' ? 'СТАТЬИ' : 'ARTICLES'}</span>
                                    </div>
                                    {author.expertise && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                                            <span className="text-red-600">{author.expertise}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="author-bio max-w-2xl text-lg leading-relaxed font-medium mb-6">
                                    {author.bio || (lang === 'az' ? `${author.name} tərəfindən paylaşılan bütün xəbər və araşdırmalar bu bölmədə toplanıb.` :
                                        lang === 'ru' ? `Все новости и исследования, опубликованные ${author.name}, собраны в этом разделе.` :
                                            `All news and research published by ${author.name} are collected in this section.`)}
                                </p>

                                {/* Expertise Areas */}
                                {author.expertise_areas && Array.isArray(author.expertise_areas) && (
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                                        {author.expertise_areas.map((area: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-700">
                                                #{area}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Social Links with Mail */}
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <a href={`mailto:${author.email || 'info@bond.az'}`} className="group flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-red-600 dark:hover:bg-red-600 transition-all shadow-md">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Email</span>
                                    </a>
                                    {author.x_url && (
                                        <a href={author.x_url} target="_blank" rel="noopener" className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-red-600 dark:hover:bg-red-600 transition-all shadow-md">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                        </a>
                                    )}
                                    {author.linkedin_url && (
                                        <a href={author.linkedin_url} target="_blank" rel="noopener" className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-red-600 dark:hover:bg-red-600 transition-all shadow-md">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Background Floating Letter (Even more subtle) */}
                        <div className="absolute top-0 right-0 text-[10rem] md:text-[12rem] font-black text-zinc-100/30 dark:text-zinc-800/10 -z-20 pointer-events-none select-none leading-none">
                            {author.name.charAt(0)}
                        </div>

                        {/* Force Contrast Styles */}
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .author-title { color: #000000 !important; }
                            .dark .author-title { color: #ffffff !important; }
                            .author-bio { color: #111111 !important; }
                            .dark .author-bio { color: #e4e4e7 !important; }
                        ` }} />

                        {/* SEO Schemas (Reuters-Style) */}
                        <Script
                            id="author-schema"
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@graph": [
                                        {
                                            "@type": "Person",
                                            "@id": `https://bond.az/author/${author.slug}#person`,
                                            "identifier": author.email || `${author.slug}@bond.az`,
                                            "name": author.name,
                                            "givenName": author.given_name || author.name.split(' ')[0],
                                            "familyName": author.family_name || author.name.split(' ').slice(1).join(' '),
                                            "jobTitle": author.job_title || "Redaktor",
                                            "knowsAbout": author.expertise_areas || [author.expertise].filter(Boolean),
                                            "email": author.email || "info@bond.az",
                                            "image": {
                                                "@type": "ImageObject",
                                                "url": author.avatar || "https://bond.az/bond_logo_black.png"
                                            },
                                            "url": `https://bond.az/author/${author.slug}`,
                                            "description": author.bio || `${author.name} Bond.az saytında araşdırmaçı müəllifdir.`,
                                            "sameAs": [
                                                author.email ? `mailto:${author.email}` : null,
                                                author.facebook_url,
                                                author.instagram_url,
                                                author.x_url,
                                                author.linkedin_url
                                            ].filter(Boolean),
                                            "affiliation": {
                                                "@id": "https://bond.az/#organization"
                                            }
                                        },
                                        {
                                            "@type": "NewsMediaOrganization",
                                            "@id": "https://bond.az/#organization",
                                            "name": "Bond.az",
                                            "url": "https://bond.az",
                                            "logo": {
                                                "@type": "ImageObject",
                                                "url": "https://bond.az/bond_logo_black.png",
                                                "width": 512,
                                                "height": 512
                                            },
                                            "address": {
                                                "@type": "PostalAddress",
                                                "addressLocality": "Baku, Azerbaijan",
                                                "streetAddress": "Nizami str. 203"
                                            },
                                            "sameAs": [
                                                "https://www.facebook.com/bondxeber",
                                                "https://x.com/bondxeber",
                                                "https://www.instagram.com/bond.az"
                                            ],
                                            "publishingPrinciples": "https://bond.az/about",
                                            "ethicsPolicy": "https://bond.az/ethics",
                                            "correctionsPolicy": "https://bond.az/corrections",
                                            "verificationFactCheckingPolicy": "https://bond.az/fact-checking",
                                            "diversityPolicy": "https://bond.az/diversity"
                                        }
                                    ]
                                })
                            }}
                        />
                    </div>

                    {/* Posts Section */}
                    <div className="section-header mb-8">
                        <h2 className="section-title">
                            {lang === 'az' ? 'MÜƏLLİFİN YAZILARI' : lang === 'ru' ? 'СТАТЬИ АВТОРА' : 'AUTHOR POSTS'}
                        </h2>
                    </div>

                    {authorPosts.length > 0 ? (
                        <InfiniteScroll initialPosts={authorPosts} lang={lang} />
                    ) : (
                        <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl">
                            <p className="text-gray-400">Bu müəllif hələ xəbər paylaşmayıb.</p>
                        </div>
                    )}
                </div>

                {/* Right Ads - Standardized with Home Page */}
                <aside className="side-ads right">
                    <AdSlot slotId="sidebar_right" width={160} height={600} className="ads-box" />
                </aside>
            </section>
        </main>
    );
}
