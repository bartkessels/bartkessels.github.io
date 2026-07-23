import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GpxManager } from '@/managers/gpx.manager';
import type { FileService } from '@/services/file.service';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const GPX_ELEVATION = `<?xml version="1.0"?>
<gpx version="1.1">
  <trk><trkseg>
    <trkpt lat="40.1" lon="-3.7"><ele>600</ele></trkpt>
    <trkpt lat="40.2" lon="-3.6"><ele>750</ele></trkpt>
    <trkpt lat="40.3" lon="-3.5"><ele>500</ele></trkpt>
    <trkpt lat="40.4" lon="-3.4"><ele>820</ele></trkpt>
  </trkseg></trk>
</gpx>`;

const GPX_DISTANCE = `<?xml version="1.0"?>
<gpx version="1.1">
  <trk><trkseg>
    <trkpt lat="51.5074" lon="-0.1278"><ele>10</ele></trkpt>
    <trkpt lat="48.8566" lon="2.3522"><ele>35</ele></trkpt>
  </trkseg></trk>
</gpx>`;

const GPX_EMPTY = `<?xml version="1.0"?><gpx version="1.1"><trk><trkseg></trkseg></trk></gpx>`;

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

describe('GpxManager', (): void => {
    const mockReadFile = vi.fn();
    const mockFileService = { readFile: mockReadFile } as unknown as FileService;
    const manager = new GpxManager(mockFileService);

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------------------------------
    // getTotalDistance
    // -------------------------------------------------------------------------

    describe('getTotalDistance', (): void => {
        it('returns the correct distance between two known coordinates', async (): Promise<void> => {
            // London → Paris ≈ 341 km
            mockReadFile.mockResolvedValue(GPX_DISTANCE);

            const result = await manager.getTotalDistance('/track.gpx');

            expect(result.inKilometers).toBeGreaterThan(300);
            expect(result.inKilometers).toBeLessThan(400);
        });

        it('returns 0 when the GPX has no track points', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_EMPTY);

            const result = await manager.getTotalDistance('/track.gpx');

            expect(result.inKilometers).toBe(0);
        });

        it('passes the file path to the FileService', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_DISTANCE);

            await manager.getTotalDistance('/path/to/track.gpx');

            expect(mockReadFile).toHaveBeenCalledWith('/path/to/track.gpx');
        });
    });

    // -------------------------------------------------------------------------
    // getStatistics
    // -------------------------------------------------------------------------

    describe('getStatistics', (): void => {
        it('returns null when the GPX has no elevation data', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_EMPTY);

            const result = await manager.getStatistics('/track.gpx');

            expect(result).toBeNull();
        });

        it('returns correct elevation stats', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_ELEVATION);

            const result = await manager.getStatistics('/track.gpx');

            expect(result?.lowestRecordedElevation).toBe(500);
            expect(result?.highestRecordedElevation).toBe(820);
            expect(result?.startOfTrack).toBe(600);
            expect(result?.endOfTrack).toBe(820);
            // 600→750: +150, 500→820: +320 → 470
            expect(result?.totalAscent).toBe(470);
            // 750→500: −250
            expect(result?.totalDescent).toBe(250);
            expect(result?.rawElevations).toEqual([600, 750, 500, 820]);
        });

        it('passes the file path to the FileService', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_ELEVATION);

            await manager.getStatistics('/path/to/track.gpx');

            expect(mockReadFile).toHaveBeenCalledWith('/path/to/track.gpx');
        });
    });

    // -------------------------------------------------------------------------
    // getRawGpx
    // -------------------------------------------------------------------------

    describe('getRawGpx', (): void => {
        it('returns the raw GPX content from the FileService', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_DISTANCE);

            const result = await manager.getRawGpx('/track.gpx');

            expect(result).toBe(GPX_DISTANCE);
        });

        it('passes the file path to the FileService', async (): Promise<void> => {
            mockReadFile.mockResolvedValue(GPX_DISTANCE);

            await manager.getRawGpx('/path/to/track.gpx');

            expect(mockReadFile).toHaveBeenCalledWith('/path/to/track.gpx');
        });
    });
});
