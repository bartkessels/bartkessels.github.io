import { describe, expect, it } from 'vitest';
import HeroImage from '@/components/HeroImage.astro';
import { renderComponent } from './support/render';

describe('HeroImage', (): void => {
    it('renders the image with the provided src and alt text', async (): Promise<void> => {
        const { document } = await renderComponent(HeroImage, {
            props: { imageUrl: '/hero.jpg', alternativeText: 'A hero image', caption: 'A caption' },
        });

        const img = document.querySelector('img');

        expect(img?.getAttribute('src')).toBe('/hero.jpg');
        expect(img?.getAttribute('alt')).toBe('A hero image');
    });

    it('renders the caption text', async (): Promise<void> => {
        const { document } = await renderComponent(HeroImage, {
            props: { imageUrl: '/hero.jpg', alternativeText: 'A hero image', caption: 'A caption' },
        });

        const figcaption = document.querySelector('figcaption');

        expect(figcaption?.textContent?.trim()).toBe('A caption');
    });

    it('wraps the image and caption in a figure', async (): Promise<void> => {
        const { document } = await renderComponent(HeroImage, {
            props: { imageUrl: '/hero.jpg', alternativeText: 'A hero image', caption: 'A caption' },
        });

        const figure = document.querySelector('figure');

        expect(figure?.querySelector('img')).not.toBeNull();
        expect(figure?.querySelector('figcaption')).not.toBeNull();
    });
});
