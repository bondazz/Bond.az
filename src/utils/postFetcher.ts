import { supabase } from './supabase';
import { Post } from '@/data/posts';

export async function getPosts(lang?: string, categorySlug?: string, page: number = 1, limit: number = 30) {
    const offset = (page - 1) * limit;
    
    // Use native fetch to enable aggressive Next.js caching and bypass supabase-js client overhead
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let url = `${supabaseUrl}/rest/v1/posts?select=id,common_id,lang,title,category,category_slug,slug,image,summary,likes,dislikes,views,date,author,audio_url,authors(name,avatar,job_title,slug)&order=id.desc&offset=${offset}&limit=${limit}`;
    if (lang) url += `&lang=eq.${lang}`;
    if (categorySlug) url += `&category_slug=eq.${categorySlug}`;

    const response = await fetch(url, {
        headers: {
            'apikey': anonKey!,
            'Authorization': `Bearer ${anonKey!}`
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Error fetching posts:', await response.text());
        return [];
    }
    
    const data = await response.json();

    return data.map((p: any) => ({
        id: p.id,
        commonId: p.common_id,
        lang: p.lang,
        title: p.title,
        category: p.category,
        categorySlug: p.category_slug,
        slug: p.slug,
        image: p.image,
        summary: p.summary,
        likes: p.likes,
        dislikes: p.dislikes,
        views: p.views,
        date: p.date,
        author: p.authors?.name || p.author,
        authorAvatar: p.authors?.avatar,
        authorJobTitle: p.authors?.job_title,
        authorId: p.author_id,
        authorSlug: p.authors?.slug,
        audio_url: p.audio_url
    })) as Post[];
}

export async function getPostBySlug(slug: string, lang: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const url = `${supabaseUrl}/rest/v1/posts?select=*,authors(name,avatar,job_title,slug)&slug=eq.${slug}&lang=eq.${lang}&limit=1`;
    
    const response = await fetch(url, {
        headers: {
            'apikey': anonKey!,
            'Authorization': `Bearer ${anonKey!}`,
            'Accept': 'application/vnd.pgrst.object+json'
        },
        cache: 'no-store'
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data) return null;

    // FAIL-SAFE: If join failed but author_id exists, fetch author separately
    let authorDetails = data.authors;
    if (!authorDetails && data.author_id) {
        const authUrl = `${supabaseUrl}/rest/v1/authors?select=name,avatar,job_title,slug&id=eq.${data.author_id}&limit=1`;
        const authRes = await fetch(authUrl, {
            headers: {
                'apikey': anonKey!,
                'Authorization': `Bearer ${anonKey!}`,
                'Accept': 'application/vnd.pgrst.object+json'
            },
            cache: 'no-store'
        });
        if (authRes.ok) {
            authorDetails = await authRes.json();
        }
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
        author: authorDetails?.name || data.author,
        authorAvatar: authorDetails?.avatar,
        authorJobTitle: authorDetails?.job_title,
        authorId: data.author_id,
        authorSlug: authorDetails?.slug,
        audio_url: data.audio_url
    } as Post;
}

export async function getRelatedPostsByCommonId(commonId: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('lang, category_slug, slug')
        .eq('common_id', commonId);

    if (error || !data) {
        console.error('Error fetching related posts:', error);
        return [];
    }

    return data.map(p => ({
        lang: p.lang,
        categorySlug: p.category_slug,
        slug: p.slug
    }));
}

export async function getPostsByTag(tag: string, lang: string, page: number = 1, limit: number = 30) {
    const offset = (page - 1) * limit;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // We search for the tag in both title and content using ILIKE
    // Note: If you have a specific 'tags' column, use that instead.
    const url = `${supabaseUrl}/rest/v1/posts?select=id,common_id,lang,title,category,category_slug,slug,image,summary,likes,dislikes,views,date,author,authors(name,avatar,job_title,slug)&lang=eq.${lang}&or=(title.ilike.*${tag}*,content.ilike.*${tag}*)&order=id.desc&offset=${offset}&limit=${limit}`;

    const response = await fetch(url, {
        headers: {
            'apikey': anonKey!,
            'Authorization': `Bearer ${anonKey!}`
        },
        cache: 'no-store'
    });

    if (!response.ok) return [];
    const data = await response.json();

    return data.map((p: any) => ({
        id: p.id,
        commonId: p.common_id,
        lang: p.lang,
        title: p.title,
        category: p.category,
        categorySlug: p.category_slug,
        slug: p.slug,
        image: p.image,
        summary: p.summary,
        likes: p.likes,
        dislikes: p.dislikes,
        views: p.views,
        date: p.date,
        author: p.authors?.name || p.author,
        authorAvatar: p.authors?.avatar,
        authorJobTitle: p.authors?.job_title,
        authorSlug: p.authors?.slug,
    })) as Post[];
}

export async function getCategoryBySlug(slug: string, lang: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const url = `${supabaseUrl}/rest/v1/categories?select=*&slug=eq.${slug}&lang=eq.${lang}&limit=1`;
    
    const response = await fetch(url, {
        headers: {
            'apikey': anonKey!,
            'Authorization': `Bearer ${anonKey!}`,
            'Accept': 'application/vnd.pgrst.object+json'
        },
        cache: 'no-store'
    });

    if (!response.ok) return null;
    return await response.json();
}

export async function getTagBySlug(slug: string, lang: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const url = `${supabaseUrl}/rest/v1/tags?select=*&slug=eq.${slug}&lang=eq.${lang}&limit=1`;
    
    const response = await fetch(url, {
        headers: {
            'apikey': anonKey!,
            'Authorization': `Bearer ${anonKey!}`,
            'Accept': 'application/vnd.pgrst.object+json'
        },
        cache: 'no-store'
    });

    if (!response.ok) return null;
    return await response.json();
}
