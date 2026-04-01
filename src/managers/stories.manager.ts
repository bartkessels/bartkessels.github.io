import type { BlogRepository } from "@/repositories/blog.repository";
import type { CollectionEntry } from "astro:content";
import type { StoriesRepository } from "@/repositories/stories.repository";

export class StoriesManager {
    constructor(
        private readonly repository: StoriesRepository,
        private readonly blogRepository: BlogRepository,
    ) {

    }

    public async getStories(): Promise<CollectionEntry<'stories'>[]> {
        const stories = await this.repository.getStories();
        return stories
            .filter((s: CollectionEntry<'stories'>) => !s.data.draft)
            .sort((a: CollectionEntry<'stories'>, b: CollectionEntry<'stories'>) => b.data.date.valueOf() - a.data.date.valueOf());
    }

    public async getFeaturedStories(maxStories?: number): Promise<CollectionEntry<'stories'>[]> {
        const stories = await this.getStories();
        const totalStories = maxStories ?? stories.length;

        return stories
            .filter((s: CollectionEntry<'stories'>) => s.data.featured)
            .slice(0, totalStories);
    }

    public async getStoryForPost(post: CollectionEntry<'blog'>): Promise<CollectionEntry<'stories'> | null> {
        const stories = await this.getStories();
        const filteredStories = stories.filter((s: CollectionEntry<'stories'>) => s.data.posts.includes(post.id));

        if (filteredStories.length > 1) {
            throw new Error(`Multiple stories referenced for '${post.id}'`);
        } else if (filteredStories.length <= 0) {
            return null;
        }

        return filteredStories.at(0)!;
    }

    public async getPostsForStory(story: CollectionEntry<'stories'>): Promise<CollectionEntry<'blog'>[]> {
        const result: CollectionEntry<'blog'>[] = [];

        for (const postId of story.data.posts) {
            const post = await this.blogRepository.getBlogPost(postId);

            if (post) {
                result.push(post);
            }
        }

        return result;
    }
}