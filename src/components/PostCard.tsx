"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/data/posts';
import { formatPostDate } from '@/utils/dateFormatter';

interface PostCardProps {
    post: Post;
    isOverlay?: boolean;
    isSmall?: boolean;
    lang?: string;
}

const PostCard = ({ post, isOverlay = false, isSmall = false, lang: propLang }: PostCardProps) => {
    const lang = propLang || 'az';
    const [likes, setLikes] = useState(post.likes || 0);
    const [dislikes, setDislikes] = useState(post.dislikes || 0);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const voted = localStorage.getItem(`voted_${post.id}`);
            if (voted) setHasVoted(true);
        }
    }, [post.id]);

    const handleVote = async (e: React.MouseEvent, type: 'like' | 'dislike') => {
        e.preventDefault();
        e.stopPropagation();

        if (hasVoted) return;

        try {
            const res = await fetch(`/api/posts/${post.id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });

            if (res.ok) {
                const data = await res.json();
                if (type === 'like') setLikes(data.count);
                else setDislikes(data.count);
                
                setHasVoted(true);
                localStorage.setItem(`voted_${post.id}`, type);
            }
        } catch (err) {
            console.error('Vote error:', err);
        }
    };

    if (!post) return null;

    const getLocalizedPath = (path: string) => {
        if (lang === 'az') return path;
        return `/${lang}${path === '/' ? '' : path}`;
    };

    const postLink = getLocalizedPath(`/${post.categorySlug}/${post.slug}`);
    
    // Fallback for empty or invalid image URLs
    const safeImageUrl = (post.image && post.image.startsWith('http')) 
        ? post.image 
        : 'https://pub-aa4d7ea2cdf4406aa95e778a75a12177.r2.dev/azerbaycanda-yeni-qaydalar-quvveye-mindi.webp'; // Safe fallback from R2

    return (
        <div className={`post-card ${isOverlay ? 'overlay-post' : ''} ${isSmall ? 'small-post' : ''}`}>
            <div className="featured-img-holder">
                <Link href={postLink} className="p-flink" target="_blank" rel="noopener noreferrer" aria-label={post.title}>
                    <Image 
                        src={safeImageUrl} 
                        alt={post.title} 
                        title={post.title}
                        width={800} 
                        height={450} 
                        priority={isOverlay} 
                        {...(isOverlay ? { fetchPriority: "high" } : { loading: "lazy" })}
                        sizes={isOverlay 
                            ? "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1100px" 
                            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        }
                        className="post-main-img"
                    />
                </Link>
                {!isOverlay && <div className="img-blur-edge"></div>}
            </div>

            <div className={`${isOverlay ? 'overlay-content' : 'card-content'}`}>
                {!isOverlay && (
                    <div className="meta-pill-container">
                        <div className="post-top-meta-pill">
                            <div className="meta-item-wrapper date-meta">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                <span>{formatPostDate(post.date, lang)}</span>
                            </div>
                            <div className="meta-separator">|</div>
                            <div className="meta-item-wrapper views-meta">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>{post.views}</span>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="entry-title">
                    <Link href={postLink} target="_blank" rel="noopener noreferrer" aria-label={post.title}>{post.title}</Link>
                </h2>

                <h3 className="entry-summary">{post.summary}</h3>

                <div className="post-bottom-meta">
                    {!isOverlay && (
                        <>
                            <div className="cat-wrap">
                                <Link className="post-category-link" href={getLocalizedPath(`/${post.categorySlug}`)}>
                                    {post.category.toUpperCase()} <span>→</span>
                                </Link>
                            </div>
                             <div className="post-actions-pill">
                                 <span 
                                     className={`action-item-pill like-action ${hasVoted ? 'voted' : ''}`} 
                                     data-title="Like"
                                     onClick={(e) => handleVote(e, 'like')}
                                     style={{ cursor: hasVoted ? 'default' : 'pointer' }}
                                 >
                                     <svg width="14" height="14" viewBox="0 0 24 24" fill={hasVoted === true && typeof window !== 'undefined' && localStorage.getItem(`voted_${post.id}`) === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                     <span className="count">{likes}</span>
                                 </span>
                                 <div className="action-divider"></div>
                                 <span 
                                     className={`action-item-pill dislike-action ${hasVoted ? 'voted' : ''}`} 
                                     data-title="Dislike"
                                     onClick={(e) => handleVote(e, 'dislike')}
                                     style={{ cursor: hasVoted ? 'default' : 'pointer' }}
                                 >
                                     <svg width="14" height="14" viewBox="0 0 24 24" fill={hasVoted === true && typeof window !== 'undefined' && localStorage.getItem(`voted_${post.id}`) === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                                     <span className="count">{dislikes}</span>
                                 </span>
                             </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
