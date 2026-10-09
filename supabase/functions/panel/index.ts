// Servicio del panel de administración. Hace lo que el navegador no puede
// hacer por seguridad, porque necesita la clave de GitHub:
//   - "subir-foto": guarda una foto en el repositorio (src/assets/productos/).
//   - "publicar": vuelve a publicar el sitio para que se vean los cambios.
// Solo lo pueden usar las cuentas de la tabla `administradores`.
//
// Secretos (se configuran en Supabase → Edge Functions → Secrets):
//   TOKEN_GITHUB  Clave de GitHub limitada a este repositorio, con permiso de
//                 "Contents: read and write" y "Actions: read and write".
//   ORIGENES      Sitios desde donde se usa el panel, separados por comas.
// Opcionales: REPO_GITHUB (usuario/repositorio), RAMA_GITHUB y API_GITHUB.

import { createClient } from 'npm:@supabase/supabase-js@2';

const REPO = Deno.env.get('REPO_GITHUB') ?? 'SuprSalva/RosasViri';
const RAMA = Deno.env.get('RAMA_GITHUB') ?? 'main';
const API = Deno.env.get('API_GITHUB') ?? 'https://api.github.com';
const TOKEN = Deno.env.get('TOKEN_GITHUB') ?? '';
const ORIGENES = (Deno.env.get('ORIGENES') ?? 'https://rossvtienda.com')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const CARPETA = 'src/assets/productos';
const FLUJO = 'publicar.yml';
const MAXIMO = 8 * 1024 * 1024;

class ErrorPanel extends Error {
  constructor(
    message: string,
    readonly estado = 400,
  ) {
    super(message);
  }
}

function cabecerasCors(origen: string | null): Record<string, string> {
  const permitido = origen && ORIGENES.includes(origen) ? origen : ORIGENES[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

/** Tipo real del archivo según sus primeros bytes (no se confía en el nombre). */
function extension(bytes: Uint8Array): string | undefined {
  const inicio = (firma: number[], desde = 0) => firma.every((b, i) => bytes[desde + i] === b);
  if (inicio([0xff, 0xd8, 0xff])) return 'jpg';
  if (inicio([0x89, 0x50, 0x4e, 0x47])) return 'png';
  if (inicio([0x52, 0x49, 0x46, 0x46]) && inicio([0x57, 0x45, 0x42, 0x50], 8)) return 'webp';
  return undefined;
}

function nombreArchivo(nombre: string, ext: string): string {
  const base =
    nombre
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'foto';
  const azar = crypto.getRandomValues(new Uint8Array(4));
  const sufijo = Array.from(azar, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${base}-${sufijo}.${ext}`;
}

async function github(ruta: string, init: RequestInit): Promise<Response> {
  if (!TOKEN) throw new ErrorPanel('Falta configurar la clave de GitHub (TOKEN_GITHUB) en Supabase.', 500);
  const respuesta = await fetch(`${API}/repos/${REPO}${ruta}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
  });
  if (!respuesta.ok) {
    console.error('GitHub respondió', respuesta.status, await respuesta.text());
    throw new ErrorPanel('GitHub no aceptó el cambio. Revisa que la clave de GitHub siga vigente.', 502);
  }
  return respuesta;
}

async function subirFoto(datos: Record<string, unknown>, correo: string) {
  if (typeof datos.contenido !== 'string' || !datos.contenido) throw new ErrorPanel('No llegó ninguna foto.');
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(datos.contenido), (c) => c.charCodeAt(0));
  } catch {
    throw new ErrorPanel('La foto llegó dañada. Intenta de nuevo.');
  }
  if (bytes.length > MAXIMO) throw new ErrorPanel('La foto pesa demasiado (máximo 8 MB).');
  const ext = extension(bytes);
  if (!ext) throw new ErrorPanel('Solo se aceptan fotos JPG, PNG o WebP.');

  const archivo = nombreArchivo(typeof datos.nombre === 'string' ? datos.nombre : '', ext);
  await github(`/contents/${CARPETA}/${archivo}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Subir foto ${archivo} desde el panel (${correo})`,
      content: datos.contenido,
      branch: RAMA,
    }),
  });
  return { ruta: `/${CARPETA}/${archivo}` };
}

async function publicar() {
  await github(`/actions/workflows/${FLUJO}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({ ref: RAMA }),
  });
  return { ok: true };
}

Deno.serve(async (peticion) => {
  const cors = cabecerasCors(peticion.headers.get('Origin'));
  const responder = (cuerpo: unknown, estado = 200) =>
    new Response(JSON.stringify(cuerpo), { status: estado, headers: { ...cors, 'Content-Type': 'application/json' } });

  if (peticion.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (peticion.method !== 'POST') return responder({ error: 'Método no permitido.' }, 405);

  try {
    const autorizacion = peticion.headers.get('Authorization') ?? '';
    const clavePublica = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '';
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, clavePublica, {
      global: { headers: { Authorization: autorizacion } },
      auth: { persistSession: false },
    });
    const { data: sesion } = await supabase.auth.getUser(autorizacion.replace(/^Bearer\s+/i, ''));
    if (!sesion.user) throw new ErrorPanel('Tu sesión terminó. Vuelve a entrar.', 401);
    const { data: esAdmin, error } = await supabase.rpc('es_admin');
    if (error || esAdmin !== true) throw new ErrorPanel('Esta cuenta no tiene permiso para administrar la tienda.', 403);

    const datos = (await peticion.json().catch(() => ({}))) as Record<string, unknown>;
    switch (datos.accion) {
      case 'subir-foto':
        return responder(await subirFoto(datos, sesion.user.email ?? sesion.user.id));
      case 'publicar':
        return responder(await publicar());
      default:
        throw new ErrorPanel('Acción desconocida.');
    }
  } catch (e) {
    if (e instanceof ErrorPanel) return responder({ error: e.message }, e.estado);
    console.error(e);
    return responder({ error: 'Algo falló en el servidor. Intenta de nuevo.' }, 500);
  }
});
