import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlogManager } from '@/managers/blog.manager';
import { BlogViewModel } from './blog.view-model';
import type { CollectionEntry } from 'astro:content';
import type { PageManager } from '@/managers/page.manager';
import type { StoriesManager } from '@/managers/stories.manager';
import type { SubjectManager } from '@/managers/subject.manager';

describe('BlogViewModel', (): void => {
    const mockGetBlogPage = vi.fn();
    const mockGetPost = vi.fn();
    const mockGetPosts = vi.fn();
    const mockGetRelatedPosts = vi.fn();
    const mockGetPostsForSubject = vi.fn();
    const mockGetFeaturedStories = vi.fn();
    const mockGetStoryForPost = vi.fn();
    const mockGetBlogCategories = vi.fn();
    const mockGetCategoryForBlogPost = vi.fn();

    const mockPageManager = {
        getAboutPage: vi.fn(),
        getBackpackingPage: vi.fn(),
        getBlogPage: mockGetBlogPage,
        getGardeningPage: vi.fn(),
        getHomePage: vi.fn(),
        getSoftwarePage: vi.fn(),
        getStoriesPage: vi.fn(),
        getPages: vi.fn()
    } as unknown as PageManager;

    const mockBlogManager = {
        getPost: mockGetPost,
        getPosts: mockGetPosts,
        getRelatedPosts: mockGetRelatedPosts,
        getPostsForSubject: mockGetPostsForSubject
    } as unknown as BlogManager;

    const mockStoriesManager = {
        getFeaturedStories: mockGetFeaturedStories,
        getStoryForPost: mockGetStoryForPost
    } as unknown as StoriesManager;

    const mockSubjectManager = {
        getBlogCategories: mockGetBlogCategories,
        getCategoryForBlogPost: mockGetCategoryForBlogPost
    } as unknown as SubjectManager;

    const viewModel = new BlogViewModel(mockBlogManager, mockPageManager, mockStoriesManager, mockSubjectManager);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makePost(id: string, date: Date): CollectionEntry<'blog'> {
        return { id, data: { date } } as unknown as CollectionEntry<'blog'>;
    }

    function makeStory(id: string, posts: string[]): CollectionEntry<'stories'> {
        return { id, data: { posts } } as unknown as CollectionEntry<'stories'>;
    }

    function makeSubject(id: string, name: string, href: string): CollectionEntry<'subjects/blog'> {
        return { id, data: { name, href } } as unknown as CollectionEntry<'subjects/blog'>;
    }

    describe('getOverviewPage', (): void => {
        it('should return the page from PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('blog', 'Blog');
            mockGetBlogPage.mockResolvedValue(expectedPage);
            mockGetBlogCategories.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty subjects when no categories exist', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.subjects).toEqual([]);
        });

        it('should return simplified subjects with href and name', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.subjects).toHaveLength(1);
            expect(result.subjects[0].name).toBe('Android');
            expect(result.subjects[0].href).toBe('/blog/android');
        });

        it('should return featured stories with max limit of 3', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const story = makeStory('story-1', []);
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([story]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(mockGetFeaturedStories).toHaveBeenCalledWith(3);
            expect(result.stories).toEqual([story]);
        });

        it('should return posts with their subjects', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-01-01'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.posts).toHaveLength(1);
            expect(result.posts[0].post).toBe(post);
            expect(result.posts[0].subject).toBe(subject);
        });

        it('should return postsPerPage of 9', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([]);
            mockGetFeaturedStories.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverviewPage();

            // Assert
            expect(result.postsPerPage).toBe(9);
        });
    });

    describe('getSubjectOverviewPages', (): void => {
        it('should return empty array when no categories exist', async (): Promise<void> => {
            // Arrange
            mockGetBlogCategories.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSubjectOverviewPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return a page for each subject category', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const subject1 = makeSubject('android', 'Android', '/blog/android');
            const subject2 = makeSubject('kotlin', 'Kotlin', '/blog/kotlin');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject1, subject2]);
            mockGetPostsForSubject.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSubjectOverviewPages();

            // Assert
            expect(result).toHaveLength(2);
        });

        it('should include page and subject in each overview page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPostsForSubject.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSubjectOverviewPages();

            // Assert
            expect(result[0].page).toBe(page);
            expect(result[0].subject).toBe(subject);
        });

        it('should include simplified subjects list in each overview page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const subject1 = makeSubject('android', 'Android', '/blog/android');
            const subject2 = makeSubject('kotlin', 'Kotlin', '/blog/kotlin');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject1, subject2]);
            mockGetPostsForSubject.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSubjectOverviewPages();

            // Assert
            expect(result[0].subjects).toHaveLength(2);
            expect(result[0].subjects[0].name).toBe('Android');
            expect(result[1].subjects).toHaveLength(2);
        });

        it('should include posts for each subject', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const subject = makeSubject('android', 'Android', '/blog/android');
            const post = makePost('post-1', new Date('2024-01-01'));
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPostsForSubject.mockResolvedValue([post]);

            // Act
            const result = await viewModel.getSubjectOverviewPages();

            // Assert
            expect(result[0].posts).toEqual([post]);
        });

        it('should include postsPerPage of 9 in each overview page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPostsForSubject.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSubjectOverviewPages();

            // Assert
            expect(result[0].postsPerPage).toBe(9);
        });
    });

    describe('getPostPages', (): void => {
        it('should return empty array when no posts exist', async (): Promise<void> => {
            // Arrange
            mockGetBlogCategories.mockResolvedValue([]);
            mockGetPosts.mockResolvedValue([]);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return a page for each post', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post1 = makePost('post-1', new Date('2024-01-01'));
            const post2 = makePost('post-2', new Date('2024-01-02'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post1, post2]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(null);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result).toHaveLength(2);
        });

        it('should include page post and subject in each post page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-01-01'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(null);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].page).toBe(page);
            expect(result[0].post).toBe(post);
            expect(result[0].subject).toBe(subject);
        });

        it('should include simplified subjects in each post page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-01-01'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(null);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].subjects).toHaveLength(1);
            expect(result[0].subjects[0].name).toBe('Android');
        });

        it('should include related posts for each post page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-01-01'));
            const relatedPost = makePost('related-post', new Date('2024-01-02'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([relatedPost]);
            mockGetStoryForPost.mockResolvedValue(null);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].relatedPosts).toEqual([relatedPost]);
        });

        it('should include formatted date for each post page', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-06-15'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(null);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].formattedDate).toBe('June 15, 2024');
        });

        it('should set story to null when post is not part of a story', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-01-01'));
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(null);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].story).toBeNull();
            expect(result[0].previousPostInStory).toBeNull();
            expect(result[0].nextPostInStory).toBeNull();
        });

        it('should include story when post is part of a story', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const post = makePost('post-1', new Date('2024-01-01'));
            const story = makeStory('story-1', ['post-1']);
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([post]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(story);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].story).toBe(story);
        });

        it('should set previousPostInStory when post is not the first in story', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const previousPost = makePost('post-1', new Date('2024-01-01'));
            const currentPost = makePost('post-2', new Date('2024-01-02'));
            const story = makeStory('story-1', ['post-1', 'post-2']);
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([currentPost]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(story);
            mockGetPost.mockResolvedValue(previousPost);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].previousPostInStory).toBe(previousPost);
        });

        it('should set nextPostInStory when post is not the last in story', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const currentPost = makePost('post-1', new Date('2024-01-01'));
            const nextPost = makePost('post-2', new Date('2024-01-02'));
            const story = makeStory('story-1', ['post-1', 'post-2']);
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([currentPost]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(story);
            mockGetPost.mockResolvedValue(nextPost);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].nextPostInStory).toBe(nextPost);
        });

        it('should set previousPostInStory to null when post is first in story', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const currentPost = makePost('post-1', new Date('2024-01-01'));
            const story = makeStory('story-1', ['post-1', 'post-2']);
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([currentPost]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(story);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].previousPostInStory).toBeNull();
        });

        it('should set nextPostInStory to null when post is last in story', async (): Promise<void> => {
            // Arrange
            const page = makePage('blog', 'Blog');
            const currentPost = makePost('post-2', new Date('2024-01-02'));
            const story = makeStory('story-1', ['post-1', 'post-2']);
            const subject = makeSubject('android', 'Android', '/blog/android');
            mockGetBlogPage.mockResolvedValue(page);
            mockGetBlogCategories.mockResolvedValue([subject]);
            mockGetPosts.mockResolvedValue([currentPost]);
            mockGetCategoryForBlogPost.mockResolvedValue(subject);
            mockGetRelatedPosts.mockResolvedValue([]);
            mockGetStoryForPost.mockResolvedValue(story);

            // Act
            const result = await viewModel.getPostPages();

            // Assert
            expect(result[0].nextPostInStory).toBeNull();
        });
    });
});
