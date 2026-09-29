import { ruta } from './enlaces';

/** Páginas del menú principal y del pie de página. */
export const menu = [
  { id: 'catalogo', texto: 'Catálogo', href: ruta('/catalogo/') },
  { id: 'personalizados', texto: 'Personalizados', href: ruta('/pedidos-personalizados/') },
  { id: 'galeria', texto: 'Galería', href: ruta('/galeria/') },
  { id: 'como-pedir', texto: 'Cómo pedir', href: ruta('/como-pedir/') },
  { id: 'contacto', texto: 'Contacto', href: ruta('/contacto/') },
];
