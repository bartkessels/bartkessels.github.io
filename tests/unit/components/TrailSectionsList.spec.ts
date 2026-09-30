import { describe, expect, it } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { renderComponent } from './support/render';
import TrailSectionsList from '@/components/TrailSectionsList.astro';

const trail = { id: 'pieterpad' } as CollectionEntry<'backpacking/trails'>;

function createSection(id: string, title: string, description: string): CollectionEntry<'backpacking/sections'> {
    return { id, data: { title, description } } as CollectionEntry<'backpacking/sections'>;
}

describe('TrailSectionsList', (): void => {
    it('renders nothing when there are no sections', async (): Promise<void> => {
        const { document } = await renderComponent(TrailSectionsList, {
            props: { trail, sections: [] }
        });

        expect(document.querySelector('section')).toBeNull();
    });

    it('renders a list item for each section', async (): Promise<void> => {
        const sections = [
            createSection('sittard-to-roermond', 'Sittard to Roermond', 'The first section'),
            createSection('roermond-to-venlo', 'Roermond to Venlo', 'The second section')
        ];

        const { document } = await renderComponent(TrailSectionsList, {
            props: { trail, sections }
        });

        const items = document.querySelectorAll('a');

        expect(items.length).toBe(2);
        expect(items[0]?.textContent).toContain('Sittard to Roermond');
        expect(items[0]?.textContent).toContain('The first section');
        expect(items[1]?.textContent).toContain('Roermond to Venlo');
        expect(items[1]?.textContent).toContain('The second section');
    });

    it('builds the section href from the trail and section ids', async (): Promise<void> => {
        const sections = [createSection('sittard-to-roermond', 'Sittard to Roermond', 'The first section')];

        const { document } = await renderComponent(TrailSectionsList, {
            props: { trail, sections }
        });

        const link = document.querySelector('a');

        expect(link?.getAttribute('href')).toBe('/backpacking/pieterpad/sittard-to-roermond');
    });

    it('numbers the sections starting at 1', async (): Promise<void> => {
        const sections = [
            createSection('sittard-to-roermond', 'Sittard to Roermond', 'The first section'),
            createSection('roermond-to-venlo', 'Roermond to Venlo', 'The second section')
        ];

        const { document } = await renderComponent(TrailSectionsList, {
            props: { trail, sections }
        });

        const indexes = document.querySelectorAll('a > span');

        expect(indexes[0]?.textContent?.trim()).toBe('1');
        expect(indexes[1]?.textContent?.trim()).toBe('2');
    });

    it('uses the singular label when there is only one section', async (): Promise<void> => {
        const sections = [createSection('sittard-to-roermond', 'Sittard to Roermond', 'The first section')];

        const { document } = await renderComponent(TrailSectionsList, {
            props: { trail, sections }
        });

        expect(document.querySelector('span.text-sm.text-muted')?.textContent).toBe('section');
    });

    it('uses the plural label when there are multiple sections', async (): Promise<void> => {
        const sections = [
            createSection('sittard-to-roermond', 'Sittard to Roermond', 'The first section'),
            createSection('roermond-to-venlo', 'Roermond to Venlo', 'The second section')
        ];

        const { document } = await renderComponent(TrailSectionsList, {
            props: { trail, sections }
        });

        expect(document.querySelector('span.text-sm.text-muted')?.textContent).toBe('sections');
    });
});
