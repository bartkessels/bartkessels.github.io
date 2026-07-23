import { describe, expect, it } from 'vitest';
import Footer from '@/components/Footer.astro';
import { renderComponent } from './support/render';

describe('Footer', (): void => {
    it('renders the GitHub, LinkedIn and RSS links', async (): Promise<void> => {
        const { document } = await renderComponent(Footer);

        expect(document.querySelector('a[aria-label="GitHub"]')?.getAttribute('href')).toBe('https://github.com/bartkessels');
        expect(document.querySelector('a[aria-label="LinkedIn"]')?.getAttribute('href')).toBe('https://linkedin.com/in/bartkessels');
        expect(document.querySelector('a[aria-label="RSS Feed"]')?.getAttribute('href')).toBe('/rss.xml');
    });

    it('renders the current year in the copyright notice', async (): Promise<void> => {
        const { document } = await renderComponent(Footer);

        expect(document.querySelector('p')?.textContent).toContain(String(new Date().getFullYear()));
    });
});
