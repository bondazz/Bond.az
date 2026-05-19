import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import Script from "next/script";
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
import { ThemeProvider } from "@/components/ThemeProvider";
import { headers } from 'next/headers';
import { getPosts } from "@/utils/postFetcher";
import { Locale } from "@/utils/translations";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "bond.az",
  description: "News Website",
  openGraph: {
    images: ['/bond_brand.webp'],
  },
  twitter: {
    images: ['/bond_brand.webp'],
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const lang = headerList.get('x-lang') || 'az';
  const initialTickerPosts = await getPosts(lang, undefined, 1, 10);

  return (
    <html lang={lang} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <head>
        <meta name="yandex-verification" content="16fb14240674baf8" />
        <link rel="preconnect" href="https://cdn.bond.az" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.bond.az" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4Y82BEZ0BR"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4Y82BEZ0BR');
            `,
          }}
        />
        <ThemeProvider>
          <Header initialLang={lang as Locale} initialPosts={initialTickerPosts} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
