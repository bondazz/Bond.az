import React from 'react';
import StaticPageContent from '@/components/StaticPageContent';
import { Metadata } from 'next';
import { translations, Locale } from '@/utils/translations';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const t = translations[lang as Locale] || translations.az;
    const url = `https://bond.az/${lang}/privacy`;

    return {
        title: t.static.privacy.title,
        description: t.static.privacy.content.slice(0, 160),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: t.static.privacy.title,
            description: t.static.privacy.content.slice(0, 160),
            url: url,
            type: 'website',
            siteName: 'Bond.az',
            locale: lang === 'az' ? 'az_AZ' : lang === 'ru' ? 'ru_RU' : 'en_US',
            images: [
                {
                    url: 'https://bond.az/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: t.static.privacy.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.static.privacy.title,
            description: t.static.privacy.content.slice(0, 160),
            images: ['https://bond.az/og-image.jpg'],
        }
    };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <StaticPageContent lang={lang} pageKey="privacy" />;
}
