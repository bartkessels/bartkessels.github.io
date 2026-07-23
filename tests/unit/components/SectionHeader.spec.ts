import { describe, expect, it, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { renderComponent } from './support/render';

vi.mock('astro:content', async (): Promise<Record<string, unknown>> => {
    const actual = await vi.importActual('astro:content');
    return {
        ...actual,
        render: async (): Promise<{ Content: unknown }> => {
            const { default: Stub } = await import('./support/fixtures/RenderedContentStub.astro');
            return { Content: Stub };
        },
    };
});

describe('SectionHeader', (): void => {
    it('renders the page title', async (): Promise<void> => {
        const { default: SectionHeader } = await import('@/components/SectionHeader.astro');
        const page = { data: { title: 'About', description: 'A page about me' } } as CollectionEntry<'pages'>;

        const { document } = await renderComponent(SectionHeader, { props: { page } });

        expect(document.querySelector('h1')?.textContent).toContain('About');
    });

    it('renders the mocked rendered content', async (): Promise<void> => {
        const { default: SectionHeader } = await import('@/components/SectionHeader.astro');
        const page = { data: { title: 'About', description: 'A page about me' } } as CollectionEntry<'pages'>;

        const { html } = await renderComponent(SectionHeader, { props: { page } });

        expect(html).toContain('Stub rendered content');
    });
});
