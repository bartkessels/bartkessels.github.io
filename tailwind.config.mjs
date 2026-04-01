/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        foreground: '#1A1A1A',
        muted: '#6B7280',
        'muted-foreground': '#9CA3AF',
        border: '#E5E7EB',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-foreground': '#FFFFFF',
        card: '#FFFFFF',
        'card-foreground': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '720px',
            color: '#1A1A1A',
            a: {
              color: 'rgb(var(--color-accent))',
              '&:hover': {
                color: 'rgb(var(--color-accent) / 0.8)',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
