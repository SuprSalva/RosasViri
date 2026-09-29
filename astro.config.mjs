// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tienda from './src/data/tienda.json' with { type: 'json' };

// Mientras no haya dominio propio, el sitio se publica en GitHub Pages en
// https://suprsalva.github.io/RosasViri/
// Cuando se conecte el dominio (por ejemplo https://rossvtienda.com):
//   1. Cambiar `site` por el dominio.
//   2. Cambiar `base` por '/'.
//   3. Agregar el archivo public/CNAME con el dominio.
const site = 'https://suprsalva.github.io';
const base = '/RosasViri';

// Google Analytics solo se permite si hay un ID configurado en el panel.
const analytics = Boolean(tienda.google?.analytics);
const google = analytics
  ? {
      scripts: ['https://www.googletagmanager.com'],
      conexiones: ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
      imagenes: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
    }
  : { scripts: [], conexiones: [], imagenes: [] };

export default defineConfig({
  site,
  base,
  // Sin resaltado de código: usa estilos en línea que la política de seguridad bloquea.
  markdown: { syntaxHighlight: false },
  // No incrustar fuentes ni imágenes como `data:`; la política de seguridad solo
  // permite archivos del propio sitio.
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      filter: (pagina) => !/\/(admin|404)\/?$/.test(new URL(pagina).pathname),
    }),
  ],
  security: {
    // Política de seguridad de contenido: el navegador solo ejecuta los
    // scripts y estilos del propio sitio (y Google Analytics si está activo).
    csp: {
      directives: [
        "default-src 'self'",
        /** @type {`img-src${string}`} */ (["img-src 'self' data:", ...google.imagenes].join(' ')),
        "font-src 'self'",
        /** @type {`connect-src${string}`} */ (["connect-src 'self'", ...google.conexiones].join(' ')),
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'", ...google.scripts],
      },
    },
  },
});
