import { beforeEach, describe, expect, it, vi } from "vitest";
import { CertificateManager } from "./certificate.manager";
import type { CertificateRepository } from "@/repositories/certificate.repository";
import type { CollectionEntry } from "astro:content";

function makeCertificate(id: string, date: Date, name: string, expiryDate?: Date): CollectionEntry<'certificates'> {
    return { id, data: { issueDate: date, name: name, expiryDate: expiryDate } } as CollectionEntry<'certificates'>;
}

const mockGetCertificates = vi.fn();

const mockRepository = {
    getCertificates: mockGetCertificates
} as CertificateRepository;

const manager = new CertificateManager(mockRepository);

describe('CertificateManager', (): void => {
    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getCertificates', (): void => {
        it('should return an empty list when the repository finds no certificates', async (): Promise<void> => {
            mockGetCertificates.mockResolvedValue([]);

            const result = await manager.getCertificates();

            expect(result.length).toBe(0);
        });

        it('should return an ordered when the repository finds certificates', async (): Promise<void> => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            const azCertificate = makeCertificate('cert-1', new Date(), 'AZ204');
            const mtaCertificate = makeCertificate('cert-2', yesterday, 'MTA');

            mockGetCertificates.mockResolvedValue([azCertificate, mtaCertificate]);

            const result = await manager.getCertificates();

            expect(result).length(2);
            expect(result[0]).toBe(azCertificate);
            expect(result[1]).toBe(mtaCertificate);
        });

        it('should order the retired certificates after the active certificates', async (): Promise<void> => {
            const today = new Date();
            const yesterday = new Date(today.getDate() - 1);
            const twoDaysAgo = new Date(today.getDate() - 2);

            const retiredAzCertificate = makeCertificate('cert-1', twoDaysAgo, 'AZ-204', yesterday);
            const activeAzCertificate = makeCertificate('cert-2', today, 'AZ-204');
            const mtaCertificate = makeCertificate('cert-3', twoDaysAgo, 'MTA');

            mockGetCertificates.mockResolvedValue([retiredAzCertificate, activeAzCertificate, mtaCertificate]);

            const result = await manager.getCertificates();

            expect(result.length).toBe(3);
            expect(result[0]).toBe(activeAzCertificate);
            expect(result[1]).toBe(mtaCertificate);
            expect(result[2]).toBe(retiredAzCertificate);
        });
    });
});