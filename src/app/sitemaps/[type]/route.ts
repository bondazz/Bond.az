import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

type RouteParams = {
  params: Promise<{
    type: string;
  }>;
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

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { type: rawType } = await params;
  if (!rawType.endsWith('.xml')) {
    return new Response('Not Found', { status: 404 });
  }

  const type = rawType.replace('.xml', '');
  const baseUrl = 'https://bond.az';
  const now = getRoundedDate();

  // Pages Sitemap
  if (type === 'pages') {
    const langs = ['az', 'en', 'ru'];
    const staticPages = ['', '/about', '/contact', '/currencies', '/breaking-news'];
    const urls = langs.flatMap(lang => 
      staticPages.map(page => {
        const langPrefix = lang === 'az' ? '' : `/${lang}`;
        const path = page === '' && lang === 'az' ? '' : page;
        const locUrl = `${baseUrl}${langPrefix}${path}`;
        return `
    <url>
      <loc>${escapeXml(locUrl)}</loc>
      <lastmod>${now.toISOString()}</lastmod>
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

  // Categories Sitemap
  if (type === 'categories') {
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
      <loc>${escapeXml(url)}</loc>
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

  // Authors Sitemap
  if (type === 'authors') {
    const { data: authors, error } = await supabase
      .from('authors')
      .select('slug, name, lang')
      .order('name', { ascending: true });

    if (error || !authors) {
      return new Response('Error fetching authors', { status: 500 });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${authors.map((author) => {
    const lang = author.lang || 'az';
    const url = `${baseUrl}/${lang}/author/${author.slug}`;
    return `
    <url>
      <loc>${escapeXml(url)}</loc>
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

  // Dynamic Content (Posts, Tags, Images) Indexing
  if (type.startsWith('posts-') || type === 'tags' || type === 'images') {
    let minDateRes, maxDateRes;
    if (type.startsWith('posts-')) {
      const lang = type.replace('posts-', '');
      [minDateRes, maxDateRes] = await Promise.all([
        supabase.from('posts').select('date').eq('lang', lang).order('date', { ascending: true }).limit(1).single(),
        supabase.from('posts').select('date').eq('lang', lang).order('date', { ascending: false }).limit(1).single()
      ]);
    } else if (type === 'tags') {
      [minDateRes, maxDateRes] = await Promise.all([
        supabase.from('tags').select('created_at').order('created_at', { ascending: true }).limit(1).single(),
        supabase.from('tags').select('created_at').order('created_at', { ascending: false }).limit(1).single()
      ]);
    } else { // images
      [minDateRes, maxDateRes] = await Promise.all([
        supabase.from('posts').select('date').not('image', 'is', null).order('date', { ascending: true }).limit(1).single(),
        supabase.from('posts').select('date').not('image', 'is', null).order('date', { ascending: false }).limit(1).single()
      ]);
    }

    const minVal = minDateRes.data ? ((minDateRes.data as any).date || (minDateRes.data as any).created_at) : null;
    const maxVal = maxDateRes.data ? ((maxDateRes.data as any).date || (maxDateRes.data as any).created_at) : null;

    const minDate = minVal ? new Date(minVal) : now;
    const maxDate = maxVal ? new Date(maxVal) : now;

    const startYear = minDate.getUTCFullYear();
    const startMonth = minDate.getUTCMonth();
    const endYear = maxDate.getUTCFullYear();
    const endMonth = maxDate.getUTCMonth();

    const monthsList: { year: number; monthName: string; monthIndex: number }[] = [];
    let currYear = startYear;
    let currMonth = startMonth;

    while (currYear < endYear || (currYear === endYear && currMonth <= endMonth)) {
      monthsList.push({
        year: currYear,
        monthName: MONTH_NAMES[currMonth],
        monthIndex: currMonth
      });
      currMonth++;
      if (currMonth > 11) {
        currMonth = 0;
        currYear++;
      }
    }

    monthsList.reverse(); // Newest first

    const currentYear = now.getUTCFullYear();
    const currentMonthIndex = now.getUTCMonth();

    const sitemapLinks = monthsList.map(({ year, monthName, monthIndex }) => {
      let lastmod: string;
      if (year === currentYear && monthIndex === currentMonthIndex) {
        lastmod = now.toISOString();
      } else {
        const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));
        lastmod = lastDay.toISOString();
      }

      let sitemapUrl = '';
      if (type.startsWith('posts-')) {
        sitemapUrl = `${baseUrl}/sitemaps/${type}/post-sitemap-${year}-${monthName}.xml`;
      } else if (type === 'tags') {
        sitemapUrl = `${baseUrl}/sitemaps/tags/tag-sitemap-${year}-${monthName}.xml`;
      } else {
        sitemapUrl = `${baseUrl}/sitemaps/images/image-sitemap-${year}-${monthName}.xml`;
      }

      return `  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapLinks}
</sitemapindex>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  }

  return new Response('Not Found', { status: 404 });
}
