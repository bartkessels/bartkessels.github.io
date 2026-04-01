import { z } from 'astro/zod';

export const subjectSchema = z.object({
    name: z.string(),
    color: z.string().default('bg-gray-100 text-gray-800'),
    href: z.string(),
});

export type SubjectModelType = z.infer<typeof subjectSchema>;
export interface SimplifiedSubject {
  href: string,
  name: string
}