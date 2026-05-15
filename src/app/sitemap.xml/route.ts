import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PER_SITEMAP = 1000;

export async function GET() {
  const baseUrl = 'https://bond.az';
  const now = new Date().toISOString();

  // 1. Fetch counts in parallel for performance
  const [postsCount, tagsCount, imagesCount] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('image', { count: 'exact', head: true }).not('image', 'is', null)
  ]);

  // 2. Calculate chunk counts
  const postsSitemapCount = Math.ceil((postsCount.count || 0) / PER_SITEMAP);
  const tagsSitemapCount = Math.ceil((tagsCount.count || 0) / PER_SITEMAP);
  const imagesSitemapCount = Math.ceil((imagesCount.count || 0) / PER_SITEMAP);

  // 3. Generate Sitemap link helpers
  const generateSitemaps = (prefix: string, count: number) => 
    Array.from({ length: count }, (_, i) => `
  <sitemap>
    <loc>${baseUrl}/${prefix}-sitemap-${i + 1}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('');

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/pages-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/categories-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/news-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  ${generateSitemaps('posts', postsSitemapCount)}
  ${generateSitemaps('tags', tagsSitemapCount)}
  ${generateSitemaps('images', imagesSitemapCount)}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
