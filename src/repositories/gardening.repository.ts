import { type CollectionEntry, getCollection } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export class GardeningRepository {
    public async getJournalEntries(): Promise<CollectionEntry<'gardening/journal'>[]> {
        return await getCollection('gardening/journal', notUnderscored);
    }

    public async getPlants(): Promise<CollectionEntry<'gardening/plants'>[]> {
        return await getCollection('gardening/plants', notUnderscored);
    }
}