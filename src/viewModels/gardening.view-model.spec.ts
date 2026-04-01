import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GardeningViewModel, type PlantsPerCategory } from './gardening.view-model';
import type { CollectionEntry } from 'astro:content';
import type { GardeningManager } from '@/managers/gardening.manager';
import type { PageManager } from '@/managers/page.manager';

describe('GardeningViewModel', (): void => {
    const mockGetGardeningPage = vi.fn();
    const mockGetAllYears = vi.fn();
    const mockGetJournalEntriesForYear = vi.fn();
    const mockGetPlantsForYear = vi.fn();
    const mockGetAllJournalEntries = vi.fn();
    const mockGetAllPlants = vi.fn();

    const mockPageManager = {
        getAboutPage: vi.fn(),
        getBackpackingPage: vi.fn(),
        getBlogPage: vi.fn(),
        getGardeningPage: mockGetGardeningPage,
        getHomePage: vi.fn(),
        getSoftwarePage: vi.fn(),
        getStoriesPage: vi.fn(),
        getPages: vi.fn()
    } as unknown as PageManager;

    const mockGardeningManager = {
        getAllYears: mockGetAllYears,
        getJournalEntriesForYear: mockGetJournalEntriesForYear,
        getPlantsForYear: mockGetPlantsForYear,
        getAllJournalEntries: mockGetAllJournalEntries,
        getAllPlants: mockGetAllPlants
    } as unknown as GardeningManager;

    const viewModel = new GardeningViewModel(mockGardeningManager, mockPageManager);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makeYear(id: string, name: string, href?: string): CollectionEntry<'subjects/gardening'> {
        return { id, data: { name, href } } as unknown as CollectionEntry<'subjects/gardening'>;
    }

    function makeJournalEntry(id: string, date: Date, subject: string): CollectionEntry<'gardening/journal'> {
        return { id, data: { date, subject } } as unknown as CollectionEntry<'gardening/journal'>;
    }

    function makePlant(id: string, name: string, category?: string): CollectionEntry<'gardening/plants'> {
        return { id, data: { name, category } } as unknown as CollectionEntry<'gardening/plants'>;
    }

    describe('getOverviewPage', (): void => {
        it('should return the page from PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('gardening', 'Gardening');
            mockGetGardeningPage.mockResolvedValue(expectedPage);
            mockGetAllYears.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty itemsPerYear when no years exist', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.itemsPerYear).toEqual([]);
        });

        it('should return years sorted in descending order', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            const year2024 = makeYear('2024', '2024');
            const year2025 = makeYear('2025', '2025');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([year2024, year2025]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.itemsPerYear).toHaveLength(2);
            expect(result.itemsPerYear[0].year.id).toBe('2025');
            expect(result.itemsPerYear[1].year.id).toBe('2024');
        });

        it('should include journal entries for each year', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            const year2024 = makeYear('2024', '2024');
            const journalEntry = makeJournalEntry('entry-1', new Date('2024-03-15'), '2024');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([journalEntry]);
            mockGetPlantsForYear.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.itemsPerYear[0].journalEntries).toEqual([journalEntry]);
        });

        it('should group plants by category', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            const year2024 = makeYear('2024', '2024');
            const plant1 = makePlant('tomato', 'Tomato', 'Vegetables');
            const plant2 = makePlant('carrot', 'Carrot', 'Vegetables');
            const plant3 = makePlant('rose', 'Rose', 'Flowers');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([plant1, plant2, plant3]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.itemsPerYear[0].plants).toHaveLength(2);
            const vegetablesCategory = result.itemsPerYear[0].plants.find((p: PlantsPerCategory) => p.category === 'Vegetables');
            const flowersCategory = result.itemsPerYear[0].plants.find((p: PlantsPerCategory) => p.category === 'Flowers');
            expect(vegetablesCategory?.plants).toHaveLength(2);
            expect(flowersCategory?.plants).toHaveLength(1);
        });

        it('should group plants without category as Other', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            const year2024 = makeYear('2024', '2024');
            const plant = makePlant('unknown', 'Unknown Plant');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([plant]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.itemsPerYear[0].plants).toHaveLength(1);
            expect(result.itemsPerYear[0].plants[0].category).toBe('Other');
        });

        it('should return simplified subjects with href and name', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            const year2024 = makeYear('2024', '2024', '/gardening/2024');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.subjects).toHaveLength(1);
            expect(result.subjects[0].name).toBe('2024');
            expect(result.subjects[0].href).toBe('/gardening/2024');
        });

        it('should use year id as href when href is not provided', async (): Promise<void> => {
            // Arrange
            const page = makePage('gardening', 'Gardening');
            const year2024 = makeYear('2024', '2024');
            mockGetGardeningPage.mockResolvedValue(page);
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.subjects[0].href).toBe('2024');
        });
    });

    describe('getYearOverviewPages', (): void => {
        it('should return empty array when no years exist', async (): Promise<void> => {
            // Arrange
            mockGetAllYears.mockResolvedValue([]);

            // Act
            const result = await viewModel.getYearOverviewPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return year overview pages with year data', async (): Promise<void> => {
            // Arrange
            const year2024 = makeYear('2024', '2024');
            const journalEntry = makeJournalEntry('entry-1', new Date('2024-03-15'), '2024');
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([journalEntry]);
            mockGetPlantsForYear.mockResolvedValue([]);

            // Act
            const result = await viewModel.getYearOverviewPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].year).toBe(year2024);
            expect(result[0].journalEntries).toEqual([journalEntry]);
        });

        it('should include plants grouped by category', async (): Promise<void> => {
            // Arrange
            const year2024 = makeYear('2024', '2024');
            const plant1 = makePlant('tomato', 'Tomato', 'Vegetables');
            const plant2 = makePlant('rose', 'Rose', 'Flowers');
            mockGetAllYears.mockResolvedValue([year2024]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([plant1, plant2]);

            // Act
            const result = await viewModel.getYearOverviewPages();

            // Assert
            expect(result[0].plants).toHaveLength(2);
        });

        it('should include simplified subjects in each year overview page', async (): Promise<void> => {
            // Arrange
            const year2024 = makeYear('2024', '2024', '/gardening/2024');
            const year2025 = makeYear('2025', '2025', '/gardening/2025');
            mockGetAllYears.mockResolvedValue([year2024, year2025]);
            mockGetJournalEntriesForYear.mockResolvedValue([]);
            mockGetPlantsForYear.mockResolvedValue([]);

            // Act
            const result = await viewModel.getYearOverviewPages();

            // Assert
            expect(result[0].subjects).toHaveLength(2);
            expect(result[1].subjects).toHaveLength(2);
            expect(result[0].subjects[0].name).toBe('2025');
            expect(result[0].subjects[1].name).toBe('2024');
        });
    });

    describe('getJournalPages', (): void => {
        it('should return empty array when no journal entries exist', async (): Promise<void> => {
            // Arrange
            mockGetAllJournalEntries.mockResolvedValue([]);

            // Act
            const result = await viewModel.getJournalPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return journal pages with formatted dates', async (): Promise<void> => {
            // Arrange
            const journalEntry = makeJournalEntry('entry-1', new Date('2024-03-15'), '2024');
            mockGetAllJournalEntries.mockResolvedValue([journalEntry]);

            // Act
            const result = await viewModel.getJournalPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].journalEntry).toBe(journalEntry);
            expect(result[0].formattedDate).toBe('March 15, 2024');
        });

        it('should return multiple journal pages', async (): Promise<void> => {
            // Arrange
            const entry1 = makeJournalEntry('entry-1', new Date('2024-03-15'), '2024');
            const entry2 = makeJournalEntry('entry-2', new Date('2024-04-20'), '2024');
            mockGetAllJournalEntries.mockResolvedValue([entry1, entry2]);

            // Act
            const result = await viewModel.getJournalPages();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].journalEntry).toBe(entry1);
            expect(result[1].journalEntry).toBe(entry2);
        });
    });

    describe('getPlantPages', (): void => {
        it('should return empty array when no plants exist', async (): Promise<void> => {
            // Arrange
            mockGetAllPlants.mockResolvedValue([]);

            // Act
            const result = await viewModel.getPlantPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return plant pages', async (): Promise<void> => {
            // Arrange
            const plant = makePlant('tomato', 'Tomato', 'Vegetables');
            mockGetAllPlants.mockResolvedValue([plant]);

            // Act
            const result = await viewModel.getPlantPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].plant).toBe(plant);
        });

        it('should return multiple plant pages', async (): Promise<void> => {
            // Arrange
            const plant1 = makePlant('tomato', 'Tomato', 'Vegetables');
            const plant2 = makePlant('rose', 'Rose', 'Flowers');
            mockGetAllPlants.mockResolvedValue([plant1, plant2]);

            // Act
            const result = await viewModel.getPlantPages();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].plant).toBe(plant1);
            expect(result[1].plant).toBe(plant2);
        });
    });
});
