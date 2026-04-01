import { baseContentSchema } from './base-content.model';
import { z } from 'astro/zod';

export const backpackingSectionSchema = baseContentSchema.extend({
    gpx: z.string(),
});

export type BackpackingSectionModelType = z.infer<typeof backpackingSectionSchema>;
