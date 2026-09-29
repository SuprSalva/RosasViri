# Rossvtienda

Sitio web de **Rossvtienda** (flores de listón satinado y ramos con carritos Hot Wheels), que
sustituye a la página de Beacons `beacons.ai/rossvtienda`. El plan completo está en
[`PLAN_DE_TRABAJO.md`](PLAN_DE_TRABAJO.md).

Los pedidos se hacen por WhatsApp: cada producto tiene un botón que abre el chat con un mensaje
ya escrito (producto, precio y las opciones que el cliente eligió).

## Páginas

| Página | Dirección | Qué tiene |
|---|---|---|
| Inicio | `/` | Portada, secciones del catálogo, destacados, personalizados, cómo pedir y redes |
| Catálogo | `/catalogo/` | Todos los productos por sección |
| Sección | `/rosas/`, `/girasoles/`, `/hot-wheels/` | Productos de una sección |
| Producto | `/rosas/ramo-chico-de-rosas/` | Fotos, precio, opciones y botón de WhatsApp |
| Personalizados | `/pedidos-personalizados/` | Formulario que arma un mensaje de WhatsApp con la idea del cliente |
| Galería | `/galeria/` | Ramos entregados, fotos del catálogo y opiniones de clientes |
| Cómo pedir | `/como-pedir/` | Pasos y preguntas frecuentes |
| Contacto | `/contacto/` | WhatsApp, Instagram, TikTok y correo |

Tipografías: **Playfair Display** (títulos) y **Lato** (texto).

## Cambiar datos de la tienda

Todo está en [`src/data/tienda.ts`](src/data/tienda.ts): número de WhatsApp, correo, redes
sociales y las secciones del catálogo (con la foto que representa a cada una en la portada). Los
datos marcados con `POR CONFIRMAR` hay que revisarlos antes del lanzamiento.

## Agregar o editar productos

Cada producto es un archivo en [`src/content/productos/`](src/content/productos/), y sus fotos
van en [`src/content/productos/fotos/`](src/content/productos/fotos/).

Para agregar un producto, copia un archivo existente, cámbiale el nombre (el nombre del archivo
es la dirección de la página, por ejemplo `ramo-chico-de-rosas.md` →
`/rosas/ramo-chico-de-rosas/`) y edita los datos:

```md
---
nombre: Ramo chico de rosas
categoria: rosas              # rosas, girasoles o hot-wheels
resumen: Rosas clásicas       # texto corto de la tarjeta (opcional)
precio: 220
fotos:                        # la primera es la de la tarjeta
  - src: ./fotos/ramo-chico-de-rosas-1.jpg
    alt: Ramo de 7 rosas color durazno envuelto en papel blanco
opciones:                     # lo que el cliente escribe antes de pedir (opcional)
  - nombre: Color de rosas
    ejemplo: durazno, rojo, azul...
disponible: true              # false muestra "Agotado"
destacado: true               # aparece en "Destacados" en la portada
orden: 2                      # posición dentro de su sección
---
Descripción del producto.
```

- **Cambiar un precio:** edita `precio`.
- **Producto agotado:** pon `disponible: false`. No hace falta borrarlo.
- **Más fotos:** agrega más elementos a `fotos`. La página del producto las muestra en carrusel.

## Galería y opiniones

- **Fotos de ramos entregados:** súbelas a [`src/content/galeria/`](src/content/galeria/). El nombre
  del archivo es la descripción de la foto, por ejemplo `2026-10-05-ramo-rosas-rojas.jpg` (si
  empieza con la fecha, las más nuevas salen primero). Mientras la carpeta esté vacía, esa
  sección no aparece.
- **Opiniones de clientes:** agrégalas en [`src/data/opiniones.ts`](src/data/opiniones.ts). Solo
  opiniones reales y con permiso de quien las escribió.

Se puede editar desde la web de GitHub (botón de lápiz en cada archivo). Al guardar en `main`,
el sitio se vuelve a publicar solo en uno o dos minutos.

> Las fotos actuales son **provisionales**: se recortaron de capturas de pantalla de Beacons.
> Hay que reemplazarlas por las fotos originales, con el mismo nombre de archivo.

## Trabajar en la computadora

Requiere Node.js 22 o más reciente.

```sh
npm install
npm run dev       # vista previa en http://localhost:4321/RosasViri/
npm run check     # revisa errores
npm run build     # genera el sitio en dist/
```

## Publicación

El sitio se publica en GitHub Pages con [`.github/workflows/publicar.yml`](.github/workflows/publicar.yml)
cada vez que hay cambios en `main`. Para activarlo la primera vez: en GitHub, **Settings → Pages →
Source: GitHub Actions**. Quedará en https://suprsalva.github.io/RosasViri/.

Mientras el sitio esté en prueba, `indexar: false` en `src/data/tienda.ts` evita que Google lo
muestre en sus resultados.

### Conectar el dominio propio

1. En `astro.config.mjs`, cambia `site` por el dominio (por ejemplo `https://rossvtienda.com`)
   y `base` por `'/'`.
2. Crea el archivo `public/CNAME` con el dominio (por ejemplo `rossvtienda.com`).
3. En GitHub, **Settings → Pages → Custom domain**, escribe el dominio y activa HTTPS.
4. Configura el DNS del dominio según las instrucciones de GitHub Pages.
5. Cambia `indexar` a `true` en `src/data/tienda.ts`.
