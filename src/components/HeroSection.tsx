import React from 'react';
import './HeroSection.css';
import { getPosts } from '@/utils/postFetcher';
import PostCard from './PostCard';
import InfiniteScroll from './InfiniteScroll';
import Image from 'next/image';

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
                <div className="ads-box placeholder-ads">
                    <Image src="/sidebar-ads.webp" alt="Sidebar Ad" width={160} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                            <Image src="/kontakt-ads.webp" alt="Kontakt Ad" width={300} height={250} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {heroPosts[1] && <PostCard post={heroPosts[1]} isSmall={true} lang={lang} />}
                    </div>
                </div>

                {/* Banner Moved Here */}
                <div className="top-banner-wrapper" style={{ marginBottom: '25px', width: '100%', minHeight: '90px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center' }}>
                    <iframe 
                        src="https://ads.newmedia.az/www/images/8747db0639abf487b28f4635d8221f0a/index.html?clickTag=https://ads2.newmedia.az/www/delivery/ck.php?oaparams=2__bannerid=16323__zoneid=1290__cb=4875a1fc00__campaignid=3015801__p1=1777443017__p2=a6069974da3f8b869f1a0c92940a__p3=492642.e1e37f0d2d132adc5778274e5e15fabf4a26ee3d__oadest=https%3A%2F%2Fbit.ly%2F46qRBeX%3Futm_content%3DNewmedia%26utm_source%3Doxu.az%26utm_medium%3Diab_banner%26utm_campaign%3DBond.az_invest%26utm_device%3Ddesktop"
                        width="970"
                        height="90"
                        style={{ border: 'none', maxWidth: '100%' }}
                        scrolling="no"
                        title="Bond Invest Advertisement"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
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
                    <Image src="/sidebar-ads.webp" alt="Sidebar Ad" width={160} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </aside>
        </section>
    );
};

export default HeroSection;
