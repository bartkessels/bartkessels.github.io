import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackpackingManager } from '@/managers/backpacking.manager';
import { BackpackingViewModel } from './backpacking.view-model';
import type { CollectionEntry } from 'astro:content';
import { PageManager } from '@/managers/page.manager';

describe('BackpackingViewModel', (): void => {
    const mockGetBackpackingPage = vi.fn();
    const mockGetTrails = vi.fn();
    const mockGetSections = vi.fn();
    const mockGetPosts = vi.fn();
    const mockGetPreviousSection = vi.fn();
    const mockGetNextSection = vi.fn();

    const mockPageManager = {
        getAboutPage: vi.fn(),
        getBackpackingPage: mockGetBackpackingPage,
        getBlogPage: vi.fn(),
        getGardeningPage: vi.fn(),
        getHomePage: vi.fn(),
        getSoftwarePage: vi.fn(),
        getStoriesPage: vi.fn(),
        getPages: vi.fn()
    } as unknown as PageManager;

    const mockBackpackingManager = {
        getTrails: mockGetTrails,
        getSections: mockGetSections,
        getPosts: mockGetPosts,
        getPreviousSection: mockGetPreviousSection,
        getNextSection: mockGetNextSection
    } as unknown as BackpackingManager;

    const viewModel = new BackpackingViewModel(mockBackpackingManager, mockPageManager);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makeTrail(id: string, date: Date, distanceKm: number): CollectionEntry<'backpacking/trails'> {
        return { id, data: { date, distanceKm } } as unknown as CollectionEntry<'backpacking/trails'>;
    }

    function makeSection(id: string, date: Date): CollectionEntry<'backpacking/sections'> {
        return { id, data: { date } } as unknown as CollectionEntry<'backpacking/sections'>;
    }

    function makePost(id: string, date: Date): CollectionEntry<'backpacking/posts'> {
        return { id, data: { date } } as unknown as CollectionEntry<'backpacking/posts'>;
    }

    describe('getOverviewPage', (): void => {
        it('should return the page from PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('backpacking', 'Backpacking');
            mockGetBackpackingPage.mockResolvedValue(expectedPage);
            mockGetTrails.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty trailsByYear when no trails exist', async (): Promise<void> => {
            // Arrange
            const page = makePage('backpacking', 'Backpacking');
            mockGetBackpackingPage.mockResolvedValue(page);
            mockGetTrails.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.trailsByYear).toEqual([]);
        });

        it('should group trails by year', async (): Promise<void> => {
            // Arrange
            const page = makePage('backpacking', 'Backpacking');
            const trail2024 = makeTrail('trail-2024', new Date('2024-06-01'), 100);
            const trail2025 = makeTrail('trail-2025', new Date('2025-06-01'), 150);
            
            mockGetBackpackingPage.mockResolvedValue(page);
            mockGetTrails.mockResolvedValue([trail2024, trail2025]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.trailsByYear).toHaveLength(2);
            expect(result.trailsByYear[0].year).toBe(2024);
            expect(result.trailsByYear[0].trails).toEqual([trail2024]);
            expect(result.trailsByYear[1].year).toBe(2025);
            expect(result.trailsByYear[1].trails).toEqual([trail2025]);
        });

        it('should return posts from BackpackingManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('backpacking', 'Backpacking');
            const post = makePost('post-1', new Date('2024-01-01'));
            
            mockGetBackpackingPage.mockResolvedValue(page);
            mockGetTrails.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([post]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.posts).toEqual([post]);
        });
    });

    describe('getTrailPages', (): void => {
        it('should return empty array when no trails exist', async (): Promise<void> => {
            // Arrange
            mockGetTrails.mockResolvedValue([]);

            // Act
            const result = await viewModel.getTrailPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return trail page with sections and formatted date', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail-1', new Date('2024-06-15'), 100);
            const section = makeSection('section-1', new Date('2024-06-15'));
            
            mockGetTrails.mockResolvedValue([trail]);
            mockGetSections.mockResolvedValue([section]);

            // Act
            const result = await viewModel.getTrailPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].trail).toBe(trail);
            expect(result[0].sections).toEqual([section]);
            expect(result[0].formattedDate).toBe('June 15, 2024');
        });

        it('should convert distance from km to miles', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail-1', new Date('2024-06-15'), 100);
            
            mockGetTrails.mockResolvedValue([trail]);
            mockGetSections.mockResolvedValue([]);

            // Act
            const result = await viewModel.getTrailPages();

            // Assert
            expect(result[0].distanceInMiles).toBeCloseTo(62.1, 1);
        });
    });

    describe('getSectionPages', (): void => {
        it('should return empty array when no trails exist', async (): Promise<void> => {
            // Arrange
            mockGetTrails.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSectionPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return section page with formatted date', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail-1', new Date('2024-06-15'), 100);
            const section = makeSection('section-1', new Date('2024-06-15'));
            
            mockGetTrails.mockResolvedValue([trail]);
            mockGetSections.mockResolvedValue([section]);
            mockGetPreviousSection.mockReturnValue(null);
            mockGetNextSection.mockReturnValue(null);

            // Act
            const result = await viewModel.getSectionPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].formattedDate).toBe('June 15, 2024');
        });

        it('should assign correct section numbers starting from 1', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail-1', new Date('2024-06-15'), 100);
            const section1 = makeSection('section-1', new Date('2024-06-15'));
            const section2 = makeSection('section-2', new Date('2024-06-16'));
            
            mockGetTrails.mockResolvedValue([trail]);
            mockGetSections.mockResolvedValue([section1, section2]);
            mockGetPreviousSection.mockReturnValue(null);
            mockGetNextSection.mockReturnValue(null);

            // Act
            const result = await viewModel.getSectionPages();

            // Assert
            expect(result[0].sectionNumber).toBe(1);
            expect(result[1].sectionNumber).toBe(2);
        });

        it('should include previous and next section links', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail-1', new Date('2024-06-15'), 100);
            const section1 = makeSection('section-1', new Date('2024-06-15'));
            const section2 = makeSection('section-2', new Date('2024-06-16'));
            
            mockGetTrails.mockResolvedValue([trail]);
            mockGetSections.mockResolvedValue([section1, section2]);
            mockGetPreviousSection.mockReturnValueOnce(null).mockReturnValueOnce(section1);
            mockGetNextSection.mockReturnValueOnce(section2).mockReturnValueOnce(null);

            // Act
            const result = await viewModel.getSectionPages();

            // Assert
            expect(result[0].previousSection).toBeNull();
            expect(result[0].nextSection).toBe(section2);
            expect(result[1].previousSection).toBe(section1);
            expect(result[1].nextSection).toBeNull();
        });

        it('should include trail reference in each section page', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail-1', new Date('2024-06-15'), 100);
            const section = makeSection('section-1', new Date('2024-06-15'));
            
            mockGetTrails.mockResolvedValue([trail]);
            mockGetSections.mockResolvedValue([section]);
            mockGetPreviousSection.mockReturnValue(null);
            mockGetNextSection.mockReturnValue(null);

            // Act
            const result = await viewModel.getSectionPages();

            // Assert
            expect(result[0].trail).toBe(trail);
            expect(result[0].section).toBe(section);
        });
    });

    describe('getPostPages', (): void => {
        it('should return empty array when no posts exist', async (): Promise<void> => {
            // Arrange
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return post page with formatted date', async (): Promise<void> => {
            // Arrange
            const post = makePost('post-1', new Date('2024-06-15'));
            mockGetPosts.mockResolvedValue([post]);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].post).toBe(post);
            expect(result[0].formattedDate).toBe('June 15, 2024');
        });

        it('should map all posts with formatted dates', async (): Promise<void> => {
            // Arrange
            const post1 = makePost('post-1', new Date('2024-06-15'));
            const post2 = makePost('post-2', new Date('2024-07-20'));
            mockGetPosts.mockResolvedValue([post1, post2]);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].formattedDate).toBe('June 15, 2024');
            expect(result[1].formattedDate).toBe('July 20, 2024');
        });
    });
})