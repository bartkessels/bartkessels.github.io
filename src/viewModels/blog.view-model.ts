import type { BlogManager } from "@/managers/blog.manager";
import type { CollectionEntry } from "astro:content";
import { formatDate } from "@/utils/content";
import type { PageManager } from "@/managers/page.manager";
import type { SimplifiedSubject } from "@/models/subject.model";
import type { StoriesManager } from "@/managers/stories.manager";
import type { SubjectManager } from "@/managers/subject.manager";

export class BlogViewModel {
    private readonly numberOfPostsPerPage = 9;
    private readonly maxFeaturedStories = 3;

    constructor(
        private readonly blogManager: BlogManager,
        private readonly pageManager: PageManager,
        private readonly storiesManager: StoriesManager,
        private readonly subjectManager: SubjectManager
    ) {

    }

    public async getOverviewPage(): Promise<OverviewPage> {
        const page = await this.pageManager.getBlogPage();
        const subjects = await this.getSubjects();
        const featuredStories = await this.storiesManager.getFeaturedStories(this.maxFeaturedStories);
        const posts = await this.blogManager.getPosts();
        const postsWithSubject: PostWithSubject[] = [];

        for (const post of posts) {
            const subject = await this.subjectManager.getCategoryForBlogPost(post);
            postsWithSubject.push({post, subject});
        }

        return {
            page: page,
            stories: featuredStories,
            posts: postsWithSubject,
            postsPerPage: this.numberOfPostsPerPage,
            subjects: subjects
        };
    }

    public async getSubjectOverviewPages(): Promise<SubjectOverviewPage[]> {
        const categories = await this.subjectManager.getBlogCategories();
        const page = await this.pageManager.getBlogPage();
        const subjects = this.simplifySubjects(categories);
        const result: SubjectOverviewPage[] = [];

        for (const subject of categories) {
            const posts = await this.blogManager.getPostsForSubject(subject);

            result.push({
                page: page,
                subject: subject,
                subjects: subjects,
                posts: posts,
                postsPerPage: this.numberOfPostsPerPage
            });
        }

        return result;
    }

    public async getPostPages(): Promise<PostPage[]> {
        const posts = await this.blogManager.getPosts();
        const page = await this.pageManager.getBlogPage();
        const subjects = await this.getSubjects();
        const result: PostPage[] = [];

        for (const post of posts) {
            const category = await this.subjectManager.getCategoryForBlogPost(post);
            const relatedPosts = await this.blogManager.getRelatedPosts(post);
            const story = await this.storiesManager.getStoryForPost(post);
            const previousPost = await this.getPreviousPost(story, post);
            const nextPost = await this.getNextPost(story, post);
            
            result.push({
                page: page,
                subject: category,
                subjects: subjects,
                relatedPosts: relatedPosts,
                post: post,
                story: story,
                previousPostInStory: previousPost,
                nextPostInStory: nextPost,
                formattedDate: formatDate(post.data.date)
            });
        }

        return result;
    }

    private async getPreviousPost(story: CollectionEntry<'stories'> | null, post: CollectionEntry<'blog'>): Promise<CollectionEntry<'blog'> | null> {
        if (story === null) {
            return null;
        }

        const currentIndex = story.data.posts.indexOf(post.id);
        const previousPostId = story.data.posts.at(currentIndex - 1);

        if (currentIndex <= 0 || currentIndex >= story.data.posts.length || !previousPostId) {
            return null;
        }

        return await this.blogManager.getPost(previousPostId);
    }

    private async getNextPost(story: CollectionEntry<'stories'> | null, post: CollectionEntry<'blog'>): Promise<CollectionEntry<'blog'> | null> {
        if (story === null) {
            return null;
        }

        const currentIndex = story.data.posts.indexOf(post.id);
        const nextPostId = story.data.posts.at(currentIndex + 1);

        if (currentIndex < 0 || currentIndex >= story.data.posts.length || !nextPostId) {
            return null;
        }

        return await this.blogManager.getPost(nextPostId);
    }

    private async getSubjects(): Promise<SimplifiedSubject[]> {
        const subjects = await this.subjectManager.getBlogCategories();
        return this.simplifySubjects(subjects);
    }

    private simplifySubjects(subjects: CollectionEntry<'subjects/blog'>[]): SimplifiedSubject[] {
        return subjects.map((s: CollectionEntry<'subjects/blog'>) => ({
            href: s.data.href,
            name: s.data.name
        }));
    }
}

export interface OverviewPage {
    page: CollectionEntry<'pages'>,
    subjects: SimplifiedSubject[],
    stories: CollectionEntry<'stories'>[],
    posts: PostWithSubject[],
    postsPerPage: number
}

export interface SubjectOverviewPage {
    page: CollectionEntry<'pages'>,
    subject: CollectionEntry<'subjects/blog'>,
    subjects: SimplifiedSubject[],
    posts: CollectionEntry<'blog'>[],
    postsPerPage: number
}

export interface PostPage {
    page: CollectionEntry<'pages'>,
    subject: CollectionEntry<'subjects/blog'>,
    subjects: SimplifiedSubject[],
    post: CollectionEntry<'blog'>,
    relatedPosts: CollectionEntry<'blog'>[],
    story: CollectionEntry<'stories'> | null,
    nextPostInStory: CollectionEntry<'blog'> | null,
    previousPostInStory: CollectionEntry<'blog'> | null,
    formattedDate: string
}

export interface PostWithSubject {
    subject: CollectionEntry<'subjects/blog'>,
    post: CollectionEntry<'blog'>
}