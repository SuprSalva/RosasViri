import type { APIRoute } from 'astro';
import { tienda } from '../../data/tienda';
import { ruta } from '../../lib/enlaces';

// Dónde reportar un problema de seguridad (RFC 9116). Vence en un año desde
// cada publicación, así que se renueva solo.
export const GET: APIRoute = ({ site }) => {
  const vence = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const lineas = [
    tienda.correo && `Contact: mailto:${tienda.correo}`,
    `Expires: ${vence}`,
    'Preferred-Languages: es, en',
    `Canonical: ${new URL(ruta('/.well-known/security.txt'), site).href}`,
  ].filter(Boolean);
  return new Response(`${lineas.join('\n')}\n`);
};
