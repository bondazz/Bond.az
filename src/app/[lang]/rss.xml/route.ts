import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> } // Next.js 15 pattern
) {
  const { lang } = await params; // Await params

  // Seçilmiş dilə uyğun ən son 50 xəbəri çəkirik
  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, category_slug, image, summary, content, date, lang, author')
    .eq('lang', lang)
    .order('date', { ascending: false })
    .limit(50);

  if (error || !posts) {
    console.error('RSS Fetch Error:', error);
    return new Response('Error fetching posts', { status: 500 });
  }

  const rssItems = posts.map((post) => {
    const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
    const url = `https://bond.az${langPrefix}/${post.category_slug}/${post.slug}`;
    
    // Xəbərin tam mətni və sonunda dofollow link
    const footer = `<br/><br/><hr/><strong>Mənbə:</strong> <a href="${url}">Bond.az</a>`;
    const description = `${post.summary}${footer}`;

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="false">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.author || 'Bond.az'}]]></dc:creator>
      <category><![CDATA[${post.category_slug}]]></category>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${post.content || post.summary}${footer}]]></content:encoded>
      <enclosure url="${post.image}" length="0" type="image/jpeg" />
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bond.az - ${lang.toUpperCase()} News</title>
    <link>https://bond.az/${lang}</link>
    <description>Azərbaycanın ən son iqtisadiyyat və maliyyə xəbərləri portalı</description>
    <language>${lang}</language>
    <atom:link href="https://bond.az/${lang}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=600',
    },
  });
}
