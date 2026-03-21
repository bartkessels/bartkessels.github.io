import type { BlogRepository } from "@/repositories/blog.repository";
import type { PagesRepository } from "@/repositories/pages.repository";
import type { CollectionEntry } from "astro:content";

export class BlogManager {
    private static pageName = 'blog';

    constructor(
        private readonly pagesRepository: PagesRepository,
        private readonly blogRepository: BlogRepository
    ) {

    }

    public async getPage(): Promise<CollectionEntry<'pages'>> {
        return this.pagesRepository.getPage(BlogManager.pageName);
    }

    public async getBlogs(): Promise<CollectionEntry<'blog'>[]> {
        const blogs = await this.blogRepository.getBlogPosts();
        return blogs
            .filter(b => !b.data.draft)
            .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    }
}