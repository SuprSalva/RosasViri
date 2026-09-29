// Lee y valida los datos que se editan desde el panel de administración
// (archivos .json de esta carpeta). Si algo está mal escrito, la publicación
// se detiene con un mensaje que dice qué corregir, en lugar de publicar un
// sitio roto.

import { z } from 'astro/zod';
import { existeImagen } from '../lib/imagenes';
import datosTienda from './tienda.json';
import datosCategorias from './categorias.json';
import datosPortada from './portada.json';
import datosComoPedir from './como-pedir.json';
import datosPersonalizados from './personalizados.json';
import datosGaleria from './galeria.json';
import datosOpiniones from './opiniones.json';

const opcional = <T extends z.ZodType>(esquema: T) => z.union([z.literal(''), esquema]).default('');

const foto = z.string().refine(existeImagen, {
  error: (problema) => `No se encontró la foto "${String(problema.input)}" dentro de src/assets/.`,
});

const esquemaTienda = z.object({
  nombre: z.string().min(1),
  lema: z.string(),
  descripcion: z.string(),
  // Solo dígitos, con código de país (México: 52 + 10 dígitos).
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v === '' || (v.length >= 11 && v.length <= 15), {
      message: 'El WhatsApp debe llevar código de país: en México, 52 seguido de los 10 dígitos.',
    }),
  correo: opcional(z.email('El correo no es válido.')),
  redes: z.object({
    instagram: opcional(z.url()),
    tiktok: opcional(z.url()),
    facebook: opcional(z.url()),
  }),
  moneda: z.string().length(3),
  google: z.object({
    indexar: z.boolean(),
    // Se acepta el código solo o la etiqueta <meta> completa que da Search Console.
    verificacion: z
      .string()
      .default('')
      .transform((v) => v.match(/content=["']([^"']+)["']/)?.[1] ?? v.trim()),
    analytics: opcional(
      z.string().regex(/^G-[A-Z0-9]+$/, 'El ID de Google Analytics empieza con "G-", por ejemplo G-ABC123XYZ.'),
    ),
  }),
  responsable: z.object({
    nombre: z.string().default(''),
    domicilio: z.string().default(''),
  }),
});

const esquemaCategorias = z.object({
  categorias: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/, 'El id de una sección solo lleva minúsculas, números y guiones.'),
        nombre: z.string(),
        corto: z.string(),
        descripcion: z.string(),
        foto,
      }),
    )
    .min(1),
});

const texto = z.object({ titulo: z.string(), texto: z.string() });

const esquemaPortada = z.object({
  antetitulo: z.string(),
  titulo: z.string(),
  tituloCursiva: z.string().default(''),
  bajada: z.string(),
  fotos: z.array(foto).min(1).max(3),
  personalizados: texto,
});

const esquemaComoPedir = z.object({
  pasos: z.array(texto).min(1),
  preguntas: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })),
});

const esquemaPersonalizados = z.object({
  intro: z.string(),
  ideas: z.array(texto),
  ocasiones: z.array(z.string()),
  aviso: z.string().default(''),
});

const esquemaGaleria = z.object({
  fotos: z.array(
    z.object({
      foto,
      descripcion: z.string().default(''),
      fecha: z.coerce.date().optional(),
    }),
  ),
});

const esquemaOpiniones = z.object({
  opiniones: z.array(z.object({ nombre: z.string(), texto: z.string(), producto: z.string().default('') })),
});

function validar<T extends z.ZodType>(archivo: string, esquema: T, datos: unknown): z.output<T> {
  const resultado = esquema.safeParse(datos);
  if (!resultado.success) {
    const problemas = resultado.error.issues.map((i) => `  - ${i.path.join(' → ') || '(archivo)'}: ${i.message}`);
    throw new Error(`Hay un error en src/data/${archivo}:\n${problemas.join('\n')}`);
  }
  return resultado.data;
}

export const tienda = validar('tienda.json', esquemaTienda, datosTienda);
export const categorias = validar('categorias.json', esquemaCategorias, datosCategorias).categorias;
export const portada = validar('portada.json', esquemaPortada, datosPortada);
export const comoPedir = validar('como-pedir.json', esquemaComoPedir, datosComoPedir);
export const personalizados = validar('personalizados.json', esquemaPersonalizados, datosPersonalizados);
export const galeria = validar('galeria.json', esquemaGaleria, datosGaleria).fotos.sort(
  (a, b) => (b.fecha?.getTime() ?? 0) - (a.fecha?.getTime() ?? 0),
);
export const opiniones = validar('opiniones.json', esquemaOpiniones, datosOpiniones).opiniones;

export type Categoria = (typeof categorias)[number];
