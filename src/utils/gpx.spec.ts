import { describe, expect, it } from 'vitest';
import { buildElevationPath, buildGridLines, buildSvgMetadata, toYFraction } from '@/utils/gpx';

describe('gpx utils', (): void => {
    describe('buildElevationPath', (): void => {
        it('should return an empty string when fewer than 2 elevation points are provided', (): void => {
            expect(buildElevationPath([], 200, 100, 0.1)).toBe('');
            expect(buildElevationPath([100], 200, 100, 0.1)).toBe('');
        });

        it('should return a valid SVG path string for a flat series (all elevations equal)', (): void => {
            const result = buildElevationPath([100, 100, 100], 200, 100, 0.1);

            expect(result).toContain('M 0,100');
            expect(result).toContain('Z');
        });

        it('should return a valid SVG path string for an ascending series', (): void => {
            const result = buildElevationPath([100, 200, 300], 200, 100, 0.1);

            expect(result).toContain('M 0,100');
            expect(result).toContain('Z');
            expect(result).toContain('L');
        });

        it('should start with M 0,{height} and end with Z', (): void => {
            const height = 100;
            const result = buildElevationPath([50, 100, 150], 200, height, 0.1);

            expect(result.startsWith(`M 0,${height}`)).toBe(true);
            expect(result.endsWith('Z')).toBe(true);
        });
    });

    describe('buildGridLines', (): void => {
        it('should return an empty array when min === max (zero range)', (): void => {
            const result = buildGridLines(100, 100, 0.1, 200, 100);

            expect(result).toEqual([]);
        });

        it('should return evenly-spaced grid line values within the range', (): void => {
            const result = buildGridLines(0, 100, 0.1, 200, 100);

            expect(result.length).toBeGreaterThan(0);
            result.forEach(v => {
                expect(v).toBeGreaterThanOrEqual(0);
                expect(v).toBeLessThan(100);
            });
        });

        it('should respect the targetCount parameter', (): void => {
            const result = buildGridLines(0, 1000, 0.1, 200, 100, 4);

            expect(result.length).toBeLessThanOrEqual(5); // targetCount + 1
        });
    });

    describe('buildSvgMetadata', (): void => {
        it('should return empty strings when min === max', (): void => {
            const result = buildSvgMetadata(100, 100, 0.1, 200, 100);

            expect(result.lines).toBe('');
            expect(result.labels).toBe('');
        });

        it('should return non-empty lines and labels strings for a valid range', (): void => {
            const result = buildSvgMetadata(0, 1000, 0.1, 200, 100);

            expect(result.lines).not.toBe('');
            expect(result.labels).not.toBe('');
        });

        it('each label should contain a value in metres (m suffix)', (): void => {
            const result = buildSvgMetadata(0, 1000, 0.1, 200, 100);

            expect(result.labels).toContain(' m');
        });
    });

    describe('toYFraction', (): void => {
        it('should map min to the bottom of the draw area (close to 1 - padding)', (): void => {
            const padding = 0.1;
            const result = toYFraction(0, 0, 100, padding);

            expect(result).toBeCloseTo(1 - padding, 5);
        });

        it('should map max to the top of the draw area (close to padding)', (): void => {
            const padding = 0.1;
            const result = toYFraction(100, 0, 100, padding);

            expect(result).toBeCloseTo(padding, 5);
        });

        it('should return a valid fraction when min === max (zero-range guard)', (): void => {
            const result = toYFraction(100, 100, 100, 0.1);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        });
    });
});
