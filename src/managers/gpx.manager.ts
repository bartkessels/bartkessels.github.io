import type { Distance } from "@/models/distance.model";
import type { ElevationStats } from "@/models/elevation-stats.model";
import type { FileService } from "@/services/file.service";
import { kmToMiles } from "@/utils/conversions";
import { roundToDecimalPlaces } from "@/utils/math";
import type { TrackPoint } from "@/models/track-point.model";

export class GpxManager {
    private static readonly EARTH_RADIUS_KM = 6371;

    constructor(
        private readonly fileService: FileService
    ) { }

    public async getRawGpx(gpxFilePath: string): Promise<string> {
        return await this.fileService.readFile(gpxFilePath);
    }

    public async getTotalDistance(gpxFilePath: string): Promise<Distance> {
        const gpxText = await this.fileService.readFile(gpxFilePath);
        const points = this.extractTrackPoints(gpxText);

        if (points.length < 2) return { inKilometers: 0, inMiles: 0 };

        let total = 0;

        for (let i = 1; i < points.length; i++) {
            total += this.haversineDistanceKm(points[i - 1], points[i]);
        }

        const totalDistanceInMiles = kmToMiles(total);

        return {
            inKilometers: roundToDecimalPlaces(total, 1),
            inMiles: roundToDecimalPlaces(totalDistanceInMiles, 1)
        };
    }

    public async getStatistics(gpxFilePath: string): Promise<ElevationStats | null> {
        const gpxText = await this.fileService.readFile(gpxFilePath);
        const elevations = this.extractElevations(gpxText);

        if (elevations.length === 0) return null;

        let totalAscent = 0;
        let totalDescent = 0;

        for (let i = 1; i < elevations.length; i++) {
            const delta = elevations[i] - elevations[i - 1];
            if (delta > 0) totalAscent += delta;
            else totalDescent += Math.abs(delta);
        }

        return <ElevationStats>{
            startOfTrack: roundToDecimalPlaces(elevations[0], 0),
            endOfTrack: roundToDecimalPlaces(elevations[elevations.length - 1], 0),
            lowestRecordedElevation: roundToDecimalPlaces(Math.min(...elevations), 0),
            highestRecordedElevation: roundToDecimalPlaces(Math.max(...elevations), 0),
            totalAscent: roundToDecimalPlaces(totalAscent, 0),
            totalDescent: roundToDecimalPlaces(totalDescent, 0),
            rawElevations: elevations
        };
    }

    private extractElevations(gpxText: string): number[] {
        const matches = [...gpxText.matchAll(/<ele>\s*([\d.]+)\s*<\/ele>/g)];
        return matches.map((m: RegExpMatchArray) => parseFloat(m[1]));
    }

    private extractTrackPoints(gpxText: string): TrackPoint[] {
        const trackPointPattern = /<trkpt\s+lat="([\d.+-]+)"\s+lon="([\d.+-]+)"/g;
        const matches = [...gpxText.matchAll(trackPointPattern)];
        return matches.map((m: RegExpMatchArray) => ({ lat: parseFloat(m[1]), lon: parseFloat(m[2]) }));
    }

    private haversineDistanceKm(prev: TrackPoint, curr: TrackPoint): number {
        const dLat = this.toRadians(curr.lat - prev.lat);
        const dLon = this.toRadians(curr.lon - prev.lon);
        const prevLatRad = this.toRadians(prev.lat);
        const currLatRad = this.toRadians(curr.lat);

        const haversine =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(prevLatRad) *
            Math.cos(currLatRad) *
            Math.sin(dLon / 2) ** 2;
        const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return GpxManager.EARTH_RADIUS_KM * centralAngle;
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}