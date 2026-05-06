"use client";

import React, { useState, useEffect } from 'react';
import './SinglePost.css';
import { Post } from '@/data/posts';
import { formatPostDate } from '@/utils/dateFormatter';
import { usePathname } from 'next/navigation';
import { translations, Locale } from '@/utils/translations';
import Link from 'next/link';
import Image from 'next/image';
import AdSlot from './AdSlot';

interface SinglePostProps { post: Post; }

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
    const pathname = usePathname() || '';
    const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'az';
    const t = translations[lang as Locale] || translations.az;
    const [mounted, setMounted] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [dislikes, setDislikes] = useState(post.dislikes || 0);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Unique View Check: only increment if not viewed before on this device
        if (typeof window !== 'undefined') {
            const viewed = localStorage.getItem(`viewed_${post.id}`);
            if (!viewed) {
                fetch(`/api/posts/${post.id}/view`, { method: 'POST' })
                    .then(() => {
                        localStorage.setItem(`viewed_${post.id}`, 'true');
                    })
                    .catch(() => {});
            }

            // Check local voting state
            const voted = localStorage.getItem(`voted_${post.id}`);
            if (voted) setHasVoted(true);
        }
    }, [post.id]);

    const handleVote = async (type: 'like' | 'dislike') => {
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

    const handleCopyLink = () => {
        const shareUrl = mounted ? window.location.href : '';
        navigator.clipboard.writeText(shareUrl);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (!post) return null;
    const shareUrl = mounted ? window.location.href : '';
    const categoryUrl = lang === 'az' ? `/${post.categorySlug}` : `/${lang}/${post.categorySlug}`;

    const copyMessages = {
        az: "Link kopyalandı!",
        en: "Link copied to clipboard!",
        ru: "Ссылка скопирована!"
    };

    return (
        <div className="s-ct foxiz-premium-standard">
            <div className="rb-post-page-container">
                
                {/* 1:1 FOXIZ HEADER MATCH */}
                <header className="single-header">
                    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
                        <Link href={lang === 'az' ? '/' : `/${lang}`}>{t.home}</Link>
                        <span className="breadcrumb-sep">/</span>
                        <Link href={categoryUrl}>{post.category}</Link>
                        <span className="breadcrumb-sep">/</span>
                        <span className="breadcrumb-current">{post.title.substring(0, 40)}...</span>
                    </nav>

                    <div className="s-cats ecat-text ecat-size-big custom-size">
                        <div className="p-categories">
                            <Link href={categoryUrl} className="p-category" rel="category">
                                {post.category.toUpperCase()}
                            </Link>
                        </div>
                    </div>

                    <h1 className="s-title">{post.title}</h1>
                    <h2 className="s-tagline">{post.summary}</h2>

                    <div className="single-meta-outer-container">
                        <div className="single-meta-wrapper">
                            <div className="author-avatar-col">
                                <Link className="meta-avatar" href={lang === 'az' ? `/author/${post.authorSlug || 'admin'}` : `/${lang}/author/${post.authorSlug || 'admin'}`}>
                                    <div className="small-brush-container">
                                        <Image 
                                            src={post.authorAvatar || "/placeholder-user.png"} 
                                            alt={post.author || "Author"} 
                                            width={48} 
                                            height={48} 
                                            className="photo avatar" 
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="author-info-col">
                                <div className="author-top-row">
                                    <span className="meta-by">{t.by}</span>
                                    <Link className="meta-author" href={lang === 'az' ? `/author/${post.authorSlug || 'admin'}` : `/${lang}/author/${post.authorSlug || 'admin'}`}>
                                        {post.author || "Admin"}
                                    </Link>
                                    {post.authorJobTitle && <span className="meta-job">- {post.authorJobTitle}</span>}
                                </div>
                                <div className="author-bottom-row">
                                    <time className="updated-date">{t.lastUpdated}: {formatPostDate(post.date, lang)}</time>
                                </div>
                            </div>
                        </div>

                        <div className="smeta-extra">
                            <div className="t-shared-sec">
                                <div className="share-row">
                                    <div className="t-shared-header is-meta">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                        <span className="share-label">{t.share}</span>
                                    </div>
                                    <div className="top-shared-icons effect-fadeout">
                                        <a className="share-action" data-title="X" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                        </a>
                                        <a className="share-action" data-title="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                        </a>
                                        <button className="share-action copy-link-btn" data-title="Copy Link" onClick={handleCopyLink}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="post-actions-pill single-actions">
                                <span 
                                    className={`action-item-pill like-action ${hasVoted ? 'voted' : ''}`} 
                                    onClick={() => handleVote('like')}
                                    style={{ cursor: hasVoted ? 'default' : 'pointer' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={hasVoted === true && typeof window !== 'undefined' && localStorage.getItem(`voted_${post.id}`) === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                    <span className="count">{likes}</span>
                                </span>
                                <div className="action-divider"></div>
                                <span 
                                    className={`action-item-pill dislike-action ${hasVoted ? 'voted' : ''}`} 
                                    onClick={() => handleVote('dislike')}
                                    style={{ cursor: hasVoted ? 'default' : 'pointer' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={hasVoted === true && typeof window !== 'undefined' && localStorage.getItem(`voted_${post.id}`) === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                                    <span className="count">{dislikes}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="s-ct-inner">


                    <div className="e-ct-outer">
                        <figure className="featured-image-v6">
                             <Image 
                                src={(post.image && post.image.startsWith('http')) ? post.image : 'https://pub-aa4d7ea2cdf4406aa95e778a75a12177.r2.dev/azerbaycanda-yeni-qaydalar-quvveye-mindi.webp'} 
                                alt={post.title} 
                                title={post.title}
                                width={800} 
                                height={450} 
                                priority 
                                sizes="100vw" 
                             />
                             <figcaption 
                                className="image-attribution" 
                                dangerouslySetInnerHTML={{ __html: t.imageAttribution }} 
                             />
                        </figure>

                        {post.audio_url && (
                            <div className="audio-player-wrapper">
                                <div className="audio-player-label">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                    <span>Xəbəri dinlə</span>
                                </div>
                                <audio controls className="premium-audio-player">
                                    <source src={post.audio_url} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}

                        <div className="entry-content rbct">
                            {post.content && (() => {
                                const paragraphs = post.content.split('</p>');
                                if (paragraphs.length > 2) {
                                    const firstTwo = paragraphs.slice(0, 2).join('</p>') + '</p>';
                                    const rest = paragraphs.slice(2).join('</p>');
                                    return (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: firstTwo }} />
                                            <div className="intra-article-ad" style={{ margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
                                                <AdSlot slotId="intra_article" width={300} height={300} />
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: rest }} />
                                        </>
                                    );
                                }
                                return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
                            })()}
                        </div>
                        
                        {/* Social Follow Banner (Ads Style) */}
                        <div className="social-follow-banner">
                            <div className="follow-cta">
                                <span className="follow-label">{t.followUs}</span>
                            </div>
                            <div className="follow-links">
                                <a href="https://whatsapp.com/channel/..." target="_blank" rel="noopener noreferrer" className="follow-item whatsapp" aria-label="WhatsApp">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.258-.041.404.314.159.386.541 1.32.589 1.417.048.097.08.21.014.339s-.099.21-.197.323c-.097.113-.204.252-.29.34-.105.107-.214.224-.092.433.122.208.542.893 1.163 1.444.798.71 1.469.93 1.677 1.034.208.105.33.087.453-.054.122-.141.523-.609.664-.816s.282-.173.476-.101c.195.073 1.235.583 1.451.691.217.108.361.162.414.253.054.09.054.523-.09.928zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg>
                                </a>
                                <a href="https://t.me/..." target="_blank" rel="noopener noreferrer" className="follow-item telegram" aria-label="Telegram">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                                </a>
                                <a href="https://instagram.com/..." target="_blank" rel="noopener noreferrer" className="follow-item instagram" aria-label="Instagram">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Toast Notification */}
            {showToast && (
                <div className="premium-toast-wrapper">
                    <div className="premium-toast-content">
                        <div className="toast-icon-box">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="toast-msg">{copyMessages[lang as Locale] || copyMessages.az}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePost;
