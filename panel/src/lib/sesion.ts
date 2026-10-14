// Entrada al panel: correo y contraseña, verificación en dos pasos, invitaciones
// y "olvidé mi contraseña".
//
// La verificación en dos pasos es obligatoria: además de la contraseña se pide
// el código de 6 números que muestra una app del celular (Google Authenticator
// u otra). Así, con una contraseña robada no basta para entrar. Se pide una
// vez por inicio de sesión: la sesión se queda abierta en ese navegador.

import { $ } from './dom';
import { aviso, conectar, detalleDe, errorServidor, mostrar, sesionVencida, supabase } from './comun';

type ErrorCuenta = { code?: string; status?: number; message?: string };

/** Lo que se hace al terminar de entrar (abrir el panel). */
let alEntrar: () => void | Promise<void> = () => {};
/** El enlace del correo pidió crear la contraseña (invitación) o cambiarla (olvidé mi contraseña). */
let crearContrasena = false;
// Se recuerda en la pestaña: si la página se recarga antes de guardarla, se
// vuelve a pedir (si no, una invitación quedaría sin contraseña).
const CLAVE_CREAR_CONTRASENA = 'rv-crear-contrasena';
/** La app de códigos con la que se entra o la que se está activando. */
let factor = '';
/** La clave para activar la app a mano (sin espacios), para copiarla. */
let claveApp = '';
// Para distinguir "Salir" de una sesión que se cerró sola.
let salidaVoluntaria = false;

/** Sin respuesta del servidor de cuentas (sin internet o en pausa): no trae código HTTP. */
function sinConexion(error: ErrorCuenta): boolean {
  return !error.status;
}

function demasiadosIntentos(error: ErrorCuenta): boolean {
  return error.status === 429 || error.code === 'over_request_rate_limit';
}

function pedirContrasena(pedir: boolean) {
  crearContrasena = pedir;
  try {
    if (pedir) sessionStorage.setItem(CLAVE_CREAR_CONTRASENA, '1');
    else sessionStorage.removeItem(CLAVE_CREAR_CONTRASENA);
  } catch {
    // Sin acceso al almacenamiento: solo se recuerda mientras no se recargue.
  }
}

function contrasenaPendiente(): boolean {
  try {
    return sessionStorage.getItem(CLAVE_CREAR_CONTRASENA) === '1';
  } catch {
    return false;
  }
}

/**
 * Decide qué pantalla toca según la sesión: el código de la app, crear la
 * contraseña, activar la verificación en dos pasos o, al final, el panel.
 */
async function continuar() {
  const { data, error: errorUsuario } = await supabase.auth.getUser();
  if (!data.user) {
    // Sin conexión no se sabe si la sesión sigue: mejor decirlo que pedir entrar.
    if (errorUsuario && sinConexion(errorUsuario)) return errorServidor('No hubo respuesta del servidor de cuentas.');
    // Había sesión guardada pero ya no es válida (venció o se cerró en otro lado).
    return mostrar('error-401');
  }
  for (const nodo of document.querySelectorAll('[data-correo]')) nodo.textContent = data.user.email ?? '';

  const { data: nivel, error: errorNivel } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (errorNivel) return errorServidor(detalleDe(errorNivel));
  // Ya tiene la app activada: falta el código de este inicio de sesión. Va
  // antes que todo, también antes de cambiar la contraseña (Supabase no deja
  // cambiarla sin el código).
  if (nivel.currentLevel !== 'aal2' && nivel.nextLevel === 'aal2') return pedirCodigo();
  if (crearContrasena) return mostrar('contrasena');

  const { data: esAdmin, error } = await supabase.rpc('es_admin');
  if (error) return sesionVencida(error) ? mostrar('error-401') : errorServidor(detalleDe(error));
  if (esAdmin !== true) return mostrar('sin-permiso');

  if (nivel.currentLevel !== 'aal2') return activarVerificacion();
  await alEntrar();
}

async function pedirCodigo() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) return sesionVencida(error) ? mostrar('error-401') : errorServidor(detalleDe(error));
  factor = data.totp[0]?.id ?? '';
  if (!factor) return activarVerificacion();
  $<HTMLFormElement>('[data-form-codigo]').reset();
  mostrar('codigo');
}

async function activarVerificacion() {
  const { data: lista, error: errorLista } = await supabase.auth.mfa.listFactors();
  if (errorLista) return sesionVencida(errorLista) ? mostrar('error-401') : errorServidor(detalleDe(errorLista));
  // Un intento anterior sin terminar (se cerró la página antes de escribir el
  // código) no sirve y estorba para crear el nuevo: se quita.
  for (const viejo of lista.all) {
    if (viejo.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: viejo.id });
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Panel de Rossvtienda',
    issuer: 'Rossvtienda',
  });
  if (error) return sesionVencida(error) ? mostrar('error-401') : errorServidor(detalleDe(error));
  factor = data.id;
  claveApp = data.totp.secret;
  $<HTMLImageElement>('[data-qr]').src = data.totp.qr_code;
  $<HTMLAnchorElement>('[data-abrir-app]').href = data.totp.uri;
  // En grupos de 4 para copiarla a mano sin perderse.
  $('[data-clave-app]').textContent = claveApp.match(/.{1,4}/g)?.join(' ') ?? claveApp;
  $<HTMLFormElement>('[data-form-activar]').reset();
  mostrar('activar');
}

/** Revisa el código de la app; si es correcto, la sesión queda verificada. */
async function verificarCodigo(evento: SubmitEvent) {
  evento.preventDefault();
  const form = evento.currentTarget as HTMLFormElement;
  const codigo = String(new FormData(form).get('codigo')).replace(/\D/g, '');
  if (codigo.length !== 6) return aviso('Escribe los 6 números que aparecen en tu app.', 'error');

  const boton = $<HTMLButtonElement>('button[type="submit"]', form);
  boton.disabled = true;
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor, code: codigo });
  boton.disabled = false;
  if (error) {
    if (error.code === 'mfa_verification_failed') {
      return aviso('Ese código no es correcto o ya cambió. Escribe el que aparece ahora en tu app.', 'error');
    }
    if (demasiadosIntentos(error)) return aviso('Demasiados intentos. Espera unos minutos y vuelve a intentarlo.', 'error');
    if (sesionVencida(error)) return mostrar('error-401');
    return aviso('No se pudo revisar el código. Revisa tu conexión e intenta de nuevo.', 'error');
  }
  form.reset();
  if (form.matches('[data-form-activar]')) aviso('Listo: la verificación en dos pasos quedó activada.');
  await continuar();
}

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
    if (error) {
      if (demasiadosIntentos(error)) return aviso('Demasiados intentos. Espera unos minutos y vuelve a intentarlo.', 'error');
      if (sinConexion(error)) return aviso('No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.', 'error');
      return aviso('Correo o contraseña incorrectos.', 'error');
    }
    form.reset();
    await continuar();
  });

  $('[data-olvide]').addEventListener('click', () => mostrar('recuperar'));
  $('[data-form-recuperar]').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget as HTMLFormElement;
    const correo = String(new FormData(form).get('correo')).trim();
    const { error } = await supabase.auth.resetPasswordForEmail(correo, { redirectTo: location.origin + location.pathname });
    if (error && (demasiadosIntentos(error) || error.code === 'over_email_send_rate_limit')) {
      return aviso('Ya se mandaron varios correos hace poco. Espera un rato y vuelve a intentarlo.', 'error');
    }
    // Mismo mensaje exista o no la cuenta, para no revelar qué correos tienen acceso.
    form.reset();
    aviso('Si ese correo tiene acceso, te llegará un enlace en unos minutos.');
    mostrar('entrar');
  });

  $('[data-form-contrasena]').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget as HTMLFormElement;
    const datos = new FormData(form);
    const contrasena = String(datos.get('contrasena'));
    if (contrasena.length < 10) return aviso('Usa al menos 10 caracteres.', 'error');
    if (contrasena !== String(datos.get('repetida'))) return aviso('Las contraseñas no coinciden.', 'error');
    const boton = $<HTMLButtonElement>('button[type="submit"]', form);
    boton.disabled = true;
    const { error } = await supabase.auth.updateUser({ password: contrasena });
    boton.disabled = false;
    if (error) {
      if (error.code === 'weak_password') {
        return aviso('Esa contraseña es muy fácil de adivinar. Usa una más larga o con más variedad.', 'error');
      }
      if (error.code === 'same_password') return aviso('Es la misma contraseña de antes. Escribe una nueva.', 'error');
      if (sesionVencida(error)) return mostrar('error-401');
      return aviso('No se pudo guardar la contraseña. Pide un enlace nuevo.', 'error');
    }
    form.reset();
    pedirContrasena(false);
    aviso('Contraseña guardada.');
    await continuar();
  });

  $('[data-form-codigo]').addEventListener('submit', verificarCodigo);
  $('[data-form-activar]').addEventListener('submit', verificarCodigo);
  $('[data-copiar-clave]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(claveApp);
      aviso('Clave copiada. Pégala en tu app de códigos.');
    } catch {
      aviso('No se pudo copiar. Escríbela a mano en tu app.', 'error');
    }
  });

  for (const boton of document.querySelectorAll('[data-ir]')) {
    boton.addEventListener('click', () => mostrar((boton as HTMLElement).dataset.ir!));
  }
  for (const boton of document.querySelectorAll('[data-salir]')) {
    boton.addEventListener('click', async () => {
      salidaVoluntaria = true;
      pedirContrasena(false);
      // "local": cierra la sesión en este navegador aunque el servidor no responda.
      await supabase.auth.signOut({ scope: 'local' });
      salidaVoluntaria = false;
      mostrar('entrar');
    });
  }
  $('[data-reintentar]').addEventListener('click', () => location.reload());
}

/** Arranca el panel: revisa la sesión y muestra la pantalla que toca. */
export async function iniciar(entrar: () => void | Promise<void>) {
  alEntrar = entrar;
  // Contra el "clickjacking": Cloudflare ya manda el encabezado que prohíbe
  // mostrar el panel dentro de un marco (public/_headers). Por si acaso, el
  // panel tampoco arranca (no lee la sesión ni muestra el formulario) si está en uno.
  if (window.top !== window.self) return mostrar('en-marco');

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

  if (!conectar()) {
    mostrar('entrar');
    return aviso('Falta configurar la base de datos (PUBLIC_SUPABASE_URL en .env).', 'error');
  }
  conectarEventos();
  supabase.auth.onAuthStateChange((evento) => {
    // La sesión se cerró sola a mitad del trabajo (venció y no se pudo renovar).
    if (evento === 'SIGNED_OUT' && !salidaVoluntaria && !$('[data-vista="panel"]').hidden) mostrar('error-401');
  });

  const { data } = await supabase.auth.getSession();
  // Quita de la barra lo que traía el enlace (Supabase a veces deja un "#" suelto).
  if (location.href.includes('#')) history.replaceState(null, '', location.pathname);

  if (errorEnlace) {
    mostrar('entrar');
    return aviso('El enlace ya no es válido o ya se usó. Pide uno nuevo con «¿Olvidaste tu contraseña?».', 'error');
  }
  if (!data.session) pedirContrasena(false);
  else if (tipoEnlace === 'invite' || tipoEnlace === 'recovery') pedirContrasena(true);
  else crearContrasena = contrasenaPendiente();
  if (data.session) return continuar();
  mostrar(habiaSesion ? 'error-401' : 'entrar');
}
