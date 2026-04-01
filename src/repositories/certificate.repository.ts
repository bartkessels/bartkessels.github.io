import { type CollectionEntry, getCollection } from 'astro:content';

export class CertificateRepository {
    public async getCertificates(): Promise<CollectionEntry<'certificates'>[]> {
        return getCollection('certificates');
    }
}
