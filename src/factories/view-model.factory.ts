import { getBackpackingManager, getBlogManager, getCertificateManager, getGardeningManager, getPageManager, getSoftwareManager, getStoriesManager, getSubjectManager } from "./manager-factory";
import { AboutViewModel } from "@/viewModels/about.view-model";
import { BackpackingViewModel } from "@/viewModels/backpacking.view-model";
import { BlogViewModel } from "@/viewModels/blog.view-model";
import { GardeningViewModel } from "@/viewModels/gardening.view-model";
import { HomeViewModel } from "@/viewModels/home.view-model";
import { SoftwareViewModel } from "@/viewModels/software.view-model";
import { StoriesViewModel } from "@/viewModels/stories.view-model";

const backpackingManager = getBackpackingManager();
const blogManager = getBlogManager();
const certificateManager = getCertificateManager();
const gardeningManager = getGardeningManager();
const pageManager = getPageManager();
const softwareManager = getSoftwareManager();
const storiesManager = getStoriesManager();
const subjectManager = getSubjectManager();

export const getAboutViewModel = (): AboutViewModel => {
    return new AboutViewModel(pageManager, certificateManager);
}

export const getHomeViewModel = (): HomeViewModel => {
    return new HomeViewModel(pageManager, blogManager, softwareManager, backpackingManager, storiesManager, subjectManager);
}

export const getGardeningViewModel = (): GardeningViewModel => {
    return new GardeningViewModel(gardeningManager, pageManager);
}

export const getBackpackingViewModel = (): BackpackingViewModel => {
    return new BackpackingViewModel(backpackingManager, pageManager);
}

export const getBlogViewModel = (): BlogViewModel => {
    return new BlogViewModel(blogManager, pageManager, storiesManager, subjectManager);
}

export const getSoftwareViewModel = (): SoftwareViewModel => {
    return new SoftwareViewModel(softwareManager, pageManager);
}

export const getStoriesViewModel = (): StoriesViewModel => {
    return new StoriesViewModel(storiesManager, pageManager);
}