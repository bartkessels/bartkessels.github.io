import { getCollection, type CollectionEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export const getSubjectsForSection = (section: string): Promise<CollectionEntry<'subjects'>[]> =>
  getCollection('subjects', (s) => notUnderscored(s) && s.id.startsWith(`${section}/`));

export const getAllSubjects = (): Promise<CollectionEntry<'subjects'>[]> =>
  getCollection('subjects');

export class SubjectsRepository {
    public async getGardeningSubjects(): Promise<CollectionEntry<'subjects/gardening'>[]> {
        return await getCollection('subjects/gardening', notUnderscored);
    }

    public async getBlogSubjects(): Promise<CollectionEntry<'subjects/blog'>[]> {
      return await getCollection('subjects/blog', notUnderscored);
    }
}