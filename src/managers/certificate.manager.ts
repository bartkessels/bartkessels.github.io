import type { CertificateRepository } from '@/repositories/certificate.repository';
import type { CollectionEntry } from 'astro:content';

export class CertificateManager {
    constructor(
        private readonly certificateRepository: CertificateRepository,
    ) {
        
    }

    public async getCertificates(): Promise<CollectionEntry<'certificates'>[]> {
        const certificates = await this.certificateRepository.getCertificates();
        const now = new Date();

        return certificates.sort((a: CollectionEntry<'certificates'>, b: CollectionEntry<'certificates'>) => {
            const aExpired = a.data.expiryDate !== undefined && a.data.expiryDate < now;
            const bExpired = b.data.expiryDate !== undefined && b.data.expiryDate < now;

            if (aExpired !== bExpired) {
                return aExpired ? 1 : -1;
            }

            return b.data.issueDate.valueOf() - a.data.issueDate.valueOf();
        });
    }
}
