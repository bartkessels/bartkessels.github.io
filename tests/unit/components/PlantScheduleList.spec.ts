import { describe, expect, it } from 'vitest';
import PlantScheduleList from '@/components/PlantScheduleList.astro';
import { renderComponent } from './support/render';

describe('PlantScheduleList', (): void => {
    it('renders the month header row even when plants is empty', async (): Promise<void> => {
        const { document } = await renderComponent(PlantScheduleList, { props: { plants: [] } });

        expect(document.querySelector('.plant-schedule-list-header')).not.toBeNull();
        expect(document.querySelectorAll('.plant-schedule-list-row').length).toBe(0);
    });

    describe('plant name', (): void => {
        it('renders a link to /gardening/plants/slug when slug is provided', async (): Promise<void> => {
            const { document } = await renderComponent(PlantScheduleList, {
                props: { plants: [{ name: 'Tomato', slug: 'tomato' }] },
            });

            const link = document.querySelector('.plant-schedule-list-row a');

            expect(link?.getAttribute('href')).toBe('/gardening/plants/tomato');
            expect(link?.textContent).toBe('Tomato');
        });

        it('renders a plain span without a link when slug is omitted', async (): Promise<void> => {
            const { document } = await renderComponent(PlantScheduleList, {
                props: { plants: [{ name: 'Tomato' }] },
            });

            const row = document.querySelector('.plant-schedule-list-row');

            expect(row?.querySelector('a')).toBeNull();
            expect(row?.querySelector('span')?.textContent).toBe('Tomato');
        });
    });

    describe('per-row schedule cells', (): void => {
        it('has no title tooltip and a plain aria-label when a month has no events', async (): Promise<void> => {
            const { document } = await renderComponent(PlantScheduleList, {
                props: { plants: [{ name: 'Tomato', slug: 'tomato' }] },
            });

            const jan = document.querySelector('.schedule-col-cell[data-col="1"]');

            expect(jan?.getAttribute('title')).toBeNull();
            expect(jan?.getAttribute('aria-label')).toBe('Jan');
            expect(jan?.getAttribute('style')).toBe('background-color: #E5E7EB');
        });

        it('renders a single-color style, capitalized tooltip and lowercase aria-label suffix for one event', async (): Promise<void> => {
            const { document } = await renderComponent(PlantScheduleList, {
                props: { plants: [{ name: 'Tomato', slug: 'tomato', sowIndoors: [3] }] },
            });

            const march = document.querySelector('.schedule-col-cell[data-col="3"]');

            expect(march?.getAttribute('style')).toBe('background-color: #3B82F6');
            expect(march?.getAttribute('title')).toBe('Sow indoors');
            expect(march?.getAttribute('aria-label')).toBe('Mar: sow indoors');
        });

        it('renders a two-color gradient and joined labels for two overlapping events', async (): Promise<void> => {
            const { document } = await renderComponent(PlantScheduleList, {
                props: { plants: [{ name: 'Tomato', slug: 'tomato', sowIndoors: [3], moveOutdoors: [3] }] },
            });

            const march = document.querySelector('.schedule-col-cell[data-col="3"]');

            expect(march?.getAttribute('style')).toBe('background: linear-gradient(135deg, #3B82F6 50%, #059669 50%)');
            expect(march?.getAttribute('title')).toBe('Sow indoors, Move outdoors');
            expect(march?.getAttribute('aria-label')).toBe('Mar: sow indoors, move outdoors');
        });

        it('renders a three-color gradient and joined labels for three overlapping events', async (): Promise<void> => {
            const { document } = await renderComponent(PlantScheduleList, {
                props: {
                    plants: [{ name: 'Tomato', slug: 'tomato', sowIndoors: [3], moveOutdoors: [3], harvest: [3] }],
                },
            });

            const march = document.querySelector('.schedule-col-cell[data-col="3"]');

            expect(march?.getAttribute('style')).toBe(
                'background: linear-gradient(135deg, #3B82F6 33.33%, #059669 33.33%, #059669 66.66%, #F59E0B 66.66%)'
            );
            expect(march?.getAttribute('title')).toBe('Sow indoors, Move outdoors, Harvest');
            expect(march?.getAttribute('aria-label')).toBe('Mar: sow indoors, move outdoors, harvest');
        });
    });

    it('renders the three legend swatch labels unconditionally', async (): Promise<void> => {
        const { document } = await renderComponent(PlantScheduleList, { props: { plants: [] } });

        const legendText = document.body.textContent ?? '';

        expect(legendText).toContain('Sow indoors');
        expect(legendText).toContain('Move outdoors');
        expect(legendText).toContain('Harvest');
    });
});
