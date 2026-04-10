import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BackpackingManager } from '@/managers/backpacking.manager';
import type { BlogManager } from '@/managers/blog.manager';
import type { CollectionEntry } from 'astro:content';
import { HomeViewModel } from './home.view-model';
import type { PageManager } from '@/managers/page.manager';
import type { SoftwareManager } from '@/managers/software.manager';
import type { StoriesManager } from '@/managers/stories.manager';
import type { SubjectManager } from '@/managers/subject.manager';
describe('HomeViewModel', (): void => {
    const mockGetHomePage = vi.fn();
    const mockGetLatestsPosts = vi.fn();
    const mockGetFeaturedProjects = vi.fn();
    const mockGetLatestTrails = vi.fn();
    const mockGetFeaturedStories = vi.fn();
    const mockGetCategoryForBlogPost = vi.fn();

    const mockPageManager = {
        getAboutPage: vi.fn(),
        getBackpackingPage: vi.fn(),
        getBlogPage: vi.fn(),
        getGardeningPage: vi.fn(),
        getHomePage: mockGetHomePage,
        getSoftwarePage: vi.fn(),
        getStoriesPage: vi.fn(),
        getPages: vi.fn()
    } as unknown as PageManager;

    const mockBlogManager = {
        getLatestsPosts: mockGetLatestsPosts
    } as unknown as BlogManager;

    const mockSoftwareManager = {
        getFeaturedProjects: mockGetFeaturedProjects
    } as unknown as SoftwareManager;

    const mockBackpackingManager = {
        getLatestTrails: mockGetLatestTrails
    } as unknown as BackpackingManager;

    const mockStoryManager = {
        getFeaturedStories: mockGetFeaturedStories
    } as unknown as StoriesManager;

    const mockSubjectManager = {
        getCategoryForBlogPost: mockGetCategoryForBlogPost
    } as unknown as SubjectManager;

    const viewModel = new HomeViewModel(
        mockPageManager,
        mockBlogManager,
        mockSoftwareManager,
        mockBackpackingManager,
        mockStoryManager,
        mockSubjectManager
    );

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makePost(id: string, title: string): CollectionEntry<'blog'> {
        return { id, data: { title } } as unknown as CollectionEntry<'blog'>;
    }

    function makeSoftwareProject(id: string, title: string): CollectionEntry<'software'> {
        return { id, data: { title } } as unknown as CollectionEntry<'software'>;
    }

    function makeTrail(id: string, name: string): CollectionEntry<'backpacking/trails'> {
        return { id, data: { name } } as unknown as CollectionEntry<'backpacking/trails'>;
    }

    function makeStory(id: string, title: string): CollectionEntry<'stories'> {
        return { id, data: { title } } as unknown as CollectionEntry<'stories'>;
    }

    function makeSubject(id: string, name: string): CollectionEntry<'subjects/blog'> {
        return { id, data: { name } } as unknown as CollectionEntry<'subjects/blog'>;
    }

    describe('getOverviewPage', (): void => {
        it('should return the page from PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(expectedPage);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty latestPosts when BlogManager returns no posts', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestPosts).toEqual([]);
        });

        it('should request maximum of 3 latest posts', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            await viewModel.getOverviewPage();

            // Assert
            expect(mockGetLatestsPosts).toHaveBeenCalledWith(3);
        });

        it('should return latest posts with their subjects', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            const post = makePost('post-1', 'My Post');
            const subject = makeSubject('android', 'Android');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([post]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestPosts).toHaveLength(1);
            expect(result.latestPosts[0].post).toBe(post);
            expect(result.latestPosts[0].subject).toBe(subject);
        });

        it('should return multiple posts with their subjects', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            const post1 = makePost('post-1', 'Post 1');
            const post2 = makePost('post-2', 'Post 2');
            const subject1 = makeSubject('android', 'Android');
            const subject2 = makeSubject('kotlin', 'Kotlin');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([post1, post2]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetCategoryForBlogPost.mockResolvedValueOnce(subject1).mockResolvedValueOnce(subject2);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestPosts).toHaveLength(2);
            expect(result.latestPosts[0].subject).toBe(subject1);
            expect(result.latestPosts[1].subject).toBe(subject2);
        });

        it('should return empty featuredSoftwareProjects when SoftwareManager returns no projects', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.featuredSoftwareProjects).toEqual([]);
        });

        it('should request maximum of 2 featured software projects', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            await viewModel.getOverviewPage();

            // Assert
            expect(mockGetFeaturedProjects).toHaveBeenCalledWith(2);
        });

        it('should return featured software projects from SoftwareManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            const project = makeSoftwareProject('project-1', 'My Project');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([project]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.featuredSoftwareProjects).toEqual([project]);
        });

        it('should return empty latestTrails when BackpackingManager returns no trails', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestTrails).toEqual([]);
        });

        it('should request maximum of 3 latest trails', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            await viewModel.getOverviewPage();

            // Assert
            expect(mockGetLatestTrails).toHaveBeenCalledWith(3);
        });

        it('should return latest trails from BackpackingManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            const trail = makeTrail('trail-1', 'Pieterpad');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([trail]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestTrails).toEqual([trail]);
        });

        it('should return empty latestStories when StoriesManager returns no stories', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestStories).toEqual([]);
        });

        it('should request maximum of 2 featured stories', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);

            // Act
            await viewModel.getOverviewPage();

            // Assert
            expect(mockGetFeaturedStories).toHaveBeenCalledWith(2);
        });

        it('should return featured stories from StoriesManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('index', 'Home');
            const story = makeStory('story-1', 'My Story');
            mockGetHomePage.mockResolvedValue(page);
            mockGetLatestsPosts.mockResolvedValue([]);
            mockGetFeaturedProjects.mockResolvedValue([]);
            mockGetLatestTrails.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([story]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.latestStories).toEqual([story]);
        });
    });
});
