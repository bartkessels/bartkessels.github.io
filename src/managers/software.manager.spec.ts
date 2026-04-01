import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CollectionEntry } from "astro:content";
import { SoftwareManager } from "./software.manager";
import type { SoftwareRepository } from "@/repositories/software.repository";

describe('SoftwareManager', (): void => {
    function makeProject(id: string, name: string, draft: boolean = false, featured: boolean = false): CollectionEntry<'software'> {
        return { id, data: { name: name, draft: draft, featured: featured } } as CollectionEntry<'software'>;
    }

    const mockGetProjects = vi.fn();

    const mockRepository = {
        getProjects: mockGetProjects
    } as SoftwareRepository;

    const manager = new SoftwareManager(mockRepository);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('getProjects', (): void => {
        it('should return an empty list when the repository has no projects', async (): Promise<void> => {
            // Arrange
            mockGetProjects.mockResolvedValue([]);

            // Act
            const result = await manager.getProjects();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return all projects sorted based on the name', async (): Promise<void> => {
            // Arrange
            const projectA = makeProject('proj-a', 'a');
            const projectB = makeProject('proj-b', 'b', false, true);
            const projectC = makeProject('proj-c', 'c');

            mockGetProjects.mockResolvedValue([projectB, projectC, projectA]);

            // Act
            const result = await manager.getProjects();

            // Assert
            expect(result.length).toBe(3);
            expect(result[0]).toBe(projectA);
            expect(result[1]).toBe(projectB);
            expect(result[2]).toBe(projectC);
        });

        it('should filter out all the draft projects', async (): Promise<void> => {
            // Arrange
            const projectA = makeProject('proj-a', 'a');
            const projectB = makeProject('proj-b', 'b', true);
            const projectC = makeProject('proj-c', 'c');

            mockGetProjects.mockResolvedValue([projectB, projectC, projectA]);

            // Act
            const result = await manager.getProjects();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(projectA);
            expect(result[1]).toBe(projectC);
        });
    });

    describe('getFeaturedProjects', (): void => {
        it('should return an empty list when the repository has no projects', async (): Promise<void> => {
            // Arrange
            mockGetProjects.mockResolvedValue([]);

            // Act
            const result = await manager.getFeaturedProjects();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return an empty list when there are no featured projects', async (): Promise<void> => {
            // Arrange
            const projectA = makeProject('proj-a', 'a', false, false);
            const projectB = makeProject('proj-b', 'b', false, false);
            const projectC = makeProject('proj-c', 'c', false, false);

            mockGetProjects.mockResolvedValue([projectA, projectB, projectC]);

            // Act
            const result = await manager.getFeaturedProjects();

            // Assert
            expect(result.length).toBe(0);
        });

        it('should return only featured projects sorted based on the name', async (): Promise<void> => {
            // Arrange
            const projectA = makeProject('proj-a', 'a', false, true);
            const projectB = makeProject('proj-b', 'b', false, true);
            const projectC = makeProject('proj-c', 'c');

            mockGetProjects.mockResolvedValue([projectB, projectC, projectA]);

            // Act
            const result = await manager.getFeaturedProjects();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(projectA);
            expect(result[1]).toBe(projectB);
        });

        it('should filter out all the draft projects', async (): Promise<void> => {
            // Arrange
            const projectA = makeProject('proj-a', 'a', false, true);
            const projectB = makeProject('proj-b', 'b', true);
            const projectC = makeProject('proj-c', 'c', false, true);

            mockGetProjects.mockResolvedValue([projectB, projectC, projectA]);

            // Act
            const result = await manager.getFeaturedProjects();

            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(projectA);
            expect(result[1]).toBe(projectC);
        });
    });
});