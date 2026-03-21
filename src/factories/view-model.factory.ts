import { BackpackingManager } from "@/managers/backpacking.manager";
import { BlogManager } from "@/managers/blog.manager";
import { GardeningManager } from "@/managers/gardening.manager";
import { StoriesManager } from "@/managers/stories.manager";
import { BackpackingRepository } from "@/repositories/backpacking.repository";
import { BlogRepository } from "@/repositories/blog.repository";
import { GardeningRepository } from "@/repositories/gardening.repository";
import { PagesRepository } from "@/repositories/pages.repository";
import { StoriesRepository } from "@/repositories/stories.repository";
import { SubjectsRepository } from "@/repositories/subject.repository";
import { BackpackingViewModel } from "@/viewModels/backpacking.view-model";
import { BlogViewModel } from "@/viewModels/blog.view-model";
import { GardeningViewModel } from "@/viewModels/gardening.view-model";

const subjectsRepository = new SubjectsRepository();
const pagesRepository = new PagesRepository();
const storiesRepository = new StoriesRepository();

const storiesManager = new StoriesManager(storiesRepository);

export const getGardeningViewModel = (): GardeningViewModel => {
    const gardeningRepository = new GardeningRepository();
    const gardeningManager = new GardeningManager(subjectsRepository, gardeningRepository);

    return new GardeningViewModel(gardeningManager);
}

export const getBackpackingViewModel = (): BackpackingViewModel => {
    const backpackingRepository = new BackpackingRepository();
    const backpackingManager = new BackpackingManager(subjectsRepository, backpackingRepository);

    return new BackpackingViewModel(backpackingManager);
}

export const getBlogViewModel = (): BlogViewModel => {
    const blogRepository = new BlogRepository();
    const blogManager = new BlogManager(subjectsRepository, pagesRepository, blogRepository);

    return new BlogViewModel(blogManager, storiesManager);
}