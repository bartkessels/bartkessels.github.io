import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import type { SimplifiedSubject } from '@/models/subject.model';
import SubjectsBar from '@/components/SubjectsBar.astro';

const subjects: SimplifiedSubject[] = [
    { href: 'gardening', name: 'Gardening' },
    { href: 'backpacking', name: 'Backpacking' },
];

describe('SubjectsBar', (): void => {
    it('renders one link per subject', async (): Promise<void> => {
        const { document } = await renderComponent(SubjectsBar, { props: { subjects } });

        const links = document.querySelectorAll('a');

        expect(links.length).toBe(2);
        expect(links[0].getAttribute('href')).toBe('/gardening');
        expect(links[0].textContent?.trim()).toBe('Gardening');
        expect(links[1].getAttribute('href')).toBe('/backpacking');
        expect(links[1].textContent?.trim()).toBe('Backpacking');
    });

    it('marks the link matching the current url as active', async (): Promise<void> => {
        const { document } = await renderComponent(SubjectsBar, {
            props: { subjects },
            request: new Request('http://localhost/gardening'),
        });

        const links = document.querySelectorAll('a');
        const activeLinks = document.querySelectorAll('a[aria-current="page"]');

        expect(activeLinks.length).toBe(1);
        expect(links[0].getAttribute('aria-current')).toBe('page');
        expect(links[1].getAttribute('aria-current')).toBeNull();
    });

    it('marks no link as active when the current url does not match any subject', async (): Promise<void> => {
        const { document } = await renderComponent(SubjectsBar, {
            props: { subjects },
            request: new Request('http://localhost/about'),
        });

        expect(document.querySelectorAll('a[aria-current="page"]').length).toBe(0);
    });
});
