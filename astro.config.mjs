import { dirname, resolve } from 'path';
import { buildFileMap } from './src/plugins/remark-resolve-file-links.mjs';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeMermaid from 'rehype-mermaid';
import { remarkResolveFileLinks } from './src/plugins/remark-resolve-file-links.mjs';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentFileMap = buildFileMap(resolve(__dirname, 'content'));

export default defineConfig({
    site: 'https://bartkessels.net',
    integrations: [
        mdx(),
        sitemap(),
    ],
    markdown: {
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['mermaid']
        },
        remarkPlugins: [[remarkResolveFileLinks, contentFileMap]],
        rehypePlugins: [rehypeMermaid, [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
        shikiConfig: {
            theme: 'github-light',
            wrap: false
        }
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            // Covers the dev server: prevents esbuild from lowering native class
            // fields to __publicField() calls which then have no runtime definition.
            esbuildOptions: {
                target: 'es2022',
            },
        },
        build: {
            target: 'es2022',
        },
    },
});
