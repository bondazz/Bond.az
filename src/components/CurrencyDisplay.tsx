'use client';

import React, { useState, useEffect } from 'react';
import { CurrencyRate } from '@/utils/currencyFetcher';

interface Props {
    initialRates: CurrencyRate[];
    lang: string;
}

export default function CurrencyDisplay({ initialRates, lang }: Props) {
    const [rates, setRates] = useState<CurrencyRate[]>(initialRates);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [mounted, setMounted] = useState(false);

    const refreshRates = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch(`/api/currencies`);
            if (res.ok) {
                const newRates = await res.json();
                setRates(newRates);
                setLastUpdated(new Date());
            }
        } catch (e) {
            console.error("Failed to refresh:", e);
        } finally {
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    };

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(refreshRates, 60000);
        return () => clearInterval(interval);
    }, []);

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return 'https://www.cbar.az/images/table_up.png';
        if (trend === 'down') return 'https://www.cbar.az/images/table_down.png';
        return 'https://www.cbar.az/images/table_cur.png';
    };

    return (
        <div className="currencies-mirror-wrapper">
            <div className="table_table">
                <div className="valuta_title">
                    <div className="val_title">Valyuta</div>
                    <div className="kod_title">Kod</div>
                    <div className="kurs_title">Kurs</div>
                    <div className="dynam_title"></div>
                </div>
                <div className="table_items">
                    {rates.map((rate, index) => (
                        <div key={rate.code} className="table_row">
                            <div className="valuta">{rate.name}</div>
                            <div className="kod">{rate.code}</div>
                            <div className="kurs">{rate.rate.toFixed(4)}</div>
                            <div className="dynamic">
                                <img src={getTrendIcon(rate.trend)} alt={rate.trend} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
