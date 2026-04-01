import { describe, expect, it } from 'vitest';
import { formatDate, formatShortDate, getReadingTime, getSectionLabel, getSectionOrderLabel, kmToMiles, notUnderscored } from './content';

describe('content utils', (): void => {
    describe('getReadingTime', (): void => {
        it('should return 0 when body is undefined', (): void => {
            const result = getReadingTime(undefined);

            expect(result).toBe(0);
        });

        it('should return 0 when body is empty', (): void => {
            const result = getReadingTime('');

            expect(result).toBe(0);
        });

        it('should return 1 for short content', (): void => {
            const result = getReadingTime('Hello world');

            expect(result).toBe(1);
        });

        it('should calculate reading time for longer content', (): void => {
            const words = new Array(400).fill('word').join(' ');

            const result = getReadingTime(words);

            expect(result).toBe(2);
        });

        it('should round up partial minutes', (): void => {
            const words = new Array(201).fill('word').join(' ');

            const result = getReadingTime(words);

            expect(result).toBe(2);
        });
    });

    describe('notUnderscored', (): void => {
        it('should return false when filename starts with underscore', (): void => {
            const result = notUnderscored({ id: 'folder/_file.md' });

            expect(result).toBe(false);
        });

        it('should return true when filename does not start with underscore', (): void => {
            const result = notUnderscored({ id: 'folder/file.md' });

            expect(result).toBe(true);
        });

        it('should return true when underscore is in the middle of filename', (): void => {
            const result = notUnderscored({ id: 'folder/my_file.md' });

            expect(result).toBe(true);
        });

        it('should return false when id is just an underscored filename', (): void => {
            const result = notUnderscored({ id: '_file.md' });

            expect(result).toBe(false);
        });
    });

    describe('formatDate', (): void => {
        it('should format date to long format', (): void => {
            const date = new Date('2025-01-15');

            const result = formatDate(date);

            expect(result).toBe('January 15, 2025');
        });
    });

    describe('formatShortDate', (): void => {
        it('should format date to short format', (): void => {
            const date = new Date('2025-01-15');

            const result = formatShortDate(date);

            expect(result).toBe('Jan 15, 2025');
        });
    });

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

    describe('getSectionLabel', (): void => {
        it('should return full label when total sections is provided', (): void => {
            const result = getSectionLabel(3, 10);

            expect(result).toBe('3 of 10 sections');
        });

        it('should return null when published count is zero and no total', (): void => {
            const result = getSectionLabel(0);

            expect(result).toBe(null);
        });

        it('should return sections label when only published count is available', (): void => {
            const result = getSectionLabel(5);

            expect(result).toBe('5 sections');
        });

        it('should return singular section when published count is one', (): void => {
            const result = getSectionLabel(1);

            expect(result).toBe('1 section');
        });

        it('should return full label with zero published when total is provided', (): void => {
            const result = getSectionLabel(0, 10);

            expect(result).toBe('0 of 10 sections');
        });
    });

    describe('getSectionOrderLabel', (): void => {
        it('should return full label when total sections is provided', (): void => {
            const result = getSectionOrderLabel(3, 10);

            expect(result).toBe('Section 3 of 10');
        });

        it('should return label without total when total is not provided', (): void => {
            const result = getSectionOrderLabel(5);

            expect(result).toBe('Section 5');
        });

        it('should handle first section with total', (): void => {
            const result = getSectionOrderLabel(1, 15);

            expect(result).toBe('Section 1 of 15');
        });
    });
});
