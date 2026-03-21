import type { StoriesRepository } from "@/repositories/stories.repository";
import type { CollectionEntry } from "astro:content";

export class StoriesManager {
    constructor(
        private readonly repository: StoriesRepository
    ) {

    }
    public async getStories(): Promise<CollectionEntry<'stories'>[]> {
        const stories = await this.repository.getStories();
        return stories.filter(s => !s.data.draft);
    }

    public async getFeaturedStories(): Promise<CollectionEntry<'stories'>[]> {
        const stories = await this.getStories();
        return stories.filter(s => s.data.featured);
    }
}