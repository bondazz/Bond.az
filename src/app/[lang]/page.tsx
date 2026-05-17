import HeroSection from '@/components/HeroSection';
import { translations, Locale } from '@/utils/translations';
import { Metadata } from 'next';
import { getPosts } from '@/utils/postFetcher';
import Script from 'next/script';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = translations[lang as Locale] || translations.az;
  const siteUrl = "https://bond.az";
  const currentUrl = lang === 'az' ? siteUrl : `${siteUrl}/${lang}`;

  // SEO Optimized Titles (Keyword-First)
  const titles: Record<string, string> = {
    az: "Son Xəbərlər, 24/7 Azərbaycan və Dünya Xəbərləri - Bond.az",
    en: "Breaking News, 24/7 Azerbaijan and World News - Bond.az",
    ru: "Последние новости, 24/7 Азербайджан и Мировые новости - Bond.az"
  };

  const descriptions: Record<string, string> = {
    az: "Ən son Azərbaycan və dünya xəbərləri, siyasət, iqtisadiyyat və idman hadisələri. Operativ və tərəfsiz xəbər mənbəyiniz - Bond.az",
    en: "Latest Azerbaijan and world news, politics, economy and sports events. Your operative and impartial news source - Bond.az",
    ru: "Последние новости Азербайджана и мира, политика, экономика и спорт. Ваш оперативный и беспристрастный источник новостей - Bond.az"
  };

  return {
    title: titles[lang] || titles.az,
    description: descriptions[lang] || descriptions.az,
    alternates: {
      canonical: currentUrl,
      languages: {
        'az': `${siteUrl}`,
        'en': `${siteUrl}/en`,
        'ru': `${siteUrl}/ru`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.az,
      description: descriptions[lang] || descriptions.az,
      url: currentUrl,
      siteName: 'Bond.az',
      locale: lang === 'az' ? 'az_AZ' : lang === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/bond_brand.webp',
          width: 1200,
          height: 630,
          alt: 'Bond.az News',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.az,
      description: descriptions[lang] || descriptions.az,
      images: ['/bond_brand.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LangHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const siteUrl = "https://bond.az";
  const posts = await getPosts(lang);
  const latestPosts = posts.slice(0, 10);

  // 1. Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Bond.az",
    "url": siteUrl,
    "logo": `${siteUrl}/bond_logo_black.png`,
    "sameAs": [
      "https://facebook.com/bondaz",
      "https://instagram.com/bondaz",
      "https://twitter.com/bondaz",
      "https://t.me/bondaz"
    ]
  };

  // 2. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": lang === 'az' ? "Bond.az hansı xəbərləri təqdim edir?" : "What news does Bond.az provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'az' 
            ? "Bond.az son xəbərlər və aktual hadisələr barədə operativ, keyfiyyətli və müxtəlif məzmun təqdim edir. Siyasət, iqtisadiyyat və idman sahələrini əhatə edir."
            : "Bond.az provides prompt, high-quality, and diverse content about the latest news and current events, covering politics, economy, and sports."
        }
      },
      {
        "@type": "Question",
        "name": lang === 'az' ? "Bond.az xəbərləri nə dərəcədə operativdir?" : "How prompt is Bond.az news?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'az'
            ? "Xəbərlərimiz 24 saat ərzində anlıq olaraq yenilənir və oxuculara ən sürətli şəkildə çatdırılır."
            : "Our news is updated instantly 24 hours a day and delivered to our readers in the fastest way possible."
        }
      }
    ]
  };

  // 3. ItemList (Carousel) Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": latestPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${siteUrl}/${post.categorySlug}/${post.slug}`
    }))
  };

  return (
    <>
      <Script
        id="home-schemas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([orgSchema, faqSchema, itemListSchema])
        }}
      />
      <main>
        <HeroSection lang={lang} />
      </main>
    </>
  );
}
