import type { CertificateManager } from "@/managers/certificate.manager";
import type { CollectionEntry } from "astro:content";
import { formatShortDate } from "@/utils/content";
import type { PageManager } from "@/managers/page.manager";

export class AboutViewModel {
    constructor(
        private readonly pageManager: PageManager,
        private readonly certificateManager: CertificateManager
    ) {

    }

    public async getPage(): Promise<AboutPage> {
        const page = await this.pageManager.getAboutPage();
        const certificates = await this.certificateManager.getCertificates();
        const certificateDates = certificates.map((certificate: CollectionEntry<'certificates'>) => {
            let expiryDate = undefined;
            let isExpired = false;
            
            if (certificate.data.expiryDate) {
                expiryDate = formatShortDate(certificate.data.expiryDate);
                isExpired = certificate.data.expiryDate < new Date();
            }

            return {
                certificate: certificate,
                issueDate: formatShortDate(certificate.data.issueDate),
                isExpired: isExpired,
                expiryDate: expiryDate
            };
        });

        return {
            page: page,
            certificates: certificateDates,
        };
    }
}

export interface AboutPage {
    page: CollectionEntry<'pages'>;
    certificates: CertificateDates[];
}

export interface CertificateDates {
    certificate: CollectionEntry<'certificates'>;
    issueDate: string;
    expiryDate?: string;
    isExpired: boolean;
}