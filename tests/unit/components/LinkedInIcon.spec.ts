import { describe, expect, it } from 'vitest';
import LinkedInIcon from '@/components/LinkedInIcon.astro';
import { renderComponent } from './support/render';

describe('LinkedInIcon', (): void => {
    it('renders an svg with role img', async (): Promise<void> => {
        const { document } = await renderComponent(LinkedInIcon);

        const svg = document.querySelector('svg');

        expect(svg).not.toBeNull();
        expect(svg?.getAttribute('role')).toBe('img');
    });

    it('applies the class prop when provided', async (): Promise<void> => {
        const { document } = await renderComponent(LinkedInIcon, { props: { class: 'h-5 w-5' } });

        const svg = document.querySelector('svg');

        expect(svg?.getAttribute('class')).toBe('h-5 w-5');
    });

    it('renders without a class when omitted', async (): Promise<void> => {
        const { document } = await renderComponent(LinkedInIcon);

        const svg = document.querySelector('svg');

        expect(svg?.getAttribute('class')).toBeNull();
    });
});
