import { z } from 'astro/zod';

export const certificateSchema = z.object({
    name: z.string(),
    issuer: z.string(),
    issuerLogo: z.string().optional(),
    issueDate: z.date(),
    expiryDate: z.date().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.url().optional(),
});

export type CertificateModelType = z.infer<typeof certificateSchema>;
