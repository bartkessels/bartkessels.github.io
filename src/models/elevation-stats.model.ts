export interface ElevationStats {
    startOfTrack: number;
    endOfTrack: number;
    lowestRecordedElevation: number;
    highestRecordedElevation: number;
    totalAscent: number;
    totalDescent: number;
    rawElevations: number[];
}
