import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import TrailStatistics from '@/components/TrailStatistics.astro';

describe('TrailStatistics', (): void => {
    it('renders the total distance in km and mi', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 120,
                totalDistanceInMiles: 74.6,
                walkedSections: 0,
                totalSections: 0
            }
        });

        const values = document.querySelectorAll('dd');
        const labels = document.querySelectorAll('dt');

        expect(values[0]?.textContent).toBe('120');
        expect(labels[0]?.textContent).toBe('km');
        expect(values[1]?.textContent).toBe('74.6');
        expect(labels[1]?.textContent).toBe('mi');
    });

    it('does not render the sections stat when there are no sections', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 120,
                totalDistanceInMiles: 74.6,
                walkedSections: 0,
                totalSections: 0
            }
        });

        expect(document.querySelectorAll('dl > div').length).toBe(2);
        expect(document.body.textContent).not.toContain('section');
    });

    it('renders the sections stat when there are walked sections', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 120,
                totalDistanceInMiles: 74.6,
                walkedSections: 3,
                totalSections: 5
            }
        });

        const values = document.querySelectorAll('dd');
        const labels = document.querySelectorAll('dt');

        expect(document.querySelectorAll('dl > div').length).toBe(3);
        expect(values[2]?.textContent).toBe('3');
        expect(labels[2]?.textContent).toBe('of 5 sections');
    });

    it('renders the sections stat when there are total sections but none walked yet', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 120,
                totalDistanceInMiles: 74.6,
                walkedSections: 0,
                totalSections: 5
            }
        });

        expect(document.querySelectorAll('dl > div').length).toBe(3);
    });

    it('uses the singular label when there is only one section', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 10,
                totalDistanceInMiles: 6.2,
                walkedSections: 1,
                totalSections: 1
            }
        });

        const labels = document.querySelectorAll('dt');

        expect(labels[2]?.textContent).toBe('of 1 section');
    });

    it('uses a three column grid when sections are present', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 120,
                totalDistanceInMiles: 74.6,
                walkedSections: 3,
                totalSections: 5
            }
        });

        const dl = document.querySelector('dl');

        expect(dl?.className).toContain('grid-cols-3');
    });

    it('uses a two column grid when there are no sections', async (): Promise<void> => {
        const { document } = await renderComponent(TrailStatistics, {
            props: {
                totalDistanceInKm: 120,
                totalDistanceInMiles: 74.6,
                walkedSections: 0,
                totalSections: 0
            }
        });

        const dl = document.querySelector('dl');

        expect(dl?.className).toContain('grid-cols-2');
        expect(dl?.className).not.toContain('grid-cols-3');
    });
});
