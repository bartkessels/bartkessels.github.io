import { GpxManager } from '@/managers/gpx.manager';
import { FileService } from '@/services/file.service';

/**
 * <trip-conditions gpx="/path/to/track.gpx"></trip-conditions>
 *
 * Fetches the GPX file, computes the total track distance, and renders the
 * distance row inside the Trip Conditions aside.
 *
 * All computation is done client-side — no data is uploaded anywhere.
 */
class TripConditionsElement extends HTMLElement {
    private readonly gpxManager = new GpxManager(new FileService());

    async connectedCallback(): Promise<void> {
        const gpxUrl = this.getAttribute('gpx');
        if (!gpxUrl) return;

        this.setAttribute('aria-busy', 'true');

        try {
            const distanceKm = await this.gpxManager.calculateTotalDistanceInKilometers(gpxUrl);
            if (distanceKm === 0) return;
            const distanceMi = Math.round(distanceKm * 0.621371 * 10) / 10;

            this.innerHTML = `
                <dd class="text-sm font-medium text-foreground mt-0.5">
                    ${distanceKm}&thinsp;km&thinsp;/&thinsp;${distanceMi}&thinsp;mi
                </dd>
            `;
        } catch {
            // Silently fail — the static fallback remains visible.
        } finally {
            this.removeAttribute('aria-busy');
        }
    }
}

customElements.define('trip-conditions', TripConditionsElement);
