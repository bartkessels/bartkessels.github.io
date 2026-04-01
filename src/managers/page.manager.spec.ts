import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CollectionEntry } from "astro:content";
import { PageManager } from "./page.manager";
import type { PagesRepository } from "@/repositories/pages.repository";

describe('PageManager', (): void => {
    function makePage(id: string, name: string): CollectionEntry<'pages'> {
        return { id, data: { title: name } } as CollectionEntry<'pages'>;
    }

    const mockGetPage = vi.fn();
    const mockGetPages = vi.fn();

    const mockRepository = {
        getPage: mockGetPage,
        getPages: mockGetPages
    } as PagesRepository;

    const manager = new PageManager(mockRepository);

    beforeEach((): void => {
        vi.resetAllMocks();
    });

    describe('getAboutPage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'about';

            // Act
            await manager.getAboutPage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getBackpackingPage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'backpacking';

            // Act
            await manager.getBackpackingPage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getBlogPage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'blog';

            // Act
            await manager.getBlogPage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getGardeningPage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'gardening';

            // Act
            await manager.getGardeningPage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getHomePage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'index';

            // Act
            await manager.getHomePage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getSoftwarePage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'software';

            // Act
            await manager.getSoftwarePage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getStoriesPage', (): void => {
        it('should call the repository with the correct id', async (): Promise<void> => {
            // Arrange
            const expectedId = 'stories';

            // Act
            await manager.getStoriesPage();

            // Assert
            expect(mockGetPage).toHaveBeenCalledWith(expectedId);
        });
    });

    describe('getPages', (): void => {
        it('should return an empty array when the repository has no pages', async (): Promise<void> => {
            // Arrange
            mockGetPages.mockReturnValue([]);

            // Act
            const result = await manager.getPages();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all pages from the repository', async (): Promise<void> => {
            // Arrange
            const pageA = makePage('page-a', 'Page A');
            const pageB = makePage('page-b', 'Page B');

            mockGetPages.mockReturnValue([pageA, pageB]);

            // Act
            const result = await manager.getPages();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(pageA);
            expect(result[1]).toBe(pageB);
        });
    });
});