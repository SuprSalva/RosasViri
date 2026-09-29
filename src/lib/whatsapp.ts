// Sin dependencias: también se usa en los scripts del navegador.

/** Enlace de WhatsApp. Sin número, WhatsApp deja elegir a quién enviarlo. */
export function urlWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
}
