import { celsiusToFahrenheit, kmToMiles } from './conversions';
import { describe, expect, it } from 'vitest';

describe('conversions utils', (): void => {
    describe('kmToMiles', (): void => {
        it('should convert kilometers to miles rounded to one decimal', (): void => {
            const result = kmToMiles(10);

            expect(result).toBe(6.2);
        });

        it('should handle zero kilometers', (): void => {
            const result = kmToMiles(0);

            expect(result).toBe(0);
        });

        it('should round properly', (): void => {
            const result = kmToMiles(5);

            expect(result).toBe(3.1);
        });

        it('should handle fractional kilometers', (): void => {
            const result = kmToMiles(2.5);

            expect(result).toBe(1.6);
        });
    });

    describe('celsiusToFahrenheit', (): void => {
        it('should convert Celsius to Fahrenheit rounded to one decimal', (): void => {
            const result = celsiusToFahrenheit(100);

            expect(result).toBe(212);
        });

        it('should handle zero Celsius', (): void => {
            const result = celsiusToFahrenheit(0);

            expect(result).toBe(32);
        });

        it('should convert negative Celsius', (): void => {
            const result = celsiusToFahrenheit(-40);

            expect(result).toBe(-40);
        });

        it('should round properly', (): void => {
            const result = celsiusToFahrenheit(37);

            expect(result).toBe(98.6);
        });
    });
});
