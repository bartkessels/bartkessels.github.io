import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoriesManager } from '@/managers/stories.manager';
import type { BlogRepository } from '@/repositories/blog.repository';
import type { StoriesRepository } from '@/repositories/stories.repository';
import type { CollectionEntry } from 'astro:content';

describe('StoriesManager', (): void => {
    function makeStory(id: string, date: Date, posts: string[] = [], draft: boolean = false, featured: boolean = false): CollectionEntry<'stories'> {
        return { id, data: { date, draft, featured, posts } } as unknown as CollectionEntry<'stories'>;
    }

    function makePost(id: string): CollectionEntry<'blog'> {
        return { id } as CollectionEntry<'blog'>;
    }

    const mockGetStories = vi.fn();
    const mockGetBlogPost = vi.fn();

    const mockRepository = {
        getStories: mockGetStories,
    } as StoriesRepository;

    const mockBlogRepository = {
        getBlogPost: mockGetBlogPost,
        getBlogPosts: vi.fn(),
    } as BlogRepository;

    const manager = new StoriesManager(mockRepository, mockBlogRepository);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getStories', (): void => {
        it('should filter out draft stories', async (): Promise<void> => {
            // Arrange
            const draftStory = makeStory('draft', new Date(), [], true);
            const publishedStory = makeStory('published', new Date(), [], false);

            mockGetStories.mockResolvedValue([draftStory, publishedStory]);

            // Act
            const result = await manager.getStories();

            // Assert
            expect(result).toEqual([publishedStory]);
        });

        it('should sort stories by date descending', async (): Promise<void> => {
            // Arrange
            const older = makeStory('older', new Date('2024-01-01'));
            const newer = makeStory('newer', new Date('2024-06-01'));

            mockGetStories.mockResolvedValue([older, newer]);

            // Act
            const result = await manager.getStories();

            // Assert
            expect(result).toEqual([newer, older]);
        });
    });

    describe('getFeaturedStories', (): void => {
        it('should return only featured stories', async (): Promise<void> => {
            // Arrange
            const featured = makeStory('featured', new Date(), [], false, true);
            const notFeatured = makeStory('not-featured', new Date(), [], false, false);

            mockGetStories.mockResolvedValue([featured, notFeatured]);

            // Act
            const result = await manager.getFeaturedStories();

            // Assert
            expect(result).toEqual([featured]);
        });

        it('should respect the maxStories limit', async (): Promise<void> => {
            // Arrange
            const story1 = makeStory('story-1', new Date('2024-06-01'), [], false, true);
            const story2 = makeStory('story-2', new Date('2024-05-01'), [], false, true);
            const story3 = makeStory('story-3', new Date('2024-04-01'), [], false, true);

            mockGetStories.mockResolvedValue([story1, story2, story3]);

            // Act
            const result = await manager.getFeaturedStories(2);

            // Assert
            expect(result).toHaveLength(2);
            expect(result).toEqual([story1, story2]);
        });

        it('should return all featured stories when no limit provided', async (): Promise<void> => {
            // Arrange
            const story1 = makeStory('story-1', new Date(), [], false, true);
            const story2 = makeStory('story-2', new Date(), [], false, true);

            mockGetStories.mockResolvedValue([story1, story2]);

            // Act
            const result = await manager.getFeaturedStories();

            // Assert
            expect(result).toHaveLength(2);
        });
    });

    describe('getStoryForPost', (): void => {
        it('should return null when no story references the post', async (): Promise<void> => {
            // Arrange
            const post = makePost('post-1');
            const story = makeStory('story-1', new Date(), ['other-post']);

            mockGetStories.mockResolvedValue([story]);

            // Act
            const result = await manager.getStoryForPost(post);

            // Assert
            expect(result).toBeNull();
        });

        it('should return the matching story', async (): Promise<void> => {
            // Arrange
            const post = makePost('post-1');
            const story = makeStory('story-1', new Date(), ['post-1']);

            mockGetStories.mockResolvedValue([story]);

            // Act
            const result = await manager.getStoryForPost(post);

            // Assert
            expect(result).toBe(story);
        });

        it('should throw an error when multiple stories reference the same post', async (): Promise<void> => {
            // Arrange
            const post = makePost('post-1');
            const story1 = makeStory('story-1', new Date(), ['post-1']);
            const story2 = makeStory('story-2', new Date(), ['post-1']);

            mockGetStories.mockResolvedValue([story1, story2]);

            // Act & Assert
            await expect(manager.getStoryForPost(post)).rejects.toThrow(`Multiple stories referenced for 'post-1'`);
        });
    });

    describe('getPostsForStory', (): void => {
        it('should return posts belonging to the story in declared order', async (): Promise<void> => {
            // Arrange
            const post1 = makePost('post-1');
            const post2 = makePost('post-2');
            const story = makeStory('story-1', new Date(), ['post-1', 'post-2']);

            mockGetBlogPost.mockImplementation((id: string) => {
                if (id === 'post-1') return Promise.resolve(post1);
                if (id === 'post-2') return Promise.resolve(post2);
                return Promise.resolve(null);
            });

            // Act
            const result = await manager.getPostsForStory(story);

            // Assert
            expect(result).toEqual([post1, post2]);
        });

        it('should skip post IDs that the blog repository cannot find', async (): Promise<void> => {
            // Arrange
            const post1 = makePost('post-1');
            const story = makeStory('story-1', new Date(), ['post-1', 'missing-post']);

            mockGetBlogPost.mockImplementation((id: string) => {
                if (id === 'post-1') return Promise.resolve(post1);
                return Promise.resolve(null);
            });

            // Act
            const result = await manager.getPostsForStory(story);

            // Assert
            expect(result).toEqual([post1]);
        });
    });
});
