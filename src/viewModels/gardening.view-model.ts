import type { CollectionEntry } from "astro:content";
import { formatDate } from "@/utils/content";
import type { GardeningManager } from "@/managers/gardening.manager";
import type { PageManager } from "@/managers/page.manager";
import type { SimplifiedSubject } from "@/models/subject.model";

export class GardeningViewModel {
    constructor(
        private readonly gardeningManager: GardeningManager,
        private readonly pageManager: PageManager
    ) {

    }

    public async getOverviewPage(): Promise<OverviewPage> {
        const page = await this.pageManager.getGardeningPage();
        const pagesPerYear = await this.getPagesPerYear();
        const simplifiedSubjects = this.getSimplifiedSubjects(pagesPerYear);

        return {
            page: page,
            itemsPerYear: pagesPerYear,
            subjects: simplifiedSubjects
        };
    }

    public async getYearOverviewPages(): Promise<YearOverviewPage[]> {
        const pagesPerYear = await this.getPagesPerYear();
        const simplifiedSubjects = this.getSimplifiedSubjects(pagesPerYear);

        return pagesPerYear.map((p: PagesPerYear) => ({
            year: p.year,
            journalEntries: p.journalEntries,
            plants: p.plants,
            subjects: simplifiedSubjects
        }));
    }

    public async getJournalPages(): Promise<JournalPage[]> {
        const journalEntries = await this.gardeningManager.getAllJournalEntries();
        const result: JournalPage[] = [];

        for (const journalEntry of journalEntries) {
            result.push({
                journalEntry: journalEntry,
                formattedDate: formatDate(journalEntry.data.date)
            });
        }

        return result;
    }

    public async getPlantPages(): Promise<PlantPage[]> {
        const plants = await this.gardeningManager.getAllPlants();

        return plants.map((p: CollectionEntry<'gardening/plants'>) => ({
            plant: p
        }));
    }

    private getSimplifiedSubjects(pagesPerYear: PagesPerYear[]): SimplifiedSubject[] {
        return pagesPerYear.map((p: PagesPerYear) => ({
            href: p.year.data.href ?? p.year.id,
            name: p.year.data.name
        }));
    }

    private async getPagesPerYear(): Promise<PagesPerYear[]> {
        const years = await this.gardeningManager.getAllYears();
        const result: PagesPerYear[] = [];

        for (const year of years) {
            const journalEntries = await this.gardeningManager.getJournalEntriesForYear(year);
            const plants = await this.gardeningManager.getPlantsForYear(year);
            const plantsByCategory = this.mapPlantsToCategory(plants);

            result.push({
                year: year,
                journalEntries: journalEntries,
                plants: plantsByCategory
            });
        }

        return result
            .sort((a: PagesPerYear, b: PagesPerYear) => b.year.id.localeCompare(a.year.id));
    }

    private mapPlantsToCategory(plants: CollectionEntry<'gardening/plants'>[]): PlantsPerCategory[] {
        const defaultCategory = 'Other';
        const mappedPlants = Map.groupBy(plants, (p: CollectionEntry<'gardening/plants'>) => p.data.category ?? defaultCategory);
        const result: PlantsPerCategory[] = [];

        for (const [category, plants] of mappedPlants) {
            result.push({
                category: category,
                plants: plants
            });
        }

        return result;
    }
}

export interface OverviewPage {
    page: CollectionEntry<'pages'>,
    itemsPerYear: PagesPerYear[],
    subjects: SimplifiedSubject[]
}

export interface YearOverviewPage extends PagesPerYear {
    subjects: SimplifiedSubject[]
}

export interface JournalPage {
    journalEntry: CollectionEntry<'gardening/journal'>;
    formattedDate: string;
}

export interface PlantPage {
    plant: CollectionEntry<'gardening/plants'>
}

export interface PagesPerYear {
    year: CollectionEntry<'subjects/gardening'>,
    journalEntries: CollectionEntry<'gardening/journal'>[],
    plants: PlantsPerCategory[]
}

export interface PlantsPerCategory {
    category: string,
    plants: CollectionEntry<'gardening/plants'>[]
}
