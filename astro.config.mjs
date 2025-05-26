// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: netlify(),
  // redirects: {
  //   '/diktat-asistensi/jadwal-asistensi' : 'https://docs.google.com/spreadsheets/d/163hVaMOp6ueTPgI_qtoAmQ2mu7z_FvGspG9_36Cffxs/edit?gid=0#gid=0'
  // },
  env: {
    schema: {
      YOUTUBE_URL: envField.string({context: "client", access: "public"})
    }
  }
});