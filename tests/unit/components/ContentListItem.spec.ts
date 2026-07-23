import { describe, expect, it } from 'vitest';
import ContentListItem from '@/components/ContentListItem.astro';
import { renderComponent } from './support/render';

describe('ContentListItem', (): void => {
    describe('index', (): void => {
        it('shows the index badge when index is provided', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title', index: 3 },
            });

            const badge = document.querySelector('a > span');

            expect(badge?.textContent?.trim()).toBe('3');
        });

        it('still shows the index badge when index is 0', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title', index: 0 },
            });

            const badge = document.querySelector('a > span');

            expect(badge?.textContent?.trim()).toBe('0');
        });

        it('does not show the index badge when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title' },
            });

            expect(document.querySelector('a > span')).toBeNull();
        });
    });

    describe('image', (): void => {
        it('shows the thumbnail when image is provided', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title', image: '/thumb.jpg' },
            });

            expect(document.querySelector('img')).not.toBeNull();
        });

        it('does not show a thumbnail when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title' },
            });

            expect(document.querySelector('img')).toBeNull();
        });
    });

    describe('description', (): void => {
        it('shows the description paragraph when provided', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title', description: 'A description' },
            });

            expect(document.querySelector('p.text-sm')?.textContent).toBe('A description');
        });

        it('does not show a description paragraph when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(ContentListItem, {
                props: { href: '/a', title: 'A title' },
            });

            expect(document.querySelector('p.text-sm')).toBeNull();
        });
    });
});
