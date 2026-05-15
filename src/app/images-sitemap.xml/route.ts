import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const baseUrl = 'https://bond.az';
  
  // Fetch latest 1000 posts with images
  const { data: posts, error } = await supabase
    .from('posts')
    .select('image, title, date, lang, category_slug, slug')
    .not('image', 'is', null)
    .order('date', { ascending: false })
    .limit(1000);

  if (error || !posts) {
    return new Response('Error fetching images', { status: 500 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map((post) => {
    const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
    const postUrl = `${baseUrl}${langPrefix}/${post.category_slug}/${post.slug}`;
    return `
    <url>
      <loc>${postUrl}</loc>
      <image:image>
        <image:loc>${post.image}</image:loc>
        <image:title><![CDATA[${post.title}]]></image:title>
        <image:caption><![CDATA[${post.title}]]></image:caption>
      </image:image>
    </url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
