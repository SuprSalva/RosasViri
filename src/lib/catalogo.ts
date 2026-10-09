import { getCollection, type CollectionEntry } from 'astro:content';
import { ruta } from './enlaces';
import { imagen } from './imagenes';

export type Producto = CollectionEntry<'productos'>;
export type Categoria = CollectionEntry<'categorias'>;

function porOrden(a: Producto | Categoria, b: Producto | Categoria) {
  return a.data.orden - b.data.orden || a.data.nombre.localeCompare(b.data.nombre, 'es');
}

/** Secciones del catálogo, en el orden elegido en el panel. */
export async function categorias(): Promise<Categoria[]> {
  return (await getCollection('categorias')).sort(porOrden);
}

export async function productosDe(categoria: string): Promise<Producto[]> {
  const productos = await getCollection('productos', (p) => p.data.categoria === categoria);
  return productos.sort(porOrden);
}

/** Cada categoría con sus productos, en el orden del panel. */
export async function catalogo() {
  return Promise.all(
    (await categorias()).map(async (categoria) => {
      const productos = await productosDe(categoria.id);
      const precios = productos.map((p) => p.data.precio);
      return {
        categoria: { id: categoria.id, ...categoria.data },
        productos,
        desde: precios.length ? Math.min(...precios) : undefined,
        foto: imagen(categoria.data.foto),
      };
    }),
  );
}

/** Productos marcados como destacados, en el orden del catálogo. */
export async function destacados(): Promise<Producto[]> {
  return (await catalogo()).flatMap((s) => s.productos.filter((p) => p.data.destacado));
}

/** Foto de un producto, lista para <Picture>. */
export function fotoDe(producto: Producto, indice: number): ImageMetadata {
  return imagen(producto.data.fotos[indice].src);
}

/** Texto alternativo de una foto de producto (la descripción es opcional). */
export function altFoto(producto: Producto, indice: number): string {
  const foto = producto.data.fotos[indice];
  if (foto?.alt) return foto.alt;
  const total = producto.data.fotos.length;
  return total > 1 ? `${producto.data.nombre}, foto ${indice + 1} de ${total}` : producto.data.nombre;
}

/**
 * Fotos de la ficha del producto: primero las suyas y después la de cada color
 * que no esté ya entre ellas. `ruta` sirve para encontrar la foto de un color.
 */
export function galeriaDe(producto: Producto): { ruta: string; src: ImageMetadata; alt: string }[] {
  const fotos = producto.data.fotos.map((foto, i) => ({ ruta: foto.src, src: fotoDe(producto, i), alt: altFoto(producto, i) }));
  for (const color of producto.data.colores) {
    if (fotos.some((foto) => foto.ruta === color.foto)) continue;
    fotos.push({ ruta: color.foto, src: imagen(color.foto), alt: `${producto.data.nombre} en ${color.nombre.toLowerCase()}` });
  }
  return fotos;
}

/** La descripción del panel, separada en párrafos por renglones en blanco. */
export function parrafos(texto: string): string[] {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function urlProducto(producto: Producto): string {
  return ruta(`/${producto.data.categoria}/${producto.id}/`);
}

export function urlCategoria(id: string): string {
  return ruta(`/${id}/`);
}
