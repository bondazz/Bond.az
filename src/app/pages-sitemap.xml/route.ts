export async function GET() {
  const baseUrl = 'https://bond.az';
  const now = new Date().toISOString();
  const langs = ['az', 'en', 'ru'];
  
  // Define static pages
  const staticPages = [
    '', // Home
    '/about',
    '/contact',
    '/currencies',
    '/breaking-news',
  ];

  const urls = langs.flatMap(lang => 
    staticPages.map(page => {
      const langPrefix = lang === 'az' ? '' : `/${lang}`;
      // Fix for home page double slash
      const path = page === '' && lang === 'az' ? '' : page;
      return `
    <url>
      <loc>${baseUrl}${langPrefix}${path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${page === '' ? '1.0' : '0.6'}</priority>
    </url>`;
    })
  ).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
