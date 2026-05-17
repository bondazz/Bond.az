import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, category_slug, image, date, lang')
    .gte('date', fortyEightHoursAgo)
    .order('date', { ascending: false })
    .limit(1000);

  if (error) {
    return new Response('Error fetching posts', { status: 500 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map((post) => {
    const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
    const url = `https://bond.az${langPrefix}/${post.category_slug}/${post.slug}`;
    return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
      <news:news>
        <news:publication>
          <news:name>Bond.az</news:name>
          <news:language>${post.lang}</news:language>
        </news:publication>
        <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
        <news:title><![CDATA[${post.title}]]></news:title>
      </news:news>
      <image:image>
        <image:loc>${post.image}</image:loc>
        <image:title><![CDATA[${post.title}]]></image:title>
      </image:image>
    </url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
    },
  });
}
