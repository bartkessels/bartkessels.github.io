import { baseContentSchema } from './base-content.model';
import { z } from 'astro/zod';

export const backpackingSectionSchema = baseContentSchema.extend({
    gpx: z.string(),
    weather: z.string().optional(),
    temperatureC: z.number().optional(),
    difficulty: z.enum(['easy', 'moderate', 'hard', 'very-hard']).optional(),
    distanceKm: z.number().optional(),
});

export type BackpackingSectionModelType = z.infer<typeof backpackingSectionSchema>;
