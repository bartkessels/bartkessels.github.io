import { getCollection, type CollectionEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export const getGardeningJournal = (): Promise<CollectionEntry<'gardening/journal'>[]> =>
  getCollection('gardening/journal', (e) => notUnderscored(e) && !e.data.draft);

export const getGardeningPlants = (): Promise<CollectionEntry<'gardening/plants'>[]> =>
  getCollection('gardening/plants', notUnderscored);

export const getGardeningPlantsByYear = async (year: number): Promise<CollectionEntry<'gardening/plants'>[]> => {
  const plants = await getGardeningPlants();

  return plants.filter(p => p.data.years.includes(year));
}

export class GardeningRepository {
  public async getJournalEntries(): Promise<CollectionEntry<'gardening/journal'>[]> {
    return await getCollection('gardening/journal', notUnderscored);
  }

  public async getPlants(): Promise<CollectionEntry<'gardening/plants'>[]> {
    return await getCollection('gardening/plants', notUnderscored);
  }
}