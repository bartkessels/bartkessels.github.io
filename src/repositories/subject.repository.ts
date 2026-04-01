import { type CollectionEntry, getCollection } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class SubjectsRepository {
    public async getGardeningSubjects(): Promise<CollectionEntry<'subjects/gardening'>[]> {
        return await getCollection('subjects/gardening', notUnderscored);
    }

    public async getBlogSubjects(): Promise<CollectionEntry<'subjects/blog'>[]> {
        return await getCollection('subjects/blog', notUnderscored);
    }
}