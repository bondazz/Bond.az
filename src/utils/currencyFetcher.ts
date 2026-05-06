import * as cheerio from 'cheerio';

export interface CurrencyRate {
    code: string;
    name: string;
    rate: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
}

export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
    try {
        // Scrape the HTML directly to get the "Mirror" effect with trend icons
        const res = await fetch('https://www.cbar.az/currency/rates', {
            next: { revalidate: 300 } // 5 minutes cache for "live" feel
        });

        if (!res.ok) throw new Error('Failed to fetch from CBAR HTML');

        const html = await res.text();
        const $ = cheerio.load(html);
        
        const rates: CurrencyRate[] = [];
        
        $('.table_row').each((_, elem) => {
            const name = $(elem).find('.valuta').text().trim();
            const code = $(elem).find('.kod').text().trim().toUpperCase();
            const rateStr = $(elem).find('.kurs').text().trim();
            const rate = parseFloat(rateStr);
            
            const trendImg = $(elem).find('.dynamic img').attr('src') || '';
            let trend: 'up' | 'down' | 'stable' = 'stable';
            
            if (trendImg.includes('table_up')) trend = 'up';
            else if (trendImg.includes('table_down')) trend = 'down';
            
            rates.push({
                code,
                name,
                rate: parseFloat(rate.toFixed(4)),
                trend,
                change: trend === 'up' ? 0.0001 : trend === 'down' ? -0.0001 : 0
            });
        });

        return rates;
    } catch (error) {
        console.error('CBAR scraping error:', error);
        return [
            { code: 'USD', name: '1 ABŞ dolları', rate: 1.7000, trend: 'stable', change: 0 },
            { code: 'EUR', name: '1 Avro', rate: 1.8452, trend: 'up', change: 0.0012 }
        ];
    }
};
