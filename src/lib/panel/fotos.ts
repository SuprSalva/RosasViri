// Prepara una foto antes de subirla: la gira según la cámara, la reduce a un
// tamaño razonable y la guarda como JPG. De paso se borran los datos ocultos
// de la foto (como la ubicación GPS del celular). También deja soltar fotos
// arrastradas desde la computadora.

const LADO_MAXIMO = 1600;
const CALIDAD = 0.86;

export async function prepararFoto(archivo: File): Promise<{ base64: string; vista: string }> {
  let imagen: ImageBitmap;
  try {
    imagen = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(`No se pudo abrir "${archivo.name}". Usa fotos JPG, PNG o WebP.`);
  }
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  const contexto = lienzo.getContext('2d');
  if (!contexto) throw new Error('Este navegador no puede preparar la foto.');
  // Fondo claro por si la foto tiene partes transparentes (PNG).
  contexto.fillStyle = '#ffffff';
  contexto.fillRect(0, 0, lienzo.width, lienzo.height);
  contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  imagen.close();

  const blob = await new Promise<Blob | null>((listo) => lienzo.toBlob(listo, 'image/jpeg', CALIDAD));
  if (!blob) throw new Error('No se pudo preparar la foto.');
  return { base64: await aBase64(blob), vista: URL.createObjectURL(blob) };
}

/** ¿Lo que se arrastra son archivos de la computadora (y no texto o una imagen de otra página)? */
export function traeArchivos(evento: DragEvent): boolean {
  return evento.dataTransfer?.types.includes('Files') ?? false;
}

/**
 * Deja soltar fotos sobre `zona`, arrastrándolas desde una carpeta de la
 * computadora: es lo mismo que elegirlas con el botón. Mientras se arrastran
 * encima, la zona lleva la clase "soltando" para que se note dónde caen.
 */
export function zonaParaSoltar(zona: HTMLElement, alSoltar: (archivos: File[]) => void) {
  // dragenter y dragleave también saltan al pasar sobre lo que hay dentro de
  // la zona, así que se cuentan para saber cuándo de verdad salió.
  let encima = 0;
  const salir = () => {
    encima = 0;
    zona.classList.remove('soltando');
  };
  zona.addEventListener('dragenter', (evento) => {
    if (!traeArchivos(evento)) return;
    encima++;
    zona.classList.add('soltando');
  });
  zona.addEventListener('dragover', (evento) => {
    if (!traeArchivos(evento)) return;
    evento.preventDefault();
    evento.dataTransfer!.dropEffect = 'copy';
  });
  zona.addEventListener('dragleave', (evento) => {
    if (traeArchivos(evento) && --encima <= 0) salir();
  });
  zona.addEventListener('drop', (evento) => {
    if (!traeArchivos(evento)) return;
    evento.preventDefault();
    salir();
    const archivos = [...evento.dataTransfer!.files];
    if (archivos.length) alSoltar(archivos);
  });
}

function aBase64(blob: Blob): Promise<string> {
  return new Promise((listo, fallo) => {
    const lector = new FileReader();
    lector.onload = () => listo(String(lector.result).split(',')[1] ?? '');
    lector.onerror = () => fallo(new Error('No se pudo leer la foto.'));
    lector.readAsDataURL(blob);
  });
}
