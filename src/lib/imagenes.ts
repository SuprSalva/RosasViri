// Fotos subidas desde el panel de administración. Se guardan en src/assets/ y
// los archivos de datos las nombran con su ruta, por ejemplo
// "/src/assets/productos/ramo-chico-de-rosas-1.jpg".

const todas = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

export function existeImagen(ruta: string): boolean {
  return `/${ruta.replace(/^\/+/, '')}` in todas;
}

export function imagen(ruta: string): ImageMetadata {
  const clave = `/${ruta.replace(/^\/+/, '')}`;
  const encontrada = todas[clave];
  if (!encontrada) {
    throw new Error(`No se encontró la foto "${ruta}". Revisa que exista dentro de src/assets/.`);
  }
  return encontrada.default;
}

/** Anchos a generar para una foto, sin pasar de su tamaño original. */
export function anchos(foto: ImageMetadata, deseados: number[]): number[] {
  const tope = Math.min(foto.width, Math.max(...deseados));
  return [...deseados.filter((w) => w < tope), tope];
}
