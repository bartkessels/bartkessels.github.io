import type { BlogRepository } from "@/repositories/blog.repository";
import type { CollectionEntry } from "astro:content";

export class BlogManager {
    private readonly maxRelatedPosts: number = 3;

    constructor(
        private readonly blogRepository: BlogRepository
    ) {

    }

    public async getPost(id: string): Promise<CollectionEntry<'blog'> | null> {
        return await this.blogRepository.getBlogPost(id);
    }

    public async getPosts(): Promise<CollectionEntry<'blog'>[]> {
        const posts = await this.blogRepository.getBlogPosts();
        return posts
            .filter((b: CollectionEntry<'blog'>) => !b.data.draft)
            .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.date.valueOf() - a.data.date.valueOf());
    }

    public async getRelatedPosts(post: CollectionEntry<'blog'>): Promise<CollectionEntry<'blog'>[]> {
        const posts = await this.getPosts();
        return posts
            .filter((p: CollectionEntry<'blog'>) => p.id !== post.id)
            .filter((p: CollectionEntry<'blog'>) => p.data.subject === post.data.subject)
            .slice(0, this.maxRelatedPosts);
    }

    public async getPostsForSubject(subject: CollectionEntry<'subjects/blog'>): Promise<CollectionEntry<'blog'>[]> {
        const posts = await this.getPosts();
        return posts.filter((p: CollectionEntry<'blog'>) => p.data.subject === subject.id);
    }

    public async getLatestsPosts(maxNumberOfPosts?: number): Promise<CollectionEntry<'blog'>[]> {
        const allPosts = await this.getPosts();
        const maxPosts = maxNumberOfPosts ?? allPosts.length;

        return allPosts.slice(0, maxPosts);
    }
}