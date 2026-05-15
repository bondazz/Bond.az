import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PER_SITEMAP = 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const page = id ? parseInt(id) : 1;
  const offset = (page - 1) * PER_SITEMAP;

  const { data: tags, error } = await supabase
    .from('tags')
    .select('slug, lang, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + PER_SITEMAP - 1);

  if (error || !tags) {
    return new Response('Error fetching tags', { status: 500 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${tags.map((tag) => {
    const langPrefix = tag.lang === 'az' ? '' : `/${tag.lang}`;
    const url = `https://bond.az${langPrefix}/tag/${tag.slug}`;
    return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date(tag.created_at).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
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
