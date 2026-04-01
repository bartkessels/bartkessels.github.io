import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AboutViewModel } from './about.view-model';
import type { CertificateManager } from '@/managers/certificate.manager';
import type { CollectionEntry } from 'astro:content';
import { PageManager } from '@/managers/page.manager';

describe('AboutViewModel', (): void => {
    const mockGetAboutPage = vi.fn();
    const mockGetCertificates = vi.fn();

    const mockPageManager = {
        getAboutPage: mockGetAboutPage
    } as unknown as PageManager;

    const mockCertificateManager = {
        getCertificates: mockGetCertificates
    } as unknown as CertificateManager;

    const viewModel = new AboutViewModel(mockPageManager, mockCertificateManager);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makeCertificate(id: string, issueDate: Date, name: string, expiryDate?: Date): CollectionEntry<'certificates'> {
        return { id, data: { issueDate, name, expiryDate } } as CollectionEntry<'certificates'>;
    }

    describe('getPage', (): void => {
        it('should return the page from the PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('about', 'About');
            mockGetAboutPage.mockResolvedValue(expectedPage);
            mockGetCertificates.mockResolvedValue([]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty certificates when CertificateManager returns no certificates', async (): Promise<void> => {
            // Arrange
            const page = makePage('about', 'About');
            mockGetAboutPage.mockResolvedValue(page);
            mockGetCertificates.mockResolvedValue([]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.certificates).toEqual([]);
        });

        it('should return formatted issueDate for each certificate', async (): Promise<void> => {
            // Arrange
            const page = makePage('about', 'About');
            const issueDate = new Date('2025-07-03');
            const certificate = makeCertificate('cert-1', issueDate, 'AZ-204');
            
            mockGetAboutPage.mockResolvedValue(page);
            mockGetCertificates.mockResolvedValue([certificate]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.certificates[0].issueDate).toBe('Jul 3, 2025');
        });

        it('should set expiryDate to undefined and isExpired to false when certificate has no expiryDate', async (): Promise<void> => {
            // Arrange
            const page = makePage('about', 'About');
            const certificate = makeCertificate('cert-1', new Date('2016-01-15'), 'MTA');
            
            mockGetAboutPage.mockResolvedValue(page);
            mockGetCertificates.mockResolvedValue([certificate]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.certificates[0].expiryDate).toBeUndefined();
            expect(result.certificates[0].isExpired).toBe(false);
        });

        it('should format expiryDate and set isExpired to false when certificate has future expiryDate', async (): Promise<void> => {
            // Arrange
            const page = makePage('about', 'About');
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const certificate = makeCertificate('cert-1', new Date('2025-07-03'), 'AZ-204', tomorrow);
            
            mockGetAboutPage.mockResolvedValue(page);
            mockGetCertificates.mockResolvedValue([certificate]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.certificates[0].expiryDate).toBeDefined();
            expect(result.certificates[0].isExpired).toBe(false);
        });

        it('should format expiryDate and set isExpired to true when certificate has past expiryDate', async (): Promise<void> => {
            // Arrange
            const page = makePage('about', 'About');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const certificate = makeCertificate('cert-1', new Date('2025-07-03'), 'AZ-204', yesterday);
            
            mockGetAboutPage.mockResolvedValue(page);
            mockGetCertificates.mockResolvedValue([certificate]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.certificates[0].expiryDate).toBeDefined();
            expect(result.certificates[0].isExpired).toBe(true);
        });

        it('should include the certificate object in each mapped certificate', async (): Promise<void> => {
            // Arrange
            const page = makePage('about', 'About');
            const certificate = makeCertificate('cert-1', new Date('2025-07-03'), 'AZ-204');
            
            mockGetAboutPage.mockResolvedValue(page);
            mockGetCertificates.mockResolvedValue([certificate]);

            // Act
            const result = await viewModel.getPage();

            // Assert
            expect(result.certificates[0].certificate).toBe(certificate);
        });
    });
});