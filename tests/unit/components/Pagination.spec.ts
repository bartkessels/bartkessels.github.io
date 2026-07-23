import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Pagination.astro';
import { renderComponent } from './support/render';

describe('Pagination', (): void => {
    it('renders nothing when totalPages is 1', async (): Promise<void> => {
        const { document } = await renderComponent(Pagination, {
            props: { currentPage: 1, totalPages: 1, baseUrl: '/blog' },
        });

        expect(document.querySelector('nav')).toBeNull();
    });

    describe('getPageUrl', (): void => {
        it('links page 1 to baseUrl without a suffix', async (): Promise<void> => {
            const { document } = await renderComponent(Pagination, {
                props: { currentPage: 2, totalPages: 3, baseUrl: '/blog' },
            });

            const pageOneLink = document.querySelector('a[aria-label="Go to page 1"]');

            expect(pageOneLink?.getAttribute('href')).toBe('/blog');
        });

        it('links other pages to baseUrl/page', async (): Promise<void> => {
            const { document } = await renderComponent(Pagination, {
                props: { currentPage: 2, totalPages: 3, baseUrl: '/blog' },
            });

            const pageTwoLink = document.querySelector('a[aria-label="Go to page 2"]');

            expect(pageTwoLink?.getAttribute('href')).toBe('/blog/2');
        });
    });

    describe('boundary buttons', (): void => {
        it('hides the first and previous buttons on the first page', async (): Promise<void> => {
            const { document } = await renderComponent(Pagination, {
                props: { currentPage: 1, totalPages: 5, baseUrl: '/blog' },
            });

            expect(document.querySelector('a[aria-label="Go to first page"]')).toBeNull();
            expect(document.querySelector('a[aria-label="Go to previous page"]')).toBeNull();
            expect(document.querySelector('a[aria-label="Go to next page"]')).not.toBeNull();
        });

        it('hides the next and last buttons on the last page', async (): Promise<void> => {
            const { document } = await renderComponent(Pagination, {
                props: { currentPage: 5, totalPages: 5, baseUrl: '/blog' },
            });

            expect(document.querySelector('a[aria-label="Go to next page"]')).toBeNull();
            expect(document.querySelector('a[aria-label="Go to last page"]')).toBeNull();
            expect(document.querySelector('a[aria-label="Go to previous page"]')).not.toBeNull();
        });

        it('shows all four buttons on a middle page', async (): Promise<void> => {
            const { document } = await renderComponent(Pagination, {
                props: { currentPage: 3, totalPages: 5, baseUrl: '/blog' },
            });

            expect(document.querySelector('a[aria-label="Go to first page"]')).not.toBeNull();
            expect(document.querySelector('a[aria-label="Go to previous page"]')).not.toBeNull();
            expect(document.querySelector('a[aria-label="Go to next page"]')).not.toBeNull();
            expect(document.querySelector('a[aria-label="Go to last page"]')).not.toBeNull();
        });
    });

    it('shows exactly two ellipses and the correct page sequence for a gap on both sides', async (): Promise<void> => {
        const { document } = await renderComponent(Pagination, {
            props: { currentPage: 5, totalPages: 10, baseUrl: '/blog' },
        });

        const pageNumberContainer = document.querySelector('.flex.items-center.gap-1.mx-2');
        const ellipses = pageNumberContainer?.querySelectorAll('span');
        const pageLinks = pageNumberContainer?.querySelectorAll('a');

        expect(ellipses?.length).toBe(2);
        expect(Array.from(pageLinks ?? []).map((a: Element): string | null => a.textContent?.trim() ?? null)).toEqual([
            '1', '4', '5', '6', '10',
        ]);
    });

    it('marks only the current page link as aria-current', async (): Promise<void> => {
        const { document } = await renderComponent(Pagination, {
            props: { currentPage: 5, totalPages: 10, baseUrl: '/blog' },
        });

        const current = document.querySelectorAll('a[aria-current="page"]');

        expect(current.length).toBe(1);
        expect(current[0].textContent?.trim()).toBe('5');
    });
});
