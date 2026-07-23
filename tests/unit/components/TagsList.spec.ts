import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import TagsList from '@/components/TagsList.astro';

describe('TagsList', (): void => {
    it('renders nothing when tags is empty', async (): Promise<void> => {
        const { document } = await renderComponent(TagsList, { props: { tags: [] } });

        expect(document.querySelector('span[aria-label="Tags"]')).toBeNull();
    });

    it('renders each tag separated by | but not before the first or after the last', async (): Promise<void> => {
        const { document } = await renderComponent(TagsList, { props: { tags: ['one', 'two', 'three'] } });

        const wrapper = document.querySelector('span[aria-label="Tags"]');
        const separators = wrapper?.querySelectorAll('span.text-accent\\/40');

        expect(wrapper?.textContent).toContain('one');
        expect(wrapper?.textContent).toContain('two');
        expect(wrapper?.textContent).toContain('three');
        expect(separators?.length).toBe(2);
    });

    describe('size', (): void => {
        it('applies the small text classes by default', async (): Promise<void> => {
            const { document } = await renderComponent(TagsList, { props: { tags: ['one'] } });

            const wrapper = document.querySelector('span[aria-label="Tags"]');

            expect(wrapper?.className).toContain('text-xs');
        });

        it('applies the medium text classes when size is md', async (): Promise<void> => {
            const { document } = await renderComponent(TagsList, { props: { tags: ['one'], size: 'md' } });

            const wrapper = document.querySelector('span[aria-label="Tags"]');

            expect(wrapper?.className).toContain('text-sm');
        });
    });
});
