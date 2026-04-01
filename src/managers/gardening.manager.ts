import type { CollectionEntry } from "astro:content";
import type { GardeningRepository } from "@/repositories/gardening.repository";
import type { SubjectsRepository } from "@/repositories/subject.repository";

export class GardeningManager {
    constructor(
        private readonly subjectsRepository: SubjectsRepository,
        private readonly gardeningRepository: GardeningRepository,
    ) {

    }

    public async getAllYears(): Promise<CollectionEntry<'subjects/gardening'>[]> {
        const subjects = await this.subjectsRepository.getGardeningSubjects();
        
        return subjects.sort((a: CollectionEntry<'subjects/gardening'>, b: CollectionEntry<'subjects/gardening'>) =>
            a.data.name.localeCompare(b.data.name)
        );
    }

    public async getYear(year: number): Promise<CollectionEntry<'subjects/gardening'>> {
        const allYears = await this.getAllYears();
        const filteredYears = allYears.filter((y: CollectionEntry<'subjects/gardening'>) =>
            y.id.startsWith(year.toString())
        );

        if (filteredYears.length > 1) {
            throw new Error(`Duplicate years found for '${year}'`);
        } else if (filteredYears.length <= 0) {
            throw new Error(`No year found for '${year}'`);
        }

        return filteredYears.at(0)!;
    }

    public async getAllJournalEntries(): Promise<CollectionEntry<'gardening/journal'>[]> {
        const entries = await this.gardeningRepository.getJournalEntries();
        const sortedEntries = entries
            ?.sort((a: CollectionEntry<'gardening/journal'>, b: CollectionEntry<'gardening/journal'>) =>
                b.data.date.valueOf() - a.data.date.valueOf()
            );

        return sortedEntries ?? [];
    }

    public async getAllPlants(): Promise<CollectionEntry<'gardening/plants'>[]> {
        const plants = await this.gardeningRepository.getPlants();
        const sortedPlants = plants
            ?.sort((a: CollectionEntry<'gardening/plants'>, b: CollectionEntry<'gardening/plants'>) =>
                a.data.name.localeCompare(b.data.name)
            );
    
        return sortedPlants ?? [];
    }

    public async getJournalEntriesForYear(year: CollectionEntry<'subjects/gardening'>): Promise<CollectionEntry<'gardening/journal'>[]> {
        const entries = await this.getAllJournalEntries();

        return entries
            .filter((e: CollectionEntry<'gardening/journal'>) =>
                year.id.includes(e.data.subject)
            );
    }

    public async getPlantsForYear(year: CollectionEntry<'subjects/gardening'>): Promise<CollectionEntry<'gardening/plants'>[]> {
        const plants = await this.getAllPlants();
        const parsedYear = Number.parseInt(year.id);

        return plants
            .filter((p: CollectionEntry<'gardening/plants'>) => p.data.years.includes(parsedYear))
            .sort((a: CollectionEntry<'gardening/plants'>, b: CollectionEntry<'gardening/plants'>) => a.data.name.localeCompare(b.data.name));
    }
}