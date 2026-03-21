import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';
import { type BlogEntry } from '@/models/blog.model';

export const getBlogPosts = (): Promise<BlogEntry[]> =>
  getCollection('blog', (e) => notUnderscored(e) && !e.data.draft);

export const getBlogPostBySlug = async (slug: string): Promise<BlogEntry> => {
  const entry = await getEntry('blog', slug);

  if (entry && !entry.data.draft) {
    return entry;
  }

  throw new Error(`Blog post '${slug}' not found`)
}

export class BlogRepository {
  public async getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
    return getCollection('blog', notUnderscored);
  }
}