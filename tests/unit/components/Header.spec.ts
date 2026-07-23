import { describe, expect, it } from 'vitest';
import Header from '@/components/Header.astro';
import { renderComponent } from './support/render';

describe('Header', (): void => {
    it('renders the page links and personal links in both the desktop and mobile navigation', async (): Promise<void> => {
        const { document } = await renderComponent(Header, { props: { activePageId: 'blog' } });

        const desktopNav = document.querySelector('nav[aria-label="Main"]');
        const mobileNav = document.querySelector('nav[aria-label="Mobile menu"]');

        const expectedHrefs = ['/blog', '/stories', '/software', '/backpacking', '/gardening', '/about'];

        for (const nav of [desktopNav, mobileNav]) {
            const hrefs = Array.from(nav?.querySelectorAll('a') ?? []).map((a: Element): string | null => a.getAttribute('href'));
            expect(hrefs).toEqual(expectedHrefs);
        }
    });

    it('marks the link matching activePageId as aria-current in both navigations', async (): Promise<void> => {
        const { document } = await renderComponent(Header, { props: { activePageId: 'blog' } });

        const activeLinks = document.querySelectorAll('a[aria-current="page"][href="/blog"]');

        expect(activeLinks.length).toBe(2);
    });

    describe('showSubjectsBar', (): void => {
        it('does not render the subjects-bar slot by default', async (): Promise<void> => {
            const { html } = await renderComponent(Header, {
                props: { activePageId: 'blog' },
                slots: { 'subjects-bar': '<div data-test="bar" />' },
            });

            expect(html).not.toContain('data-test="bar"');
        });

        it('renders the subjects-bar slot when showSubjectsBar is true', async (): Promise<void> => {
            const { html } = await renderComponent(Header, {
                props: { activePageId: 'blog', showSubjectsBar: true },
                slots: { 'subjects-bar': '<div data-test="bar" />' },
            });

            expect(html).toContain('data-test="bar"');
        });
    });
});
