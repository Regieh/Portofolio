// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import rehypeSections from './src/lib/rehype-sections.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    rehypePlugins: [rehypeSections],
  },
  redirects: {
    '/project': '/',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});