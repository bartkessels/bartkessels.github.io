import { describe, expect, it } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { renderComponent } from './support/render';
import StoryNavigation from '@/components/StoryNavigation.astro';

function makePost(id: string, subject: string, title: string): CollectionEntry<'blog'> {
    return { id, data: { subject, title } } as CollectionEntry<'blog'>;
}

describe('StoryNavigation', (): void => {
    it('renders nothing when both previousPost and nextPost are null', async (): Promise<void> => {
        const { document } = await renderComponent(StoryNavigation, {
            props: { previousPost: null, nextPost: null },
        });

        expect(document.querySelector('nav')).toBeNull();
    });

    it('renders only the previous link when only previousPost is provided', async (): Promise<void> => {
        const previousPost = makePost('prev', 'gardening', 'Previous title');

        const { document } = await renderComponent(StoryNavigation, {
            props: { previousPost, nextPost: null },
        });

        const links = document.querySelectorAll('nav a');

        expect(links.length).toBe(1);
        expect(links[0].getAttribute('href')).toBe('/gardening/prev');
        expect(links[0].textContent).toContain('Previous title');
    });

    it('renders only the next link when only nextPost is provided', async (): Promise<void> => {
        const nextPost = makePost('next', 'backpacking', 'Next title');

        const { document } = await renderComponent(StoryNavigation, {
            props: { previousPost: null, nextPost },
        });

        const links = document.querySelectorAll('nav a');

        expect(links.length).toBe(1);
        expect(links[0].getAttribute('href')).toBe('/backpacking/next');
        expect(links[0].textContent).toContain('Next title');
    });

    it('renders both links with the correct hrefs when both are provided', async (): Promise<void> => {
        const previousPost = makePost('prev', 'gardening', 'Previous title');
        const nextPost = makePost('next', 'backpacking', 'Next title');

        const { document } = await renderComponent(StoryNavigation, {
            props: { previousPost, nextPost },
        });

        const links = document.querySelectorAll('nav a');

        expect(links.length).toBe(2);
        expect(links[0].getAttribute('href')).toBe('/gardening/prev');
        expect(links[1].getAttribute('href')).toBe('/backpacking/next');
    });
});
