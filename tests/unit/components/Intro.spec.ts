import { describe, expect, it } from 'vitest';
import Intro from '@/components/Intro.astro';
import { renderComponent } from './support/render';

describe('Intro', (): void => {
    it('renders the slot content inside the paragraph', async (): Promise<void> => {
        const { document } = await renderComponent(Intro, {
            slots: { default: 'n this intro I write about code.' }
        });

        const paragraph = document.querySelector('[data-intro-text]');

        expect(paragraph?.textContent).toContain('n this intro I write about code.');
    });

    it('renders the top dot as a hollow, accent-outlined circle', async (): Promise<void> => {
        const { document } = await renderComponent(Intro, { slots: { default: 'Text' } });

        const marker = document.querySelector('[data-intro-marker]');
        const topDot = marker?.querySelector('span');

        expect(topDot?.className).toContain('rounded-full');
        expect(topDot?.className).toContain('border-accent');
        expect(topDot?.className).toContain('bg-background');
    });

    it('renders the rule and end dot in their fully-drawn default state', async (): Promise<void> => {
        const { document } = await renderComponent(Intro, { slots: { default: 'Text' } });

        const rule = document.querySelector('[data-intro-rule]');
        const end = document.querySelector('[data-intro-end]');

        expect(rule?.className).toContain('origin-top');
        expect(rule?.className).toContain('bg-accent/30');
        expect(end?.className).toContain('rounded-full');
        expect(end?.className).toContain('bg-accent');
    });

    it('is driven entirely by CSS, with no client-side script', async (): Promise<void> => {
        const { html } = await renderComponent(Intro, { slots: { default: 'Text' } });

        expect(html).not.toContain('<script');
    });

    it('wraps slot content in a container instead of a paragraph, so multiple paragraphs nest validly', async (): Promise<void> => {
        const { document } = await renderComponent(Intro, {
            slots: { default: '<p>First paragraph.</p><p>Second paragraph.</p>' }
        });

        const container = document.querySelector('[data-intro-text]');

        expect(container?.tagName).not.toBe('P');
        expect(container?.querySelectorAll('p').length).toBe(2);
    });

    it('gives every paragraph but the last a bottom margin, so multiple paragraphs stack with spacing', async (): Promise<void> => {
        const { document } = await renderComponent(Intro, {
            slots: { default: '<p>First paragraph.</p><p>Second paragraph.</p>' }
        });

        const container = document.querySelector('[data-intro-text]');

        expect(container?.className).toContain('[&_p]:mb-3');
        expect(container?.className).toContain('[&_p:last-child]:mb-0!');
    });
});
