"use client";

import React, { useState, useEffect } from 'react';
import './SinglePost.css';
import { Post } from '@/data/posts';
import { formatPostDate } from '@/utils/dateFormatter';
import { usePathname } from 'next/navigation';
import { translations, Locale } from '@/utils/translations';
import Link from 'next/link';

interface SinglePostProps { post: Post; }

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
    const pathname = usePathname() || '';
    const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'az';
    const t = translations[lang as Locale] || translations.az;
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!post) return null;
    const shareUrl = mounted ? window.location.href : '';
    const homeLink = lang === 'az' ? '/' : `/${lang}`;

    return (
        <div className="s-ct foxiz-premium-standard">
            <div className="rb-post-page-container">
                
                {/* 1:1 FOXIZ HEADER MATCH */}
                <header className="single-header">
                    <div className="s-cats ecat-text ecat-size-big custom-size">
                        <div className="p-categories">
                            <Link href={`${homeLink}/${post.category_slug}`} className="p-category" rel="category">
                                {post.category.toUpperCase()}
                            </Link>
                        </div>
                    </div>

                    <h1 className="s-title">{post.title}</h1>
                    <h2 className="s-tagline">{post.summary}</h2>

                    <div className="single-meta meta-s-dslash">
                        <div className="smeta-in">
                            <div className="smeta-sec">
                                <div className="p-meta">
                                    <div className="meta-inner is-meta">
                                        <a className="meta-el meta-avatar" href="#">
                                            <img width="32" height="32" src="https://foxiz.io/capital/wp-content/uploads/sites/8/2026/04/avatar-150x150.jpg" className="photo avatar" alt="" />
                                        </a>
                                        <div className="meta-el">
                                            <div className="ulightbox-holder">
                                                <a className="meta-author" href="#">{post.author || "Admin"}</a>
                                                <span className="meta-label meta-job">- Senior Editor</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="smeta-bottom meta-text">
                                    <time className="updated-date">{t.lastUpdated}: {formatPostDate(post.date, lang)}</time>
                                </div>
                            </div>
                        </div>

                        <div className="smeta-extra">
                            <div className="t-shared-sec">
                                <div className="t-shared-header is-meta">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                    <span className="share-label">Share</span>
                                </div>
                                <div className="top-shared-icons effect-fadeout">
                                    <a className="share-action" data-title="X" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>
                                    <a className="share-action" data-title="Facebook" href="#"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                                    <a className="share-action" data-title="Email" href="#"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg></a>
                                    <a className="share-action more-icon" data-title="More" href="#"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="s-ct-inner">
                    {/* 1:1 STICKY SHARE SIDEBAR */}
                    <div className="l-shared-sec-outer">
                        <div className="l-shared-sec">
                            <div className="l-shared-header meta-text">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                <span className="share-label">SHARE</span>
                            </div>
                            <div className="l-shared-items blur-group">
                                <a className="share-action" data-title="X" href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>
                                <a className="share-action" data-title="Facebook" href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                                <a className="share-action" data-title="Email" href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg></a>
                                <a className="share-action" data-title="Link" href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a>
                                <a className="share-action more-icon" data-title="More" href="#"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></a>
                            </div>
                        </div>
                    </div>

                    <div className="e-ct-outer">
                        <div className="featured-image-v6">
                             <img src={post.image} alt={post.title} width="1200" height="675" />
                        </div>

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

                        <div className="entry-content rbct has-drop-cap" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;
