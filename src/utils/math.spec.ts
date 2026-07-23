import { describe, expect, it } from 'vitest';
import { roundToDecimalPlaces } from './math';

describe('roundToDecimalPlaces', () => {
    it('rounds to the specified number of decimal places', () => {
        expect(roundToDecimalPlaces(341.356, 1)).toBe(341.4);
        expect(roundToDecimalPlaces(341.356, 2)).toBe(341.36);
        expect(roundToDecimalPlaces(341.356, 0)).toBe(341);
    });

    it('rounds up when the next digit is 5 or above', () => {
        expect(roundToDecimalPlaces(1.25, 1)).toBe(1.3);
        expect(roundToDecimalPlaces(1.45, 1)).toBe(1.5);
    });

    it('rounds down when the next digit is below 5', () => {
        expect(roundToDecimalPlaces(1.24, 1)).toBe(1.2);
        expect(roundToDecimalPlaces(1.44, 1)).toBe(1.4);
    });

    it('returns the value unchanged when it already has fewer decimal places', () => {
        expect(roundToDecimalPlaces(10, 2)).toBe(10);
        expect(roundToDecimalPlaces(3.1, 3)).toBe(3.1);
    });

    it('handles negative values', () => {
        expect(roundToDecimalPlaces(-341.356, 1)).toBe(-341.4);
    });

    it('handles zero', () => {
        expect(roundToDecimalPlaces(0, 2)).toBe(0);
    });
});
