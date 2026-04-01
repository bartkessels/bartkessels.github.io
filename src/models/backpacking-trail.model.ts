import { baseContentSchema } from './base-content.model';
import { z } from 'astro/zod';

export const backpackingTrailSchema = baseContentSchema.extend({
    country: z.string(),
    location: z.string(),
    distanceKm: z.number(),
    sections: z.array(z.string()),
    totalSections: z.number().optional()
});

export type BackpackingTrailModelType = z.infer<typeof backpackingTrailSchema>;
