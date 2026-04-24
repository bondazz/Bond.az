"use client";

import Link from "next/link";
import { Mail, Heart } from "lucide-react";
import ThemeToggle from "@/components/ui/footer";
import { translations, Locale } from "@/utils/translations";
import { usePathname } from "next/navigation";

const Underline = `hover:-translate-y-1 border border-dotted border-slate-300 dark:border-slate-600 rounded-xl p-2.5 transition-transform text-slate-700 dark:text-slate-300 hover:text-red-500`;

export default function Footer() {
    const pathname = usePathname() || "";
    const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'az';
    const t = translations[lang as Locale] || translations.az;

    const getLocalizedPath = (path: string) => {
        if (lang === 'az') return path;
        return `/${lang}${path === '/' ? '' : path}`;
    };

    const nav = {
        categories: [
            {
                name: lang === 'en' ? 'News' : lang === 'ru' ? 'Новости' : 'Xəbər',
                sections: [
                    {
                        name: lang === 'en' ? 'Categories' : lang === 'ru' ? 'Категории' : 'Kateqoriyalar',
                        items: [
                            { name: t.politics, href: getLocalizedPath("/politics") },
                            { name: t.business, href: getLocalizedPath("/business") },
                            { name: t.economy, href: getLocalizedPath("/economy") },
                            { name: t.travel, href: getLocalizedPath("/travel") },
                        ],
                    },
                    {
                        name: t.about,
                        items: [
                            { name: t.about, href: getLocalizedPath("/about") },
                            { name: t.contact, href: getLocalizedPath("/contact") },
                            { name: t.ads, href: getLocalizedPath("/ads") },
                        ],
                    },
                    {
                        name: t.terms,
                        items: [
                            { name: t.terms, href: getLocalizedPath("/terms") },
                            { name: t.privacy, href: getLocalizedPath("/privacy") },
                        ],
                    },
                ],
            },
        ],
    };

    return (
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d0e] px-4 py-12 mt-20">
            <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 pb-0 md:flex">
                <Link href={getLocalizedPath("/")}>
                    <div className="flex items-center justify-center text-2xl font-black italic">
                        <span className="text-red-600">///</span> bond.az
                    </div>
                </Link>
                <p className="bg-transparent text-center text-xs leading-5 text-slate-700 dark:text-slate-300 max-w-3xl md:text-left">
                    {t.footerDesc}
                </p>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="border-b border-dotted border-slate-300 dark:border-slate-700"></div>
                <div className="py-10">
                    {nav.categories.map((category: any, catIndex: number) => (
                        <div
                            key={`cat-${catIndex}`}
                            className="grid grid-cols-2 gap-8 md:flex md:justify-around"
                        >
                            {category.sections.map((section: any, secIndex: number) => (
                                <div key={`sec-${secIndex}`} className="flex flex-col gap-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        {section.name}
                                    </h4>
                                    <ul role="list" className="flex flex-col space-y-2">
                                        {section.items.map((item: any, itemIndex: number) => (
                                            <li key={`item-${catIndex}-${secIndex}-${itemIndex}`}>
                                                <Link
                                                    href={item.href}
                                                    className="text-sm text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-500 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="border-b border-dotted border-slate-300 dark:border-slate-700"></div>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 py-6">
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="#" className={Underline} aria-label="Mail"><Mail size={20} /></Link>
                    <Link href="#" className={Underline} aria-label="Facebook">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </Link>
                    <Link href="#" className={Underline} aria-label="X">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </Link>
                    <Link href="#" className={Underline} aria-label="Instagram">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </Link>
                    <Link href="#" className={Underline} aria-label="Youtube">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
                    </Link>
                </div>
                <ThemeToggle />
            </div>

            <div className="mx-auto mb-6 mt-6 flex flex-col justify-between text-center text-[10px] md:max-w-7xl">
                <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-300">
                    <span> © </span>
                    <span>{new Date().getFullYear()}</span>
                    <span> {t.madeWith} </span>
                    <Heart className="text-red-600 h-3 w-3 animate-pulse" fill="currentColor" />
                    <span> {t.by} </span>
                    <span className="hover:text-red-600 cursor-pointer text-slate-900 dark:text-white font-bold transition-colors ml-1">
                        Ali Imam
                    </span>
                    -
                    <span className="hover:text-red-600 cursor-pointer text-slate-700 dark:text-slate-300 transition-colors ml-1">
                        Designali
                    </span>
                </div>
            </div>
        </footer>
    );
}
