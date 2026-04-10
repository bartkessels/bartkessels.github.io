/** Returns the estimated reading time for a piece of content in minutes (minimum 1). */
export function getReadingTime(body?: string): number {
    if (!body) {
        return 0;
    }

    return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}

/** Returns false for any content entry whose filename starts with an underscore. */
export function notUnderscored({ filePath }: { filePath?: string }): boolean {
    return !filePath?.split('/').pop()!.startsWith('_');
}

/** Formats a Date to a human-readable string (e.g. "January 1, 2025"). */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Formats a Date to a short human-readable string (e.g. "Jan 1, 2025"). */
export function formatShortDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Converts kilometers to miles, rounded to one decimal place. */
export function kmToMiles(km: number): number {
    return Math.round(km * 0.621371 * 10) / 10;
}

/**
 * Returns a human-readable section count label for a trail.
 * Returns null when there are no published sections and no total is known.
 */
export function getSectionLabel(publishedCount: number, totalSections?: number): string | null {
    if (totalSections) return `${publishedCount} of ${totalSections} sections`;
    if (publishedCount === 0) return null;
    return `${publishedCount} ${publishedCount === 1 ? 'section' : 'sections'}`;
}

/** Returns a human-readable "Section X (of Y)" label for a section detail page. */
export function getSectionOrderLabel(sectionOrder: number, totalSections?: number): string {
    return totalSections ? `Section ${sectionOrder} of ${totalSections}` : `Section ${sectionOrder}`;
}

