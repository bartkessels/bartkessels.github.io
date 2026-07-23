import { describe, expect, it } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import RelatedPosts from '@/components/RelatedPosts.astro';
import { renderComponent } from './support/render';

function makePost(id: string, subject: string, title: string): CollectionEntry<'blog'> {
    return {
        id,
        data: { subject, title, description: `${title} description`, image: '/img.jpg' },
    } as CollectionEntry<'blog'>;
}

describe('RelatedPosts', (): void => {
    it('renders nothing when relatedPosts is empty', async (): Promise<void> => {
        const { document } = await renderComponent(RelatedPosts, { props: { relatedPosts: [] } });

        expect(document.querySelector('aside')).toBeNull();
    });

    it('renders one item per post with the correct href', async (): Promise<void> => {
        const posts = [
            makePost('post-1', 'gardening', 'First post'),
            makePost('post-2', 'backpacking', 'Second post'),
        ];

        const { document } = await renderComponent(RelatedPosts, { props: { relatedPosts: posts } });

        const links = document.querySelectorAll('a');

        expect(links.length).toBe(2);
        expect(links[0].getAttribute('href')).toBe('/gardening/post-1');
        expect(links[1].getAttribute('href')).toBe('/backpacking/post-2');
    });
});
