import { supabase } from './supabase';
import { Post } from '@/data/posts';

export async function getPosts(lang?: string, categorySlug?: string, page: number = 1, limit: number = 30) {
    let query = supabase.from('posts').select('*');

    if (lang) {
        query = query.eq('lang', lang);
    }

    if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
    }

    const offset = (page - 1) * limit;
    const { data, error } = await query
        .order('id', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    // Map DB underscore_case to JS camelCase
    return data.map(p => ({
        id: p.id,
        commonId: p.common_id,
        lang: p.lang,
        title: p.title,
        category: p.category,
        categorySlug: p.category_slug,
        slug: p.slug,
        image: p.image,
        summary: p.summary,
        content: p.content,
        likes: p.likes,
        dislikes: p.dislikes,
        views: p.views,
        date: p.date,
        author: p.author,
        audio_url: p.audio_url
    })) as Post[];
}

export async function getPostBySlug(slug: string, lang: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('lang', lang)
        .single();

    if (error || !data) {
        console.error('Error fetching post:', error);
        return null;
    }

    return {
        id: data.id,
        commonId: data.common_id,
        lang: data.lang,
        title: data.title,
        category: data.category,
        categorySlug: data.category_slug,
        slug: data.slug,
        image: data.image,
        summary: data.summary,
        content: data.content,
        likes: data.likes,
        dislikes: data.dislikes,
        views: data.views,
        date: data.date,
        author: data.author,
        audio_url: data.audio_url
    } as Post;
}
