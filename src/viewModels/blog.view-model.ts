import type { BlogManager } from "@/managers/blog.manager";
import type { StoriesManager } from "@/managers/stories.manager";
import type { CollectionEntry } from "astro:content";

export class BlogViewModel {
    constructor(
        private readonly manager: BlogManager,
        private readonly storiesManager: StoriesManager
    ) {

    }

    public async getOverview(): Promise<BlogOverviewPageViewState> {
        const page = await this.manager.getPage();
        const blogs = await this.manager.getBlogs();
        const featuredStories = await this.storiesManager.getFeaturedStories();

        return {
            page: page,
            stories: featuredStories.slice(0, 3),
            posts: blogs,
            postsPerPage: 9
        };
    }
}

export interface BlogOverviewPageViewState {
    page: CollectionEntry<'pages'>,
    stories: CollectionEntry<'stories'>[],
    posts: CollectionEntry<'blog'>[],
    postsPerPage: number
}
