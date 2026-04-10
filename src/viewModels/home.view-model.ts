import type { BackpackingManager } from "@/managers/backpacking.manager";
import type { BlogManager } from "@/managers/blog.manager";
import type { CollectionEntry } from "astro:content";
import type { PageManager } from "@/managers/page.manager";
import type { SoftwareManager } from "@/managers/software.manager";
import type { StoriesManager } from "@/managers/stories.manager";
import type { SubjectManager } from "@/managers/subject.manager";

export class HomeViewModel {
    private readonly maximumNumberOfBlogPosts = 3;
    private readonly maximumNumberOfFeaturedSoftwareProjects = 2;
    private readonly maximumNumberOfTrails = 3;
    private readonly maximumNumberOfFeaturedStories = 2;

    constructor(
        private readonly pageManager: PageManager,
        private readonly blogManager: BlogManager,
        private readonly softwareManager: SoftwareManager,
        private readonly backpackingManager: BackpackingManager,
        private readonly storyManager: StoriesManager,
        private readonly subjectManager: SubjectManager
    ) {

    }

    public async getOverviewPage(): Promise<OverviewPage> {
        const page = await this.pageManager.getHomePage();
        const latestPosts = await this.blogManager.getLatestsPosts(this.maximumNumberOfBlogPosts);
        const featuredSoftwareProjects = await this.softwareManager.getFeaturedProjects(this.maximumNumberOfFeaturedSoftwareProjects);
        const latestTrails = await this.backpackingManager.getLatestTrails(this.maximumNumberOfTrails);
        const latestsStories = await this.storyManager.getFeaturedStories(this.maximumNumberOfFeaturedStories);
        const postsWithSubject: PostWithSubject[] = [];
        
        for (const post of latestPosts) {
            const subject = await this.subjectManager.getCategoryForBlogPost(post);
            postsWithSubject.push({post, subject});
        }

        return {
            page: page,
            latestPosts: postsWithSubject,
            featuredSoftwareProjects: featuredSoftwareProjects,
            latestTrails: latestTrails,
            latestStories: latestsStories
        };
    }
}

export interface OverviewPage {
    page: CollectionEntry<'pages'>,
    latestPosts: PostWithSubject[],
    featuredSoftwareProjects: CollectionEntry<'software'>[],
    latestTrails: CollectionEntry<'backpacking/trails'>[],
    latestStories: CollectionEntry<'stories'>[]
}

export interface PostWithSubject {
    subject: CollectionEntry<'subjects/blog'>,
    post: CollectionEntry<'blog'>
}