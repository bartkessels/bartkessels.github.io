import type { CollectionEntry } from "astro:content";
import type { SubjectsRepository } from "@/repositories/subject.repository";

export class SubjectManager {

    constructor(
        private readonly subjectsRepository: SubjectsRepository
    ) {
        
    }

    public async getGardeningYears(): Promise<CollectionEntry<'subjects/gardening'>[]> {
        return await this.subjectsRepository.getGardeningSubjects();
    }

    public async getYearForGardeningJournalEntry(entry: CollectionEntry<'gardening/journal'>): Promise<CollectionEntry<'subjects/gardening'>> {
        const years = await this.getGardeningYears();
        const year = years.filter((y: CollectionEntry<'subjects/gardening'>) =>
            y.id === entry.data.subject
        ).at(0);

        if (!year) {
            throw new Error(`No year found for gardening journal '${entry.id}'`);
        }

        return year;
    }

    public async getBlogCategories(): Promise<CollectionEntry<'subjects/blog'>[]> {
        return await this.subjectsRepository.getBlogSubjects();
    }

    public async getCategoryForBlogPost(post: CollectionEntry<'blog'>): Promise<CollectionEntry<'subjects/blog'>> {
        const categories = await this.getBlogCategories();
        const category = categories.filter((c: CollectionEntry<'subjects/blog'>) => c.id === post.data.subject).at(0);

        if (!category) {
            throw new Error(`No category found for blog post '${post.id}'`);
        }

        return category;
    }
}