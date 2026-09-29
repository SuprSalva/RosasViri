import { tienda } from '../data/tienda';
import { urlWhatsApp } from './whatsapp';

/** Convierte una ruta interna ("/rosas/") en una que respeta el `base` del sitio. */
export function ruta(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpia = path.replace(/^\//, '');
  return `${base}/${limpia}`;
}

/** Enlace a WhatsApp de la tienda con un mensaje ya escrito. */
export function enlaceWhatsApp(mensaje: string): string {
  return urlWhatsApp(tienda.whatsapp, mensaje);
}

export function mensajePedido(producto?: { nombre: string; precio: number }): string {
  const saludo = `Hola ${tienda.nombre} 🌷`;
  if (!producto) return `${saludo} Quiero hacer un pedido.`;
  return `${saludo} Quiero pedir: *${producto.nombre}* (${precio(producto.precio)}).`;
}

export function precio(valor: number): string {
  return `$${valor.toLocaleString('es-MX')}`;
}

/** "@usuario" a partir del enlace de una red social. */
export function usuarioDe(url: string): string {
  const usuario = (new URL(url).pathname.split('/').filter(Boolean)[0] ?? '').replace(/^@/, '');
  // Perfiles sin nombre de usuario (por ejemplo facebook.com/profile.php?id=...).
  if (!usuario || usuario.endsWith('.php')) return 'Ver perfil';
  return `@${usuario}`;
}
