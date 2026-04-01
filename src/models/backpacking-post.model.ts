import { baseContentSchema } from './base-content.model';
import { z } from 'astro/zod';

export const backpackingPostSchema = baseContentSchema;

export type BackpackingPostModelType = z.infer<typeof backpackingPostSchema>;
