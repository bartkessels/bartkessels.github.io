import { z } from 'astro/zod';

export const plantSchema = z.object({
  name: z.string(),
  image: z.string(),
  caption: z.string(),
  category: z.string().optional(),
  years: z.number().array(),
});

export type PlantModelType = z.infer<typeof plantSchema>;
