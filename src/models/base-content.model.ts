import { z } from 'astro/zod';

export const baseContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  author: z.string().default('Bart Kessels'),
  image: z.string(),
  caption: z.string(),
  draft: z.boolean().default(false),
});
