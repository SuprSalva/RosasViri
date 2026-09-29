import { getCollection, type CollectionEntry } from 'astro:content';
import { categorias } from '../data/tienda';
import { ruta } from './enlaces';
import { imagen } from './imagenes';

export type Producto = CollectionEntry<'productos'>;

function porOrden(a: Producto, b: Producto) {
  return a.data.orden - b.data.orden || a.data.nombre.localeCompare(b.data.nombre, 'es');
}

export async function productosDe(categoria: string): Promise<Producto[]> {
  const productos = await getCollection('productos', (p) => p.data.categoria === categoria);
  return productos.sort(porOrden);
}

/** Cada categoría con sus productos, en el orden de categorias.json. */
export async function catalogo() {
  return Promise.all(
    categorias.map(async (categoria) => {
      const productos = await productosDe(categoria.id);
      const precios = productos.map((p) => p.data.precio);
      return {
        categoria,
        productos,
        desde: precios.length ? Math.min(...precios) : undefined,
        foto: imagen(categoria.foto),
      };
    }),
  );
}

/** Productos marcados con `destacado: true`, en el orden del catálogo. */
export async function destacados(): Promise<Producto[]> {
  return (await catalogo()).flatMap((s) => s.productos.filter((p) => p.data.destacado));
}

/** Texto alternativo de una foto de producto (la descripción es opcional). */
export function altFoto(producto: Producto, indice: number): string {
  const foto = producto.data.fotos[indice];
  if (foto?.alt) return foto.alt;
  const total = producto.data.fotos.length;
  return total > 1 ? `${producto.data.nombre}, foto ${indice + 1} de ${total}` : producto.data.nombre;
}

export function urlProducto(producto: Producto): string {
  return ruta(`/${producto.data.categoria}/${producto.id}/`);
}

export function urlCategoria(id: string): string {
  return ruta(`/${id}/`);
}
