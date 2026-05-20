import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

function getMonthsForRange(minVal: any, maxVal: any, now: Date): { year: number; monthName: string; monthIndex: number }[] {
  const minDate = minVal ? new Date(minVal) : now;
  const maxDate = maxVal ? new Date(maxVal) : now;

  const startYear = minDate.getUTCFullYear();
  const startMonth = minDate.getUTCMonth();
  const endYear = maxDate.getUTCFullYear();
  const endMonth = maxDate.getUTCMonth();

  const monthsList: { year: number; monthName: string; monthIndex: number }[] = [];
  let currYear = startYear;
  let currMonth = startMonth;

  const MONTH_NAMES = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

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

  return monthsList.reverse(); // Newest first
}

export async function GET() {
  const baseUrl = 'https://bond.az';
  const now = getRoundedDate();
  const nowStr = now.toISOString();

  const [
    minAz, maxAz,
    minEn, maxEn,
    minRu, maxRu,
    minTags, maxTags,
    minImages, maxImages
  ] = await Promise.all([
    supabase.from('posts').select('date').eq('lang', 'az').order('date', { ascending: true }).limit(1).single(),
    supabase.from('posts').select('date').eq('lang', 'az').order('date', { ascending: false }).limit(1).single(),
    
    supabase.from('posts').select('date').eq('lang', 'en').order('date', { ascending: true }).limit(1).single(),
    supabase.from('posts').select('date').eq('lang', 'en').order('date', { ascending: false }).limit(1).single(),
    
    supabase.from('posts').select('date').eq('lang', 'ru').order('date', { ascending: true }).limit(1).single(),
    supabase.from('posts').select('date').eq('lang', 'ru').order('date', { ascending: false }).limit(1).single(),
    
    supabase.from('tags').select('created_at').order('created_at', { ascending: true }).limit(1).single(),
    supabase.from('tags').select('created_at').order('created_at', { ascending: false }).limit(1).single(),
    
    supabase.from('posts').select('date').not('image', 'is', null).order('date', { ascending: true }).limit(1).single(),
    supabase.from('posts').select('date').not('image', 'is', null).order('date', { ascending: false }).limit(1).single()
  ]);

  const currentYear = now.getUTCFullYear();
  const currentMonthIndex = now.getUTCMonth();

  const getSitemapLinks = (monthsList: any[], typeKey: string, urlPrefix: string) => {
    return monthsList.map(({ year, monthName, monthIndex }) => {
      let lastmod: string;
      if (year === currentYear && monthIndex === currentMonthIndex) {
        lastmod = nowStr;
      } else {
        const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));
        lastmod = lastDay.toISOString();
      }
      const sitemapUrl = `${baseUrl}/sitemaps/${typeKey}/${urlPrefix}-sitemap-${year}-${monthName}.xml`;
      return `  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    });
  };

  const azMonths = getMonthsForRange(minAz.data?.date, maxAz.data?.date, now);
  const enMonths = getMonthsForRange(minEn.data?.date, maxEn.data?.date, now);
  const ruMonths = getMonthsForRange(minRu.data?.date, maxRu.data?.date, now);
  const tagMonths = getMonthsForRange(minTags.data?.created_at, maxTags.data?.created_at, now);
  const imgMonths = getMonthsForRange(minImages.data?.date, maxImages.data?.date, now);

  const azLinks = getSitemapLinks(azMonths, 'posts-az', 'post').join('\n');
  const enLinks = getSitemapLinks(enMonths, 'posts-en', 'post').join('\n');
  const ruLinks = getSitemapLinks(ruMonths, 'posts-ru', 'post').join('\n');
  const tagLinks = getSitemapLinks(tagMonths, 'tags', 'tag').join('\n');
  const imgLinks = getSitemapLinks(imgMonths, 'images', 'image').join('\n');

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/pages.xml</loc>
    <lastmod>${nowStr}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/categories.xml</loc>
    <lastmod>${nowStr}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/authors.xml</loc>
    <lastmod>${nowStr}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/news-sitemap.xml</loc>
    <lastmod>${nowStr}</lastmod>
  </sitemap>
${azLinks}
${enLinks}
${ruLinks}
${tagLinks}
${imgLinks}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
