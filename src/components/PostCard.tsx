import React from 'react';
import Link from 'next/link';
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

    if (!post) return null;

    const getLocalizedPath = (path: string) => {
        if (lang === 'az') return path;
        return `/${lang}${path === '/' ? '' : path}`;
    };

    const postLink = getLocalizedPath(`/${post.categorySlug}/${post.slug}`);

    return (
        <div className={`post-card ${isOverlay ? 'overlay-post' : ''} ${isSmall ? 'small-post' : ''}`}>
            <div className="featured-img-holder">
                <Link href={postLink} className="p-flink" target="_blank" rel="noopener noreferrer">
                    <img src={post.image} alt={post.title} width="800" height="450" />
                </Link>
                {!isOverlay && <div className="img-blur-edge"></div>}
            </div>

            <div className={`${isOverlay ? 'overlay-content' : 'card-content'}`}>
                {!isOverlay && (
                    <div className="post-top-meta">
                        <div className="meta-item-wrapper date-meta">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>{formatPostDate(post.date, lang)}</span>
                        </div>
                        <div className="meta-item-wrapper views-meta">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <span>{post.views}</span>
                        </div>
                    </div>
                )}

                <h2 className="entry-title">
                    <Link href={postLink} target="_blank" rel="noopener noreferrer">{post.title}</Link>
                </h2>

                {!isSmall && !isOverlay && <h3 className="entry-summary">{post.summary}</h3>}
                {isOverlay && <p className="entry-summary">{post.summary}</p>}

                <div className="post-bottom-meta">
                    {!isOverlay && (
                        <>
                            <div className="cat-wrap">
                                <Link className="post-category" href={getLocalizedPath(`/${post.categorySlug}`)} data-title={post.category}>{post.category}</Link>
                            </div>
                            <div className="meta-actions">
                                <span className="action-item like-action" data-title="Like">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                    <span className="count">{post.likes}</span>
                                </span>
                                <span className="action-item dislike-action" data-title="Dislike">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                                    <span className="count">{post.dislikes}</span>
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
