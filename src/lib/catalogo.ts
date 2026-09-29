import { getCollection, type CollectionEntry } from 'astro:content';
import { categorias } from '../data/tienda';
import { ruta } from './enlaces';

export type Producto = CollectionEntry<'productos'>;

function porOrden(a: Producto, b: Producto) {
  return a.data.orden - b.data.orden || a.data.nombre.localeCompare(b.data.nombre, 'es');
}

export async function productosDe(categoria: string): Promise<Producto[]> {
  const productos = await getCollection('productos', (p) => p.data.categoria === categoria);
  return productos.sort(porOrden);
}

/** Cada categoría con sus productos, en el orden definido en tienda.ts. */
export async function catalogo() {
  return Promise.all(
    categorias.map(async (categoria) => ({ categoria, productos: await productosDe(categoria.id) })),
  );
}

export function urlProducto(producto: Producto): string {
  return ruta(`/${producto.data.categoria}/${producto.id}/`);
}

export function urlCategoria(id: string): string {
  return ruta(`/${id}/`);
}
