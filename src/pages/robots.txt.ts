import type { APIRoute } from 'astro';
import { ruta } from '../lib/enlaces';

export const GET: APIRoute = ({ site }) => {
  const mapa = new URL(ruta('/sitemap-index.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${mapa.href}\n`);
};
