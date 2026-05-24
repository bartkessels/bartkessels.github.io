import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubjectManager } from '@/managers/subject.manager';
import type { SubjectsRepository } from '@/repositories/subject.repository';
import type { CollectionEntry } from 'astro:content';

describe('SubjectManager', (): void => {
    function makeGardeningYear(id: string): CollectionEntry<'subjects/gardening'> {
        return { id } as CollectionEntry<'subjects/gardening'>;
    }

    function makeBlogSubject(id: string): CollectionEntry<'subjects/blog'> {
        return { id } as CollectionEntry<'subjects/blog'>;
    }

    function makeJournalEntry(id: string, subject: string): CollectionEntry<'gardening/journal'> {
        return { id, data: { subject } } as unknown as CollectionEntry<'gardening/journal'>;
    }

    function makeBlogPost(id: string, subject: string): CollectionEntry<'blog'> {
        return { id, data: { subject } } as unknown as CollectionEntry<'blog'>;
    }

    const mockGetGardeningSubjects = vi.fn();
    const mockGetBlogSubjects = vi.fn();

    const mockRepository = {
        getGardeningSubjects: mockGetGardeningSubjects,
        getBlogSubjects: mockGetBlogSubjects,
    } as SubjectsRepository;

    const manager = new SubjectManager(mockRepository);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getGardeningYears', (): void => {
        it('should return all gardening year subjects from the repository', async (): Promise<void> => {
            // Arrange
            const year2024 = makeGardeningYear('2024');
            const year2025 = makeGardeningYear('2025');

            mockGetGardeningSubjects.mockResolvedValue([year2024, year2025]);

            // Act
            const result = await manager.getGardeningYears();

            // Assert
            expect(result).toEqual([year2024, year2025]);
        });
    });

    describe('getYearForGardeningJournalEntry', (): void => {
        it('should return the correct year for a given journal entry', async (): Promise<void> => {
            // Arrange
            const year2024 = makeGardeningYear('2024');
            const entry = makeJournalEntry('entry-1', '2024');

            mockGetGardeningSubjects.mockResolvedValue([year2024]);

            // Act
            const result = await manager.getYearForGardeningJournalEntry(entry);

            // Assert
            expect(result).toBe(year2024);
        });

        it('should throw when no year matches the entry subject', async (): Promise<void> => {
            // Arrange
            const year2024 = makeGardeningYear('2024');
            const entry = makeJournalEntry('entry-1', '2023');

            mockGetGardeningSubjects.mockResolvedValue([year2024]);

            // Act & Assert
            await expect(manager.getYearForGardeningJournalEntry(entry)).rejects.toThrow(`No year found for gardening journal 'entry-1'`);
        });
    });

    describe('getBlogCategories', (): void => {
        it('should return all blog subject categories from the repository', async (): Promise<void> => {
            // Arrange
            const android = makeBlogSubject('android');
            const kotlin = makeBlogSubject('kotlin');

            mockGetBlogSubjects.mockResolvedValue([android, kotlin]);

            // Act
            const result = await manager.getBlogCategories();

            // Assert
            expect(result).toEqual([android, kotlin]);
        });
    });

    describe('getCategoryForBlogPost', (): void => {
        it('should return the correct category for a given blog post', async (): Promise<void> => {
            // Arrange
            const android = makeBlogSubject('android');
            const post = makeBlogPost('post-1', 'android');

            mockGetBlogSubjects.mockResolvedValue([android]);

            // Act
            const result = await manager.getCategoryForBlogPost(post);

            // Assert
            expect(result).toBe(android);
        });

        it('should throw when no category matches the post subject', async (): Promise<void> => {
            // Arrange
            const android = makeBlogSubject('android');
            const post = makeBlogPost('post-1', 'unknown-subject');

            mockGetBlogSubjects.mockResolvedValue([android]);

            // Act & Assert
            await expect(manager.getCategoryForBlogPost(post)).rejects.toThrow(`No category found for blog post 'post-1'`);
        });
    });
});
