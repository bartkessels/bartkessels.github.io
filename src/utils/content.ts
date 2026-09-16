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

/**
 * Returns a human-readable section count label for a trail.
 * Returns null when there are no published sections and no total is known.
 */
export function getSectionLabel(publishedCount: number, totalSections?: number): string | null {
    const sectionLabel = getPluralString(publishedCount, 'section', 'sections');

    if (totalSections) return `${publishedCount} of ${totalSections} ${sectionLabel}`;
    if (publishedCount === 0) return null;
    return `${publishedCount} ${sectionLabel}`;
}

/**
 * Returns a singular or plurar string based on the number input.
 */
export function getPluralString(total: number, singular: string, plural: string): string {
    if (total === 1) {
        return singular;
    }
    
    return plural;
}

/** Returns a human-readable "Section X (of Y)" label for a section detail page. */
export function getSectionOrderLabel(sectionOrder: number, totalSections?: number): string {
    return totalSections ? `Section ${sectionOrder} of ${totalSections}` : `Section ${sectionOrder}`;
}

