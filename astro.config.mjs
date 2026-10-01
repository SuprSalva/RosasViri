// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
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

/**
 * En la computadora, el sitio vive en http://localhost:4321/RosasViri/. Si se
 * abre una página sin "/RosasViri" (por ejemplo http://localhost:4321/), se
 * redirige a la misma página dentro del sitio en vez de mostrar el 404 de Astro.
 */
const redirigirAlBase = {
  name: 'redirigir-al-base',
  /** @param {import('vite').ViteDevServer} servidor */
  configureServer(servidor) {
    const prefijo = base.replace(/\/$/, '');
    if (!prefijo) return;
    /** @type {import('vite').Connect.NextHandleFunction} */
    const redirigir = (peticion, respuesta, siguiente) => {
      const url = peticion.originalUrl ?? peticion.url ?? '/';
      const esPagina = peticion.method === 'GET' && (peticion.headers.accept ?? '').includes('text/html');
      // Archivos internos de Vite y Astro (/@vite, /@fs, /node_modules, /src...) no se tocan.
      const interna = /^\/(@|node_modules\/|src\/|__|\.well-known\/appspecific)/.test(url);
      if (!esPagina || interna || url === prefijo || url.startsWith(`${prefijo}/`)) return siguiente();
      respuesta.writeHead(302, { Location: `${prefijo}${url}` }).end();
    };
    // Antes que todo lo demás: Astro responde su propio 404 antes que cualquier
    // middleware registrado de forma normal.
    const atender = servidor.middlewares.handle.bind(servidor.middlewares);
    servidor.middlewares.handle = (peticion, respuesta, siguiente) =>
      redirigir(peticion, respuesta, () => atender(peticion, respuesta, siguiente));
  },
};

export default defineConfig({
  site,
  base,
  // Sin resaltado de código: usa estilos en línea que la política de seguridad bloquea.
  markdown: { syntaxHighlight: false },
  // No incrustar fuentes ni imágenes como `data:`; la política de seguridad solo
  // permite archivos del propio sitio.
  vite: { build: { assetsInlineLimit: 0 }, plugins: [redirigirAlBase] },
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
