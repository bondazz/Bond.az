import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const POSTS_PER_SITEMAP = 1000;

export async function GET() {
  const baseUrl = 'https://bond.az';
  const now = new Date().toISOString();

  // 1. Get total posts count to calculate chunks
  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  const postsSitemapCount = Math.ceil((totalPosts || 0) / POSTS_PER_SITEMAP);

  // 2. Generate Posts Sitemap links
  const postsSitemaps = Array.from({ length: postsSitemapCount }, (_, i) => `
  <sitemap>
    <loc>${baseUrl}/posts-sitemap-${i + 1}.xml</loc>
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
  ${postsSitemaps}
  <sitemap>
    <loc>${baseUrl}/images-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/tags-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
