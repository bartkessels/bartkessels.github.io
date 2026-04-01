import type { CollectionEntry } from "astro:content";
import type { PageManager } from "@/managers/page.manager";
import type { SoftwareManager } from "@/managers/software.manager";

export class SoftwareViewModel {
    constructor(
        private readonly softwareManager: SoftwareManager,
        private readonly pageManager: PageManager
    ) {

    }

    public async getOverview(): Promise<OverviewPage> {
        const page = await this.pageManager.getSoftwarePage();
        const projects = await this.softwareManager.getProjects();

        return {
            page: page,
            projects: projects
        };
    }

    public async getSoftwarePages(): Promise<SoftwarePage[]> {
        const projects = await this.softwareManager.getProjects();

        return projects.map((p: CollectionEntry<'software'>) => ({
            project: p
        }));
    }
}

export interface OverviewPage {
    page: CollectionEntry<'pages'>,
    projects: CollectionEntry<'software'>[]
}

export interface SoftwarePage {
    project: CollectionEntry<'software'>
}