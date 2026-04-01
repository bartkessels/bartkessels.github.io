import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import type { PageManager } from '@/managers/page.manager';
import type { StoriesManager } from '@/managers/stories.manager';
import { StoriesViewModel } from './stories.view-model';

describe('StoriesViewModel', (): void => {
    const mockGetStoriesPage = vi.fn();
    const mockGetStories = vi.fn();
    const mockGetPostsForStory = vi.fn();

    const mockPageManager = {
        getAboutPage: vi.fn(),
        getBackpackingPage: vi.fn(),
        getBlogPage: vi.fn(),
        getGardeningPage: vi.fn(),
        getHomePage: vi.fn(),
        getSoftwarePage: vi.fn(),
        getStoriesPage: mockGetStoriesPage,
        getPages: vi.fn()
    } as unknown as PageManager;

    const mockStoriesManager = {
        getStories: mockGetStories,
        getFeaturedStories: vi.fn(),
        getStoryForPost: vi.fn(),
        getPostsForStory: mockGetPostsForStory
    } as unknown as StoriesManager;

    const viewModel = new StoriesViewModel(mockStoriesManager, mockPageManager);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makeStory(id: string, date: Date, posts: string[]): CollectionEntry<'stories'> {
        return { id, data: { date, posts } } as unknown as CollectionEntry<'stories'>;
    }

    function makePost(id: string, title: string): CollectionEntry<'blog'> {
        return { id, data: { title } } as unknown as CollectionEntry<'blog'>;
    }

    describe('getOverview', (): void => {
        it('should return the page from PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('stories', 'Stories');
            mockGetStoriesPage.mockResolvedValue(expectedPage);
            mockGetStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty stories when StoriesManager returns no stories', async (): Promise<void> => {
            // Arrange
            const page = makePage('stories', 'Stories');
            mockGetStoriesPage.mockResolvedValue(page);
            mockGetStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.stories).toEqual([]);
        });

        it('should return stories from StoriesManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('stories', 'Stories');
            const story = makeStory('story-1', new Date('2024-03-15'), ['post-1']);
            mockGetStoriesPage.mockResolvedValue(page);
            mockGetStories.mockResolvedValue([story]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.stories).toEqual([story]);
        });

        it('should return multiple stories from StoriesManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('stories', 'Stories');
            const story1 = makeStory('story-1', new Date('2024-03-15'), ['post-1']);
            const story2 = makeStory('story-2', new Date('2024-04-20'), ['post-2', 'post-3']);
            mockGetStoriesPage.mockResolvedValue(page);
            mockGetStories.mockResolvedValue([story1, story2]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.stories).toHaveLength(2);
            expect(result.stories).toEqual([story1, story2]);
        });
    });

    describe('getStoryPages', (): void => {
        it('should return empty array when no stories exist', async (): Promise<void> => {
            // Arrange
            mockGetStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getStoryPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return story page with formatted date', async (): Promise<void> => {
            // Arrange
            const story = makeStory('story-1', new Date('2024-03-15'), []);
            mockGetStories.mockResolvedValue([story]);
            mockGetPostsForStory.mockResolvedValue([]);

            // Act
            const result = await viewModel.getStoryPages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].story).toBe(story);
            expect(result[0].formattedDate).toBe('March 15, 2024');
        });

        it('should return story page with empty posts when story has no posts', async (): Promise<void> => {
            // Arrange
            const story = makeStory('story-1', new Date('2024-03-15'), []);
            mockGetStories.mockResolvedValue([story]);
            mockGetPostsForStory.mockResolvedValue([]);

            // Act
            const result = await viewModel.getStoryPages();

            // Assert
            expect(result[0].posts).toEqual([]);
        });

        it('should return story page with posts from StoriesManager', async (): Promise<void> => {
            // Arrange
            const story = makeStory('story-1', new Date('2024-03-15'), ['post-1']);
            const post = makePost('post-1', 'My Post');
            mockGetStories.mockResolvedValue([story]);
            mockGetPostsForStory.mockResolvedValue([post]);

            // Act
            const result = await viewModel.getStoryPages();

            // Assert
            expect(result[0].posts).toEqual([post]);
        });

        it('should return story page with multiple posts', async (): Promise<void> => {
            // Arrange
            const story = makeStory('story-1', new Date('2024-03-15'), ['post-1', 'post-2']);
            const post1 = makePost('post-1', 'First Post');
            const post2 = makePost('post-2', 'Second Post');
            mockGetStories.mockResolvedValue([story]);
            mockGetPostsForStory.mockResolvedValue([post1, post2]);

            // Act
            const result = await viewModel.getStoryPages();

            // Assert
            expect(result[0].posts).toHaveLength(2);
            expect(result[0].posts).toEqual([post1, post2]);
        });

        it('should return multiple story pages', async (): Promise<void> => {
            // Arrange
            const story1 = makeStory('story-1', new Date('2024-03-15'), ['post-1']);
            const story2 = makeStory('story-2', new Date('2024-04-20'), ['post-2']);
            const post1 = makePost('post-1', 'First Post');
            const post2 = makePost('post-2', 'Second Post');
            mockGetStories.mockResolvedValue([story1, story2]);
            mockGetPostsForStory.mockResolvedValueOnce([post1]).mockResolvedValueOnce([post2]);

            // Act
            const result = await viewModel.getStoryPages();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].story).toBe(story1);
            expect(result[0].posts).toEqual([post1]);
            expect(result[1].story).toBe(story2);
            expect(result[1].posts).toEqual([post2]);
        });
    });
});
