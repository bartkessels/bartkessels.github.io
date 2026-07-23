import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import StoryCard from '@/components/StoryCard.astro';

const baseProps = {
    title: 'A story',
    description: 'A story description',
    date: new Date(2024, 0, 15),
    image: '/img.jpg',
    slug: 'a-story',
};

describe('StoryCard', (): void => {
    it('renders title, description, date and links to /stories/slug', async (): Promise<void> => {
        const { document } = await renderComponent(StoryCard, { props: { ...baseProps, postCount: 3 } });

        expect(document.querySelector('h3')?.textContent).toContain('A story');
        expect(document.querySelector('h3 a')?.getAttribute('href')).toBe('/stories/a-story');
        expect(document.querySelector('p.text-muted')?.textContent).toContain('A story description');
        expect(document.querySelector('time')?.textContent).toContain('January 15, 2024');
    });

    describe('postCount', (): void => {
        it('renders singular "post" when postCount is 1', async (): Promise<void> => {
            const { document } = await renderComponent(StoryCard, { props: { ...baseProps, postCount: 1 } });

            expect(document.body.textContent).toContain('1 post');
            expect(document.body.textContent).not.toContain('1 posts');
        });

        it('renders plural "posts" when postCount is 2', async (): Promise<void> => {
            const { document } = await renderComponent(StoryCard, { props: { ...baseProps, postCount: 2 } });

            expect(document.body.textContent).toContain('2 posts');
        });

        it('renders plural "posts" when postCount is 0', async (): Promise<void> => {
            const { document } = await renderComponent(StoryCard, { props: { ...baseProps, postCount: 0 } });

            expect(document.body.textContent).toContain('0 posts');
        });
    });
});
