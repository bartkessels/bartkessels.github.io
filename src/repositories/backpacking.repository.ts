import { type CollectionEntry, getCollection } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class BackpackingRepository {
    public async getTrails(): Promise<CollectionEntry<'backpacking/trails'>[]> {
        return await getCollection('backpacking/trails', notUnderscored);
    }

    public async getPosts(): Promise<CollectionEntry<'backpacking/posts'>[]> {
        return await getCollection('backpacking/posts', notUnderscored);
    }

    public async getSections(ids: string[]): Promise<CollectionEntry<'backpacking/sections'>[]> {
        const sections = await getCollection('backpacking/sections', notUnderscored);
        const sectionsById = new Map(sections.map((s: CollectionEntry<'backpacking/sections'>) => [s.id, s]));

        return ids
            .map((id: string) => sectionsById.get(id))
            .filter((s: CollectionEntry<'backpacking/sections'> | undefined) => s !== undefined);
    }
}