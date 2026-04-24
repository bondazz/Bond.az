"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { translations, Locale } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import './Header.css';

const Header = () => {
  const pathname = usePathname() || "";
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Avoid hydration mismatch for theme-specific UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'az';

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
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
        console.error("Redirect logic failed, using fallback", err);
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

  const isDarkMode = mounted ? resolvedTheme === 'dark' : true; // Default to dark on server
  const t = translations[lang as Locale] || translations.az;

  const menuItems = [
    { name: t.politics, href: getLocalizedPath("/politics"), active: pathname.includes('politics') },
    { name: t.business, href: getLocalizedPath("/business"), active: pathname.includes('business') },
    { name: t.economy, href: getLocalizedPath("/economy"), active: pathname.includes('economy') },
    { name: t.travel, href: getLocalizedPath("/travel"), active: pathname.includes('travel') },
  ];

  return (
    <header className="header-container">
      {/* Top Section */}
      <div className="header-top">
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

          <a href={getLocalizedPath("/")} className="logo-area" aria-label="Bond.az Home">
            <span className="logo-icon">///</span>
            <span className="logo-text">bond.az</span>
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
            <input type="text" placeholder={t.search} aria-label={t.search} />
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

          <div className="lang-switcher">
            <a href="#" className={lang === 'az' ? 'active' : ''} onClick={(e) => changeLanguage('az', e)} data-title="Azərbaycan dili">AZ</a>
            <a href="#" className={lang === 'en' ? 'active' : ''} onClick={(e) => changeLanguage('en', e)} data-title="English language">EN</a>
            <a href="#" className={lang === 'ru' ? 'active' : ''} onClick={(e) => changeLanguage('ru', e)} data-title="Русский язык">RU</a>
          </div>

          <div className="dark-mode-toggle-wrap">
            <div
              className={`dark-mode-toggle ${isDarkMode ? 'triggered' : ''}`}
              onClick={toggleDarkMode}
              data-title={isDarkMode ? t.switchToLight : t.switchToDark}
              aria-label={isDarkMode ? t.switchToLight : t.switchToDark}
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

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'show' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav-links">
            <li><a href={getLocalizedPath("/")} onClick={() => setMobileMenuOpen(false)}>{t.home}</a></li>
            <li><a href={getLocalizedPath("/politics")} onClick={() => setMobileMenuOpen(false)}>{t.politics}</a></li>
            <li><a href={getLocalizedPath("/business")} onClick={() => setMobileMenuOpen(false)}>{t.business}</a></li>
            <li><a href={getLocalizedPath("/economy")} onClick={() => setMobileMenuOpen(false)}>{t.economy}</a></li>
            <li><a href={getLocalizedPath("/feed")} onClick={() => setMobileMenuOpen(false)}>{t.myFeed}</a></li>
            <li><a href={getLocalizedPath("/saves")} onClick={() => setMobileMenuOpen(false)}>{t.mySaves}</a></li>
          </ul>
        </nav>
      </div>

      <div className="header-bottom">
        <div className="header-bottom-inner">
          <nav className="desktop-nav">
            <ul className="secondary-nav">
              <li>
                <a href={getLocalizedPath("/")} className={pathname === '/' || pathname === `/${lang}` ? 'active' : ''} data-title={t.home}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 7C8 5.5 9.6 4.4 10.7 3.7C11.5 3.2 12.5 3.2 13.3 3.7C14.4 4.4 16 5.5 17.5 7C20.7 10.2 20.5 12 20.5 15C20.5 16.4 20.4 17.6 20.3 18.5C20.1 19.4 19.4 20 18.4 20H17C15.9 20 15 19.1 15 18V16C15 15.2 14.7 14.4 14.1 13.9C13.6 13.3 12.8 13 12 13C11.2 13 10.4 13.3 9.9 13.9C9.3 14.4 9 15.2 9 16V18C9 19.1 8.1 20 7 20H5.6C4.6 20 3.9 19.4 3.7 18.5C3.6 17.6 3.5 16.4 3.5 15C3.5 12 3.3 10.2 6.5 7Z"></path>
                  </svg>
                  {t.home}
                </a>
              </li>
              <li><a href={getLocalizedPath("/feed")} className={pathname.includes('feed') ? 'active' : ''} data-title={t.myFeed}>{t.myFeed}</a></li>
              <li><a href={getLocalizedPath("/interests")} className={pathname.includes('interests') ? 'active' : ''} data-title={t.myInterests}>{t.myInterests}</a></li>
              <li><a href={getLocalizedPath("/saves")} className={pathname.includes('saves') ? 'active' : ''} data-title={t.mySaves}>{t.mySaves}</a></li>
              <li><a href={getLocalizedPath("/history")} className={pathname.includes('history') ? 'active' : ''} data-title={t.history}>{t.history}</a></li>
              <li><a href={getLocalizedPath("/blog")} className={pathname.includes('blog') ? 'active' : ''} data-title={t.blog}>{t.blog}</a></li>
            </ul>
          </nav>

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
    </header >
  );
};

export default Header;
