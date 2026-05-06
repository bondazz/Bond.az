import { NextResponse } from 'next/server';
import { getCurrencyRates } from '@/utils/currencyFetcher';

export async function GET() {
    try {
        const rates = await getCurrencyRates();
        return NextResponse.json(rates);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
