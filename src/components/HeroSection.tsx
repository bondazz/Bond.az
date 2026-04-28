import React from 'react';
import './HeroSection.css';
import { getPosts } from '@/utils/postFetcher';
import PostCard from './PostCard';
import InfiniteScroll from './InfiniteScroll';

const HeroSection = async ({ lang: propLang }: { lang?: string }) => {
    const lang = propLang || 'az';
    
    // Server-side fetch: Page 1, Limit 30
    const allPosts = await getPosts(lang, undefined, 1, 30);
    
    const heroPosts = allPosts.slice(0, 5);
    const gridPosts = allPosts.slice(5, 30);

    return (
        <section className="hero-container">
            {/* Left Ads */}
            <aside className="side-ads left">
                <div className="ads-box placeholder-ads">
                    <img src="/sidebar-ads.png" alt="Sidebar Ad" width="160" height="600" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                </div>
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
                            <img src="/kontakt-ads.png" alt="Kontakt Ad" width="300" height="250" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                        </div>
                        {heroPosts[1] && <PostCard post={heroPosts[1]} isSmall={true} lang={lang} />}
                    </div>
                </div>

                {/* Banner Moved Here */}
                <div className="top-banner-wrapper" style={{ marginBottom: '25px' }}>
                    <img src="/accessbank-banner.png" alt="AccessBank" width="1000" height="120" className="full-top-banner" loading="lazy" decoding="async" />
                </div>

                {/* Lower Grid: 3 Posts */}
                <div className="hero-grid-bottom">
                    {heroPosts.slice(2, 5).map(post => (
                        <PostCard key={post.id} post={post} lang={lang} />
                    ))}
                </div>

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
                <div className="ads-box placeholder-ads">
                    <img src="/sidebar-ads.png" alt="Sidebar Ad" width="160" height="600" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                </div>
            </aside>
        </section>
    );
};

export default HeroSection;
