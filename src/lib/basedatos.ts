// Conexión con la base de datos del catálogo (Supabase).
//
// La URL y la clave pública vienen de .env (se pueden sobrescribir en
// .env.local). La clave pública está hecha para ir en el sitio: solo permite
// leer el catálogo; para cambiarlo hay que entrar al panel con una cuenta de
// administración.

import { existeImagen } from './imagenes';

export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_CLAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

type Fila = Record<string, unknown> & { id: string };

/** Lee una tabla completa. Si la base de datos no responde, detiene la publicación. */
export async function leerTabla(tabla: 'categorias' | 'productos', orden: string): Promise<Fila[]> {
  if (!SUPABASE_URL || !SUPABASE_CLAVE) {
    throw new Error('Falta PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY en el archivo .env.');
  }
  // Solo lo activo: lo eliminado (en la Papelera del panel) no se publica.
  const url = `${SUPABASE_URL}/rest/v1/${tabla}?select=*&eliminado=is.null&order=${orden}`;
  let respuesta: Response;
  try {
    // La clave clásica (anon, empieza con "eyJ") también va como Bearer; la nueva
    // (sb_publishable_...) solo en `apikey`.
    const cabeceras: Record<string, string> = { apikey: SUPABASE_CLAVE };
    if (SUPABASE_CLAVE.startsWith('eyJ')) cabeceras.Authorization = `Bearer ${SUPABASE_CLAVE}`;
    respuesta = await fetch(url, { headers: cabeceras });
  } catch (e) {
    throw new Error(`No se pudo conectar con la base de datos (${SUPABASE_URL}). ¿Está en pausa el proyecto de Supabase?`, {
      cause: e,
    });
  }
  if (!respuesta.ok) {
    throw new Error(`La base de datos respondió ${respuesta.status} al leer "${tabla}": ${await respuesta.text()}`);
  }
  const filas = (await respuesta.json()) as Fila[];
  if (filas.length === 0) {
    // Nunca publicar un catálogo vacío por un error de conexión o de permisos.
    throw new Error(`La tabla "${tabla}" está vacía en la base de datos. No se publica un catálogo vacío.`);
  }
  return import.meta.env.DEV ? filas.flatMap(sinFotosFaltantes) : filas;
}

/**
 * En desarrollo, las fotos que se suben desde el panel llegan al repositorio
 * de GitHub y no a esta computadora hasta hacer `git pull`. Para que el
 * servidor local no se detenga, se omiten esas fotos con un aviso.
 */
function sinFotosFaltantes(fila: Fila): Fila[] {
  if (!Array.isArray(fila.fotos)) return [fila];
  const fotos = (fila.fotos as { src: string }[]).filter((f) => existeImagen(f.src));
  const todosLosColores = Array.isArray(fila.colores) ? (fila.colores as { foto: string }[]) : [];
  const colores = todosLosColores.filter((c) => existeImagen(c.foto));
  if (fotos.length < fila.fotos.length || colores.length < todosLosColores.length) {
    console.warn(`[catálogo] "${fila.id}" tiene fotos que aún no están en esta computadora. Haz git pull para traerlas.`);
  }
  return fotos.length ? [{ ...fila, fotos, ...(Array.isArray(fila.colores) && { colores }) }] : [];
}
