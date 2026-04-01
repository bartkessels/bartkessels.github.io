import { type CollectionEntry, getCollection, getEntry } from 'astro:content';

export class PagesRepository {
    public async getPage(name: string): Promise<CollectionEntry<'pages'>> {
        const page = await getEntry('pages', name);

        if (!page) {
            throw new Error(`Page '${page}' not found`);
        }

        return page;
    }

    public async getPages(): Promise<CollectionEntry<'pages'>[]> {
        return await getCollection('pages');
    }
}