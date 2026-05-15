import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const POSTS_PER_SITEMAP = 1000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Extract number from "posts-sitemap-1.xml" or just "1"
  const pageMatch = id.match(/(\d+)/);
  const page = pageMatch ? parseInt(pageMatch[1]) : 1;
  const offset = (page - 1) * POSTS_PER_SITEMAP;

  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, category_slug, date, lang, image, title')
    .order('date', { ascending: false })
    .range(offset, offset + POSTS_PER_SITEMAP - 1);

  if (error || !posts) {
    return new Response('Error fetching posts', { status: 500 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map((post) => {
    const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
    const url = `https://bond.az${langPrefix}/${post.category_slug}/${post.slug}`;
    const postDate = new Date(post.date).toISOString();
    
    return `
    <url>
      <loc>${url}</loc>
      <lastmod>${postDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
      ${post.image ? `
      <image:image>
        <image:loc>${post.image}</image:loc>
        <image:title><![CDATA[${post.title}]]></image:title>
      </image:image>` : ''}
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
