import { describe, expect, it } from 'vitest';
import {
    buildElevationPath,
    computeElevationStats,
    downsampleElevations,
    extractElevations,
} from './gpx';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const GPX_BASIC = `<?xml version="1.0"?>
<gpx version="1.1">
  <trk><trkseg>
    <trkpt lat="40.1" lon="-3.7"><ele>600</ele></trkpt>
    <trkpt lat="40.2" lon="-3.6"><ele>750</ele></trkpt>
    <trkpt lat="40.3" lon="-3.5"><ele>500</ele></trkpt>
    <trkpt lat="40.4" lon="-3.4"><ele>820</ele></trkpt>
  </trkseg></trk>
</gpx>`;

const GPX_WHITESPACE = `<ele>
  1234.56
</ele>`;

const GPX_EMPTY = `<?xml version="1.0"?><gpx version="1.1"><trk><trkseg></trkseg></trk></gpx>`;

// ---------------------------------------------------------------------------
// extractElevations
// ---------------------------------------------------------------------------

describe('extractElevations', () => {
    it('returns the correct elevation values in order', () => {
        expect(extractElevations(GPX_BASIC)).toEqual([600, 750, 500, 820]);
    });

    it('handles whitespace around the numeric value', () => {
        expect(extractElevations(GPX_WHITESPACE)).toEqual([1234.56]);
    });

    it('returns an empty array when no <ele> tags exist', () => {
        expect(extractElevations(GPX_EMPTY)).toEqual([]);
    });

    it('returns an empty array for an empty string', () => {
        expect(extractElevations('')).toEqual([]);
    });
});

// ---------------------------------------------------------------------------
// computeElevationStats
// ---------------------------------------------------------------------------

describe('computeElevationStats', () => {
    it('returns null for an empty array', () => {
        expect(computeElevationStats([])).toBeNull();
    });

    it('returns correct start and end elevations', () => {
        const stats = computeElevationStats([600, 750, 500, 820]);
        expect(stats?.start).toBe(600);
        expect(stats?.end).toBe(820);
    });

    it('returns correct min and max elevations', () => {
        const stats = computeElevationStats([600, 750, 500, 820]);
        expect(stats?.min).toBe(500);
        expect(stats?.max).toBe(820);
    });

    it('computes total ascent correctly', () => {
        // 600→750: +150, 750→500: 0, 500→820: +320 → 470
        const stats = computeElevationStats([600, 750, 500, 820]);
        expect(stats?.totalAscent).toBe(470);
    });

    it('computes total descent correctly', () => {
        // 750→500: −250
        const stats = computeElevationStats([600, 750, 500, 820]);
        expect(stats?.totalDescent).toBe(250);
    });

    it('rounds all values to integers', () => {
        const stats = computeElevationStats([100.4, 200.7]);
        expect(stats?.start).toBe(100);
        expect(stats?.totalAscent).toBe(100); // 200.7-100.4 = 100.3 → 100
    });

    it('handles a flat profile (no ascent or descent)', () => {
        const stats = computeElevationStats([500, 500, 500]);
        expect(stats?.totalAscent).toBe(0);
        expect(stats?.totalDescent).toBe(0);
    });

    it('handles a single-element array without crashing', () => {
        const stats = computeElevationStats([800]);
        expect(stats?.start).toBe(800);
        expect(stats?.end).toBe(800);
        expect(stats?.totalAscent).toBe(0);
        expect(stats?.totalDescent).toBe(0);
    });
});

// ---------------------------------------------------------------------------
// downsampleElevations
// ---------------------------------------------------------------------------

describe('downsampleElevations', () => {
    it('returns the original array when within limit', () => {
        const elevations = [100, 200, 300];
        expect(downsampleElevations(elevations, 5)).toBe(elevations);
    });

    it('returns an array of exactly maxPoints elements', () => {
        const elevations = Array.from({ length: 1000 }, (_, i) => i);
        const result = downsampleElevations(elevations, 200);
        expect(result).toHaveLength(200);
    });

    it('preserves the first and last element', () => {
        const elevations = Array.from({ length: 100 }, (_, i) => i * 10);
        const result = downsampleElevations(elevations, 10);
        expect(result[0]).toBe(0);
        expect(result[result.length - 1]).toBe(990);
    });

    it('returns an empty array when the input is empty', () => {
        expect(downsampleElevations([], 100)).toEqual([]);
    });
});

// ---------------------------------------------------------------------------
// buildElevationPath
// ---------------------------------------------------------------------------

describe('buildElevationPath', () => {
    it('returns an empty string for fewer than 2 points', () => {
        expect(buildElevationPath([], 100, 50)).toBe('');
        expect(buildElevationPath([600], 100, 50)).toBe('');
    });

    it('starts with M 0,<height>', () => {
        const path = buildElevationPath([600, 800], 100, 50);
        expect(path.startsWith('M 0,50')).toBe(true);
    });

    it('ends with L <width>,<height> Z', () => {
        const path = buildElevationPath([600, 800], 100, 50);
        expect(path.endsWith('L 100,50 Z')).toBe(true);
    });

    it('produces a path for a two-point profile without throwing', () => {
        expect(() => buildElevationPath([600, 800], 800, 150)).not.toThrow();
    });
});
