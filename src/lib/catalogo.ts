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
 * Fotos de la ficha del producto, cada una con el id de su color si es de uno
 * (si el color ya no existe, la foto queda para todos).
 */
export function galeriaDe(producto: Producto): { src: ImageMetadata; alt: string; color?: string }[] {
  const ids = new Set(producto.data.colores.map((c) => c.id));
  return producto.data.fotos.map((foto, i) => ({
    src: fotoDe(producto, i),
    alt: altFoto(producto, i),
    color: foto.color && ids.has(foto.color) ? foto.color : undefined,
  }));
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
