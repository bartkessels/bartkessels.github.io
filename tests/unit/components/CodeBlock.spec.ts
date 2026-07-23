import { describe, expect, it } from 'vitest';
import CodeBlock from '@/components/CodeBlock.astro';
import { renderComponent } from './support/render';

describe('CodeBlock', (): void => {
    it('renders the default slot content', async (): Promise<void> => {
        const { html } = await renderComponent(CodeBlock, { slots: { default: 'console.log(1);' } });

        expect(html).toContain('console.log(1);');
    });

    it('renders the filename badge when filename is provided', async (): Promise<void> => {
        const { document } = await renderComponent(CodeBlock, { props: { filename: 'index.ts' } });

        const filename = document.querySelector('.code-block-filename');

        expect(filename).not.toBeNull();
        expect(filename?.textContent).toContain('index.ts');
    });

    it('does not render the filename badge when filename is omitted', async (): Promise<void> => {
        const { document } = await renderComponent(CodeBlock);

        expect(document.querySelector('.code-block-filename')).toBeNull();
    });
});
