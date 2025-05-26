// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: netlify(),
  redirects: {
    '/diktat-asistensi/jadwal-asistensi' : '/TOP-SECRET-PAGE-DO-NOT-OPEN/',
    '/diktat-asistensi' : '/TOP-SECRET-PAGE-DO-NOT-OPEN/',
    '/diktat-asistensi/kumpulan-diktat' : '/TOP-SECRET-PAGE-DO-NOT-OPEN/',
  },
  env: {
    schema: {
      YOUTUBE_URL: envField.string({context: "client", access: "public"})
    }
  }
});