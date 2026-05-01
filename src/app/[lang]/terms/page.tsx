import React from 'react';
import StaticPageContent from '@/components/StaticPageContent';
import { Metadata } from 'next';
import { translations, Locale } from '@/utils/translations';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const t = translations[lang as Locale] || translations.az;
    const url = `https://bond.az/${lang}/terms`;

    return {
        title: t.static.terms.title,
        description: t.static.terms.content.slice(0, 160),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: t.static.terms.title,
            description: t.static.terms.content.slice(0, 160),
            url: url,
            type: 'website',
            siteName: 'Bond.az',
            locale: lang === 'az' ? 'az_AZ' : lang === 'ru' ? 'ru_RU' : 'en_US',
            images: [
                {
                    url: 'https://bond.az/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: t.static.terms.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.static.terms.title,
            description: t.static.terms.content.slice(0, 160),
            images: ['https://bond.az/og-image.jpg'],
        }
    };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <StaticPageContent lang={lang} pageKey="terms" />;
}
