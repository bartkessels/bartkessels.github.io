import { type CollectionEntry, getCollection } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class StoriesRepository {
    public async getStories(): Promise<CollectionEntry<'stories'>[]> {
        return await getCollection('stories', notUnderscored);
    }
}