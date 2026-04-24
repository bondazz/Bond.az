'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Post } from '@/data/posts';
import PostCard from './PostCard';
import { fetchMorePosts } from '@/app/actions';
import { translations, Locale } from '@/utils/translations';

interface InfiniteScrollProps {
    initialPosts: Post[];
    lang: string;
    categorySlug?: string;
}

const InfiniteScroll = ({ initialPosts, lang, categorySlug }: InfiniteScrollProps) => {
    const t = translations[lang as Locale] || translations.az;
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [page, setPage] = useState(2); 
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, page]);

    const loadMore = async () => {
        setLoading(true);
        const newPosts = await fetchMorePosts(lang, categorySlug, page);
        
        if (newPosts.length === 0) {
            setHasMore(false);
        } else {
            setPosts(prev => [...prev, ...newPosts]);
            setPage(prev => prev + 1);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="latest-posts-grid">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} lang={lang} />
                ))}
            </div>

            {hasMore && (
                <div ref={observerTarget} className="load-more-placeholder">
                    {loading ? (
                        <div className="loading-spinner">{t.loading}</div>
                    ) : (
                        <div style={{ opacity: 0 }}>...</div>
                    )}
                </div>
            )}
            
            {!hasMore && (
                <div className="no-more-posts" style={{ textAlign: 'center', padding: '40px', color: 'var(--meta-text)', fontSize: '14px', fontWeight: '800' }}>
                    {t.allLoaded}
                </div>
            )}
        </>
    );
};

export default InfiniteScroll;
