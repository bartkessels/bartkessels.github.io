import { describe, expect, it } from 'vitest';
import ImageFloat from '@/components/ImageFloat.astro';
import { renderComponent } from './support/render';

describe('ImageFloat', (): void => {
    describe('imageSide', (): void => {
        it('applies the float-start classes when imageSide is start', async (): Promise<void> => {
            const { document } = await renderComponent(ImageFloat, {
                props: { image: '/img.jpg', imageSide: 'start', caption: 'A caption' },
            });

            const figure = document.querySelector('figure');

            expect(figure?.className).toContain('sm:float-start');
            expect(figure?.className).toContain('sm:mr-6');
        });

        it('applies the float-end classes when imageSide is end', async (): Promise<void> => {
            const { document } = await renderComponent(ImageFloat, {
                props: { image: '/img.jpg', imageSide: 'end', caption: 'A caption' },
            });

            const figure = document.querySelector('figure');

            expect(figure?.className).toContain('sm:float-end');
            expect(figure?.className).toContain('sm:ml-6');
        });
    });

    describe('title', (): void => {
        it('renders both mobile and desktop headings when provided', async (): Promise<void> => {
            const { document } = await renderComponent(ImageFloat, {
                props: { image: '/img.jpg', imageSide: 'start', caption: 'A caption', title: 'A title' },
            });

            const headings = document.querySelectorAll('h3');

            expect(headings.length).toBe(2);
            expect(headings[0].textContent).toBe('A title');
            expect(headings[1].textContent).toBe('A title');
        });

        it('renders no heading when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(ImageFloat, {
                props: { image: '/img.jpg', imageSide: 'start', caption: 'A caption' },
            });

            expect(document.querySelectorAll('h3').length).toBe(0);
        });
    });

    describe('height', (): void => {
        it('defaults to 200px', async (): Promise<void> => {
            const { document } = await renderComponent(ImageFloat, {
                props: { image: '/img.jpg', imageSide: 'start', caption: 'A caption' },
            });

            expect(document.querySelector('img')?.getAttribute('style')).toBe('height: 200px;');
        });

        it('reflects a custom height', async (): Promise<void> => {
            const { document } = await renderComponent(ImageFloat, {
                props: { image: '/img.jpg', imageSide: 'start', caption: 'A caption', height: 350 },
            });

            expect(document.querySelector('img')?.getAttribute('style')).toBe('height: 350px;');
        });
    });

    it('renders slot content after the figure', async (): Promise<void> => {
        const { html } = await renderComponent(ImageFloat, {
            props: { image: '/img.jpg', imageSide: 'start', caption: 'A caption' },
            slots: { default: '<p data-test="slot-content">Extra text</p>' },
        });

        expect(html.indexOf('</figure>')).toBeLessThan(html.indexOf('data-test="slot-content"'));
    });
});
