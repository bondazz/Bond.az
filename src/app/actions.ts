'use server';

import { getPosts, getPostsByTag } from '@/utils/postFetcher';

export async function fetchMorePosts(lang: string, categorySlug: string | undefined, page: number, tag?: string) {
    if (tag) {
        return await getPostsByTag(tag, lang, page, 15);
    }
    // We load 15 more starting from the next batch
    return await getPosts(lang, categorySlug, page, 15);
}
