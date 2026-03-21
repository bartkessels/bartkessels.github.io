import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { gpx } from '@tmcw/togeojson';

/**
 * <trail-map gpx="/path/to/track.gpx"></trail-map>
 *
 * Renders a GPX trail using MapLibre GL JS with OpenFreeMap vector tiles.
 * No API key, no account, no user data sent — only anonymous tile requests
 * to tiles.openfreemap.org (FOSS, no registration required).
 *
 * GPX parsing is done client-side via @tmcw/togeojson; nothing is uploaded.
 * To swap the map library or tile provider, only this file needs to change.
 */
class TrailMapElement extends HTMLElement {
  private map: maplibregl.Map | null = null;

  async connectedCallback() {
    const gpxUrl = this.getAttribute('gpx');
    if (!gpxUrl) return;

    this.style.display = 'block';

    this.map = new maplibregl.Map({
      container: this,
      // OpenFreeMap "liberty" style — vector tiles, no API key, no tracking.
      // Other styles: bright, positron  (all at tiles.openfreemap.org/styles/*)
      style: '/openfreemap/tiles/liberty.json',
      scrollZoom: false,
      attributionControl: { compact: true },
    });

    // Race-condition fix: start both the map style load and the GPX fetch at
    // the same time, then proceed only once BOTH are ready.
    const [, gpxText] = await Promise.all([
      new Promise<void>((resolve) => this.map!.once('load', resolve)),
      fetch(gpxUrl).then((r) => r.text()),
    ]);

    const gpxDoc = new DOMParser().parseFromString(gpxText, 'text/xml');
    const geojson = gpx(gpxDoc);
    const map = this.map!;

    map.addSource('trail', { type: 'geojson', data: geojson });

    // Subtle casing so the line pops against any background
    map.addLayer({
      id: 'trail-casing',
      type: 'line',
      source: 'trail',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#fff', 'line-width': 7, 'line-opacity': 0.6 },
    });

    map.addLayer({
      id: 'trail-line',
      type: 'line',
      source: 'trail',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#e05d12', 'line-width': 4, 'line-opacity': 0.95 },
    });

    // Fit the viewport to the track
    const coords = geojson.features.flatMap((f) => {
      if (f.geometry.type === 'LineString') return f.geometry.coordinates;
      if (f.geometry.type === 'MultiLineString') return f.geometry.coordinates.flat();
      return [];
    }) as [number, number][];

    if (coords.length > 0) {
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new maplibregl.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, { padding: 40, animate: false });
    }
  }

  disconnectedCallback() {
    this.map?.remove();
    this.map = null;
  }
}

customElements.define('trail-map', TrailMapElement);

