import { getCollection, type CollectionEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export const getSoftware = (): Promise<CollectionEntry<'software'>[]> =>
  getCollection('software', (e) => notUnderscored(e) && !e.data.draft);
