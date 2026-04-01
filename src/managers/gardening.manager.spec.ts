import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CollectionEntry } from "astro:content";
import { GardeningManager } from "./gardening.manager";
import type { GardeningRepository } from "@/repositories/gardening.repository";
import type { SubjectsRepository } from "@/repositories/subject.repository";

describe('GardeningManager', (): void => {
    function makeSubject(year: string): CollectionEntry<'subjects/gardening'> {
        return { id: year, data: { name: year } } as CollectionEntry<'subjects/gardening'>;
    }

    function makeJournalEntry(name: string, date: Date, year: CollectionEntry<'subjects/gardening'>): CollectionEntry<'gardening/journal'> {
        return { id: name, data: { title: name, date: date, subject: year.id } } as CollectionEntry<'gardening/journal'>;
    }

    function makePlant(name: string, year: number): CollectionEntry<'gardening/plants'> {
        return { id: name, data: { name: name, years: [year] } } as CollectionEntry<'gardening/plants'>;
    }

    const mockGetSubject = vi.fn();
    const mockGetJournalEntries = vi.fn();
    const mockGetPlants = vi.fn();

    const mockSubjectsRepository = {
        getGardeningSubjects: mockGetSubject,
        getBlogSubjects: vi.fn()
    } as SubjectsRepository;

    const mockGardeningRepository = {
        getJournalEntries: mockGetJournalEntries,
        getPlants: mockGetPlants
    } as GardeningRepository;

    const manager = new GardeningManager(mockSubjectsRepository, mockGardeningRepository);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getAllYears', (): void => {
        it('should return an empty array when the repository has no subjects', async (): Promise<void> => {
            // Arrange
            mockGetSubject.mockReturnValue([]);

            // Act
            const result = await manager.getAllYears();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all years from the repository', async (): Promise<void> => {
            // Arrange
            const year1 = makeSubject('2024');
            const year2 = makeSubject('2025');

            mockGetSubject.mockReturnValue([year2, year1]);

            // Act
            const result = await manager.getAllYears();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(year1);
            expect(result[1]).toBe(year2);
        });
    });

    describe('getYear', (): void => {
        it('should throw an error when there are multiple years with the same id', async (): Promise<void> => {
            // Arrange
            const year = makeSubject('2024');

            mockGetSubject.mockReturnValue([year, year]);

            // Act & Assert
            await expect(() => manager.getYear(2024)).rejects.toThrow(`Duplicate years found for '2024'`);
        });
        
        it('should throw an error when there are no years with the same id', async (): Promise<void> => {
            // Arrange
            mockGetSubject.mockReturnValue([]);

            // Act & Assert
            await expect(() => manager.getYear(2024)).rejects.toThrow(`No year found for '2024'`);
        });

        it('should return the year from the repository', async (): Promise<void> => {
            // Arrange
            const year1 = makeSubject('2024');
            const year2 = makeSubject('2025');

            mockGetSubject.mockReturnValue([year1, year2]);

            // Act
            const result = await manager.getYear(2024);

            // Assert
            expect(result).toBe(year1);
        });
    });

    describe('getAllJournalEntries', (): void => {
        it('should return an empty list when the repository has no journal entries', async (): Promise<void> => {
            // Arrange
            mockGetJournalEntries.mockReturnValue(undefined);

            // Act
            const result = await manager.getAllJournalEntries();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return an empty list when the repository has null journal entries', async (): Promise<void> => {
            // Arrange
            mockGetJournalEntries.mockReturnValue(null);

            // Act
            const result = await manager.getAllJournalEntries();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all journal entries sorted from the repository', async (): Promise<void> => {
            // Arrange
            const today = new Date();
            const yesterday = new Date(today.getDate() - 1);
            const year = makeSubject('2025');
            const entry1 = makeJournalEntry('Entry-1', today, year);
            const entry2 = makeJournalEntry('Entry-2', yesterday, year);

            mockGetJournalEntries.mockReturnValue([entry2, entry1]);

            // Act
            const result = await manager.getAllJournalEntries();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(entry1);
            expect(result[1]).toBe(entry2);
        });
    });

    describe('getAllPlants', (): void => {
        it('should return an empty list when the repository has no plants', async (): Promise<void> => {
            // Arrange
            mockGetPlants.mockReturnValue(undefined);

            // Act
            const result = await manager.getAllPlants();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return an empty list when the repository has null journal entries', async (): Promise<void> => {
            // Arrange
            mockGetPlants.mockReturnValue(null);

            // Act
            const result = await manager.getAllPlants();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all plants sorted from the repository', async (): Promise<void> => {
            // Arrange
            const plantA = makePlant('Plant A', 2024);
            const plantB = makePlant('Plant B', 2024);

            mockGetPlants.mockReturnValue([plantB, plantA]);

            // Act
            const result = await manager.getAllPlants();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(plantA);
            expect(result[1]).toBe(plantB);
        });
    });

    describe('getJournalEntriesForYear', (): void => {
        it('should return an empty list when the repository has no journal entries', async (): Promise<void> => {
            // Arrange
            const year = makeSubject('2025');
            mockGetJournalEntries.mockReturnValue(undefined);

            // Act
            const result = await manager.getJournalEntriesForYear(year);

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return an empty list when the repository has null journal entries', async (): Promise<void> => {
            // Arrange
            const year = makeSubject('2025');
            mockGetJournalEntries.mockReturnValue(null);

            // Act
            const result = await manager.getJournalEntriesForYear(year);

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all journal entries sorted from the repository for the given year', async (): Promise<void> => {
            // Arrange
            const today = new Date();
            const yesterday = new Date(today.getDate() - 1);
            const year = makeSubject('2025');
            const year2 = makeSubject('2026');
            const entry1 = makeJournalEntry('Entry-1', today, year);
            const entry2 = makeJournalEntry('Entry-2', yesterday, year);
            const entry3 = makeJournalEntry('Entry-3', today, year2);

            mockGetJournalEntries.mockReturnValue([entry2, entry1, entry3]);

            // Act
            const result = await manager.getJournalEntriesForYear(year);

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(entry1);
            expect(result[1]).toBe(entry2);
        });
    });

    describe('getPlantsForYear', (): void => {
        it('should return an empty list when the repository has no plants', async (): Promise<void> => {
            // Arrange
            const year = makeSubject('2025');
            mockGetPlants.mockReturnValue(undefined);

            // Act
            const result = await manager.getPlantsForYear(year);

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return an empty list when the repository has null journal entries', async (): Promise<void> => {
            // Arrange
            const year = makeSubject('2025');
            mockGetPlants.mockReturnValue(null);

            // Act
            const result = await manager.getPlantsForYear(year);

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all plants sorted from the repository', async (): Promise<void> => {
            // Arrange
            const currentYear = 2025;
            const year = makeSubject(currentYear.toString());
            const plantA = makePlant('Plant A', currentYear);
            const plantB = makePlant('Plant B', currentYear);
            const plantC = makePlant('Plant C', 2026);

            mockGetPlants.mockReturnValue([plantB, plantA, plantC]);

            // Act
            const result = await manager.getPlantsForYear(year);

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(plantA);
            expect(result[1]).toBe(plantB);
        });
    });
});