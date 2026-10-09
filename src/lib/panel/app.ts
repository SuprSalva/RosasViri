// Panel de administración del catálogo (se ejecuta en el navegador).
//
// Lee y guarda productos y secciones directo en Supabase: la base de datos
// solo acepta cambios de cuentas de administración. Para subir fotos y volver
// a publicar el sitio usa el servicio "panel" (supabase/functions/panel/),
// que es el único que tiene la clave de GitHub.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { $, aDireccion, el } from './dom';
import { prepararFoto } from './fotos';

type Foto = { src: string; alt?: string };
type Opcion = { nombre: string; ejemplo?: string };
type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  resumen: string;
  precio: number;
  descripcion: string;
  fotos: Foto[];
  opciones: Opcion[];
  disponible: boolean;
  destacado: boolean;
  orden: number;
  /** Fecha de eliminación (null = activo). Nada se borra: lo eliminado va a la Papelera. */
  eliminado: string | null;
};
type Categoria = {
  id: string;
  nombre: string;
  corto: string;
  descripcion: string;
  foto: string;
  orden: number;
  eliminado: string | null;
};

const REPOSITORIO = 'SuprSalva/RosasViri';
// Direcciones que ya usan otras páginas del sitio: una sección no puede llamarse así.
const RESERVADAS = new Set([
  'admin',
  'catalogo',
  'como-pedir',
  'contacto',
  'galeria',
  'pedidos-personalizados',
  'privacidad',
  '404',
]);

let supabase: SupabaseClient;
// Incluyen lo eliminado (la Papelera); usa activas() y activos() para lo visible.
let categorias: Categoria[] = [];
let productos: Producto[] = [];
let pestana: 'productos' | 'categorias' | 'papelera' = 'productos';
// Para distinguir "Salir" de una sesión que se cerró sola.
let salidaVoluntaria = false;

const activas = () => categorias.filter((c) => !c.eliminado);
const activos = () => productos.filter((p) => !p.eliminado);
// Fotos recién subidas: aún no están en el sitio publicado, se muestran desde esta computadora.
const vistasLocales = new Map<string, string>();
let miniaturas: Record<string, string> = {};

// ---------------------------------------------------------------- utilidades

function precio(valor: number): string {
  return `$${valor.toLocaleString('es-MX')}`;
}

function urlFoto(ruta: string): string {
  return vistasLocales.get(ruta) ?? miniaturas[ruta] ?? `https://raw.githubusercontent.com/${REPOSITORIO}/main${ruta}`;
}

function miniatura(ruta: string | undefined, alt = ''): HTMLElement {
  if (!ruta) return el('span', { class: 'sin-foto', 'aria-hidden': 'true' });
  return el('img', { src: urlFoto(ruta), alt, loading: 'lazy', decoding: 'async' });
}

let temporizadorAviso: ReturnType<typeof setTimeout> | undefined;
function aviso(texto: string, tipo: 'ok' | 'error' = 'ok') {
  const caja = $('[data-aviso]');
  caja.textContent = texto;
  caja.dataset.tipo = tipo;
  caja.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => (caja.hidden = true), tipo === 'error' ? 8000 : 4500);
}

function mostrar(vista: string) {
  for (const seccion of document.querySelectorAll<HTMLElement>('[data-vista]')) {
    seccion.hidden = seccion.dataset.vista !== vista;
  }
  window.scrollTo({ top: 0 });
  // Lleva el foco al título para que los lectores de pantalla anuncien la pantalla nueva.
  const titulo = document.querySelector<HTMLElement>(`[data-vista="${vista}"] h1`);
  titulo?.setAttribute('tabindex', '-1');
  titulo?.focus({ preventScroll: true });
}

// Sin permiso, la base de datos no marca error: simplemente no cambia ninguna fila.
const SIN_PERMISO = { code: '42501' };

function mensajeError(error: { code?: string; message?: string } | null): string {
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

function sesionVencida(error: { code?: string; message?: string } | null): boolean {
  return !!error && (error.code === 'PGRST301' || error.code === 'PGRST303' || /JWT|token/i.test(error.message ?? ''));
}

/** Muestra un error de la base de datos; si la sesión venció, abre la pantalla 401. */
function fallo(error: { code?: string; message?: string } | null) {
  if (sesionVencida(error)) return mostrar('error-401');
  aviso(mensajeError(error), 'error');
}

/** Pantalla 500: no se pudo hablar con la base de datos o con el servicio. */
function errorServidor(detalle: string) {
  $('[data-detalle-error]').textContent = detalle;
  mostrar('error-500');
}

/** Explicación corta del error para la pantalla 500. */
function detalleDe(error: { message?: string }): string {
  const mensaje = error.message ?? '';
  if (/Timeout|Tiempo agotado|abort/i.test(mensaje)) return 'La base de datos no respondió a tiempo.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(mensaje)) return 'No hay conexión con la base de datos.';
  return `Detalle: ${mensaje || 'sin respuesta de la base de datos'}.`;
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

/** Llama al servicio del panel y devuelve su respuesta, o lanza su mensaje de error. */
async function invocar<T>(cuerpo: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('panel', { body: cuerpo });
  if (!error) return data as T;
  let mensaje = 'No se pudo conectar con el servidor del panel.';
  const respuesta = (error as { context?: unknown }).context;
  if (respuesta instanceof Response) {
    if (respuesta.status === 401) mostrar('error-401');
    try {
      mensaje = ((await respuesta.json()) as { error?: string }).error ?? mensaje;
    } catch {
      // Respuesta sin JSON: se queda el mensaje general.
    }
  }
  throw new Error(mensaje);
}

let temporizadorPublicar: ReturnType<typeof setTimeout> | undefined;
/** Vuelve a publicar el sitio. Si hay varios cambios seguidos, publica una sola vez. */
function publicar() {
  clearTimeout(temporizadorPublicar);
  temporizadorPublicar = setTimeout(async () => {
    try {
      await invocar({ accion: 'publicar' });
    } catch (e) {
      aviso(`Se guardó, pero no se pudo publicar el sitio: ${(e as Error).message}`, 'error');
    }
  }, 1500);
}

async function subirFoto(archivo: File, nombre: string): Promise<string> {
  const { base64, vista } = await prepararFoto(archivo);
  const { ruta } = await invocar<{ ruta: string }>({ accion: 'subir-foto', nombre, contenido: base64 });
  vistasLocales.set(ruta, vista);
  return ruta;
}

function idUnico(base: string, usados: Set<string>): string {
  let id = base || 'producto';
  for (let n = 2; usados.has(id) || RESERVADAS.has(id); n++) id = `${base}-${n}`;
  return id;
}

// ---------------------------------------------------------------- sesión

async function entrarAlPanel() {
  const { data, error: errorSesion } = await supabase.auth.getUser();
  if (!data.user) {
    // Sin conexión con Supabase no se sabe si la sesión sigue: mejor decirlo que pedir entrar.
    if (errorSesion && !('status' in errorSesion && errorSesion.status)) {
      return errorServidor('No hubo respuesta del servidor de cuentas.');
    }
    // Había sesión guardada pero ya no es válida (venció o se cerró en otro lado).
    return mostrar('error-401');
  }
  for (const nodo of document.querySelectorAll('[data-correo]')) nodo.textContent = data.user.email ?? '';

  const { data: esAdmin, error } = await supabase.rpc('es_admin');
  if (error) {
    if (sesionVencida(error)) return mostrar('error-401');
    return errorServidor(detalleDe(error));
  }
  if (esAdmin !== true) return mostrar('sin-permiso');

  if (await cargar()) verLista(pestana);
}

async function cargar() {
  const [c, p] = await Promise.all([
    supabase.from('categorias').select('*').order('orden').order('nombre'),
    supabase.from('productos').select('*').order('orden').order('nombre'),
  ]);
  const error = c.error ?? p.error;
  if (error) {
    if (sesionVencida(error)) mostrar('error-401');
    else errorServidor(detalleDe(error));
    return false;
  }
  categorias = c.data as Categoria[];
  productos = (p.data as Producto[]).map((x) => ({ ...x, precio: Number(x.precio) }));
  return true;
}

// ---------------------------------------------------------------- listas

function verLista(cual: typeof pestana) {
  pestana = cual;
  for (const boton of document.querySelectorAll<HTMLElement>('[data-pestana]')) {
    if (boton.dataset.pestana === cual) boton.setAttribute('aria-current', 'page');
    else boton.removeAttribute('aria-current');
  }
  $('[data-lista="productos"]').hidden = cual !== 'productos';
  $('[data-lista="categorias"]').hidden = cual !== 'categorias';
  $('[data-lista="papelera"]').hidden = cual !== 'papelera';
  pintarProductos();
  pintarCategorias();
  pintarPapelera();
  mostrar('panel');
}

function pintarProductos() {
  const contenedor = $('[data-productos]');
  contenedor.replaceChildren(
    ...activas().flatMap((categoria) => {
      const suyos = activos().filter((p) => p.categoria === categoria.id);
      return [
        el('h2', { class: 'grupo-titulo' }, categoria.corto),
        suyos.length
          ? el('ul', { class: 'filas', role: 'list' }, ...suyos.map(filaProducto))
          : el('p', { class: 'nota' }, 'Todavía no hay productos en esta sección.'),
      ];
    }),
  );
}

function filaProducto(producto: Producto): HTMLElement {
  const casilla = el('input', { type: 'checkbox', checked: producto.disponible });
  const fila = el(
    'li',
    { class: producto.disponible ? 'fila' : 'fila agotado' },
    miniatura(producto.fotos[0]?.src),
    el(
      'div',
      { class: 'fila-texto' },
      el('strong', {}, producto.nombre),
      el('span', { class: 'nota' }, [precio(producto.precio), producto.resumen].filter(Boolean).join(' · ')),
    ),
    el(
      'div',
      { class: 'fila-acciones' },
      el('label', { class: 'interruptor', title: 'Disponible' }, casilla, el('span', { class: 'nota' }, 'Disponible')),
      el('button', { type: 'button', class: 'mini', onclick: () => abrirProducto(producto) }, 'Editar'),
    ),
  );
  casilla.addEventListener('change', async () => {
    const disponible = casilla.checked;
    const { data, error } = await supabase.from('productos').update({ disponible }).eq('id', producto.id).select('id');
    if (error || !data?.length) {
      casilla.checked = !disponible;
      return fallo(error ?? SIN_PERMISO);
    }
    producto.disponible = disponible;
    fila.classList.toggle('agotado', !disponible);
    aviso(disponible ? `«${producto.nombre}» está disponible.` : `«${producto.nombre}» aparece como agotado.`);
    publicar();
  });
  return fila;
}

function pintarCategorias() {
  $('[data-categorias]').replaceChildren(
    ...activas().map((categoria) => {
      const cuantos = activos().filter((p) => p.categoria === categoria.id).length;
      return el(
        'li',
        { class: 'fila' },
        miniatura(categoria.foto),
        el(
          'div',
          { class: 'fila-texto' },
          el('strong', {}, categoria.nombre),
          el('span', { class: 'nota' }, `${cuantos} ${cuantos === 1 ? 'producto' : 'productos'} · /${categoria.id}/`),
        ),
        el('div', { class: 'fila-acciones' }, el('button', { type: 'button', class: 'mini', onclick: () => abrirCategoria(categoria) }, 'Editar')),
      );
    }),
  );
}

function fechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function pintarPapelera() {
  const productosEliminados = productos.filter((p) => p.eliminado);
  const categoriasEliminadas = categorias.filter((c) => c.eliminado);
  const fila = (foto: string | undefined, titulo: string, detalle: string, alRestaurar: () => void) =>
    el(
      'li',
      { class: 'fila fila-papelera' },
      miniatura(foto),
      el('div', { class: 'fila-texto' }, el('strong', {}, titulo), el('span', { class: 'nota' }, detalle)),
      el('div', { class: 'fila-acciones' }, el('button', { type: 'button', class: 'mini', onclick: alRestaurar }, 'Restaurar')),
    );
  const lista = (filas: HTMLElement[], vacio: string) =>
    filas.length ? el('ul', { class: 'filas', role: 'list' }, ...filas) : el('p', { class: 'nota' }, vacio);

  $('[data-papelera-productos]').replaceChildren(
    lista(
      productosEliminados.map((p) =>
        fila(p.fotos[0]?.src, p.nombre, `${precio(p.precio)} · eliminado el ${fechaCorta(p.eliminado!)}`, () =>
          restaurar('productos', p),
        ),
      ),
      'No hay productos eliminados.',
    ),
  );
  $('[data-papelera-categorias]').replaceChildren(
    lista(
      categoriasEliminadas.map((c) =>
        fila(c.foto, c.nombre, `/${c.id}/ · eliminada el ${fechaCorta(c.eliminado!)}`, () => restaurar('categorias', c)),
      ),
      'No hay secciones eliminadas.',
    ),
  );
}

/** Elimina de forma lógica: marca la fecha y el registro pasa a la Papelera. */
async function marcarEliminado(tabla: 'productos' | 'categorias', registro: Producto | Categoria): Promise<boolean> {
  const eliminado = new Date().toISOString();
  const { data, error } = await supabase.from(tabla).update({ eliminado }).eq('id', registro.id).select('id');
  if (error || !data?.length) {
    fallo(error ?? SIN_PERMISO);
    return false;
  }
  registro.eliminado = eliminado;
  publicar();
  return true;
}

async function restaurar(tabla: 'productos' | 'categorias', registro: Producto | Categoria) {
  const { data, error } = await supabase.from(tabla).update({ eliminado: null }).eq('id', registro.id).select('id');
  if (error || !data?.length) return fallo(error ?? SIN_PERMISO);
  registro.eliminado = null;
  publicar();
  verLista('papelera');
  aviso(`«${registro.nombre}» se restauró y vuelve a aparecer en el sitio.`);
}

// ---------------------------------------------------------------- editor de producto

const edicion: { original?: Producto; fotos: Foto[]; opciones: Opcion[]; subiendo: number } = {
  fotos: [],
  opciones: [],
  subiendo: 0,
};

function formularioProducto() {
  return $<HTMLFormElement>('[data-form-producto]');
}

function abrirProducto(producto?: Producto) {
  const form = formularioProducto();
  form.reset();
  edicion.original = producto;
  edicion.fotos = structuredClone(producto?.fotos ?? []);
  edicion.opciones = structuredClone(producto?.opciones ?? []);
  edicion.subiendo = 0;

  const vista = $('[data-vista="producto"]');
  $('[data-titulo-editor]', vista).textContent = producto ? `Editar: ${producto.nombre}` : 'Nuevo producto';
  $('[data-eliminar]', vista).hidden = !producto;

  const select = $<HTMLSelectElement>('[data-select-categoria]');
  select.replaceChildren(...activas().map((c) => el('option', { value: c.id }, c.corto)));

  const campo = <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(nombre: string) =>
    form.elements.namedItem(nombre) as T;
  campo<HTMLInputElement>('nombre').value = producto?.nombre ?? '';
  select.value = producto?.categoria ?? activas()[0]?.id ?? '';
  campo<HTMLInputElement>('precio').value = producto ? String(producto.precio) : '';
  campo<HTMLInputElement>('resumen').value = producto?.resumen ?? '';
  campo<HTMLTextAreaElement>('descripcion').value = producto?.descripcion ?? '';
  campo<HTMLInputElement>('disponible').checked = producto?.disponible ?? true;
  campo<HTMLInputElement>('destacado').checked = producto?.destacado ?? false;
  campo<HTMLInputElement>('orden').value = String(producto?.orden ?? 100);

  actualizarDireccionProducto();
  pintarFotos();
  pintarOpciones();
  mostrar('producto');
}

function actualizarDireccionProducto() {
  const form = formularioProducto();
  const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
  const categoria = (form.elements.namedItem('categoria') as HTMLSelectElement).value;
  const id = edicion.original?.id ?? (aDireccion(nombre) || '…');
  $('[data-direccion]', form).textContent = edicion.original
    ? `Dirección en el sitio: /${categoria}/${id}/`
    : `Dirección en el sitio: /${categoria}/${id}/ (no se podrá cambiar después)`;
}

function pintarFotos() {
  const lista = $('[data-fotos]');
  const total = edicion.fotos.length;
  lista.replaceChildren(
    ...edicion.fotos.map((foto, i) => {
      const mover = (delta: number) => {
        const [quitada] = edicion.fotos.splice(i, 1);
        edicion.fotos.splice(i + delta, 0, quitada);
        pintarFotos();
      };
      return el(
        'li',
        { class: 'foto-editor' },
        miniatura(foto.src, i === 0 ? 'Foto principal' : `Foto ${i + 1}`),
        el(
          'div',
          {},
          el(
            'label',
            { class: 'campo' },
            i === 0 ? 'Foto principal · descripción (opcional)' : `Foto ${i + 1} · descripción (opcional)`,
            el('input', {
              value: foto.alt ?? '',
              maxlength: 140,
              placeholder: 'Ej. Ramo de 12 rosas azules',
              oninput: (e: Event) => (foto.alt = (e.target as HTMLInputElement).value),
            }),
          ),
          el(
            'div',
            { class: 'mini-botones' },
            el('button', { type: 'button', class: 'mini', disabled: i === 0, onclick: () => mover(-1), 'aria-label': 'Mover antes' }, '↑'),
            el('button', { type: 'button', class: 'mini', disabled: i === total - 1, onclick: () => mover(1), 'aria-label': 'Mover después' }, '↓'),
            el(
              'button',
              {
                type: 'button',
                class: 'mini',
                onclick: () => {
                  edicion.fotos.splice(i, 1);
                  pintarFotos();
                },
              },
              'Quitar',
            ),
          ),
        ),
      );
    }),
  );
  if (!total) lista.append(el('li', { class: 'nota' }, 'Agrega al menos una foto.'));
}

function pintarOpciones() {
  $('[data-opciones]').replaceChildren(
    ...edicion.opciones.map((opcion, i) =>
      el(
        'li',
        { class: 'opcion' },
        el(
          'label',
          { class: 'campo' },
          'Pregunta',
          el('input', {
            value: opcion.nombre,
            maxlength: 60,
            placeholder: 'Color de rosas',
            oninput: (e: Event) => (opcion.nombre = (e.target as HTMLInputElement).value),
          }),
        ),
        el(
          'label',
          { class: 'campo' },
          'Ejemplo (opcional)',
          el('input', {
            value: opcion.ejemplo ?? '',
            maxlength: 80,
            placeholder: 'rojo, rosa, azul...',
            oninput: (e: Event) => (opcion.ejemplo = (e.target as HTMLInputElement).value),
          }),
        ),
        el(
          'button',
          {
            type: 'button',
            class: 'mini',
            onclick: () => {
              edicion.opciones.splice(i, 1);
              pintarOpciones();
            },
          },
          'Quitar',
        ),
      ),
    ),
  );
}

async function agregarFotos(archivos: FileList) {
  const nombre = (formularioProducto().elements.namedItem('nombre') as HTMLInputElement).value || 'producto';
  for (const archivo of Array.from(archivos)) {
    edicion.subiendo++;
    aviso(`Subiendo «${archivo.name}»…`);
    try {
      edicion.fotos.push({ src: await subirFoto(archivo, nombre) });
      pintarFotos();
      aviso('Foto agregada. Recuerda guardar el producto.');
    } catch (e) {
      aviso((e as Error).message, 'error');
    } finally {
      edicion.subiendo--;
    }
  }
}

async function guardarProducto(evento: SubmitEvent) {
  evento.preventDefault();
  const form = formularioProducto();
  const valor = (nombre: string) => (form.elements.namedItem(nombre) as HTMLInputElement).value.trim();
  const marcado = (nombre: string) => (form.elements.namedItem(nombre) as HTMLInputElement).checked;

  if (edicion.subiendo > 0) return aviso('Espera a que terminen de subir las fotos.', 'error');
  const nombre = valor('nombre');
  const categoria = valor('categoria');
  const precioNumero = Number(valor('precio'));
  if (!nombre) return aviso('Escribe el nombre del producto.', 'error');
  if (!categoria) return aviso('Elige una sección. Si no hay, crea una en «Secciones».', 'error');
  if (!(precioNumero > 0)) return aviso('Escribe un precio mayor a 0.', 'error');
  if (!edicion.fotos.length) return aviso('Agrega al menos una foto.', 'error');

  const datos = {
    nombre,
    categoria,
    precio: precioNumero,
    resumen: valor('resumen'),
    descripcion: (form.elements.namedItem('descripcion') as HTMLTextAreaElement).value.trim(),
    fotos: edicion.fotos.map((f) => (f.alt?.trim() ? { src: f.src, alt: f.alt.trim() } : { src: f.src })),
    opciones: edicion.opciones
      .filter((o) => o.nombre.trim())
      .map((o) => (o.ejemplo?.trim() ? { nombre: o.nombre.trim(), ejemplo: o.ejemplo.trim() } : { nombre: o.nombre.trim() })),
    disponible: marcado('disponible'),
    destacado: marcado('destacado'),
    orden: Math.round(Number(valor('orden')) || 100),
  };

  const boton = $<HTMLButtonElement>('button[type="submit"]', form);
  boton.disabled = true;
  try {
    const original = edicion.original;
    const consulta = original
      ? supabase.from('productos').update(datos).eq('id', original.id).select().single()
      : supabase
          .from('productos')
          .insert({ id: idUnico(aDireccion(nombre), new Set(productos.map((p) => p.id))), ...datos })
          .select()
          .single();
    const { data, error } = await consulta;
    if (error) return fallo(error);
    const guardado = { ...(data as Producto), precio: Number((data as Producto).precio) };
    productos = original ? productos.map((p) => (p.id === original.id ? guardado : p)) : [...productos, guardado];
    productos.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
    publicar();
    verLista('productos');
    aviso('Guardado. El sitio se actualiza en 1 o 2 minutos.');
  } finally {
    boton.disabled = false;
  }
}

async function eliminarProducto() {
  const producto = edicion.original;
  if (!producto) return;
  if (!confirm(`¿Eliminar «${producto.nombre}»? Dejará de verse en el sitio; podrás recuperarlo desde la Papelera.`)) return;
  if (!(await marcarEliminado('productos', producto))) return;
  verLista('productos');
  aviso(`«${producto.nombre}» se movió a la Papelera.`);
}

// ---------------------------------------------------------------- editor de sección

const edicionCategoria: { original?: Categoria; foto: string } = { foto: '' };

function formularioCategoria() {
  return $<HTMLFormElement>('[data-form-categoria]');
}

function abrirCategoria(categoria?: Categoria) {
  const form = formularioCategoria();
  form.reset();
  edicionCategoria.original = categoria;
  edicionCategoria.foto = categoria?.foto ?? '';

  const vista = $('[data-vista="categoria"]');
  $('[data-titulo-editor]', vista).textContent = categoria ? `Editar: ${categoria.corto}` : 'Nueva sección';
  $('[data-eliminar]', vista).hidden = !categoria;

  const campo = (nombre: string) => form.elements.namedItem(nombre) as HTMLInputElement;
  campo('nombre').value = categoria?.nombre ?? '';
  campo('corto').value = categoria?.corto ?? '';
  campo('descripcion').value = categoria?.descripcion ?? '';
  campo('orden').value = String(categoria?.orden ?? (Math.max(0, ...activas().map((c) => c.orden)) + 1));

  actualizarDireccionCategoria();
  pintarEleccion();
  mostrar('categoria');
}

function actualizarDireccionCategoria() {
  const form = formularioCategoria();
  const corto = (form.elements.namedItem('corto') as HTMLInputElement).value;
  const id = edicionCategoria.original?.id ?? (aDireccion(corto) || '…');
  $('[data-direccion]', form).textContent = edicionCategoria.original
    ? `Dirección en el sitio: /${id}/`
    : `Dirección en el sitio: /${id}/ (no se podrá cambiar después)`;
}

function pintarEleccion() {
  // Todas las fotos conocidas: las del sitio y las recién subidas.
  const rutas = [...new Set([edicionCategoria.foto, ...vistasLocales.keys(), ...productos.flatMap((p) => p.fotos.map((f) => f.src)), ...Object.keys(miniaturas)])].filter(
    Boolean,
  );
  $('[data-eleccion]').replaceChildren(
    ...rutas.map((ruta) =>
      el(
        'button',
        {
          type: 'button',
          class: 'eleccion',
          role: 'radio',
          'aria-checked': String(ruta === edicionCategoria.foto),
          'aria-label': ruta.split('/').pop(),
          onclick: () => {
            edicionCategoria.foto = ruta;
            pintarEleccion();
          },
        },
        miniatura(ruta),
      ),
    ),
  );
}

async function guardarCategoria(evento: SubmitEvent) {
  evento.preventDefault();
  const form = formularioCategoria();
  const valor = (nombre: string) => (form.elements.namedItem(nombre) as HTMLInputElement).value.trim();
  const nombre = valor('nombre');
  const corto = valor('corto');
  if (!nombre || !corto) return aviso('Escribe el nombre completo y el nombre corto.', 'error');
  if (!edicionCategoria.foto) return aviso('Elige o sube una foto para la sección.', 'error');

  const datos = {
    nombre,
    corto,
    descripcion: valor('descripcion'),
    foto: edicionCategoria.foto,
    orden: Math.round(Number(valor('orden')) || 100),
  };
  const original = edicionCategoria.original;
  const consulta = original
    ? supabase.from('categorias').update(datos).eq('id', original.id).select().single()
    : supabase
        .from('categorias')
        .insert({ id: idUnico(aDireccion(corto), new Set(categorias.map((c) => c.id))), ...datos })
        .select()
        .single();
  const { data, error } = await consulta;
  if (error) return fallo(error);
  const guardada = data as Categoria;
  categorias = original ? categorias.map((c) => (c.id === original.id ? guardada : c)) : [...categorias, guardada];
  categorias.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
  publicar();
  verLista('categorias');
  aviso('Guardado. El sitio se actualiza en 1 o 2 minutos.');
}

async function eliminarCategoria() {
  const categoria = edicionCategoria.original;
  if (!categoria) return;
  if (activos().some((p) => p.categoria === categoria.id)) {
    return aviso('Esta sección todavía tiene productos. Muévelos a otra sección o elimínalos primero.', 'error');
  }
  if (activas().length === 1) return aviso('Debe quedar al menos una sección.', 'error');
  if (!confirm(`¿Eliminar la sección «${categoria.corto}»? Podrás recuperarla desde la Papelera.`)) return;
  if (!(await marcarEliminado('categorias', categoria))) return;
  verLista('categorias');
  aviso(`La sección «${categoria.corto}» se movió a la Papelera.`);
}

// ---------------------------------------------------------------- arranque

function conectarEventos() {
  $('[data-form-entrar]').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget as HTMLFormElement;
    const datos = new FormData(form);
    const boton = $<HTMLButtonElement>('button[type="submit"]', form);
    boton.disabled = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: String(datos.get('correo')).trim(),
      password: String(datos.get('contrasena')),
    });
    boton.disabled = false;
    if (error) return aviso('Correo o contraseña incorrectos.', 'error');
    form.reset();
    await entrarAlPanel();
  });

  $('[data-olvide]').addEventListener('click', () => mostrar('recuperar'));
  $('[data-form-recuperar]').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const correo = String(new FormData(evento.currentTarget as HTMLFormElement).get('correo')).trim();
    await supabase.auth.resetPasswordForEmail(correo, { redirectTo: location.origin + location.pathname });
    // Mismo mensaje exista o no la cuenta, para no revelar qué correos tienen acceso.
    aviso('Si ese correo tiene acceso, te llegará un enlace en unos minutos.');
    mostrar('entrar');
  });

  $('[data-form-contrasena]').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget as HTMLFormElement);
    const contrasena = String(datos.get('contrasena'));
    if (contrasena.length < 10) return aviso('Usa al menos 10 caracteres.', 'error');
    if (contrasena !== String(datos.get('repetida'))) return aviso('Las contraseñas no coinciden.', 'error');
    const { error } = await supabase.auth.updateUser({ password: contrasena });
    if (error) return aviso('No se pudo guardar la contraseña. Pide un enlace nuevo.', 'error');
    aviso('Contraseña guardada.');
    await entrarAlPanel();
  });

  for (const boton of document.querySelectorAll('[data-ir]')) {
    boton.addEventListener('click', () => mostrar((boton as HTMLElement).dataset.ir!));
  }
  for (const boton of document.querySelectorAll('[data-salir]')) {
    boton.addEventListener('click', async () => {
      salidaVoluntaria = true;
      // "local": cierra la sesión en este navegador aunque el servidor no responda.
      await supabase.auth.signOut({ scope: 'local' });
      salidaVoluntaria = false;
      mostrar('entrar');
    });
  }
  $('[data-reintentar]').addEventListener('click', () => location.reload());
  for (const boton of document.querySelectorAll<HTMLElement>('[data-pestana]')) {
    boton.addEventListener('click', () => verLista(boton.dataset.pestana as typeof pestana));
  }
  for (const boton of document.querySelectorAll('[data-volver]')) {
    boton.addEventListener('click', () => verLista(pestana));
  }

  $('[data-nuevo="producto"]').addEventListener('click', () => {
    if (!activas().length) return aviso('Primero crea una sección en «Secciones».', 'error');
    abrirProducto();
  });
  $('[data-nuevo="categoria"]').addEventListener('click', () => abrirCategoria());

  const form = formularioProducto();
  form.addEventListener('submit', guardarProducto);
  (form.elements.namedItem('nombre') as HTMLInputElement).addEventListener('input', actualizarDireccionProducto);
  (form.elements.namedItem('categoria') as HTMLSelectElement).addEventListener('change', actualizarDireccionProducto);
  $('[data-eliminar]', form).addEventListener('click', eliminarProducto);
  $('[data-agregar-opcion]').addEventListener('click', () => {
    edicion.opciones.push({ nombre: '' });
    pintarOpciones();
    $<HTMLInputElement>('[data-opciones] li:last-child input').focus();
  });
  const entradaFotos = $<HTMLInputElement>('[data-subir-fotos]');
  entradaFotos.addEventListener('change', async () => {
    if (entradaFotos.files?.length) await agregarFotos(entradaFotos.files);
    entradaFotos.value = '';
  });

  const formCategoria = formularioCategoria();
  formCategoria.addEventListener('submit', guardarCategoria);
  (formCategoria.elements.namedItem('corto') as HTMLInputElement).addEventListener('input', actualizarDireccionCategoria);
  $('[data-eliminar]', formCategoria).addEventListener('click', eliminarCategoria);
  const entradaFotoCategoria = $<HTMLInputElement>('[data-subir-foto-categoria]');
  entradaFotoCategoria.addEventListener('change', async () => {
    const archivo = entradaFotoCategoria.files?.[0];
    entradaFotoCategoria.value = '';
    if (!archivo) return;
    aviso(`Subiendo «${archivo.name}»…`);
    try {
      edicionCategoria.foto = await subirFoto(archivo, (formCategoria.elements.namedItem('corto') as HTMLInputElement).value || 'seccion');
      pintarEleccion();
      aviso('Foto agregada. Recuerda guardar la sección.');
    } catch (e) {
      aviso((e as Error).message, 'error');
    }
  });

  // Evita perder cambios al cerrar la pestaña mientras se sube una foto.
  window.addEventListener('beforeunload', (evento) => {
    if (edicion.subiendo > 0) evento.preventDefault();
  });
}

export async function iniciarPanel() {
  // Contra el "clickjacking": el sitio ya manda el encabezado que prohíbe
  // mostrarlo dentro de un marco (public/_headers). Por si acaso, el panel
  // tampoco arranca (no lee la sesión ni muestra el formulario) si está en uno.
  if (window.top !== window.self) return mostrar('en-marco');

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const clave = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  try {
    miniaturas = JSON.parse($('[data-miniaturas]').textContent || '{}');
  } catch {
    miniaturas = {};
  }
  if (!url || !clave) {
    mostrar('entrar');
    return aviso('Falta configurar la base de datos (PUBLIC_SUPABASE_URL en .env).', 'error');
  }

  // Los enlaces de invitación y de "olvidé mi contraseña" llegan con datos en la dirección.
  const enlace = new URLSearchParams(location.hash.slice(1));
  const tipoEnlace = enlace.get('type');
  const errorEnlace = enlace.get('error_description');

  // ¿Había una sesión guardada en este navegador? Si al arrancar ya no sirve,
  // se explica con la pantalla 401 en vez de mostrar el formulario sin más.
  let habiaSesion = false;
  try {
    habiaSesion = Object.keys(localStorage).some((clave) => /^sb-.+-auth-token$/.test(clave));
  } catch {
    // Sin acceso al almacenamiento: se trata como si no hubiera sesión.
  }

  supabase = createClient(url, clave, {
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true },
    global: { fetch: fetchConLimite },
  });
  conectarEventos();
  supabase.auth.onAuthStateChange((evento) => {
    if (evento === 'PASSWORD_RECOVERY') mostrar('contrasena');
    // La sesión se cerró sola a mitad del trabajo (venció y no se pudo renovar).
    if (evento === 'SIGNED_OUT' && !salidaVoluntaria && !$('[data-vista="panel"]').hidden) mostrar('error-401');
  });

  const { data } = await supabase.auth.getSession();
  if (location.hash) history.replaceState(null, '', location.pathname);

  if (errorEnlace) {
    mostrar('entrar');
    return aviso('El enlace ya no es válido o ya se usó. Pide uno nuevo con «¿Olvidaste tu contraseña?».', 'error');
  }
  if (data.session && (tipoEnlace === 'invite' || tipoEnlace === 'recovery')) return mostrar('contrasena');
  if (data.session) return entrarAlPanel();
  mostrar(habiaSesion ? 'error-401' : 'entrar');
}
