import { describe, expect, it } from 'vitest';
import BlogCard from '@/components/BlogCard.astro';
import { renderComponent } from './support/render';

const baseProps = {
    title: 'A blog post',
    description: 'A blog post description',
    date: new Date(2024, 0, 15),
    author: 'Bart Kessels',
    image: '/img.jpg',
    slug: 'a-blog-post',
};

describe('BlogCard', (): void => {
    it('renders title, description, author and formatted date', async (): Promise<void> => {
        const { document } = await renderComponent(BlogCard, { props: baseProps });

        expect(document.querySelector('h3')?.textContent).toContain('A blog post');
        expect(document.querySelector('p.text-muted')?.textContent).toContain('A blog post description');
        expect(document.body.textContent).toContain('Bart Kessels');
        expect(document.querySelector('time')?.textContent).toContain('Jan 15, 2024');
    });

    describe('href', (): void => {
        it('defaults to /subjectId/slug when href is omitted', async (): Promise<void> => {
            const { document } = await renderComponent(BlogCard, {
                props: { ...baseProps, subjectId: 'gardening' },
            });

            expect(document.querySelector('h3 a')?.getAttribute('href')).toBe('/gardening/a-blog-post');
        });

        it('uses href directly when provided', async (): Promise<void> => {
            const { document } = await renderComponent(BlogCard, {
                props: { ...baseProps, subjectId: 'gardening', href: '/custom-path' },
            });

            expect(document.querySelector('h3 a')?.getAttribute('href')).toBe('/custom-path');
        });
    });

    describe('subject badge', (): void => {
        it('is not rendered when subject is omitted', async (): Promise<void> => {
            const { document } = await renderComponent(BlogCard, { props: baseProps });

            expect(document.querySelector('.mb-3 span')).toBeNull();
        });

        it('is rendered when subject is provided', async (): Promise<void> => {
            const { document } = await renderComponent(BlogCard, {
                props: { ...baseProps, subject: 'Gardening' },
            });

            expect(document.querySelector('.mb-3')?.textContent).toContain('Gardening');
        });
    });

    describe('readingTime', (): void => {
        it('renders the reading time when provided', async (): Promise<void> => {
            const { document } = await renderComponent(BlogCard, {
                props: { ...baseProps, readingTime: 5 },
            });

            expect(document.body.textContent).toContain('5 min');
        });

        it('does not render a reading time element when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(BlogCard, { props: baseProps });

            expect(document.body.textContent).not.toContain('min');
        });
    });
});
