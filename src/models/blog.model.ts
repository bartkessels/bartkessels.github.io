import { baseContentSchema } from './base-content.model';
import { type CollectionEntry } from 'astro:content';
import { z } from 'astro/zod';

export const blogSchema = baseContentSchema.extend({
    subject: z.string()
});

export type BlogModelType = z.infer<typeof blogSchema>;
export type BlogEntry = CollectionEntry<'blog'>;