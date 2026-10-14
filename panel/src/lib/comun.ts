// Lo que usan todas las pantallas del panel: la conexión con Supabase, los
// avisos de abajo, cambiar de pantalla y explicar los errores.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { $ } from './dom';

export let supabase: SupabaseClient;

/**
 * Crea la conexión con Supabase. Se llama al arrancar, después de revisar que
 * el panel no esté dentro de un marco: al crearla ya se lee la sesión guardada
 * y la que traen los enlaces de invitación o de "olvidé mi contraseña".
 */
export function conectar(): boolean {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const clave = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !clave) return false;
  supabase = createClient(url, clave, {
    // "implicit": el enlace del correo trae la sesión en la dirección, así que
    // la invitación se puede abrir en otro dispositivo (auditoría, #17).
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true },
    global: { fetch: fetchConLimite },
  });
  return true;
}

/**
 * fetch con tiempo máximo: si la base de datos no contesta (por ejemplo, está
 * en pausa), la petición se corta y el panel muestra la pantalla 500 en vez de
 * quedarse cargando para siempre. Subir fotos tiene más tiempo.
 */
function fetchConLimite(entrada: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const direccion = entrada instanceof Request ? entrada.url : String(entrada);
  const limite = direccion.includes('/functions/v1/') ? 90_000 : 20_000;
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(new DOMException('Tiempo agotado', 'TimeoutError')), limite);
  init.signal?.addEventListener('abort', () => control.abort(init.signal?.reason));
  return fetch(entrada, { ...init, signal: control.signal }).finally(() => clearTimeout(temporizador));
}

// ---------------------------------------------------------------- pantallas y avisos

let temporizadorAviso: ReturnType<typeof setTimeout> | undefined;
export function aviso(texto: string, tipo: 'ok' | 'error' = 'ok') {
  const caja = $('[data-aviso]');
  caja.textContent = texto;
  caja.dataset.tipo = tipo;
  caja.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => (caja.hidden = true), tipo === 'error' ? 8000 : 4500);
}

export function mostrar(vista: string) {
  for (const seccion of document.querySelectorAll<HTMLElement>('[data-vista]')) {
    seccion.hidden = seccion.dataset.vista !== vista;
  }
  window.scrollTo({ top: 0 });
  // Lleva el foco al título para que los lectores de pantalla anuncien la pantalla nueva.
  const titulo = document.querySelector<HTMLElement>(`[data-vista="${vista}"] h1`);
  titulo?.setAttribute('tabindex', '-1');
  titulo?.focus({ preventScroll: true });
}

export function precio(valor: number): string {
  return `$${valor.toLocaleString('es-MX')}`;
}

// ---------------------------------------------------------------- errores

type ErrorBD = { code?: string; message?: string } | null;

// Sin permiso, la base de datos no marca error: simplemente no cambia ninguna fila.
export const SIN_PERMISO = { code: '42501' };

export function mensajeError(error: ErrorBD): string {
  if (!error) return 'Algo falló. Intenta de nuevo.';
  if (error.code === 'RV001') return 'Esta sección todavía tiene productos. Muévelos a otra sección o elimínalos primero.';
  if (error.code === 'RV002') return 'Su sección está eliminada. Restaura primero la sección desde la Papelera.';
  if (error.code === '23505') return 'Ya existe otro con ese nombre. Usa un nombre distinto.';
  if (error.code === '42501') return 'Tu cuenta no tiene permiso para hacer este cambio.';
  if (error.code === 'PGRST301' || /JWT/i.test(error.message ?? '')) return 'Tu sesión terminó. Vuelve a entrar.';
  // .single() sin filas: el registro ya no existe o no hay permiso para cambiarlo.
  if (error.code === 'PGRST116') return 'No se pudo guardar: recarga la página y vuelve a intentarlo.';
  return 'No se pudo guardar. Revisa tu conexión e intenta de nuevo.';
}

export function sesionVencida(error: ErrorBD): boolean {
  return !!error && (error.code === 'PGRST301' || error.code === 'PGRST303' || /JWT|token/i.test(error.message ?? ''));
}

/** Muestra un error de la base de datos; si la sesión venció, abre la pantalla 401. */
export function fallo(error: ErrorBD) {
  if (sesionVencida(error)) return mostrar('error-401');
  aviso(mensajeError(error), 'error');
}

/** Pantalla 500: no se pudo hablar con la base de datos o con el servicio. */
export function errorServidor(detalle: string) {
  $('[data-detalle-error]').textContent = detalle;
  mostrar('error-500');
}

/** Explicación corta del error para la pantalla 500. */
export function detalleDe(error: { message?: string }): string {
  const mensaje = error.message ?? '';
  if (/Timeout|Tiempo agotado|abort/i.test(mensaje)) return 'La base de datos no respondió a tiempo.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(mensaje)) return 'No hay conexión con la base de datos.';
  return `Detalle: ${mensaje || 'sin respuesta de la base de datos'}.`;
}
