import { tienda } from '../data/tienda';

/** Convierte una ruta interna ("/rosas/") en una que respeta el `base` del sitio. */
export function ruta(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpia = path.replace(/^\//, '');
  return `${base}/${limpia}`;
}

/** Enlace a WhatsApp con un mensaje ya escrito. */
export function enlaceWhatsApp(mensaje: string): string {
  const numero = tienda.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
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
  const partes = new URL(url).pathname.split('/').filter(Boolean);
  return `@${(partes[0] ?? '').replace(/^@/, '')}`;
}
