import type { CollectionEntry } from "astro:content";
import type { SoftwareRepository } from "@/repositories/software.repository";

export class SoftwareManager {
    constructor(
        private readonly softwareRepository: SoftwareRepository,
    ) {

    }

    public async getProjects(): Promise<CollectionEntry<'software'>[]> {
        const projects = await this.softwareRepository.getProjects();

        return projects
            .filter((p: CollectionEntry<'software'>) => !p.data.draft)
            .sort((a: CollectionEntry<'software'>, b: CollectionEntry<'software'>) => a.data.name.localeCompare(b.data.name));
    }

    public async getFeaturedProjects(maxNumberOfProjects?: number): Promise<CollectionEntry<'software'>[]> {
        const projects = await this.getProjects();
        const featuredProjects = projects.filter((p: CollectionEntry<'software'>) => p.data.featured);
        const maxProjects = maxNumberOfProjects ?? featuredProjects.length;

        return featuredProjects.slice(0, maxProjects);
    }
}