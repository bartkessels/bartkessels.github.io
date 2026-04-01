import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import type { PageManager } from '@/managers/page.manager';
import type { SoftwareManager } from '@/managers/software.manager';
import { SoftwareViewModel } from './software.view-model';

describe('SoftwareViewModel', (): void => {
    const mockGetSoftwarePage = vi.fn();
    const mockGetProjects = vi.fn();

    const mockPageManager = {
        getAboutPage: vi.fn(),
        getBackpackingPage: vi.fn(),
        getBlogPage: vi.fn(),
        getGardeningPage: vi.fn(),
        getHomePage: vi.fn(),
        getSoftwarePage: mockGetSoftwarePage,
        getStoriesPage: vi.fn(),
        getPages: vi.fn()
    } as unknown as PageManager;

    const mockSoftwareManager = {
        getProjects: mockGetProjects,
        getFeaturedProjects: vi.fn()
    } as unknown as SoftwareManager;

    const viewModel = new SoftwareViewModel(mockSoftwareManager, mockPageManager);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    function makePage(id: string, title: string): CollectionEntry<'pages'> {
        return { id, data: { title } } as CollectionEntry<'pages'>;
    }

    function makeProject(id: string, name: string): CollectionEntry<'software'> {
        return { id, data: { name } } as unknown as CollectionEntry<'software'>;
    }

    describe('getOverview', (): void => {
        it('should return the page from PageManager', async (): Promise<void> => {
            // Arrange
            const expectedPage = makePage('software', 'Software');
            mockGetSoftwarePage.mockResolvedValue(expectedPage);
            mockGetProjects.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.page).toBe(expectedPage);
        });

        it('should return empty projects when SoftwareManager returns no projects', async (): Promise<void> => {
            // Arrange
            const page = makePage('software', 'Software');
            mockGetSoftwarePage.mockResolvedValue(page);
            mockGetProjects.mockResolvedValue([]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.projects).toEqual([]);
        });

        it('should return projects from SoftwareManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('software', 'Software');
            const project = makeProject('getit', 'GetIt');
            mockGetSoftwarePage.mockResolvedValue(page);
            mockGetProjects.mockResolvedValue([project]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.projects).toEqual([project]);
        });

        it('should return multiple projects from SoftwareManager', async (): Promise<void> => {
            // Arrange
            const page = makePage('software', 'Software');
            const project1 = makeProject('getit', 'GetIt');
            const project2 = makeProject('upset', 'Upset');
            mockGetSoftwarePage.mockResolvedValue(page);
            mockGetProjects.mockResolvedValue([project1, project2]);

            // Act
            const result = await viewModel.getOverview();

            // Assert
            expect(result.projects).toHaveLength(2);
            expect(result.projects).toEqual([project1, project2]);
        });
    });

    describe('getSoftwarePages', (): void => {
        it('should return empty array when no projects exist', async (): Promise<void> => {
            // Arrange
            mockGetProjects.mockResolvedValue([]);

            // Act
            const result = await viewModel.getSoftwarePages();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return software page for a single project', async (): Promise<void> => {
            // Arrange
            const project = makeProject('getit', 'GetIt');
            mockGetProjects.mockResolvedValue([project]);

            // Act
            const result = await viewModel.getSoftwarePages();

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].project).toBe(project);
        });

        it('should return software pages for multiple projects', async (): Promise<void> => {
            // Arrange
            const project1 = makeProject('getit', 'GetIt');
            const project2 = makeProject('upset', 'Upset');
            const project3 = makeProject('it-depends', 'It Depends');
            mockGetProjects.mockResolvedValue([project1, project2, project3]);

            // Act
            const result = await viewModel.getSoftwarePages();

            // Assert
            expect(result).toHaveLength(3);
            expect(result[0].project).toBe(project1);
            expect(result[1].project).toBe(project2);
            expect(result[2].project).toBe(project3);
        });
    });
});
