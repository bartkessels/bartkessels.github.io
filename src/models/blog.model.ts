import { z } from 'astro/zod';
import { type CollectionEntry } from 'astro:content';
import { baseContentSchema } from './base-content.model';

export const blogSchema = baseContentSchema.extend({
  subject: z.string()
});

export type BlogModelType = z.infer<typeof blogSchema>;
export type BlogEntry = CollectionEntry<'blog'>;