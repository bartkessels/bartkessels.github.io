import { baseContentSchema } from './base-content.model';
import { z } from 'astro/zod';

export const backpackingSectionSchema = baseContentSchema.extend({
    gpx: z.string(),
    weather: z.string().default('Unknown'),
    temperatureC: z.number(),
    difficulty: z.enum(['easy', 'moderate', 'hard', 'very-hard']).default('easy'),
});

export type BackpackingSectionModelType = z.infer<typeof backpackingSectionSchema>;
