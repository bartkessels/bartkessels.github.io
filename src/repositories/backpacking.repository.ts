import { getCollection, type CollectionEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export const getBackpackingTrails = (): Promise<CollectionEntry<'backpacking/trails'>[]> =>
  getCollection('backpacking/trails', (e) => notUnderscored(e) && !e.data.draft);

export const getBackpackingPosts = (): Promise<CollectionEntry<'backpacking/posts'>[]> =>
  getCollection('backpacking/posts', (e) => notUnderscored(e) && !e.data.draft);

export const getBackpackingSections = async (trail: { id: string; data: { sections: string[] } }): Promise<CollectionEntry<'backpacking/sections'>[]> => {
  const sections = await getCollection('backpacking/sections', (e) => notUnderscored(e) && !e.data.draft);
  return sections.filter(s => s.id.startsWith(trail.id));
}

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