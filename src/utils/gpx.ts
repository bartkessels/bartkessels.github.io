/**
 * Pure utility functions for extracting and computing elevation data from GPX text.
 * These functions are environment-agnostic (Node + browser) and do not depend on the DOM.
 */

export interface ElevationStats {
    /** Elevation at the start of the track (metres). */
    start: number;
    /** Elevation at the end of the track (metres). */
    end: number;
    /** Lowest recorded elevation (metres). */
    min: number;
    /** Highest recorded elevation (metres). */
    max: number;
    /** Total elevation gained throughout the track (metres). */
    totalAscent: number;
    /** Total elevation lost throughout the track (metres). */
    totalDescent: number;
}

/**
 * Extracts all elevation values (in metres) from the raw text of a GPX file.
 * Matches `<ele>` elements regardless of whitespace around the numeric value.
 */
export function extractElevations(gpxText: string): number[] {
    const matches = [...gpxText.matchAll(/<ele>\s*([\d.]+)\s*<\/ele>/g)];
    return matches.map(m => parseFloat(m[1]));
}

/**
 * Computes elevation statistics from an ordered array of elevation values.
 * Returns `null` when the array is empty.
 */
export function computeElevationStats(elevations: number[]): ElevationStats | null {
    if (elevations.length === 0) return null;

    let totalAscent = 0;
    let totalDescent = 0;

    for (let i = 1; i < elevations.length; i++) {
        const delta = elevations[i] - elevations[i - 1];
        if (delta > 0) totalAscent += delta;
        else totalDescent += Math.abs(delta);
    }

    return {
        start: Math.round(elevations[0]),
        end: Math.round(elevations[elevations.length - 1]),
        min: Math.round(Math.min(...elevations)),
        max: Math.round(Math.max(...elevations)),
        totalAscent: Math.round(totalAscent),
        totalDescent: Math.round(totalDescent),
    };
}

/**
 * Down-samples an elevation array to at most `maxPoints` values while preserving
 * the shape of the profile. When the input is already within the limit the
 * original array is returned unchanged.
 */
export function downsampleElevations(elevations: number[], maxPoints: number): number[] {
    if (elevations.length <= maxPoints) return elevations;
    const step = (elevations.length - 1) / (maxPoints - 1);
    return Array.from({ length: maxPoints }, (_, i) => elevations[Math.round(i * step)]);
}

/**
 * Builds an SVG `<path>` `d` attribute for a filled area elevation chart.
 *
 * The path traces the elevation profile from left to right, then closes back
 * to the bottom of the viewport to create a filled silhouette.
 *
 * @param elevations  Raw (or down-sampled) elevation values.
 * @param width       Viewport width in SVG user units.
 * @param height      Viewport height in SVG user units.
 * @param padding     Fraction of height reserved as vertical padding (0–1, default 0.1).
 */
export function buildElevationPath(
    elevations: number[],
    width: number,
    height: number,
    padding = 0.1
): string {
    if (elevations.length < 2) return '';

    const min = Math.min(...elevations);
    const max = Math.max(...elevations);
    const range = max - min || 1;
    const drawHeight = height * (1 - 2 * padding);
    const top = height * padding;

    const toY = (e: number): number => top + drawHeight - ((e - min) / range) * drawHeight;
    const toX = (i: number): number => (i / (elevations.length - 1)) * width;

    const lineParts = elevations.map((e, i) => `${toX(i).toFixed(2)},${toY(e).toFixed(2)}`);
    return [
        `M 0,${height}`,
        `L ${lineParts.join(' L ')}`,
        `L ${width},${height}`,
        'Z',
    ].join(' ');
}
