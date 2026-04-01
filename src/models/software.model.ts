import { z } from 'astro/zod';

export const softwareSchema = z.object({
    name: z.string(),
    description: z.string(),
    logo: z.string(),
    repository: z.url(),
    website: z.url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
});

export type SoftwareModelType = z.infer<typeof softwareSchema>;
