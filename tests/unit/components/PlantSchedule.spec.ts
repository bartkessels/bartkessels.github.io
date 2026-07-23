import { describe, expect, it } from 'vitest';
import PlantSchedule from '@/components/PlantSchedule.astro';
import { renderComponent } from './support/render';

describe('PlantSchedule', (): void => {
    it('always renders 12 month cells', async (): Promise<void> => {
        const { document } = await renderComponent(PlantSchedule);

        expect(document.querySelectorAll('[data-month]').length).toBe(12);
    });

    it('gives every month the empty-color style and a plain aria-label when no events are provided', async (): Promise<void> => {
        const { document } = await renderComponent(PlantSchedule);

        const january = document.querySelector('[data-month="1"] [role="img"]');

        expect(january?.getAttribute('style')).toBe('background-color: #E5E7EB');
        expect(january?.getAttribute('aria-label')).toBe('Jan');
    });

    it('applies a single-color style and an aria-label suffix for a month in one array', async (): Promise<void> => {
        const { document } = await renderComponent(PlantSchedule, { props: { sowIndoors: [3] } });

        const march = document.querySelector('[data-month="3"] [role="img"]');

        expect(march?.getAttribute('style')).toBe('background-color: #3B82F6');
        expect(march?.getAttribute('aria-label')).toBe('Mar: sow indoors');
    });

    it('applies a two-color gradient and a joined aria-label for a month in two arrays', async (): Promise<void> => {
        const { document } = await renderComponent(PlantSchedule, {
            props: { sowIndoors: [3], moveOutdoors: [3] },
        });

        const march = document.querySelector('[data-month="3"] [role="img"]');

        expect(march?.getAttribute('style')).toBe('background: linear-gradient(135deg, #3B82F6 50%, #059669 50%)');
        expect(march?.getAttribute('aria-label')).toBe('Mar: sow indoors, move outdoors');
    });

    it('applies a three-color gradient and a joined aria-label for a month in all three arrays', async (): Promise<void> => {
        const { document } = await renderComponent(PlantSchedule, {
            props: { sowIndoors: [3], moveOutdoors: [3], harvest: [3] },
        });

        const march = document.querySelector('[data-month="3"] [role="img"]');

        expect(march?.getAttribute('style')).toBe(
            'background: linear-gradient(135deg, #3B82F6 33.33%, #059669 33.33%, #059669 66.66%, #F59E0B 66.66%)'
        );
        expect(march?.getAttribute('aria-label')).toBe('Mar: sow indoors, move outdoors, harvest');
    });
});
