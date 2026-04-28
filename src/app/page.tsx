import HeroSection from "@/components/HeroSection";
import { Metadata } from 'next';
import { translations } from '@/utils/translations';

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Bond.az - Azərbaycanın Ən Son Xəbər Portalı",
    description: "Azərbaycan və dünyada baş verən güncəl xəbərlər, siyasət, iqtisadiyyat, cəmiyyət və texnologiya yenilikləri Bond.az-da. Ətraflı analizlər və operativ xəbər axını.",
    alternates: {
        canonical: 'https://bond.az',
        languages: {
            'az-AZ': 'https://bond.az',
            'en-US': 'https://bond.az/en',
            'ru-RU': 'https://bond.az/ru',
        },
    },
    openGraph: {
        title: "Bond.az - Azərbaycanın Ən Son Xəbər Portalı",
        description: "Azərbaycan və dünyada baş verən güncəl xəbər axını...",
        url: 'https://bond.az',
        siteName: 'Bond.az',
        locale: 'az_AZ',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Bond.az News',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@bondxeber',
        creator: '@bondxeber',
        title: "Bond.az - Ən Son Xəbərlər",
        description: "Azərbaycan və dünyada baş verən ən son hadisələr Bond.az-da.",
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function Home() {
    return (
        <main>
            <HeroSection lang="az" />
        </main>
    );
}
