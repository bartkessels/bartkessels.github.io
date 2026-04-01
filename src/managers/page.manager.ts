import type { CollectionEntry } from "astro:content";
import type { PagesRepository } from "@/repositories/pages.repository";

export class PageManager {
    private readonly aboutPage: string = 'about';
    private readonly backpackingPage: string = 'backpacking';
    private readonly blogPage: string = 'blog';
    private readonly gardeningPage: string = 'gardening';
    private readonly homePage: string = 'index';
    private readonly softwarePage: string = 'software';
    private readonly storiesPage: string = 'stories';

    constructor(
        private readonly repository: PagesRepository
    ) {

    }

    public getAboutPage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.aboutPage);
    }

    public getBackpackingPage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.backpackingPage);
    }

    public getBlogPage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.blogPage);
    }

    public getGardeningPage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.gardeningPage);
    }

    public getHomePage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.homePage);
    }

    public getSoftwarePage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.softwarePage);
    }

    public getStoriesPage(): Promise<CollectionEntry<'pages'>> {
        return this.repository.getPage(this.storiesPage);
    }

    public getPages(): Promise<CollectionEntry<'pages'>[]> {
        return this.repository.getPages();
    }
}