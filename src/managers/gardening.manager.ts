import { GardeningRepository } from "@/repositories/gardening.repository";
import type { SubjectsRepository } from "@/repositories/subject.repository";
import type { CollectionEntry } from "astro:content";

export class GardeningManager {
    private static subject: string = 'gardening';

    constructor(
        private readonly subjectsRepository: SubjectsRepository,
        private readonly gardeningRepository: GardeningRepository
    ) {

    }

    public async getAllYears(): Promise<CollectionEntry<'subjects/gardening'>[]> {
        return await this.subjectsRepository.getGardeningSubjects();
    }

    public async getYear(year: number): Promise<CollectionEntry<'subjects/gardening'>> {
        const allYears = await this.getAllYears();
        const filteredYears = allYears.filter(y => y.id.startsWith(year.toString()));

        if (filteredYears.length > 1) {
            throw new Error(`Duplicate years found for '${year}'`);
        } else if (filteredYears.length <= 0) {
            throw new Error(`No year found for '${year}'`);
        }

        return filteredYears.at(0)!;
    }

    public async getAllJournalEntries(): Promise<CollectionEntry<'gardening/journal'>[]> {
        const entries = await this.gardeningRepository.getJournalEntries();
        return entries ?? [];
    }

    public async getAllPlants(): Promise<CollectionEntry<'gardening/plants'>[]> {
        const plants = await this.gardeningRepository.getPlants();
        return plants ?? [];
    }

    public async getJournalItemsForYear(year: string): Promise<CollectionEntry<'gardening/journal'>[]> {
        const entries = await this.getAllJournalEntries();
        const parsedYear = Number.parseInt(year);

        return entries
            .filter(e => e.data.date.getFullYear() === parsedYear)
            .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
    }

    public async getPlantsForYear(year: string): Promise<CollectionEntry<'gardening/plants'>[]> {
        const plants = await this.getAllPlants();
        const parsedYear = Number.parseInt(year);

        return plants
            .filter(p => p.data.years.includes(parsedYear))
            .sort((a, b) => a.data.name.localeCompare(b.data.name));
    }
}