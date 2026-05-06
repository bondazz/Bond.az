"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Ad {
    id: number;
    slot_id: string;
    type: 'code' | 'image';
    content: string;
    link_url?: string;
    is_active: boolean;
}

interface AdSlotProps {
    slotId: string;
    className?: string;
    width?: number;
    height?: number;
}

export default function AdSlot({ slotId, className, width = 300, height = 300 }: AdSlotProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                // We fetch all ads and filter for simplicity, 
                // or you could create a specific public API for this.
                const res = await fetch('/api/public/ads');
                if (res.ok) {
                    const ads: Ad[] = await res.json();
                    const foundAd = ads.find(a => a.slot_id === slotId && a.is_active);
                    setAd(foundAd || null);
                }
            } catch (err) {
                console.error('Ad fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [slotId]);

    if (loading || !ad) return null;

    return (
        <div className={`ad-slot-container ${className || ''}`} id={`ad-slot-${slotId}`}>
            {ad.type === 'image' ? (
                <Link href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <Image 
                        src={ad.content} 
                        alt="Reklam" 
                        width={width} 
                        height={height} 
                        className="w-full h-full object-contain rounded-lg bg-black/10"
                        unoptimized={ad.content.includes('.gif')}
                    />
                </Link>
            ) : (
                <div 
                    dangerouslySetInnerHTML={{ __html: ad.content }} 
                    className="w-full h-full flex justify-center items-center"
                />
            )}
        </div>
    );
}
