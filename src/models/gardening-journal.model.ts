import { baseContentSchema } from './base-content.model';
import { z } from 'astro/zod';

export const gardeningJournalSchema = baseContentSchema.extend({
    subject: z.string()
});

export type GardeningJournalModelType = z.infer<typeof gardeningJournalSchema>;
