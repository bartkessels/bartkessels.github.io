import { z } from 'astro/zod';
import { baseContentSchema } from './base-content.model';

export const gardeningJournalSchema = baseContentSchema.extend({
  subject: z.string().optional()
});

export type GardeningJournalModelType = z.infer<typeof gardeningJournalSchema>;
