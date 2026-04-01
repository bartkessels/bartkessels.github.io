import type { CollectionEntry } from "astro:content";
import { formatDate } from "@/utils/content";
import type { PageManager } from "@/managers/page.manager";
import type { StoriesManager } from "@/managers/stories.manager";

export class StoriesViewModel {
    constructor(
        private readonly storiesManager: StoriesManager,
        private readonly pageManager: PageManager
    ) {

    }

    public async getOverview(): Promise<OverviewPage> {
        const page = await this.pageManager.getStoriesPage();
        const stories = await this.storiesManager.getStories();

        return {
            page: page,
            stories: stories
        };
    }

    public async getStoryPages(): Promise<StoryPage[]> {
        const stories = await this.storiesManager.getStories();
        const result: StoryPage[] = [];

        for (const story of stories) {
            const posts = await this.storiesManager.getPostsForStory(story);
            const formattedDate = formatDate(story.data.date);

            result.push({
                story: story,
                posts: posts,
                formattedDate: formattedDate
            });
        }

        return result;
    }
}

export interface OverviewPage {
    page: CollectionEntry<'pages'>,
    stories: CollectionEntry<'stories'>[]
}

export interface StoryPage {
    story: CollectionEntry<'stories'>,
    posts: CollectionEntry<'blog'>[],
    formattedDate: string
}