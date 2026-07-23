import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import TrailCard from '@/components/TrailCard.astro';

const baseProps = {
    title: 'A trail',
    description: 'A trail description',
    date: new Date(2024, 0, 15),
    country: 'Netherlands',
    location: 'Veluwe',
    distanceKm: 10,
    image: '/img.jpg',
    slug: 'a-trail',
};

describe('TrailCard', (): void => {
    it('renders title, description, location/country, date and links to /backpacking/slug', async (): Promise<void> => {
        const { document } = await renderComponent(TrailCard, { props: baseProps });

        expect(document.querySelector('h3')?.textContent).toContain('A trail');
        expect(document.querySelector('h3 a')?.getAttribute('href')).toBe('/backpacking/a-trail');
        expect(document.querySelector('p.text-muted')?.textContent).toContain('A trail description');
        expect(document.body.textContent).toContain('Veluwe, Netherlands');
        expect(document.querySelector('time')?.textContent).toContain('January 15, 2024');
    });

    it('renders the distance in km and the converted distance in miles', async (): Promise<void> => {
        const { document } = await renderComponent(TrailCard, { props: baseProps });

        expect(document.body.textContent).toContain('10 km');
        expect(document.body.textContent).toContain('6.2 mi');
    });

    describe('sectionLabel', (): void => {
        it('renders the section label badge when provided', async (): Promise<void> => {
            const { document } = await renderComponent(TrailCard, {
                props: { ...baseProps, sectionLabel: '3 of 5 sections' },
            });

            expect(document.body.textContent).toContain('3 of 5 sections');
        });

        it('does not render a section label badge when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(TrailCard, { props: baseProps });

            expect(document.body.textContent).not.toContain('sections');
        });
    });
});
