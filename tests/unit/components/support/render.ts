import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { ContainerRenderOptions } from 'astro/container';
import { Window } from 'happy-dom';

export interface RenderedComponent {
    html: string;
    document: Document;
}

export async function renderComponent(
    component: AstroComponentFactory,
    options: ContainerRenderOptions = {}
): Promise<RenderedComponent> {
    const container = await AstroContainer.create();
    const html = await container.renderToString(component, options);
    const window = new Window();
    window.document.body.innerHTML = html;

    return { html, document: window.document as unknown as Document };
}
