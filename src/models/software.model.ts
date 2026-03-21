import { z } from 'astro/zod';

export const softwareSchema = z.object({
  name: z.string(),
  subject: z.string(),
  description: z.string(),
  logo: z.string(),
  repository: z.url(),
  website: z.url().optional(),
  draft: z.boolean().default(false),
});

export type SoftwareModelType = z.infer<typeof softwareSchema>;
