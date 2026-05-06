import React from 'react';
import './HeroSection.css';
import { getPosts } from '@/utils/postFetcher';
import PostCard from './PostCard';
import InfiniteScroll from './InfiniteScroll';
import Image from 'next/image';
import Link from 'next/link';
import AdSlot from './AdSlot';
import SectionDivider from './SectionDivider';

const HeroSection = async ({ lang: propLang }: { lang?: string }) => {
    const lang = propLang || 'az';
    
    // Server-side fetch: Page 1, Limit 15 (Reduced for mobile performance)
    const allPosts = await getPosts(lang, undefined, 1, 15);
    
    const heroPosts = allPosts.slice(0, 5);
    const gridPosts = allPosts.slice(5, 15);

    return (
        <section className="hero-container">
            {/* Left Ads */}
            <aside className="side-ads left">
                <AdSlot slotId="sidebar_left" width={160} height={600} className="ads-box" />
            </aside>

            <div className="hero-mid-wrapper">
                {/* FIRST HEADING FOR SEO (H1) */}
                <h1 className="main-seo-h1">
                    {lang === 'az' ? 'Son Xəbərlər, Azərbaycan və Dünya Xəbərləri - Bond.az' 
                     : lang === 'ru' ? 'Последние новости Азербайджана и мира - Bond.az' 
                     : 'Breaking News, Azerbaijan and World News - Bond.az'}
                </h1>


                {/* Upper Grid: Overlay Post + Side Column */}
                <div className="hero-grid-upper">
                    <div className="main-post-area">
                        {heroPosts[0] && <PostCard post={heroPosts[0]} isOverlay={true} lang={lang} />}
                    </div>

                    <div className="mid-right-col">
                        <div className="top-ads-container">
                            <AdSlot slotId="hero_square" width={300} height={300} />
                        </div>
                        {heroPosts[1] && <PostCard post={heroPosts[1]} isSmall={true} lang={lang} />}
                    </div>
                </div>

                {/* Banner Moved Here */}
                <div className="top-banner-wrapper" style={{ marginBottom: '25px', width: '100%', minHeight: '90px', display: 'flex', justifyContent: 'center' }}>
                    <AdSlot slotId="top_banner" width={970} height={90} />
                </div>

                {/* Lower Grid: 3 Posts */}
                <div className="hero-grid-bottom">
                    {heroPosts.slice(2, 5).map(post => (
                        <PostCard key={post.id} post={post} lang={lang} />
                    ))}
                </div>

                {/* Premium Divider Added Here */}
                <SectionDivider />

                {/* SECTION: LATEST NEWS + INFINITE SCROLL */}
                <div className="latest-news-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {lang === 'az' ? 'Ən Son Xəbərlər' : lang === 'ru' ? 'Последние новости' : 'Latest News'}
                        </h2>
                    </div>
                    
                    {/* 
                        SEO Logic:
                        We pass the initial 25 grid posts to InfiniteScroll.
                        InfiniteScroll will render them server-side, 
                        and then take over on the client for more.
                    */}
                    <InfiniteScroll initialPosts={gridPosts} lang={lang} />
                </div>

                {/* SEO-Friendly pagination links for bots (Hidden for humans) */}
                <nav className="bot-pagination" style={{ display: 'none' }} aria-hidden="true">
                    <a href="?page=2" rel="next">Pəncərəni aç</a>
                </nav>
            </div>

            {/* Right Ads */}
            <aside className="side-ads right">
                <AdSlot slotId="sidebar_right" width={160} height={600} className="ads-box" />
            </aside>
        </section>
    );
};

export default HeroSection;
