// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Mientras no haya dominio propio, el sitio se publica en GitHub Pages en
// https://suprsalva.github.io/RosasViri/
// Cuando se conecte el dominio (por ejemplo https://rossvtienda.com):
//   1. Cambiar `site` por el dominio.
//   2. Cambiar `base` por '/'.
//   3. Agregar el archivo public/CNAME con el dominio.
export default defineConfig({
  site: 'https://suprsalva.github.io',
  base: '/RosasViri',
  integrations: [sitemap()],
});
