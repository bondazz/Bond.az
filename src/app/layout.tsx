import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { headers } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "bond.az",
  description: "News Website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const lang = headerList.get('x-lang') || 'az';

  return (
    <html lang={lang} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-switcher"
          strategy="beforeInteractive"
        >
          {`
            (function() {
              try {
                var savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.add('light-mode');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} value={{ light: 'light-mode', dark: 'dark' }}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
