import { formatDate, kmToMiles } from "@/utils/content";
import type { BackpackingManager } from "@/managers/backpacking.manager";
import type { CollectionEntry } from "astro:content";
import type { PageManager } from "@/managers/page.manager";

export class BackpackingViewModel {
    constructor(
        private readonly backpackingManager: BackpackingManager,
        private readonly pageManager: PageManager
    ) {

    }

    public async getOverviewPage(): Promise<OverviewPage> {
        const page = await this.pageManager.getBackpackingPage();
        const trails = await this.getTrailsByYear();
        const posts = await this.backpackingManager.getPosts();

        return {
            page: page,
            trailsByYear: trails,
            posts: posts
        };
    }

    public async getTrailPages(): Promise<TrailPage[]> {
        const trails = await this.backpackingManager.getTrails();
        const result: TrailPage[] = [];

        for (const trail of trails) {
            const sections = await this.backpackingManager.getSections(trail);
            const distanceInMiles = kmToMiles(trail.data.distanceKm);

            result.push({
                trail: trail,
                sections: sections,
                formattedDate: formatDate(trail.data.date),
                distanceInMiles: distanceInMiles
            });
        }

        return result;
    }

    public async getSectionPages(): Promise<SectionPage[]> {
        const trails = await this.backpackingManager.getTrails();
        const result: SectionPage[] = [];

        for (const trail of trails) {
            const sections = await this.backpackingManager.getSections(trail);
            
            sections.forEach((section: CollectionEntry<'backpacking/sections'>, index: number) => {
                const formattedDate = formatDate(section.data.date);
                const previousSection = this.backpackingManager.getPreviousSection(sections, section);
                const nextSection = this.backpackingManager.getNextSection(sections, section);

                result.push({
                    trail: trail,
                    section: section,
                    formattedDate: formattedDate,
                    sectionNumber: index + 1,
                    previousSection: previousSection,
                    nextSection: nextSection
                });
            });
        }

        return result;
    }

    public async getPostPages(): Promise<PostPage[]> {
        const posts = await this.backpackingManager.getPosts();

        return posts.map((post: CollectionEntry<'backpacking/posts'>) => ({
            post: post,
            formattedDate: formatDate(post.data.date)
        }));
    }

    private async getTrailsByYear(): Promise<TrailsByYear[]> {
        const trails = await this.backpackingManager.getTrails();
        const years = trails.map((t: CollectionEntry<'backpacking/trails'>) => t.data.date.getFullYear());
        
        return years.map((year: number) => {
            const currentTrails = trails
                .filter((t: CollectionEntry<'backpacking/trails'>) => t.data.date.getFullYear() === year);

            return {
                year: year,
                trails: currentTrails
            };
        });
    }
}

export interface OverviewPage {
    page: CollectionEntry<'pages'>,
    trailsByYear: TrailsByYear[],
    posts: CollectionEntry<'backpacking/posts'>[]
}

export interface TrailPage {
    trail: CollectionEntry<'backpacking/trails'>,
    sections: CollectionEntry<'backpacking/sections'>[],
    formattedDate: string,
    distanceInMiles: number
}

export interface SectionPage {
    trail: CollectionEntry<'backpacking/trails'>,
    section: CollectionEntry<'backpacking/sections'>,
    formattedDate: string,
    sectionNumber: number,
    previousSection: CollectionEntry<'backpacking/sections'> | null,
    nextSection: CollectionEntry<'backpacking/sections'> | null
}

export interface PostPage {
    post: CollectionEntry<'backpacking/posts'>,
    formattedDate: string
}

export interface TrailsByYear {
    year: number,
    trails: CollectionEntry<'backpacking/trails'>[]
}