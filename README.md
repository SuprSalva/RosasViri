# Rossvtienda

Sitio web de **Rossvtienda** (flores de listón satinado y ramos con carritos Hot Wheels), que
sustituye a la página de Beacons `beacons.ai/rossvtienda`. El plan completo está en
[`PLAN_DE_TRABAJO.md`](PLAN_DE_TRABAJO.md).

Los pedidos se hacen por WhatsApp: cada producto tiene un botón que abre el chat con un mensaje
ya escrito (producto, precio y las opciones que el cliente eligió).

## Cambiar datos de la tienda

Todo está en [`src/data/tienda.ts`](src/data/tienda.ts): número de WhatsApp, correo, redes
sociales y las secciones del catálogo. Los datos marcados con `POR CONFIRMAR` hay que revisarlos
antes del lanzamiento.

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
orden: 2                      # posición dentro de su sección
---
Descripción del producto.
```

- **Cambiar un precio:** edita `precio`.
- **Producto agotado:** pon `disponible: false`. No hace falta borrarlo.
- **Más fotos:** agrega más elementos a `fotos`. La página del producto las muestra en carrusel.

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
