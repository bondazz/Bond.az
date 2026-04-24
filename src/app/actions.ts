'use server';

import { getPosts } from '@/utils/postFetcher';

export async function fetchMorePosts(lang: string, categorySlug: string | undefined, page: number) {
    // We load 15 more starting from the next batch
    return await getPosts(lang, categorySlug, page, 15);
}
