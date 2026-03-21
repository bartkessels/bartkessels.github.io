import type { BackpackingRepository } from "@/repositories/backpacking.repository";
import type { SubjectsRepository } from "@/repositories/subject.repository";
import type { CollectionEntry } from "astro:content";

export class BackpackingManager {
    constructor(
        private readonly subjectsRepository: SubjectsRepository,
        private readonly backpackingRepository: BackpackingRepository
    ) {
        
    }

    public async getTrails(): Promise<CollectionEntry<'backpacking/trails'>[]> {
        const trails = await this.backpackingRepository.getTrails();

        return trails.filter(t => !t.data.draft);
    }

    public async getSections(trail: CollectionEntry<'backpacking/trails'>): Promise<CollectionEntry<'backpacking/sections'>[]> {
        const sections = await this.backpackingRepository.getSections();

        return sections
            .filter(s => !s.data.draft)
            .filter(s => trail.data.sections.includes(s.id));
    }

    public async getPosts(): Promise<CollectionEntry<'backpacking/posts'>[]> {
        const posts = await this.backpackingRepository.getPosts();
        
        return posts.filter(p => !p.data.draft);
    }
}