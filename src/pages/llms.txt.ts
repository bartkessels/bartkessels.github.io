import {
    getBackpackingManager,
    getBlogManager,
    getGardeningManager,
    getPageManager,
    getSoftwareManager,
    getStoriesManager,
    getSubjectManager,
} from "@/factories/manager-factory";
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

export const GET: APIRoute = async () => {
    const pageManager = getPageManager();
    const subjectManager = getSubjectManager();
    const softwareManager = getSoftwareManager();
    const storiesManager = getStoriesManager();
    const blogManager = getBlogManager();
    const gardeningManager = getGardeningManager();
    const backpackingManager = getBackpackingManager();

    const pages = await pageManager.getPages();
    const blogSubjects = await subjectManager.getBlogCategories();
    const gardeningSubjects = await subjectManager.getGardeningYears();
    const software = await softwareManager.getProjects();
    const stories = await storiesManager.getStories();
    const blogPosts = await blogManager.getPosts();
    const gardeningJournal = await gardeningManager.getAllJournalEntries();
    const gardeningPlants = await gardeningManager.getAllPlants();
    const backpackingTrails = await backpackingManager.getTrails();
    const backpackingPosts = await backpackingManager.getPosts();

    const trailSections = await Promise.all(
        backpackingTrails.map(async (trail: CollectionEntry<'backpacking/trails'>) => ({
            trail,
            sections: await backpackingManager.getSections(trail),
        })),
    );

    const indexPage = pages.find((p: CollectionEntry<'pages'>) => p.id === "index");
    const sectionPages = pages.filter((p: CollectionEntry<'pages'>) => p.id !== "index");

    const lines: string[] = [];

    // Header
    if (indexPage) {
        lines.push(`# ${indexPage.data.title} — bartkessels.net`);
        lines.push("");
        lines.push(`> ${indexPage.data.description}`);
        lines.push("");
    }

    // Sections
    lines.push("## Sections");
    lines.push("");
    for (const page of sectionPages) {
        lines.push(`- [${page.data.title}](/${page.id}): ${page.data.description}`);
    }
    lines.push("- [About](/about): Background information about Bart Kessels.");
    lines.push("");

    // Blog Subjects
    if (blogSubjects.length > 0) {
        lines.push("## Blog Subjects");
        lines.push("");
        for (const subject of blogSubjects) {
            const description = subject.body?.trim() ?? subject.data.name;
            lines.push(`- [${subject.data.name}](/${subject.id}): ${description}`);
        }
        lines.push("");
    }

    // Blog Posts
    if (blogPosts.length > 0) {
        lines.push("## Blog Posts");
        lines.push("");
        for (const post of blogPosts) {
            lines.push(
                `- [${post.data.title}](/${post.data.subject}/${post.id}): ${post.data.description}`,
            );
        }
        lines.push("");
    }

    // Gardening Subjects
    if (gardeningSubjects.length > 0) {
        lines.push("## Gardening Journals");
        lines.push("");
        for (const subject of gardeningSubjects) {
            const description = subject.body?.trim() ?? subject.data.name;
            lines.push(
                `- [${subject.data.name}](/gardening/${subject.id}): ${description}`,
            );
        }
        lines.push("");
    }

    // Gardening Journal Entries
    if (gardeningJournal.length > 0) {
        lines.push("## Gardening Journal Entries");
        lines.push("");
        for (const entry of gardeningJournal) {
            const slug = entry.id.split("/").at(-1);
            const description = entry.data.description ?? entry.data.title;
            lines.push(
                `- [${entry.data.title}](/gardening/journal/${slug}): ${description}`,
            );
        }
        lines.push("");
    }

    // Gardening Plants
    if (gardeningPlants.length > 0) {
        lines.push("## Gardening Plants");
        lines.push("");
        for (const plant of gardeningPlants) {
            const slug = plant.id.split("/").at(-1);
            lines.push(`- [${plant.data.name}](/gardening/plants/${slug})`);
        }
        lines.push("");
    }

    // Backpacking Trails & Sections
    if (backpackingTrails.length > 0) {
        lines.push("## Backpacking Trails");
        lines.push("");
        for (const { trail, sections } of trailSections) {
            lines.push(
                `- [${trail.data.title}](/backpacking/${trail.id}): ${trail.data.description}`,
            );
            for (const section of sections) {
                lines.push(
                    `  - [${section.data.title}](/backpacking/${trail.id}/${section.id}): ${section.data.description}`,
                );
            }
        }
        lines.push("");
    }

    // Backpacking Posts
    if (backpackingPosts.length > 0) {
        lines.push("## Backpacking Posts");
        lines.push("");
        for (const post of backpackingPosts) {
            lines.push(
                `- [${post.data.title}](/backpacking/posts/${post.id}): ${post.data.description}`,
            );
        }
        lines.push("");
    }

    // Story Series
    if (stories.length > 0) {
        lines.push("## Story Series");
        lines.push("");
        for (const story of stories) {
            lines.push(
                `- [${story.data.title}](/stories/${story.id}): ${story.data.description}`,
            );
        }
        lines.push("");
    }

    // Software Projects
    if (software.length > 0) {
        lines.push("## Software Projects");
        lines.push("");
        for (const item of software) {
            lines.push(
                `- [${item.data.name}](/software/${item.id}): ${item.data.description}`,
            );
        }
        lines.push("");
    }

    // Author
    lines.push("## Author");
    lines.push("");
    lines.push(
        "Bart Kessels — Software Developer & Outdoor Enthusiast, Netherlands.",
    );
    lines.push("GitHub: https://github.com/bartkessels");
    lines.push("");

    return new Response(lines.join("\n"), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
