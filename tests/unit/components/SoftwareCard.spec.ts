import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import SoftwareCard from '@/components/SoftwareCard.astro';

const baseProps = {
    slug: 'my-project',
    name: 'My Project',
    description: 'A software project',
    logo: '/logo.png',
    repository: 'https://github.com/bartkessels/my-project',
};

describe('SoftwareCard', (): void => {
    it('renders the name linking to /software/slug and the repository link', async (): Promise<void> => {
        const { document } = await renderComponent(SoftwareCard, { props: baseProps });

        expect(document.querySelector('h3')?.textContent).toContain('My Project');
        expect(document.querySelector('h3 a')?.getAttribute('href')).toBe('/software/my-project');

        const repositoryLink = document.querySelector('a[href="https://github.com/bartkessels/my-project"]');
        expect(repositoryLink).not.toBeNull();
        expect(repositoryLink?.textContent).toContain('Repository');
    });

    describe('website', (): void => {
        it('renders the website link when provided', async (): Promise<void> => {
            const { document } = await renderComponent(SoftwareCard, {
                props: { ...baseProps, website: 'https://example.com' },
            });

            const websiteLink = document.querySelector('a[href="https://example.com"]');
            expect(websiteLink).not.toBeNull();
            expect(websiteLink?.textContent).toContain('Website');
        });

        it('does not render a website link when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(SoftwareCard, { props: baseProps });

            expect(document.body.textContent).not.toContain('Website');
        });
    });
});
