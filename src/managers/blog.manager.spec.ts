import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlogManager } from '@/managers/blog.manager';
import type { BlogRepository } from '@/repositories/blog.repository';
import type { CollectionEntry } from 'astro:content';


describe('BlogManager', (): void => {
    function makePost(id: string, date: Date, subject: string = 'misc', draft: boolean = false): CollectionEntry<'blog'> {
        return { id, data: { date, draft, subject } } as CollectionEntry<'blog'>;
    }

    function makeSubject(id: string): CollectionEntry<'subjects/blog'> {
        return { id } as CollectionEntry<'subjects/blog'>;
    }

    const mockGetBlogPost = vi.fn();
    const mockGetBlogPosts = vi.fn();

    const mockRepository = {
        getBlogPost: mockGetBlogPost,
        getBlogPosts: mockGetBlogPosts,
    } as BlogRepository;

    const manager = new BlogManager(mockRepository);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getPost', (): void => {
        it('should return the post when the repository returns a match', async (): Promise<void> => {
            // Arrange
            const post = makePost('post-1', new Date());
            
            mockGetBlogPost.mockResolvedValue(post);

            // Act
            const result = await manager.getPost('post-1');

            // Assert
            expect(result).toEqual(post);
        });

        it('should return null when the repository finds no match', async (): Promise<void> => {
            // Arrange
            mockGetBlogPost.mockResolvedValue(null);

            // Act
            const result = await manager.getPost('non-existent');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('getPosts', (): void => {
        it('should filter out draft posts', async (): Promise<void> => {
            // Arrange
            const draftPost = makePost('draft', new Date(), 'misc', true);
            const publishedPost = makePost('published', new Date(), 'misc', false);
            
            mockGetBlogPosts.mockResolvedValue([draftPost, publishedPost]);

            // Act
            const result = await manager.getPosts();

            // Assert
            expect(result).toEqual([publishedPost]);
        });

        it('should sort posts by date descending', async (): Promise<void> => {
            // Arrange
            const older = makePost('older', new Date('2024-01-01'));
            const newer = makePost('newer', new Date('2024-06-01'));
            
            mockGetBlogPosts.mockResolvedValue([older, newer]);

            // Act
            const result = await manager.getPosts();

            // Assert
            expect(result).toEqual([newer, older]);
        });
    });

    describe('getRelatedPosts', (): void => {
        it('should exclude the given post itself', async (): Promise<void> => {
            // Arrange
            const post = makePost('current', new Date(), 'misc');
            const other = makePost('other', new Date(), 'misc');
            
            mockGetBlogPosts.mockResolvedValue([post, other]);

            // Act
            const result = await manager.getRelatedPosts(post);

            // Assert
            expect(result).not.toContain(post);
        });

        it('should only include posts with the same subject', async (): Promise<void> => {
            // Arrange
            const post = makePost('current', new Date(), 'android');
            const related = makePost('related', new Date('2024-06-01'), 'android');
            const unrelated = makePost('unrelated', new Date('2024-05-01'), 'kotlin');
            
            mockGetBlogPosts.mockResolvedValue([post, related, unrelated]);

            // Act
            const result = await manager.getRelatedPosts(post);

            // Assert
            expect(result).toEqual([related]);
        });

        it('should return at most three related posts', async (): Promise<void> => {
            // Arrange
            const post = makePost('current', new Date('2024-01-01'), 'misc');
            const related = [
                makePost('r1', new Date('2024-06-01'), 'misc'),
                makePost('r2', new Date('2024-05-01'), 'misc'),
                makePost('r3', new Date('2024-04-01'), 'misc'),
                makePost('r4', new Date('2024-03-01'), 'misc'),
            ];

            mockGetBlogPosts.mockResolvedValue([post, ...related]);

            // Act
            const result = await manager.getRelatedPosts(post);

            // Assert
            expect(result).toHaveLength(3);
        });
    });

    describe('getPostsForSubject', (): void => {
        it('should return only posts matching the given subject', async (): Promise<void> => {
            // Arrange
            const subject = makeSubject('android');
            const matchingPost = makePost('matching', new Date(), 'android');
            const otherPost = makePost('other', new Date(), 'kotlin');
            
            mockGetBlogPosts.mockResolvedValue([matchingPost, otherPost]);

            // Act
            const result = await manager.getPostsForSubject(subject);

            // Assert
            expect(result).toEqual([matchingPost]);
        });
    });

    describe('getLatestsPosts', (): void => {
        it('should return all posts when no limit is provided', async (): Promise<void> => {
            // Arrange
            const posts = [
                makePost('a', new Date('2024-03-01')),
                makePost('b', new Date('2024-02-01')),
                makePost('c', new Date('2024-01-01')),
            ];

            mockGetBlogPosts.mockResolvedValue(posts);

            // Act
            const result = await manager.getLatestsPosts();

            // Assert
            expect(result).toHaveLength(3);
        });

        it('should return only the specified number of latest posts', async (): Promise<void> => {
            // Arrange
            const posts = [
                makePost('a', new Date('2024-03-01')),
                makePost('b', new Date('2024-02-01')),
                makePost('c', new Date('2024-01-01')),
            ];

            mockGetBlogPosts.mockResolvedValue(posts);

            // Act
            const result = await manager.getLatestsPosts(2);

            // Assert
            expect(result).toHaveLength(2);
        });
    });
});
