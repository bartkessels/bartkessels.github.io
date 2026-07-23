import { describe, expect, it, vi } from 'vitest';
import type { Distance } from '@/models/distance.model';
import ElevationProfile from '@/components/ElevationProfile.astro';
import type { ElevationStats } from '@/models/elevation-stats.model';
import { renderComponent } from './support/render';

const statistics: ElevationStats = {
    startOfTrack: 100,
    endOfTrack: 200,
    lowestRecordedElevation: 90,
    highestRecordedElevation: 250,
    totalAscent: 180,
    totalDescent: 70,
    rawElevations: [100, 150, 90, 250, 200],
};

const distance: Distance = { inKilometers: 12.3, inMiles: 7.6 };

let statisticsResult: ElevationStats | null = statistics;

vi.mock('@/factories/manager-factory', (): Record<string, unknown> => ({
    getGpxManager: (): Record<string, unknown> => ({
        getStatistics: async (): Promise<ElevationStats | null> => statisticsResult,
        getTotalDistance: async (): Promise<Distance> => distance,
    }),
}));

describe('ElevationProfile', (): void => {
    it('renders the four elevation stat values from the fixture', async (): Promise<void> => {
        statisticsResult = statistics;

        const { document } = await renderComponent(ElevationProfile, { props: { gpxUrl: '/trail.gpx' } });

        const values = document.querySelectorAll('.elevation-profile__stat-value');

        expect(values.length).toBe(4);
        expect(values[0].textContent).toBe('250 m');
        expect(values[1].textContent).toBe('90 m');
        expect(values[2].textContent).toBe('+180 m');
        expect(values[3].textContent).toBe(`${String.fromCharCode(0x2212)}70 m`);
    });

    describe('viewBox', (): void => {
        it('uses the default width and height', async (): Promise<void> => {
            statisticsResult = statistics;

            const { document } = await renderComponent(ElevationProfile, { props: { gpxUrl: '/trail.gpx' } });

            expect(document.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 800 160');
        });

        it('reflects custom width and height props', async (): Promise<void> => {
            statisticsResult = statistics;

            const { document } = await renderComponent(ElevationProfile, {
                props: { gpxUrl: '/trail.gpx', width: 500, height: 100 },
            });

            expect(document.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 500 100');
        });
    });

    it('rejects when the gpx manager cannot load statistics', async (): Promise<void> => {
        statisticsResult = null;

        await expect(
            renderComponent(ElevationProfile, { props: { gpxUrl: '/trail.gpx' } })
        ).rejects.toThrow();
    });
});
