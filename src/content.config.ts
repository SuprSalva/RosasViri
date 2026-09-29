import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categorias } from './data/tienda';

const ids = categorias.map((c) => c.id) as [string, ...string[]];

const productos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/productos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      categoria: z.enum(ids),
      // Texto corto que se ve en la tarjeta del catálogo.
      resumen: z.string().optional(),
      precio: z.number().positive(),
      fotos: z
        .array(z.object({ src: image(), alt: z.string() }))
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

export const collections = { productos };
