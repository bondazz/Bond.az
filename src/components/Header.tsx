"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { translations, Locale } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import { getPosts } from '@/utils/postFetcher';
import { Post } from '@/data/posts';
import './Header.css';

interface HeaderProps {
  initialLang?: Locale;
  initialPosts?: Post[];
}

const Header = ({ initialLang, initialPosts = [] }: HeaderProps) => {
  const pathname = usePathname() || "";
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickerPosts, setTickerPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'az';

  // Avoid hydration mismatch for theme-specific UI
  useEffect(() => {
    setMounted(true);
    const fetchTicker = async () => {
      const posts = await getPosts(lang, undefined, 1, 5);
      setTickerPosts(posts);
    };
    fetchTicker();
  }, [lang]);

  // Instant Search Logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchDropdown(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, slug, categorySlug:category_slug, image, date')
          .eq('lang', lang)
          .ilike('title', `%${searchQuery}%`)
          .order('id', { ascending: false })
          .limit(6);

        if (!error && data) {
          setSearchResults(data as any[]);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, lang]);

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    // Explicitly toggle based on current visual state if theme is still uncertain
    const currentTheme = theme || (document.documentElement.classList.contains("dark") ? "dark" : "light");
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const getLocalizedPath = (path: string) => {
    if (lang === 'az') return path;
    const cleanPath = path === '/' ? '' : path;
    return `/${lang}${cleanPath}`;
  };

  const changeLanguage = async (newLang: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (newLang === lang) return;

    const pathParts = pathname.split('/').filter(Boolean);
    let currentSlug = '';
    let isPostPage = false;

    if (pathParts.length === 3 && (pathParts[0] === 'en' || pathParts[0] === 'ru' || pathParts[0] === 'az')) {
      currentSlug = pathParts[2];
      isPostPage = true;
    } else if (pathParts.length === 2 && !['en', 'ru', 'az'].includes(pathParts[0])) {
      currentSlug = pathParts[1];
      isPostPage = true;
    }

    if (isPostPage && currentSlug) {
      try {
        const { data: currentPost } = await supabase
          .from('posts')
          .select('common_id')
          .eq('slug', currentSlug)
          .limit(1)
          .single();
          
        if (currentPost?.common_id) {
          const { data: targetPost } = await supabase
            .from('posts')
            .select('category_slug, slug')
            .eq('common_id', currentPost.common_id)
            .eq('lang', newLang)
            .limit(1)
            .single();
 
          if (targetPost) {
            const langPrefix = newLang === 'az' ? '' : `/${newLang}`;
            window.location.href = `${langPrefix}/${targetPost.category_slug}/${targetPost.slug}`;
            return;
          }
        }
      } catch (err) {
        console.error("Post redirect logic failed", err);
      }
    }

    // --- CATEGORY REDIRECT LOGIC ---
    let potentialCategorySlug = '';
    if (pathParts.length === 1 && !['en', 'ru', 'az'].includes(pathParts[0])) {
      potentialCategorySlug = pathParts[0];
    } else if (pathParts.length === 2 && ['en', 'ru', 'az'].includes(pathParts[0])) {
      potentialCategorySlug = pathParts[1];
    }

    if (potentialCategorySlug) {
      try {
        const { data: currentCat } = await supabase
          .from('categories')
          .select('common_slug')
          .eq('slug', potentialCategorySlug)
          .eq('lang', lang)
          .limit(1)
          .single();

        if (currentCat?.common_slug) {
          const { data: targetCat } = await supabase
            .from('categories')
            .select('slug')
            .eq('common_slug', currentCat.common_slug)
            .eq('lang', newLang)
            .limit(1)
            .single();

          if (targetCat) {
            const langPrefix = newLang === 'az' ? '' : `/${newLang}`;
            window.location.href = `${langPrefix}/${targetCat.slug}`;
            return;
          }
        }
      } catch (err) {
        console.error("Category redirect logic failed", err);
      }
    }

    // Default behavior for other pages (Home, Category, etc.)
    let currentPath = pathname;
    if (currentPath.startsWith('/en')) {
      currentPath = currentPath.replace(/^\/en/, '') || '/';
    } else if (currentPath.startsWith('/ru')) {
      currentPath = currentPath.replace(/^\/ru/, '') || '/';
    }

    let newPath = currentPath;
    if (newLang !== 'az') {
      newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
    }
    window.location.href = newPath;
  };

  // Improved isDarkMode logic to prevent flicker and two-click issues
  const isDarkMode = mounted ? (theme === 'dark') : false; 
  const t = translations[lang as Locale] || translations.az;

  const menuItems = [
    { name: t.politics, href: lang === 'az' ? "/siyaset" : `/${lang}/politics`, active: pathname.includes('politics') || pathname.includes('siyaset') },
    { name: t.business, href: lang === 'az' ? "/biznes" : `/${lang}/business`, active: pathname.includes('business') || pathname.includes('biznes') },
    { name: t.economy, href: lang === 'az' ? "/iqtisadiyyat" : `/${lang}/economy`, active: pathname.includes('economy') || pathname.includes('iqtisadiyyat') },
    { name: t.travel, href: lang === 'az' ? "/seyahat" : `/${lang}/travel`, active: pathname.includes('travel') || pathname.includes('seyahat') },
    { name: t.currencies, href: getLocalizedPath("/currencies"), active: pathname.includes('currencies') },
  ];

  return (
    <>
      <header className="header-container">
        <div className="header-top">
          <div className="header-top-inner">
            <div className="header-left-group">
              {/* Mobile Menu Button */}
              <button
                className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <a href={getLocalizedPath("/")} className="logo-area" aria-label="Bond.az Logo - Home">
                <div className="logo-wrapper relative w-[140px] h-[25px]">
                  <Image 
                    src="/bond_logo_white.png" 
                    alt="Bond.az White Logo" 
                    title="Bond.az - Xəbər Portalı"
                    width={140}
                    height={25}
                    className="site-logo-img logo-dark-mode"
                    priority
                  />
                  <Image 
                    src="/bond_logo_black.png" 
                    alt="Bond.az Black Logo" 
                    title="Bond.az - Xəbər Portalı"
                    width={140}
                    height={25}
                    className="site-logo-img logo-light-mode"
                    priority
                  />
                </div>
              </a>
              <nav className="desktop-nav">
                <ul className="main-nav-links">
                  {menuItems.map(item => (
                    <li key={item.name}>
                      <a href={item.href} className={item.active ? 'active' : ''} data-title={item.name}>{item.name}</a>
                    </li>
                  ))}
                  <li><a href="#" data-title={t.more}>{t.more} <span className="arrow-down">▾</span></a></li>
                </ul>
              </nav>
            </div>

            <div className="header-right-group">
              <div className="notification-bell" data-title={t.notifications} role="button" aria-label={t.notifications}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge">9</span>
              </div>

              <div className="search-box">
                <span data-title={t.searchLabel} style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder={t.search} 
                  aria-label={t.search} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                />
                
                {showSearchDropdown && (
                  <div className="search-dropdown premium-dropdown">
                    {isSearching ? (
                      <div className="search-status">{t.loading}</div>
                    ) : searchResults.length > 0 ? (
                      <div className="search-results-list">
                        {searchResults.map(post => (
                          <a 
                            key={post.id} 
                            href={getLocalizedPath(`/${post.categorySlug}/${post.slug}`)}
                            className="search-result-item"
                          >
                            <div className="result-thumb">
                              <Image src={post.image} alt={post.title} width={50} height={35} className="object-cover" />
                            </div>
                            <div className="result-info">
                              <span className="result-title">{post.title}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="search-status">Heç nə tapılmadı</div>
                    )}
                  </div>
                )}

                <span style={{ color: '#666', cursor: 'pointer', marginLeft: '5px' }} data-title={t.searchLabel}>→</span>
              </div>

              <div className="social-links">
                <a href="#" aria-label="Facebook" data-title="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" aria-label="X" data-title="X">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a href="#" aria-label="YouTube" data-title="YouTube">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
                </a>
              </div>

              <div className={`lang-switcher-dropdown ${langDropdownOpen ? 'open' : ''}`} onMouseEnter={() => setLangDropdownOpen(true)} onMouseLeave={() => setLangDropdownOpen(false)}>
                <div className="current-lang" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
                  {lang.toUpperCase()} <span className="arrow-down">▾</span>
                </div>
                <div className="lang-options">
                  <a href="#" className={lang === 'az' ? 'active' : ''} onClick={(e) => changeLanguage('az', e)} data-title="Azərbaycan dili">AZ</a>
                  <a href="#" className={lang === 'en' ? 'active' : ''} onClick={(e) => changeLanguage('en', e)} data-title="English language">EN</a>
                  <a href="#" className={lang === 'ru' ? 'active' : ''} onClick={(e) => changeLanguage('ru', e)} data-title="Русский язык">RU</a>
                </div>
              </div>

              <div className="dark-mode-toggle-wrap">
                <div
                  className={`dark-mode-toggle ${isDarkMode ? 'triggered' : ''}`}
                  onClick={toggleDarkMode}
                  data-title={isDarkMode ? t.switchToLight : t.switchToDark}
                  aria-label={isDarkMode ? t.switchToLight : t.switchToDark}
                  role="button"
                  tabIndex={0}
                  suppressHydrationWarning
                >
                  <span className="dark-mode-slide">
                    <i className={`dark-mode-slide-btn ${isDarkMode ? 'mode-icon-dark activated' : 'mode-icon-default'}`}>
                      {isDarkMode ? (
                        <svg className="svg-icon svg-mode-dark" aria-hidden="true" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                          <path fill="currentColor" d="M968.172 426.83c-2.349-12.673-13.274-21.954-26.16-22.226-12.876-0.22-24.192 8.54-27.070 21.102-27.658 120.526-133.48 204.706-257.334 204.706-145.582 0-264.022-118.44-264.022-264.020 0-123.86 84.18-229.676 204.71-257.33 12.558-2.88 21.374-14.182 21.102-27.066s-9.548-23.81-22.22-26.162c-27.996-5.196-56.654-7.834-85.176-7.834-123.938 0-240.458 48.266-328.098 135.904-87.638 87.638-135.902 204.158-135.902 328.096s48.264 240.458 135.902 328.096c87.64 87.638 204.16 135.904 328.098 135.904s240.458-48.266 328.098-135.904c87.638-87.638 135.902-204.158 135.902-328.096 0-28.498-2.638-57.152-7.828-85.17z"></path>
                        </svg>
                      ) : (
                        <svg className="svg-icon svg-mode-light" aria-hidden="true" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 232.447 232.447">
                          <path fill="currentColor" d="M116.211,194.8c-4.143,0-7.5,3.357-7.5,7.5v22.643c0,4.143,3.357,7.5,7.5,7.5s7.5-3.357,7.5-7.5V202.3 C123.711,198.157,120.354,194.8,116.211,194.8z"></path>
                          <path fill="currentColor" d="M116.211,37.645c4.143,0,7.5-3.357,7.5-7.5V7.505c0-4.143,3.357-7.5-7.5-7.5s-7.5,3.357-7.5,7.5v22.641 C108.711,34.288,112.068,37.645,116.211,37.645z"></path>
                          <path fill="currentColor" d="M50.054,171.78l-16.016,16.008c-2.93,2.929-2.931,7.677-0.003,10.606c1.465,1.466,3.385,2.198,5.305,2.198 c1.919,0,3.838-0.731,5.302-2.195l16.016-16.008c2.93-2.929,2.931-7.677,0.003-10.606C57.731,168.852,52.982,168.851,50.054,171.78 z"></path>
                          <path fill="currentColor" d="M177.083,62.852c1.919,0,3.838-0.731,5.302-2.195L198.4,44.649c2.93-2.929,2.931-7.677,0.003-10.606 c-2.93-2.932-7.679-2.931-10.607-0.003l-16.016,16.008c-2.93,2.929-2.931,7.677-0.003,10.607 C173.243,62.12,175.163,62.852,177.083,62.852z"></path>
                          <path fill="currentColor" d="M37.645,116.224c0-4.143-3.357-7.5-7.5-7.5H7.5c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h22.645 C34.287,123.724,37.645,120.366,37.645,116.224z"></path>
                          <path fill="currentColor" d="M224.947,108.724h-22.652c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h22.652c4.143,0,7.5-3.357,7.5-7.5 S229.09,108.724,224.947,108.724z"></path>
                          <path fill="currentColor" d="M50.052,60.655c1.465,1.465,3.384,2.197,5.304,2.197c1.919,0,3.839-0.732,5.303-2.196c2.93-2.929,2.93-7.678,0.001-10.606 L44.652,34.042c-2.93-2.93-7.679-2.929-10.606-0.001c-2.93,2.929-2.93,7.678-0.001,10.606L50.052,60.655z"></path>
                          <path fill="currentColor" d="M182.395,171.782c-2.93-2.929-7.679-2.93-10.606-0.001c-2.93,2.929-2.93,7.678-0.001,10.607l16.007,16.008 c1.465,1.465,3.384,2.197,5.304,2.197c1.919,0,3.839-0.732,5.303-2.196c2.93-2.929,2.93-7.678,0.001-10.607L182.395,171.782z"></path>
                          <path fill="currentColor" d="M116.22,48.7c-37.232,0-67.523,30.291-67.523,67.523s30.291,67.523,67.523,67.523s67.522-30.291,67.522-67.523 S153.452,48.7,116.22,48.7z M116.22,168.747c-28.962,0-52.523-23.561-52.523-52.523S87.258,63.7,116.22,63.7 c28.961,0,52.522,23.562,52.522,52.523S145.181,168.747,116.22,168.747z"></path>
                        </svg>
                      )}
                    </i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <div className="header-bottom-inner">
            {/* Breaking News Ticker replaces the secondary nav links */}
            <div className="breaking-news-ticker">
              <div className="ticker-label" data-title={t.breakingNews}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ticker-icon">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <div className="ticker-content">
                {tickerPosts.length > 0 ? (
                  <div className="ticker-track">
                    {tickerPosts.concat(tickerPosts).map((post, idx) => (
                      <a 
                        key={`${post.id}-${idx}`} 
                        href={getLocalizedPath(`/${post.categorySlug}/${post.slug}`)}
                        className="ticker-item"
                      >
                        <span className="ticker-title">{post.title}</span>
                        <span className="ticker-separator"></span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="ticker-placeholder-text">...</div>
                )}
              </div>
            </div>

            <div className="bottom-right-group">
              <div className="user-icon" data-title={t.signIn} role="button" aria-label={t.signIn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <a href="#" className="personalize-btn" data-title={t.personalize}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                {t.personalize}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="mobile-menu-header">
          <a href={getLocalizedPath("/")} className="mobile-logo-area" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-wrapper relative w-[140px] h-[25px]">
              <Image 
                src="/bond_logo_white.png" 
                alt="Bond.az White Logo" 
                title="Bond.az"
                width={140}
                height={25}
                className="site-logo-img logo-dark-mode"
              />
              <Image 
                src="/bond_logo_black.png" 
                alt="Bond.az Black Logo" 
                title="Bond.az"
                width={140}
                height={25}
                className="site-logo-img logo-light-mode"
              />
            </div>
          </a>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="mobile-nav">
          <ul className="mobile-nav-links">
            <li><a href={getLocalizedPath("/")} onClick={() => setMobileMenuOpen(false)}>{t.home}</a></li>
            <li><a href={lang === 'az' ? "/siyaset" : `/${lang}/politics`} onClick={() => setMobileMenuOpen(false)}>{t.politics}</a></li>
            <li><a href={lang === 'az' ? "/biznes" : `/${lang}/business`} onClick={() => setMobileMenuOpen(false)}>{t.business}</a></li>
            <li><a href={lang === 'az' ? "/iqtisadiyyat" : `/${lang}/economy`} onClick={() => setMobileMenuOpen(false)}>{t.economy}</a></li>
            <li><a href={getLocalizedPath("/feed")} onClick={() => setMobileMenuOpen(false)}>{t.myFeed}</a></li>
            <li><a href={getLocalizedPath("/saves")} onClick={() => setMobileMenuOpen(false)}>{t.mySaves}</a></li>
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-lang-switcher">
            <a href="#" className={lang === 'az' ? 'active' : ''} onClick={(e) => changeLanguage('az', e)}>AZ</a>
            <a href="#" className={lang === 'en' ? 'active' : ''} onClick={(e) => changeLanguage('en', e)}>EN</a>
            <a href="#" className={lang === 'ru' ? 'active' : ''} onClick={(e) => changeLanguage('ru', e)}>RU</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
