import { z } from 'astro/zod';
import { baseContentSchema } from './base-content.model';

export const storiesSchema = baseContentSchema.extend({
  posts: z.array(z.string()),
  featured: z.boolean().default(false)
});

export type StoriesModelType = z.infer<typeof storiesSchema>;
