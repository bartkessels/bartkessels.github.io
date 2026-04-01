import { z } from 'astro/zod';

export const plantSchema = z.object({
    name: z.string(),
    image: z.string(),
    caption: z.string(),
    category: z.string().optional(),
    years: z.number().array(),
    tags: z.array(z.string()).optional(),
    sowIndoors: z.number().array().optional(),
    moveOutdoors: z.number().array().optional(),
    harvest: z.number().array().optional(),
});

export type PlantModelType = z.infer<typeof plantSchema>;
