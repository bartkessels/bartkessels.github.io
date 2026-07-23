import { describe, expect, it, vi } from 'vitest';
import { renderComponent } from './support/render';
import TrailMap from '@/components/TrailMap.astro';

const gpxWithTrack = `<?xml version="1.0"?>
<gpx version="1.1" creator="test" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <trkseg>
      <trkpt lat="52.1" lon="5.1"><ele>10</ele></trkpt>
      <trkpt lat="52.2" lon="5.2"><ele>20</ele></trkpt>
      <trkpt lat="52.3" lon="5.3"><ele>15</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

const gpxWithoutTrack = `<?xml version="1.0"?>
<gpx version="1.1" creator="test" xmlns="http://www.topografix.com/GPX/1/1">
</gpx>`;

let rawGpx = gpxWithTrack;

vi.mock('@/factories/manager-factory', (): Record<string, unknown> => ({
    getGpxManager: (): Record<string, unknown> => ({
        getRawGpx: async (): Promise<string> => rawGpx,
    }),
}));

describe('TrailMap', (): void => {
    it('renders a role=img element with the default label', async (): Promise<void> => {
        rawGpx = gpxWithTrack;

        const { document } = await renderComponent(TrailMap, { props: { gpxUrl: '/trail.gpx' } });

        const map = document.querySelector('[data-trail-map]');

        expect(map?.getAttribute('role')).toBe('img');
        expect(map?.getAttribute('aria-label')).toBe('Interactive trail map');
    });

    it('uses a custom label when provided', async (): Promise<void> => {
        rawGpx = gpxWithTrack;

        const { document } = await renderComponent(TrailMap, {
            props: { gpxUrl: '/trail.gpx', label: 'My trail' },
        });

        expect(document.querySelector('[data-trail-map]')?.getAttribute('aria-label')).toBe('My trail');
    });

    it('serializes valid geojson, bounds, start and end for a track with points', async (): Promise<void> => {
        rawGpx = gpxWithTrack;

        const { document } = await renderComponent(TrailMap, { props: { gpxUrl: '/trail.gpx' } });

        const map = document.querySelector('[data-trail-map]');
        const geojson = JSON.parse(map?.getAttribute('data-geojson') ?? 'null');
        const bounds = JSON.parse(map?.getAttribute('data-bounds') ?? 'null');
        const start = JSON.parse(map?.getAttribute('data-start') ?? 'null');
        const end = JSON.parse(map?.getAttribute('data-end') ?? 'null');

        expect(geojson.type).toBe('FeatureCollection');
        expect(start[0]).toBeCloseTo(5.1);
        expect(start[1]).toBeCloseTo(52.1);
        expect(end[0]).toBeCloseTo(5.3);
        expect(end[1]).toBeCloseTo(52.3);
        expect(bounds).not.toBeNull();
        expect(bounds[0][0]).toBeCloseTo(5.1);
        expect(bounds[1][0]).toBeCloseTo(5.3);
    });

    it('serializes null bounds, start and end for a track with zero points', async (): Promise<void> => {
        rawGpx = gpxWithoutTrack;

        const { document } = await renderComponent(TrailMap, { props: { gpxUrl: '/trail.gpx' } });

        const map = document.querySelector('[data-trail-map]');

        expect(map?.getAttribute('data-bounds')).toBe('null');
        expect(map?.getAttribute('data-start')).toBe('null');
        expect(map?.getAttribute('data-end')).toBe('null');
    });
});
