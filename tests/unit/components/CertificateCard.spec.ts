import { describe, expect, it } from 'vitest';
import CertificateCard from '@/components/CertificateCard.astro';
import { renderComponent } from './support/render';

const baseProps = {
    name: 'AZ-204',
    issuer: 'Microsoft',
    issueDate: 'Jan 2024',
    isExpired: false,
};

describe('CertificateCard', (): void => {
    it('renders the issuer and certificate name', async (): Promise<void> => {
        const { document } = await renderComponent(CertificateCard, { props: baseProps });

        expect(document.querySelector('h3')?.textContent).toBe('AZ-204');
        expect(document.body.textContent).toContain('Microsoft');
        expect(document.body.textContent).toContain('Issued Jan 2024');
    });

    describe('isExpired', (): void => {
        it('shows an Active badge and accent stripe when not expired', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, { props: baseProps });

            expect(document.body.textContent).toContain('Active');
            expect(document.querySelector('article > div')?.className).toContain('bg-accent/80');
        });

        it('shows an Expired badge and muted stripe when expired', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, {
                props: { ...baseProps, isExpired: true, expiryDate: 'Jan 2025' },
            });

            expect(document.body.textContent).toContain('Expired');
            expect(document.querySelector('article > div')?.className).toContain('bg-muted/40');
        });

        it('prefixes the expiry date with "Expires" when active', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, {
                props: { ...baseProps, expiryDate: 'Jan 2026' },
            });

            expect(document.body.textContent).toContain('Expires Jan 2026');
        });

        it('prefixes the expiry date with "Expired" when expired', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, {
                props: { ...baseProps, isExpired: true, expiryDate: 'Jan 2025' },
            });

            expect(document.body.textContent).toContain('Expired Jan 2025');
        });
    });

    describe('issuerLogo', (): void => {
        it('renders an img when issuerLogo is provided', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, {
                props: { ...baseProps, issuerLogo: '/logo.png' },
            });

            expect(document.querySelector('img[src="/logo.png"]')).not.toBeNull();
        });

        it('renders a fallback icon when issuerLogo is omitted', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, { props: baseProps });

            expect(document.querySelector('img')).toBeNull();
            expect(document.querySelector('svg')).not.toBeNull();
        });
    });

    describe('footer', (): void => {
        it('is not rendered when neither credentialId nor credentialUrl is provided', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, { props: baseProps });

            expect(document.body.textContent).not.toContain('ID:');
            expect(document.querySelector('a[href]')).toBeNull();
        });

        it('renders only the credential id when credentialUrl is omitted', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, {
                props: { ...baseProps, credentialId: 'ABC123' },
            });

            expect(document.body.textContent).toContain('ID: ABC123');
            expect(document.body.textContent).not.toContain('Verify');
        });

        it('renders only the verify link when credentialId is omitted', async (): Promise<void> => {
            const { document } = await renderComponent(CertificateCard, {
                props: { ...baseProps, credentialUrl: 'https://example.com/verify' },
            });

            expect(document.body.textContent).not.toContain('ID:');
            const verifyLink = document.querySelector('a[href="https://example.com/verify"]');
            expect(verifyLink).not.toBeNull();
            expect(verifyLink?.textContent).toContain('Verify');
        });
    });
});
