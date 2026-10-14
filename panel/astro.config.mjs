// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Base de datos y cuentas (Supabase): la misma que usa el sitio.
const { PUBLIC_SUPABASE_URL: supabase = '' } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const baseDatos = supabase ? [new URL(supabase).origin] : [];

export default defineConfig({
  site: 'https://panel.rossvtienda.com',
  // El sitio usa el 4321: así corren los dos a la vez en la computadora.
  server: { port: 4322 },
  // En GitHub (CI) el HTML se publica comprimido; en la computadora queda legible.
  compressHTML: Boolean(process.env.CI),
  // No incrustar fuentes ni imágenes como `data:`; la política de seguridad solo
  // permite archivos del propio panel.
  vite: { build: { assetsInlineLimit: 0 } },
  // Una sola página: no hace falta precargar enlaces.
  prefetch: false,
  security: {
    // Política de seguridad de contenido: el navegador solo ejecuta los scripts
    // y estilos del propio panel y solo se conecta con Supabase. Nunca Analytics
    // ni pixeles. Los marcos se prohíben en public/_headers (frame-ancestors no
    // funciona dentro de la página).
    csp: {
      directives: [
        "default-src 'self'",
        // data: es el código QR para activar la verificación en dos pasos (lo arma Supabase).
        "img-src 'self' data:",
        "font-src 'self'",
        /** @type {`connect-src${string}`} */ (["connect-src 'self'", ...baseDatos].join(' ')),
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
    },
  },
});
