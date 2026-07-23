import { describe, expect, it, vi } from 'vitest';
import type { Distance } from '@/models/distance.model';
import { renderComponent } from './support/render';
import TripConditions from '@/components/TripConditions.astro';

const distance: Distance = { inKilometers: 12.3, inMiles: 7.6 };

vi.mock('@/factories/manager-factory', (): Record<string, unknown> => ({
    getGpxManager: (): Record<string, unknown> => ({
        getTotalDistance: async (): Promise<Distance> => distance,
    }),
}));

const baseProps = {
    weather: 'Sunny',
    temperatureC: 20,
    difficulty: 'moderate' as const,
    gpxUrl: '/trail.gpx',
};

describe('TripConditions', (): void => {
    it('renders the weather', async (): Promise<void> => {
        const { document } = await renderComponent(TripConditions, { props: baseProps });

        expect(document.body.textContent).toContain('Sunny');
    });

    it('renders the temperature in Celsius and the converted Fahrenheit value', async (): Promise<void> => {
        const { document } = await renderComponent(TripConditions, { props: baseProps });

        const text = document.body.textContent ?? '';

        expect(text).toContain('20');
        expect(text).toContain('°C');
        expect(text).toContain('68');
        expect(text).toContain('°F');
    });

    it('renders the total distance in km and mi from the gpx manager', async (): Promise<void> => {
        const { document } = await renderComponent(TripConditions, { props: baseProps });

        const text = document.body.textContent ?? '';

        expect(text).toContain('12.3');
        expect(text).toContain('km');
        expect(text).toContain('7.6');
        expect(text).toContain('mi');
    });

    interface DifficultyCase {
        difficulty: 'easy' | 'moderate' | 'hard' | 'very-hard';
        label: string;
        colorClass: string;
    }

    describe('difficulty', (): void => {
        const cases: DifficultyCase[] = [
            { difficulty: 'easy', label: 'Easy', colorClass: 'bg-emerald-500/10' },
            { difficulty: 'moderate', label: 'Moderate', colorClass: 'bg-accent/10' },
            { difficulty: 'hard', label: 'Hard', colorClass: 'bg-orange-500/10' },
            { difficulty: 'very-hard', label: 'Very Hard', colorClass: 'bg-red-500/10' },
        ];

        it.each(cases)('renders "$label" with the correct color class for $difficulty', async ({ difficulty, label, colorClass }: DifficultyCase): Promise<void> => {
            const { document } = await renderComponent(TripConditions, {
                props: { ...baseProps, difficulty },
            });

            const badge = document.querySelectorAll('dd')[3]?.querySelector('span');

            expect(badge?.textContent?.trim()).toBe(label);
            expect(badge?.className).toContain(colorClass);
        });
    });
});
