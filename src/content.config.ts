import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { leerTabla } from './lib/basedatos';
import { existeImagen } from './lib/imagenes';

// Ruta de una foto dentro de src/assets/, por ejemplo
// "/src/assets/productos/rosa-eterna-1.jpg".
const foto = z.string().refine(existeImagen, {
  error: (problema) => `No se encontró la foto "${String(problema.input)}" dentro de src/assets/.`,
});

// Secciones y productos viven en la base de datos (Supabase) y se editan
// desde el panel en /admin/. Se leen cada vez que se publica el sitio.
const categorias = defineCollection({
  loader: () => leerTabla('categorias', 'orden,nombre'),
  schema: z.object({
    nombre: z.string(),
    corto: z.string(),
    descripcion: z.string(),
    foto,
    orden: z.number(),
  }),
});

const productos = defineCollection({
  loader: () => leerTabla('productos', 'orden,nombre'),
  schema: z.object({
    nombre: z.string(),
    categoria: z.string(),
    // Texto corto que se ve en la tarjeta del catálogo.
    resumen: z.string(),
    precio: z.number().positive(),
    descripcion: z.string(),
    // La primera es la de la tarjeta.
    fotos: z.array(z.object({ src: foto, alt: z.string().optional() })).min(1),
    // Datos que el cliente escribe antes de pedir (color, carritos...).
    opciones: z.array(z.object({ nombre: z.string(), ejemplo: z.string().optional() })),
    disponible: z.boolean(),
    // Aparece en "Destacados" en la portada.
    destacado: z.boolean(),
    // Posición dentro de su sección: el número más bajo va primero.
    orden: z.number(),
  }),
});

// Páginas de texto editables (por ahora, el aviso de privacidad).
const paginas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    actualizado: z.coerce.date(),
  }),
});

export const collections = { categorias, productos, paginas };
