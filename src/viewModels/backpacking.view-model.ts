import type { BackpackingManager } from "@/managers/backpacking.manager";
import { formatDate, kmToMiles } from "@/utils/content";
import type { CollectionEntry } from "astro:content";

export class BackpackingViewModel {
    constructor(
        private readonly manager: BackpackingManager
    ) {

    }

    public async getOverviewPage(): Promise<BackpackingOverviewViewState> {
        const trails = await this.manager.getTrails();
        const posts = await this.manager.getPosts();

        const years = trails.map(t => t.data.date.getFullYear());
        const trailsByYear: TrailsByYear[] = years.map(year => {
            const currentTrails = trails.filter(t => t.data.date.getFullYear() === year);

            return {
                year: year,
                trails: currentTrails
            };
        });

        return {
            trails: trailsByYear,
            posts: posts
        };
    }

    public async getTrailPages(): Promise<BackpackingTrailViewState[]> {
        const trails = await this.manager.getTrails();
        const result: BackpackingTrailViewState[] = [];

        for (const trail of trails) {
            const sections = await this.manager.getSections(trail);
            const distanceInMiles = kmToMiles(trail.data.distanceKm);

            result.push({
                trail: trail,
                distanceInMiles: distanceInMiles,
                formattedDate: formatDate(trail.data.date),
                sections: sections
            });
        }

        return result;
    }

    public async getSectionsPage(): Promise<BackpackingSectionPageViewState[]> {
        const trails = await this.manager.getTrails();
        const result: BackpackingSectionPageViewState[] = [];

        for (const trail of trails) {
            const sections = await this.manager.getSections(trail);

            sections.forEach((section, idx) => {
                const formattedDate = formatDate(section.data.date);
                
                result.push({
                    trail: trail,
                    section: section,
                    formattedDate: formattedDate,
                    prevSection: idx > 0 ? sections[idx - 1] : null,
                    nextSection: idx < sections.length - 1 ? sections[idx + 1] : null,
                    sectionOrder: idx + 1
                });
            });
        }

        return result;
    }

    public async getPostsPage(): Promise<BackpackingPostsPageViewState[]> {
        const posts = await this.manager.getPosts();

        return posts.map(p => ({
            formattedDate: formatDate(p.data.date),
            slug: p.id,
            post: p
        }));
    }
}

export interface BackpackingOverviewViewState {
    trails: TrailsByYear[],
    posts: CollectionEntry<'backpacking/posts'>[]
}

export interface BackpackingSectionPageViewState {
    trail: CollectionEntry<'backpacking/trails'>,
    formattedDate: string,
    section: CollectionEntry<'backpacking/sections'>,
    prevSection: CollectionEntry<'backpacking/sections'> | null,
    nextSection: CollectionEntry<'backpacking/sections'> | null,
    sectionOrder: number
}

export interface BackpackingPostsPageViewState {
    slug: string,
    formattedDate: string,
    post: CollectionEntry<'backpacking/posts'>
}

export interface BackpackingTrailViewState {
    trail: CollectionEntry<'backpacking/trails'>,
    distanceInMiles: number,
    formattedDate: string,
    sections: CollectionEntry<'backpacking/sections'>[]
}

export interface TrailsByYear {
    year: number,
    trails: CollectionEntry<'backpacking/trails'>[]
}