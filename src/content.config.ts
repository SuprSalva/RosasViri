import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import datosCategorias from './data/categorias.json';

const ids = datosCategorias.categorias.map((c) => c.id) as [string, ...string[]];

const productos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/productos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      categoria: z.enum(ids),
      // Texto corto que se ve en la tarjeta del catálogo.
      resumen: z.string().optional(),
      precio: z.number().positive(),
      // Fotos en src/assets/productos/. La primera es la de la tarjeta.
      fotos: z
        .array(z.object({ src: image(), alt: z.string().optional() }))
        .min(1),
      // Datos que el cliente escribe antes de pedir (color, carritos...).
      opciones: z
        .array(z.object({ nombre: z.string(), ejemplo: z.string().optional() }))
        .default([]),
      disponible: z.boolean().default(true),
      // Aparece en "Destacados" en la portada.
      destacado: z.boolean().default(false),
      // Posición dentro de su sección: el número más bajo va primero.
      orden: z.number().default(100),
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

export const collections = { productos, paginas };
