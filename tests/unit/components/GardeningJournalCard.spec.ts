import { describe, expect, it } from 'vitest';
import GardeningJournalCard from '@/components/GardeningJournalCard.astro';
import { renderComponent } from './support/render';

const baseProps = {
    title: 'A journal entry',
    date: new Date(2024, 0, 15),
    author: 'Bart Kessels',
    image: '/img.jpg',
    slug: 'a-journal-entry',
};

describe('GardeningJournalCard', (): void => {
    it('renders title, author and formatted date, linking to /gardening/journal/slug', async (): Promise<void> => {
        const { document } = await renderComponent(GardeningJournalCard, { props: baseProps });

        expect(document.querySelector('h4')?.textContent).toContain('A journal entry');
        expect(document.querySelector('h4 a')?.getAttribute('href')).toBe('/gardening/journal/a-journal-entry');
        expect(document.body.textContent).toContain('Bart Kessels');
        expect(document.querySelector('time')?.textContent).toContain('Jan 15, 2024');
    });

    describe('description', (): void => {
        it('renders the description when provided', async (): Promise<void> => {
            const { document } = await renderComponent(GardeningJournalCard, {
                props: { ...baseProps, description: 'A journal description' },
            });

            expect(document.querySelector('p.text-sm')?.textContent).toBe('A journal description');
        });

        it('does not render a description paragraph when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(GardeningJournalCard, { props: baseProps });

            expect(document.querySelector('p.text-sm')).toBeNull();
        });
    });

    describe('readingTime', (): void => {
        it('renders the reading time when provided', async (): Promise<void> => {
            const { document } = await renderComponent(GardeningJournalCard, {
                props: { ...baseProps, readingTime: 3 },
            });

            expect(document.body.textContent).toContain('3 min');
        });

        it('does not render a reading time element when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(GardeningJournalCard, { props: baseProps });

            expect(document.body.textContent).not.toContain('min');
        });
    });
});
