import { buildElevationPath, computeElevationStats, downsampleElevations, extractElevations } from '@/utils/gpx';

/**
 * <elevation-profile gpx="/path/to/track.gpx"></elevation-profile>
 *
 * Fetches the GPX file, extracts elevation data, and renders an SVG area
 * chart together with key stats (ascent, descent, min, max elevation).
 *
 * All computation is done client-side — no data is uploaded anywhere.
 * To change the appearance, only this file needs to be modified.
 */
class ElevationProfileElement extends HTMLElement {
    private static readonly SVG_WIDTH = 800;
    private static readonly SVG_HEIGHT = 160;
    private static readonly MAX_POINTS = 500;
    private static readonly PADDING = 0.1;

    async connectedCallback(): Promise<void> {
        const gpxUrl = this.getAttribute('gpx');
        if (!gpxUrl) return;

        this.setAttribute('aria-busy', 'true');

        try {
            const gpxText = await fetch(gpxUrl).then((r: Response) => r.text());
            const raw = extractElevations(gpxText);
            if (raw.length < 2) return;

            const elevations = downsampleElevations(raw, ElevationProfileElement.MAX_POINTS);
            const stats = computeElevationStats(elevations);
            if (!stats) return;

            const path = buildElevationPath(
                elevations,
                ElevationProfileElement.SVG_WIDTH,
                ElevationProfileElement.SVG_HEIGHT,
                ElevationProfileElement.PADDING
            );
            const gridLines = this.niceGridLines(stats.min, stats.max);

            this.innerHTML = this.buildHTML(path, stats, gridLines);
        } catch {
            // Silently fail — the map still provides the primary visual.
        } finally {
            this.removeAttribute('aria-busy');
        }
    }

    /**
     * Returns "nice" round elevation values to use as horizontal grid lines.
     * Targets ~4 lines spaced at 1/2/5/10 × a power-of-10 step.
     */
    private niceGridLines(min: number, max: number, targetCount = 4): number[] {
        const range = max - min;
        if (range === 0) return [];

        const rawStep = range / targetCount;
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const candidates = [1, 2, 5, 10].map(n => n * magnitude);
        const step = candidates.find(s => range / s <= targetCount + 1) ?? candidates[candidates.length - 1];

        const first = Math.ceil(min / step) * step;
        const lines: number[] = [];
        for (let v = first; v < max; v += step) {
            lines.push(Math.round(v));
        }
        return lines;
    }

    /**
     * Converts an elevation value to a Y fraction (0 = top, 1 = bottom) using
     * the same padding as `buildElevationPath`.
     */
    private toYFraction(elevation: number, min: number, max: number): number {
        const range = max - min || 1;
        const p = ElevationProfileElement.PADDING;
        const drawFraction = 1 - 2 * p;
        return p + drawFraction - ((elevation - min) / range) * drawFraction;
    }

    private buildHTML(
        path: string,
        stats: ReturnType<typeof computeElevationStats> & object,
        gridLines: number[]
    ): string {
        const { min, max, totalAscent, totalDescent } = stats;
        const W = ElevationProfileElement.SVG_WIDTH;
        const H = ElevationProfileElement.SVG_HEIGHT;

        const gridSvgLines = gridLines.map(v => {
            const y = this.toYFraction(v, min, max) * H;
            return `<line x1="0" y1="${y.toFixed(2)}" x2="${W}" y2="${y.toFixed(2)}" stroke="currentColor" stroke-opacity="0.15" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="4 4" />`;
        }).join('\n                    ');

        const labelDivs = gridLines.map(v => {
            const pct = (this.toYFraction(v, min, max) * 100).toFixed(2);
            return `<span class="elevation-profile__grid-label" style="top:${pct}%">${v} m</span>`;
        }).join('\n                    ');

        return `
            <div class="elevation-profile">
                <div class="elevation-profile__chart-wrapper">
                    <svg
                        viewBox="0 0 ${W} ${H}"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        class="elevation-profile__chart"
                    >
                        <defs>
                            <linearGradient id="elevation-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="var(--elevation-accent, #D97706)" stop-opacity="0.5" />
                                <stop offset="100%" stop-color="var(--elevation-accent, #D97706)" stop-opacity="0.05" />
                            </linearGradient>
                        </defs>
                        ${gridSvgLines}
                        <path d="${path}" fill="url(#elevation-fill)" />
                        <path d="${path}" fill="none" stroke="var(--elevation-accent, #D97706)" stroke-width="2.5" vector-effect="non-scaling-stroke" />
                    </svg>
                    <div class="elevation-profile__grid-labels" aria-hidden="true">
                        ${labelDivs}
                    </div>
                </div>

                <dl class="elevation-profile__stats">
                    <div class="elevation-profile__stat">
                        <dt class="elevation-profile__stat-label">
                            <span aria-hidden="true">▲</span> Max
                        </dt>
                        <dd class="elevation-profile__stat-value">${max} m</dd>
                    </div>
                    <div class="elevation-profile__stat">
                        <dt class="elevation-profile__stat-label">
                            <span aria-hidden="true">▼</span> Min
                        </dt>
                        <dd class="elevation-profile__stat-value">${min} m</dd>
                    </div>
                    <div class="elevation-profile__stat">
                        <dt class="elevation-profile__stat-label">
                            <span aria-hidden="true">↑</span> Ascent
                        </dt>
                        <dd class="elevation-profile__stat-value">+${totalAscent} m</dd>
                    </div>
                    <div class="elevation-profile__stat">
                        <dt class="elevation-profile__stat-label">
                            <span aria-hidden="true">↓</span> Descent
                        </dt>
                        <dd class="elevation-profile__stat-value">−${totalDescent} m</dd>
                    </div>
                </dl>
            </div>
        `;
    }
}

customElements.define('elevation-profile', ElevationProfileElement);
