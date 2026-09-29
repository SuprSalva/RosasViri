// Datos generales de la tienda. Aquí se cambian el WhatsApp, las redes y las
// categorías del catálogo. Los productos están en src/content/productos/.

export const tienda = {
  nombre: 'Rossvtienda',
  usuario: '@rossvtienda',
  lema: 'Flores de listón satinado hechas a mano',
  descripcion:
    'Rosas eternas, girasoles y ramos con carritos Hot Wheels, hechos a mano con listón satinado.',

  // POR CONFIRMAR: número de WhatsApp para pedidos, solo dígitos y con código
  // de país. En México es 52 + los 10 dígitos, por ejemplo '5215512345678' o
  // '525512345678'. Mientras esté vacío, el botón de WhatsApp deja que la
  // persona elija a quién mandar el mensaje.
  whatsapp: '',

  // POR CONFIRMAR: correo de contacto. Si queda vacío no se muestra.
  correo: '',

  // POR CONFIRMAR: se tomaron del usuario @rossvtienda de Beacons.
  // Si un enlace queda vacío, su ícono no se muestra.
  redes: {
    tiktok: 'https://www.tiktok.com/@rossvtienda',
    instagram: 'https://www.instagram.com/rossvtienda/',
  },

  // POR CONFIRMAR: moneda de los precios (se usa para Google).
  moneda: 'MXN',

  // Dejar en false mientras el sitio esté en prueba: así Google no lo indexa.
  // Cambiar a true el día del lanzamiento con el dominio propio.
  indexar: false,
};

// Secciones del catálogo, en el orden en que aparecen en el inicio.
// El `id` es la dirección de la sección (por ejemplo /rosas/) y es el valor
// que va en el campo `categoria` de cada producto.
export const categorias = [
  {
    id: 'rosas',
    nombre: 'Rosas de listón satinado',
    corto: 'Rosas',
    descripcion: 'Rosas eternas con el color que elijas.',
  },
  {
    id: 'girasoles',
    nombre: 'Girasoles de listón satinado',
    corto: 'Girasoles',
    descripcion: 'Girasoles que no se marchitan.',
  },
  {
    id: 'hot-wheels',
    nombre: 'Ramos de Hot Wheels y flores de listón',
    corto: 'Hot Wheels',
    descripcion: 'Carritos y color de rosas a elegir.',
  },
] as const;

export type CategoriaId = (typeof categorias)[number]['id'];
