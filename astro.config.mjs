// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import tienda from './src/data/tienda.json' with { type: 'json' };

// Dirección del sitio (Cloudflare Pages). Se usa en el sitemap, robots.txt,
// las direcciones canónicas y las vistas previas para redes.
const site = 'https://rossvtienda.com';

// Base de datos del catálogo (Supabase): el panel de /admin/ se conecta a ella.
const { PUBLIC_SUPABASE_URL: supabase = '' } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const baseDatos = supabase ? [new URL(supabase).origin] : [];

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
  // En GitHub (CI) el HTML se publica comprimido en un solo renglón; en la
  // computadora queda legible para poder revisarlo en dist/.
  compressHTML: Boolean(process.env.CI),
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
        // blob: y GitHub: fotos recién subidas en el panel, antes de que se publiquen.
        /** @type {`img-src${string}`} */ (
          ["img-src 'self' data: blob: https://raw.githubusercontent.com", ...google.imagenes].join(' ')
        ),
        "font-src 'self'",
        /** @type {`connect-src${string}`} */ (["connect-src 'self'", ...baseDatos, ...google.conexiones].join(' ')),
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
