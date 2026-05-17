import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('slug, lang, created_at');

  if (error) {
    return new Response('Error fetching categories', { status: 500 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories.map((cat) => {
    const langPrefix = cat.lang === 'az' ? '' : `/${cat.lang}`;
    const url = `https://bond.az${langPrefix}/${cat.slug}`;
    return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date(cat.created_at || Date.now()).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
