import { BackpackingManager } from "@/managers/backpacking.manager";
import { BackpackingRepository } from "@/repositories/backpacking.repository";
import { BlogManager } from "@/managers/blog.manager";
import { BlogRepository } from "@/repositories/blog.repository";
import { CertificateManager } from "@/managers/certificate.manager";
import { CertificateRepository } from "@/repositories/certificate.repository";
import { GardeningManager } from "@/managers/gardening.manager";
import { GardeningRepository } from "@/repositories/gardening.repository";
import { PageManager } from "@/managers/page.manager";
import { PagesRepository } from "@/repositories/pages.repository";
import { SoftwareManager } from "@/managers/software.manager";
import { SoftwareRepository } from "@/repositories/software.repository";
import { StoriesManager } from "@/managers/stories.manager";
import { StoriesRepository } from "@/repositories/stories.repository";
import { SubjectManager } from "@/managers/subject.manager";
import { SubjectsRepository } from "@/repositories/subject.repository";

const backpackingRepository = new BackpackingRepository();
const blogRepository = new BlogRepository();
const certificateRepository = new CertificateRepository();
const gardeningRepository = new GardeningRepository();
const pagesRepository = new PagesRepository();
const softwareRepository = new SoftwareRepository();
const storiesRepository = new StoriesRepository();
const subjectsRepository = new SubjectsRepository();

export const getBackpackingManager = (): BackpackingManager => {
    return new BackpackingManager(backpackingRepository);
}

export const getBlogManager = (): BlogManager => {
    return new BlogManager(blogRepository);
}

export const getCertificateManager = (): CertificateManager => {
    return new CertificateManager(certificateRepository);
}

export const getGardeningManager = (): GardeningManager => {
    return new GardeningManager(subjectsRepository, gardeningRepository);
}

export const getPageManager = (): PageManager => {
    return new PageManager(pagesRepository);
}

export const getSoftwareManager = (): SoftwareManager => {
    return new SoftwareManager(softwareRepository);
}

export const getStoriesManager = (): StoriesManager => {
    return new StoriesManager(storiesRepository, blogRepository);
}

export const getSubjectManager = (): SubjectManager => {
    return new SubjectManager(subjectsRepository);
}