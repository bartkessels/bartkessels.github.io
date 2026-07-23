import { describe, expect, it } from 'vitest';
import { renderComponent } from './support/render';
import SubjectBadge from '@/components/SubjectBadge.astro';

describe('SubjectBadge', (): void => {
    it('renders the subject text', async (): Promise<void> => {
        const { document } = await renderComponent(SubjectBadge, { props: { subject: 'Gardening' } });

        expect(document.querySelector('span')?.textContent).toContain('Gardening');
    });

    describe('size', (): void => {
        it('applies the small text classes by default', async (): Promise<void> => {
            const { document } = await renderComponent(SubjectBadge, { props: { subject: 'Gardening' } });

            const span = document.querySelector('span');

            expect(span?.className).toContain('text-xs');
        });

        it('applies the medium text classes when size is md', async (): Promise<void> => {
            const { document } = await renderComponent(SubjectBadge, { props: { subject: 'Gardening', size: 'md' } });

            const span = document.querySelector('span');

            expect(span?.className).toContain('text-sm');
        });
    });

    describe('color', (): void => {
        it('applies the default color class when omitted', async (): Promise<void> => {
            const { document } = await renderComponent(SubjectBadge, { props: { subject: 'Gardening' } });

            const span = document.querySelector('span');

            expect(span?.className).toContain('bg-gray-100');
            expect(span?.className).toContain('text-gray-800');
        });

        it('applies a custom color class when provided', async (): Promise<void> => {
            const { document } = await renderComponent(SubjectBadge, {
                props: { subject: 'Gardening', color: 'bg-green-100 text-green-800' },
            });

            const span = document.querySelector('span');

            expect(span?.className).toContain('bg-green-100');
            expect(span?.className).toContain('text-green-800');
        });
    });
});
