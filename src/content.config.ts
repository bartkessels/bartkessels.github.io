import { backpackingPostSchema } from './models/backpacking-post.model';
import { backpackingSectionSchema } from './models/backpacking-section.model';
import { backpackingTrailSchema } from './models/backpacking-trail.model';
import { blogSchema } from './models/blog.model';
import { certificateSchema } from './models/certificate.model';
import { defineCollection } from 'astro:content';
import { gardeningJournalSchema } from './models/gardening-journal.model';
import { glob } from 'astro/loaders';
import { pageSchema } from './models/page.model';
import { plantSchema } from './models/plant.model';
import { softwareSchema } from './models/software.model';
import { storiesSchema } from './models/stories.model';
import { subjectSchema } from './models/subject.model';

const id = ({ entry, data }: { entry: string, data: Record<string, unknown> }): string =>
    (data?.slug as string | undefined) ?? entry.replace(/\.mdx?$/, '');

const blogCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/blog',
        generateId: id,
    }),
    schema: blogSchema,
});

const storiesCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/stories',
        generateId: id,
    }),
    schema: storiesSchema,
});

const softwareCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/software',
        generateId: id,
    }),
    schema: softwareSchema,
});

const gardeningJournalCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/gardening/journal/',
        generateId: id,
    }),
    schema: gardeningJournalSchema,
});

const plantCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/gardening/plants',
        generateId: id,
    }),
    schema: plantSchema,
});

const subjectsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/subjects',
        generateId: id,
    }),
    schema: subjectSchema,
});

const gardeningSubjectsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/subjects/gardening',
        generateId: id
    }),
    schema: subjectSchema
});

const blogSubjectsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/subjects/blog',
        generateId: id,
    }),
    schema: subjectSchema,
});

const pagesCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/pages',
        generateId: id,
    }),
    schema: pageSchema,
});

const backpackingTrailsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/backpacking/trails',
        generateId: id,
    }),
    schema: backpackingTrailSchema,
});

const backpackingPostsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/backpacking/posts',
        generateId: id,
    }),
    schema: backpackingPostSchema,
});

const backpackingSectionsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './content/backpacking/sections',
        generateId: id,
    }),
    schema: backpackingSectionSchema,
});

const certificatesCollection = defineCollection({
    loader: glob({
        pattern: '**/*.yml',
        base: './content/certificates',
        generateId: id,
    }),
    schema: certificateSchema,
});

export const collections = {
    blog: blogCollection,
    stories: storiesCollection,
    software: softwareCollection,
    'gardening/journal': gardeningJournalCollection,
    'gardening/plants': plantCollection,
    'backpacking/trails': backpackingTrailsCollection,
    'backpacking/posts': backpackingPostsCollection,
    'backpacking/sections': backpackingSectionsCollection,
    subjects: subjectsCollection,
    'subjects/gardening': gardeningSubjectsCollection,
    'subjects/blog': blogSubjectsCollection,
    pages: pagesCollection,
    certificates: certificatesCollection,
};
