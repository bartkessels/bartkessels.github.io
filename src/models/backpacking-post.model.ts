import { z } from 'astro/zod';
import { baseContentSchema } from './base-content.model';

export const backpackingPostSchema = baseContentSchema;

export type BackpackingPostModelType = z.infer<typeof backpackingPostSchema>;
