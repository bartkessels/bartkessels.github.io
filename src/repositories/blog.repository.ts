import { type CollectionEntry, getCollection, getEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class BlogRepository {
    public async getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
        return getCollection('blog', notUnderscored);
    }

    public async getBlogPost(id: string): Promise<CollectionEntry<'blog'> | null> {
        const entry = await getEntry('blog', id);

        if (!entry) {
            return null;
        }

        return entry;
    }
}