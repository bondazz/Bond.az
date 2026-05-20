import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MONTHS: { [key: string]: number } = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
};

function getRoundedDate(): Date {
  const now = new Date();
  const minutes = now.getUTCMinutes();
  const roundedMinutes = Math.floor(minutes / 15) * 15;
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    roundedMinutes,
    0,
    0
  ));
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

type RouteParams = {
  params: Promise<{
    type: string;
    filename: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { type, filename } = await params;

  // 1. Pages Sitemap
  if (type === 'pages' && filename === 'pages-sitemap.xml') {
    const baseUrl = 'https://bond.az';
    const now = getRoundedDate().toISOString();
    const langs = ['az', 'en', 'ru'];
    
    const staticPages = ['', '/about', '/contact', '/currencies', '/breaking-news'];
    const urls = langs.flatMap(lang => 
      staticPages.map(page => {
        const langPrefix = lang === 'az' ? '' : `/${lang}`;
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

  // 2. Categories Sitemap
  if (type === 'categories' && filename === 'categories-sitemap.xml') {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('slug, lang, created_at');

    if (error || !categories) {
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
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  }

  // 3. Authors Sitemap
  if (type === 'authors' && filename === 'authors-sitemap.xml') {
    const { data: authors, error } = await supabase
      .from('authors')
      .select('slug, name, lang')
      .order('name', { ascending: true });

    if (error || !authors) {
      return new Response('Error fetching authors', { status: 500 });
    }

    const baseUrl = 'https://bond.az';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${authors.map((author) => {
    const lang = author.lang || 'az';
    const url = `${baseUrl}/${lang}/author/${author.slug}`;
    return `
    <url>
      <title>${escapeXml(author.name)}</title>
      <loc>${url}</loc>
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

  // 4. Dynamic chronological sitemaps: posts, tags, images
  const match = filename.match(/^(post|tag|image)-sitemap-(\d{4})-([a-z]+)(?:-(\d+))?\.xml$/i);
  if (!match) {
    return new Response('Not Found', { status: 404 });
  }

  const [_, contentType, yearStr, monthName, chunkStr] = match;
  const year = parseInt(yearStr);
  const monthIndex = MONTHS[monthName.toLowerCase()];
  if (monthIndex === undefined) {
    return new Response('Not Found', { status: 404 });
  }

  const startDate = new Date(Date.UTC(year, monthIndex, 1));
  const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));
  const now = getRoundedDate();
  
  // Set cache duration depending on whether the requested month is in the past (immutable) or current
  const isCurrentMonth = (year === now.getUTCFullYear() && monthIndex === now.getUTCMonth());
  const cacheControlHeader = isCurrentMonth
    ? 'public, s-maxage=3600, stale-while-revalidate=1800' // Current month: 1 hour cache
    : 'public, s-maxage=604800, stale-while-revalidate=86400'; // Past month: 7 days cache (immutable)

  const chunk = chunkStr ? parseInt(chunkStr) : 1;
  const limit = 40000;
  const offset = (chunk - 1) * limit;

  // Render Post Sitemap
  if (type.startsWith('posts-')) {
    const lang = type.replace('posts-', '');
    
    // Fetch up to 40,000 URLs in parallel batches of 1000 to bypass REST pagination limits
    const batchSize = 1000;
    const batchCount = Math.ceil(limit / batchSize);
    const promises = Array.from({ length: batchCount }, (_, i) => {
      const batchOffset = offset + (i * batchSize);
      return supabase
        .from('posts')
        .select('slug, category_slug, date, lang, image, title')
        .eq('lang', lang)
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .order('date', { ascending: true }) // Stable deterministic sorting
        .range(batchOffset, batchOffset + batchSize - 1);
    });

    const results = await Promise.all(promises);
    let posts: any[] = [];
    for (const res of results) {
      if (res.data) {
        posts = posts.concat(res.data);
      }
    }

    if (posts.length === 0) {
      return new Response('Sitemap is empty or not found', { status: 404 });
    }

    // Double check chronological sorting
    posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map((post) => {
    const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
    const postUrl = `https://bond.az${langPrefix}/${post.category_slug}/${post.slug}`;
    return `
    <url>
      <loc>${postUrl}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
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
        'Cache-Control': cacheControlHeader,
      },
    });
  }

  // Render Tag Sitemap
  if (type === 'tags') {
    // Fetch up to 40,000 URLs in parallel batches of 1000
    const batchSize = 1000;
    const batchCount = Math.ceil(limit / batchSize);
    const promises = Array.from({ length: batchCount }, (_, i) => {
      const batchOffset = offset + (i * batchSize);
      return supabase
        .from('tags')
        .select('slug, lang, created_at')
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString())
        .order('created_at', { ascending: true })
        .range(batchOffset, batchOffset + batchSize - 1);
    });

    const results = await Promise.all(promises);
    let tags: any[] = [];
    for (const res of results) {
      if (res.data) {
        tags = tags.concat(res.data);
      }
    }

    if (tags.length === 0) {
      return new Response('Sitemap is empty or not found', { status: 404 });
    }

    // Deterministic sorting
    tags.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

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
        'Cache-Control': cacheControlHeader,
      },
    });
  }

  // Render Image Sitemap
  if (type === 'images') {
    // Fetch up to 40,000 URLs in parallel batches of 1000
    const batchSize = 1000;
    const batchCount = Math.ceil(limit / batchSize);
    const promises = Array.from({ length: batchCount }, (_, i) => {
      const batchOffset = offset + (i * batchSize);
      return supabase
        .from('posts')
        .select('image, title, date, lang, category_slug, slug')
        .not('image', 'is', null)
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .order('date', { ascending: true })
        .range(batchOffset, batchOffset + batchSize - 1);
    });

    const results = await Promise.all(promises);
    let posts: any[] = [];
    for (const res of results) {
      if (res.data) {
        posts = posts.concat(res.data);
      }
    }

    if (posts.length === 0) {
      return new Response('Sitemap is empty or not found', { status: 404 });
    }

    // Deterministic sorting
    posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map((post) => {
    const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
    const postUrl = `https://bond.az${langPrefix}/${post.category_slug}/${post.slug}`;
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
        'Cache-Control': cacheControlHeader,
      },
    });
  }

  return new Response('Not Found', { status: 404 });
}
