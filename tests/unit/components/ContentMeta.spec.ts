import { describe, expect, it } from 'vitest';
import ContentMeta from '@/components/ContentMeta.astro';
import { renderComponent } from './support/render';

describe('ContentMeta', (): void => {
    it('renders the date in a time element with the ISO datetime attribute', async (): Promise<void> => {
        const date = new Date('2026-03-05T00:00:00.000Z');
        const { document } = await renderComponent(ContentMeta, {
            props: { date, formattedDate: 'March 5, 2026' }
        });

        const time = document.querySelector('time');

        expect(time?.getAttribute('datetime')).toBe(date.toISOString());
        expect(time?.textContent).toContain('March 5, 2026');
    });

    it('does not render the author when it is not provided', async (): Promise<void> => {
        const { document } = await renderComponent(ContentMeta, {
            props: { date: new Date(), formattedDate: 'March 5, 2026' }
        });

        expect(document.body.textContent).not.toContain('undefined');
        expect(document.querySelectorAll('span').length).toBe(0);
    });

    it('renders the author when provided', async (): Promise<void> => {
        const { document } = await renderComponent(ContentMeta, {
            props: { date: new Date(), formattedDate: 'March 5, 2026', author: 'Bart Kessels' }
        });

        expect(document.body.textContent).toContain('Bart Kessels');
    });

    it('renders the reading time when provided', async (): Promise<void> => {
        const { document } = await renderComponent(ContentMeta, {
            props: { date: new Date(), formattedDate: 'March 5, 2026', readingTime: 4 }
        });

        expect(document.body.textContent).toContain('4 min read');
    });

    it('does not render the reading time when it is not provided', async (): Promise<void> => {
        const { document } = await renderComponent(ContentMeta, {
            props: { date: new Date(), formattedDate: 'March 5, 2026' }
        });

        expect(document.body.textContent).not.toContain('min read');
    });

    it('prefixes the formatted date when datePrefix is provided', async (): Promise<void> => {
        const { document } = await renderComponent(ContentMeta, {
            props: { date: new Date(), formattedDate: 'March 5, 2026', datePrefix: 'Started on' }
        });

        const time = document.querySelector('time');

        expect(time?.textContent?.trim()).toBe('Started on March 5, 2026');
    });
});
