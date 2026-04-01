import { type CollectionEntry, getCollection } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class BackpackingRepository {
    public async getTrails(): Promise<CollectionEntry<'backpacking/trails'>[]> {
        return await getCollection('backpacking/trails', notUnderscored);
    }

    public async getPosts(): Promise<CollectionEntry<'backpacking/posts'>[]> {
        return await getCollection('backpacking/posts', notUnderscored);
    }

    public async getSections(): Promise<CollectionEntry<'backpacking/sections'>[]> {
        return await getCollection('backpacking/sections', notUnderscored);
    }
}