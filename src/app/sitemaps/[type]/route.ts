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

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { type: rawType } = await params;
  if (!rawType.endsWith('.xml')) {
    return new Response('Not Found', { status: 404 });
  }

  const type = rawType.replace('.xml', '');
  const baseUrl = 'https://bond.az';
  const now = getRoundedDate();

  // Pages Index
  if (type === 'pages') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/pages/pages-sitemap.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  }

  // Categories Index
  if (type === 'categories') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/categories/categories-sitemap.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  }

  // Authors Index
  if (type === 'authors') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/authors/authors-sitemap.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
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
