import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bartkessels.net',
  integrations: [
    mdx(),
    tailwind(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false
    }
  },
  vite: {
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
