import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackpackingManager } from '@/managers/backpacking.manager';
import type { BackpackingRepository } from '@/repositories/backpacking.repository';
import type { CollectionEntry } from 'astro:content';

describe('BackpackingManager', (): void => {
    function makeTrail(id: string, date: Date, sections: string[] = [], draft: boolean = false): CollectionEntry<'backpacking/trails'> {
        return { id, data: { date, draft, sections } } as unknown as CollectionEntry<'backpacking/trails'>;
    }

    function makeSection(id: string, date: Date, draft: boolean = false): CollectionEntry<'backpacking/sections'> {
        return { id, data: { date, draft } } as unknown as CollectionEntry<'backpacking/sections'>;
    }

    function makePost(id: string, date: Date, draft: boolean = false): CollectionEntry<'backpacking/posts'> {
        return { id, data: { date, draft } } as unknown as CollectionEntry<'backpacking/posts'>;
    }

    const mockGetTrails = vi.fn();
    const mockGetSections = vi.fn();
    const mockGetPosts = vi.fn();

    const mockRepository = {
        getTrails: mockGetTrails,
        getSections: mockGetSections,
        getPosts: mockGetPosts,
    } as BackpackingRepository;

    const manager = new BackpackingManager(mockRepository);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getTrails', (): void => {
        it('should filter out draft trails', async (): Promise<void> => {
            // Arrange
            const draftTrail = makeTrail('draft', new Date(), [], true);
            const publishedTrail = makeTrail('published', new Date(), [], false);
            
            mockGetTrails.mockResolvedValue([draftTrail, publishedTrail]);

            // Act
            const result = await manager.getTrails();

            // Assert
            expect(result).toEqual([publishedTrail]);
        });

        it('should sort trails by date descending', async (): Promise<void> => {
            // Arrange
            const older = makeTrail('older', new Date('2024-01-01'));
            const newer = makeTrail('newer', new Date('2024-06-01'));
            
            mockGetTrails.mockResolvedValue([older, newer]);

            // Act
            const result = await manager.getTrails();

            // Assert
            expect(result).toEqual([newer, older]);
        });
    });

    describe('getLatestTrails', (): void => {
        it('should return all trails when no limit is provided', async (): Promise<void> => {
            // Arrange
            const trails = [
                makeTrail('a', new Date('2024-03-01')),
                makeTrail('b', new Date('2024-02-01')),
                makeTrail('c', new Date('2024-01-01')),
            ];
            
            mockGetTrails.mockResolvedValue(trails);

            // Act
            const result = await manager.getLatestTrails();

            // Assert
            expect(result).toHaveLength(3);
        });

        it('should return only the specified number of latest trails', async (): Promise<void> => {
            // Arrange
            const trails = [
                makeTrail('a', new Date('2024-03-01')),
                makeTrail('b', new Date('2024-02-01')),
                makeTrail('c', new Date('2024-01-01')),
            ];

            mockGetTrails.mockResolvedValue(trails);

            // Act
            const result = await manager.getLatestTrails(2);

            // Assert
            expect(result).toHaveLength(2);
        });
    });

    describe('getSections', (): void => {
        it('should filter out draft sections', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail', new Date(), ['draft-section', 'published-section']);
            const draftSection = makeSection('draft-section', new Date(), true);
            const publishedSection = makeSection('published-section', new Date(), false);
            
            mockGetSections.mockResolvedValue([draftSection, publishedSection]);

            // Act
            const result = await manager.getSections(trail);

            // Assert
            expect(result).toEqual([publishedSection]);
        });

        it('should only include sections referenced by the trail', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail', new Date(), ['included-section']);
            const includedSection = makeSection('included-section', new Date());
            const unrelatedSection = makeSection('unrelated-section', new Date());
            
            mockGetSections.mockResolvedValue([includedSection, unrelatedSection]);

            // Act
            const result = await manager.getSections(trail);

            // Assert
            expect(result).toEqual([includedSection]);
        });

        it('should sort sections by date ascending', async (): Promise<void> => {
            // Arrange
            const trail = makeTrail('trail', new Date(), ['section-a', 'section-b']);
            const older = makeSection('section-a', new Date('2024-01-01'));
            const newer = makeSection('section-b', new Date('2024-06-01'));
            
            mockGetSections.mockResolvedValue([newer, older]);

            // Act
            const result = await manager.getSections(trail);

            // Assert
            expect(result).toEqual([older, newer]);
        });
    });

    describe('getPreviousSection', (): void => {
        it('should return null when the section is first in the list', (): void => {
            // Arrange
            const sections = [
                makeSection('a', new Date()),
                makeSection('b', new Date()),
            ];

            // Act
            const result = manager.getPreviousSection(sections, sections[0]);

            // Assert
            expect(result).toBeNull();
        });

        it('should return the preceding section', (): void => {
            // Arrange
            const sections = [
                makeSection('a', new Date()),
                makeSection('b', new Date()),
                makeSection('c', new Date()),
            ];

            // Act
            const result = manager.getPreviousSection(sections, sections[2]);

            // Assert
            expect(result).toBe(sections[1]);
        });
    });

    describe('getNextSection', (): void => {
        it('should return null when the section is last in the list', (): void => {
            // Arrange
            const sections = [
                makeSection('a', new Date()),
                makeSection('b', new Date()),
            ];

            // Act
            const result = manager.getNextSection(sections, sections[sections.length - 1]);

            // Assert
            expect(result).toBeNull();
        });

        it('should return the following section', (): void => {
            // Arrange
            const sections = [
                makeSection('a', new Date()),
                makeSection('b', new Date()),
                makeSection('c', new Date()),
            ];

            // Act
            const result = manager.getNextSection(sections, sections[0]);

            // Assert
            expect(result).toBe(sections[1]);
        });
    });

    describe('getPosts', (): void => {
        it('should filter out draft posts', async (): Promise<void> => {
            // Arrange
            const draftPost = makePost('draft', new Date(), true);
            const publishedPost = makePost('published', new Date(), false);
            
            mockGetPosts.mockResolvedValue([draftPost, publishedPost]);

            // Act
            const result = await manager.getPosts();

            // Assert
            expect(result).toEqual([publishedPost]);
        });
    });

    describe('getPostsForYear', (): void => {
        it('should return only posts from the given year', async (): Promise<void> => {
            // Arrange
            const postIn2024 = makePost('2024-post', new Date('2024-05-01'));
            const postIn2025 = makePost('2025-post', new Date('2025-05-01'));
            
            mockGetPosts.mockResolvedValue([postIn2024, postIn2025]);

            // Act
            const result = await manager.getPostsForYear(2024);

            // Assert
            expect(result).toEqual([postIn2024]);
        });
    });
});
