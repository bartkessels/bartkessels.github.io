import type { BackpackingRepository } from "@/repositories/backpacking.repository";
import type { CollectionEntry } from "astro:content";

export class BackpackingManager {
    constructor(
        private readonly backpackingRepository: BackpackingRepository
    ) {
        
    }

    public async getTrails(): Promise<CollectionEntry<'backpacking/trails'>[]> {
        const trails = await this.backpackingRepository.getTrails();

        return trails
            .filter((t: CollectionEntry<'backpacking/trails'>) => !t.data.draft)
            .sort((a: CollectionEntry<'backpacking/trails'>, b: CollectionEntry<'backpacking/trails'>) => b.data.date.valueOf() - a.data.date.valueOf());
    }

    public async getLatestTrails(maxNumberOfTrails?: number): Promise<CollectionEntry<'backpacking/trails'>[]> {
        const trails = await this.getTrails();
        const maxTrails = maxNumberOfTrails ?? trails.length;

        return trails.slice(0, maxTrails);
    }

    public async getSections(trail: CollectionEntry<'backpacking/trails'>): Promise<CollectionEntry<'backpacking/sections'>[]> {
        const sections = await this.backpackingRepository.getSections();

        return sections
            .filter((s: CollectionEntry<'backpacking/sections'>) => !s.data.draft)
            .filter((s: CollectionEntry<'backpacking/sections'>) => trail.data.sections.includes(s.id))
            .sort((a: CollectionEntry<'backpacking/sections'>, b: CollectionEntry<'backpacking/sections'>) => a.data.date.valueOf() - b.data.date.valueOf());
    }

    public getPreviousSection(sections: CollectionEntry<'backpacking/sections'>[], section: CollectionEntry<'backpacking/sections'>): CollectionEntry<'backpacking/sections'> | null {
        const index = sections.indexOf(section);

        if (index <= 0) {
            return null;
        }

        return sections.at(index - 1) ?? null;
    }

    public getNextSection(sections: CollectionEntry<'backpacking/sections'>[], section: CollectionEntry<'backpacking/sections'>): CollectionEntry<'backpacking/sections'> | null {
        const index = sections.indexOf(section);

        if (index >= sections.length) {
            return null;
        }

        return sections.at(index + 1) ?? null;
    }

    public async getPosts(): Promise<CollectionEntry<'backpacking/posts'>[]> {
        const posts = await this.backpackingRepository.getPosts();
        
        return posts.filter((p: CollectionEntry<'backpacking/posts'>) => !p.data.draft);
    }

    public async getPostsForYear(year: number): Promise<CollectionEntry<'backpacking/posts'>[]> {
        const posts = await this.getPosts();
        return posts.filter((p: CollectionEntry<'backpacking/posts'>) => p.data.date.getFullYear() === year);
    }
}