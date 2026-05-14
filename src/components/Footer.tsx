"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { translations, Locale } from "@/utils/translations";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import './Footer.css';

export default function Footer() {
    const pathname = usePathname() || "";
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'az';
    const t = translations[lang as Locale] || translations.az;

    const getLocalizedPath = (path: string) => {
        if (lang === 'az') return path;
        return `/${lang}${path === '/' ? '' : path}`;
    };

    if (!mounted) return null;

    const navData = [
        {
            title: lang === 'az' ? 'Xəbərlər' : 'News',
            links: [
                { name: t.politics, href: lang === 'az' ? "/siyaset" : `/${lang}/politics` },
                { name: t.business, href: lang === 'az' ? "/biznes" : `/${lang}/business` },
                { name: t.economy, href: lang === 'az' ? "/iqtisadiyyat" : `/${lang}/economy` },
                { name: t.travel, href: lang === 'az' ? "/seyahat" : `/${lang}/travel` },
                { name: t.currencies, href: getLocalizedPath("/currencies") },
            ]
        },
        {
            title: lang === 'az' ? 'Son Dəqiqə' : 'Breaking News',
            links: [
                { name: lang === 'az' ? 'Günün Xəbərləri' : 'Daily News', href: "#" },
                { name: lang === 'az' ? 'Aktual' : 'Current', href: "#" },
                { name: lang === 'az' ? 'Video' : 'Video', href: "#" },
            ]
        },
        {
            title: lang === 'az' ? 'Dünya' : 'World',
            links: [
                { name: lang === 'az' ? 'Türkiyə' : 'Turkey', href: "#" },
                { name: lang === 'az' ? 'Avropa' : 'Europe', href: "#" },
                { name: lang === 'az' ? 'Yaxın Şərq' : 'Middle East', href: "#" },
            ]
        },
        {
            title: lang === 'az' ? 'İdman' : 'Sports',
            links: [
                { name: lang === 'az' ? 'Futbol' : 'Football', href: "#" },
                { name: lang === 'az' ? 'Basketbol' : 'Basketball', href: "#" },
                { name: lang === 'az' ? 'Tennis' : 'Tennis', href: "#" },
            ]
        },
        {
            title: lang === 'az' ? 'Maqazin' : 'Magazine',
            links: [
                { name: lang === 'az' ? 'Məşhurlar' : 'Celebrities', href: "#" },
                { name: lang === 'az' ? 'Kino' : 'Cinema', href: "#" },
                { name: lang === 'az' ? 'Moda' : 'Fashion', href: "#" },
            ]
        },
        {
            title: 'Bond.az',
            links: [
                { name: t.about, href: getLocalizedPath("/about") },
                { name: t.authors, href: getLocalizedPath("/authors") },
                { name: t.contact, href: getLocalizedPath("/contact") },
                { name: t.ads, href: getLocalizedPath("/ads") },
                { name: t.terms, href: getLocalizedPath("/terms") },
            ]
        }
    ];

    return (
        <footer className="footer-haberler">
            <div className="footer-container">

                {/* 1. Header Row */}
                <div className="footer-h-top">
                    <div className="footer-h-left">
                        <Link href={getLocalizedPath("/")}>
                            <div className="logo-wrapper relative w-[140px] h-[25px]">
                                <Image 
                                    src="/bond_logo_white.png" 
                                    alt="Bond.az White Logo" 
                                    title="Bond.az"
                                    width={140}
                                    height={25}
                                    className="logo-dark-mode"
                                />
                                <Image 
                                    src="/bond_logo_black.png" 
                                    alt="Bond.az Black Logo" 
                                    title="Bond.az"
                                    width={140}
                                    height={25}
                                    className="logo-light-mode"
                                />
                            </div>
                        </Link>
                        <span className="footer-h-copy">© Copyright {new Date().getFullYear()} Bond.az</span>
                    </div>
                    <div className="footer-h-right">
                        <Link href={getLocalizedPath("/about")} className="footer-h-link">{t.about}</Link>
                        <Link href={getLocalizedPath("/ads")} className="footer-h-link">{t.ads}</Link>
                        <Link href={getLocalizedPath("/contact")} className="footer-h-link">{t.contact}</Link>
                    </div>
                </div>

                {/* 2. Main Grid */}
                <div className="footer-h-grid">
                    {navData.map((col, idx) => (
                        <div key={idx} className="footer-h-col">
                            <h4 className="footer-h-col-title">{col.title}</h4>
                            <ul className="footer-h-list">
                                {col.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link href={link.href} className="footer-h-list-link">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 3. Action Row (Follow & Download) */}
                <div className="footer-h-action-row">
                    <div className="footer-h-action-box">
                        <h4 className="footer-h-action-title">{lang === 'az' ? 'BİZİ İZLƏYİN' : 'FOLLOW US'}</h4>
                        <div className="footer-h-social-list">
                            <Link href="#" className="footer-h-social-icon icon-fb" aria-label="Facebook"><FacebookIcon /></Link>
                            <Link href="#" className="footer-h-social-icon icon-tw" aria-label="X (Twitter)"><XIcon /></Link>
                            <Link href="#" className="footer-h-social-icon icon-ig" aria-label="Instagram"><InstagramIcon /></Link>
                            <Link href="#" className="footer-h-social-icon icon-li" aria-label="LinkedIn"><LinkedinIcon /></Link>
                            <Link href="#" className="footer-h-social-icon icon-yt" aria-label="YouTube"><YoutubeIcon /></Link>
                            <Link href={getLocalizedPath("/rss.xml")} className="footer-h-social-icon icon-rss" aria-label="RSS Feed"><RssIcon /></Link>
                        </div>
                    </div>
                    <div className="footer-h-action-box">
                        <h4 className="footer-h-action-title">{lang === 'az' ? 'TƏTBİQİMİZİ YÜKLƏYİN' : 'DOWNLOAD OUR APP'}</h4>
                        <div className="footer-h-apps">
                            <Image src="https://cdn.bond.az/assets/icons/app-store.svg" alt="App Store" title="Bond.az App Store" width={85} height={40} />
                            <Image src="https://cdn.bond.az/assets/icons/google-play.svg" alt="Google Play" title="Bond.az Google Play" width={85} height={40} />
                            <Image src="https://cdn.bond.az/assets/icons/app-gallery.svg" alt="App Gallery" title="Bond.az App Gallery" width={85} height={40} />
                        </div>
                    </div>
                </div>

                {/* 4. Legal Bar */}
                <div className="footer-h-legal-bar">
                    <Link href={getLocalizedPath("/terms")} className="footer-h-legal-link">{t.terms}</Link>
                    <Link href={getLocalizedPath("/privacy")} className="footer-h-legal-link">{t.privacy}</Link>
                    <Link href="#" className="footer-h-legal-link" aria-label={lang === 'az' ? 'Çərəz Siyasəti Səhifəsi' : 'Cookie Policy Page'}>{lang === 'az' ? 'Çərəz Siyasəti' : 'Cookie Policy'}</Link>
                    <Link href="#" className="footer-h-legal-link" aria-label={lang === 'az' ? 'Reklam Səhifəsi' : 'Advertising Page'}>{lang === 'az' ? 'Reklam' : 'Advertising'}</Link>
                </div>

                {/* 5. Bottom SEO */}
                <div className="footer-h-seo-bottom">
                    <div className="footer-h-seo-title">Bond.az - Son Dəqiqə Xəbərlər və Güncəl Xəbərlər</div>
                    <div className="footer-h-seo-info">
                        {lang === 'az' ? 'Gizlilik və çərəz ayarları' : 'Privacy and cookie settings'} | {new Date().toLocaleString('az-AZ')}
                    </div>
                </div>

            </div>
        </footer>
    );
}

// Minimal SVGs to avoid build errors with lucide versions
const FacebookIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const XIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>;
const InstagramIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path></svg>;
const YoutubeIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>;
const RssIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>;
