import { z } from 'astro/zod';

export const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  show_subjects: z.boolean().optional().default(false),
});

export type PageModelType = z.infer<typeof pageSchema>;
