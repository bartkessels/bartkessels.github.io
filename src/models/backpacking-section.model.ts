import { z } from 'astro/zod';
import { baseContentSchema } from './base-content.model';

export const backpackingSectionSchema = baseContentSchema.extend({
  gpx: z.string(),
});

export type BackpackingSectionModelType = z.infer<typeof backpackingSectionSchema>;
