export function buildElevationPath(
    elevations: number[],
    width: number,
    height: number,
    padding: number
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

export function buildGridLines(min: number, max: number, padding: number, width: number, height: number, targetCount = 4): number[] {
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

export function buildSvgMetadata(min: number, max: number, padding: number, width: number, height: number, targetCount = 4): { lines: string, labels: string} {
    const range = max - min;

    if (range === 0) return { lines: '', labels: '' };

    const rawStep = range / targetCount;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const candidates = [1, 2, 5, 10].map(n => n * magnitude);
    const step = candidates.find(s => range / s <= targetCount + 1) ?? candidates[candidates.length - 1];

    const first = Math.ceil(min / step) * step;
    const lines: number[] = [];

    for (let v = first; v < max; v += step) {
        lines.push(Math.round(v));
    }

    const gridLines = lines.map(v => {
        const y = toYFraction(v, min, max, padding) * height;
        return `<line x1="0" y1="${y.toFixed(2)}" x2="${width}" y2="${y.toFixed(2)}" stroke="currentColor" stroke-opacity="0.15" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="4 4" />`;
    }).join(`\n${' '.repeat(20)}`);

    const labels = lines.map(v => {
        const pct = (toYFraction(v, min, max, padding) * 100).toFixed(2);
        return `<span class="elevation-profile__grid-label" style="top:${pct}%">${v} m</span>`;
    }).join(`\n${' '.repeat(20)}`);

    return {
        lines: gridLines,
        labels: labels
    };
}

export function toYFraction(elevation: number, min: number, max: number, padding: number): number {
    const range = max - min || 1;
    const p = padding;
    const drawFraction = 1 - 2 * p;
    return p + drawFraction - ((elevation - min) / range) * drawFraction;
}