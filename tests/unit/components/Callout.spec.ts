import { describe, expect, it } from 'vitest';
import Callout from '@/components/Callout.astro';
import { renderComponent } from './support/render';

describe('Callout', (): void => {
    it('renders the default title when omitted', async (): Promise<void> => {
        const { document } = await renderComponent(Callout);

        const aside = document.querySelector('aside');

        expect(aside?.getAttribute('aria-label')).toBe('TL;DR');
        expect(aside?.textContent).toContain('TL;DR');
    });

    it('renders a custom title when provided', async (): Promise<void> => {
        const { document } = await renderComponent(Callout, { props: { title: 'Note' } });

        const aside = document.querySelector('aside');

        expect(aside?.getAttribute('aria-label')).toBe('Note');
        expect(aside?.textContent).toContain('Note');
    });

    it('renders the default slot content', async (): Promise<void> => {
        const { html } = await renderComponent(Callout, { slots: { default: 'Read this carefully.' } });

        expect(html).toContain('Read this carefully.');
    });
});
