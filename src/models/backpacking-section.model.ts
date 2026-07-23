import { z } from 'astro/zod';

export const backpackingSectionSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default('Bart Kessels'),
    draft: z.boolean().default(false),
    gpx: z.string(),
    weather: z.string().default('Unknown'),
    temperatureC: z.number(),
    difficulty: z.enum(['easy', 'moderate', 'hard', 'very-hard']).default('easy'),
    tags: z.array(z.string()).optional(),
});

export type BackpackingSectionModelType = z.infer<typeof backpackingSectionSchema>;
