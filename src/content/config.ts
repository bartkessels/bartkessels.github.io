import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema } from '../models/blog.model';
import { storiesSchema } from '../models/stories.model';
import { softwareSchema } from '../models/software.model';
import { gardeningJournalSchema } from '../models/gardening-journal.model';
import { plantSchema } from '../models/plant.model';
import { subjectSchema } from '../models/subject.model';
import { pageSchema } from '../models/page.model';
import { backpackingTrailSchema } from '../models/backpacking-trail.model';
import { backpackingPostSchema } from '../models/backpacking-post.model';
import { backpackingSectionSchema } from '../models/backpacking-section.model';

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './content/blog',
    generateId: ({ entry, data }) => (data?.slug as string | undefined) ?? entry.replace(/\.mdx?$/, ''),
  }),
  schema: blogSchema,
});

const storiesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/stories' }),
  schema: storiesSchema,
});

const softwareCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/software' }),
  schema: softwareSchema,
});

const gardeningJournalCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/gardening/journal' }),
  schema: gardeningJournalSchema,
});

const plantCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/gardening/plants' }),
  schema: plantSchema,
});

const subjectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/subjects' }),
  schema: subjectSchema,
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/pages' }),
  schema: pageSchema,
});

const backpackingTrailsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/backpacking/trails' }),
  schema: backpackingTrailSchema,
});

const backpackingPostsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/backpacking/posts' }),
  schema: backpackingPostSchema,
});

const backpackingSectionsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/backpacking/sections' }),
  schema: backpackingSectionSchema,
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
  pages: pagesCollection,
};
