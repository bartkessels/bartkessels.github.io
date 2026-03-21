import type { GardeningManager } from "@/managers/gardening.manager";
import { subjectSlug } from "@/utils/content";
import type { CollectionEntry } from "astro:content";

export class GardeningViewModel {
    constructor(
        private readonly manager: GardeningManager
    ) {

    }

    public async getOverviewPage(): Promise<GardeningOverviewViewState> {
        const years = await this.manager.getAllYears();
        const pagesPerYear = new Map<CollectionEntry<'subjects/gardening'>, GardeningOverviewPageModel>();

        for (const year of years) {
            const journalEntries = await this.manager.getJournalItemsForYear(year.id);
            const plants = await this.manager.getPlantsForYear(year.id);
            const plantsByCategory = Map.groupBy(plants, p => p.data.category ?? 'Other');

            pagesPerYear.set(year, {
                journalEntries: journalEntries,
                plants: plantsByCategory
            });
        }

        return {
            years: years,
            content: {
                pagesPerYear: pagesPerYear
            }
        };
    }

    public async getYearPages(): Promise<GardeningYearOverviewViewState[]> {
        const years = await this.manager.getAllYears();
        const result: GardeningYearOverviewViewState[] = [];

        for (const year of years) {
            const journalEntries = await this.manager.getJournalItemsForYear(year.id);
            const plants = await this.manager.getPlantsForYear(year.id);
            const plantsByCategory = Map.groupBy(plants, p => p.data.category ?? 'Other');

            result.push({
                year,
                years,
                slug: subjectSlug(year.id),
                content: {
                    journalEntries: journalEntries,
                    plants: plantsByCategory
                }
            });
        }

        return result;
    }

    public async getJournalPages(): Promise<GardeningJournalViewState[]> {
        const journals = await this.manager.getAllJournalEntries();
        const result: GardeningJournalViewState[] = [];

        for (const journal of journals) {
            const year = await this.manager.getYear(journal.data.date.getFullYear());

            result.push({
                slug: subjectSlug(journal.id),
                year: year,
                content: {
                    journalEntry: journal
                }
            });
        }

        return result;
    }

    public async getPlantPages(): Promise<GardeningPlantViewState[]> {
        const plants = await this.manager.getAllPlants();
        
        return plants.map(p => ({
            slug: subjectSlug(p.id),
            content: {
                plant: p
            }
        }));
    }
}

export interface GardeningOverviewViewState {
    years: CollectionEntry<'subjects/gardening'>[],
    content: {
        pagesPerYear: Map<CollectionEntry<'subjects/gardening'>, GardeningOverviewPageModel>
    }
}

export interface GardeningOverviewPageModel {
    journalEntries: CollectionEntry<'gardening/journal'>[],
    plants: Map<string, CollectionEntry<'gardening/plants'>[]>
}

export interface GardeningYearOverviewViewState {
    years: CollectionEntry<'subjects/gardening'>[],
    year: CollectionEntry<'subjects/gardening'>,
    slug: string,
    content: GardeningOverviewPageModel
}

export interface GardeningJournalViewState {
    slug: string,
    year: CollectionEntry<'subjects/gardening'>,
    content: {
        journalEntry: CollectionEntry<'gardening/journal'>
    }
}

export interface GardeningPlantViewState {
    slug: string,
    content: {
        plant: CollectionEntry<'gardening/plants'>
    }
}
