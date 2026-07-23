import { fileURLToPath } from 'url';
import { getViteConfig } from 'astro/config';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default getViteConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.spec.ts', 'tests/unit/**/*.spec.ts'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
