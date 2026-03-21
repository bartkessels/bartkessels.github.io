import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const getPages = (): Promise<CollectionEntry<'pages'>[]> =>
  getCollection('pages');

export const getPageById = async (id: string): Promise<CollectionEntry<'pages'>> => {
  const entry = await getEntry('pages', id);

  if (entry) {
    return entry;
  }

  throw new Error(`Page '${id}' not found`);
};


export class PagesRepository {
  public async getPage(name: string): Promise<CollectionEntry<'pages'>> {
    const page = await getEntry('pages', name);

    if (!page) {
      throw new Error(`Page '${page}' not found`);
    }

    return page;
  }
}