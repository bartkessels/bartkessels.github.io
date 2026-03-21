/** Returns the estimated reading time for a piece of content in minutes (minimum 1). */
export const getReadingTime = (body?: string): number => {
  if (!body) {
    return 0;
  }

  return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}

/** Returns false for any content entry whose filename starts with an underscore. */
export const notUnderscored = ({ id }: { id: string }) =>
  !id.split('/').pop()!.startsWith('_');

/** Formats a Date to a human-readable string (e.g. "January 1, 2025"). */
export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/** Extracts the bare slug from a subject entry id (strips folder prefix and file extension). */
export const subjectSlug = (id: string) =>
  id.split('/').pop()!.replace(/\.[^.]+$/, '');

/** Extracts the last path segment from a backpacking section slug (e.g. 'pieterpad/sittard-to-roermond' → 'sittard-to-roermond'). */
export const sectionSlug = (slug: string) =>
  slug.split('/').at(-1)!;

/** Converts kilometres to miles, rounded to one decimal place. */
export const kmToMiles = (km: number): number =>
  Math.round(km * 0.621371 * 10) / 10;

/**
 * Returns a human-readable section count label for a trail.
 * Returns null when there are no published sections and no total is known.
 */
export const getSectionLabel = (publishedCount: number, totalSections?: number): string | null => {
  if (totalSections) return `${publishedCount} of ${totalSections} sections`;
  if (publishedCount === 0) return null;
  return `${publishedCount} ${publishedCount === 1 ? 'section' : 'sections'}`;
};

/** Returns a human-readable "Section X (of Y)" label for a section detail page. */
export const getSectionOrderLabel = (sectionOrder: number, totalSections?: number): string =>
  totalSections ? `Section ${sectionOrder} of ${totalSections}` : `Section ${sectionOrder}`;

