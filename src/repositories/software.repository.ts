import { type CollectionEntry, getCollection } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class SoftwareRepository {
    public async getProjects(): Promise<CollectionEntry<'software'>[]> {
        return await getCollection('software', notUnderscored);
    }
}