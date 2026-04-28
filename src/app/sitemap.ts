import { MetadataRoute } from 'next';
import { getPosts } from '@/utils/postFetcher';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bond.az';
  const langs = ['az', 'en', 'ru'];
  const categories = ['siyaset', 'biznes', 'iqtisadiyyat', 'seyahet', 'cemiyyet', 'dunya', 'idman', 'texnologiya'];

  // Base URLs
  const routes = langs.flatMap((lang) => [
    {
      url: `${baseUrl}${lang === 'az' ? '' : `/${lang}`}`,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `${baseUrl}${lang === 'az' ? '' : `/${lang}`}/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
  ]);

  // Fetch all posts (limit 1000 for sitemap)
  const posts = await getPosts(undefined, undefined, 1, 1000);
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}${post.lang === 'az' ? '' : `/${post.lang}`}/${post.categorySlug}/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes];
}
