import { describe, expect, it } from 'vitest';
import Char from '@/components/Char.astro';
import { renderComponent } from './support/render';

describe('Char', (): void => {
    it('renders the slot content inside a bold, accent-colored span', async (): Promise<void> => {
        const { document } = await renderComponent(Char, { slots: { default: 'I' } });

        const span = document.querySelector('span');

        expect(span?.className).toContain('font-bold');
        expect(span?.className).toContain('text-accent');
        expect(span?.textContent).toBe('I');
    });
});
