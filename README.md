# Rossvtienda

Sitio web de **Rossvtienda** (flores de listón satinado y ramos con carritos Hot Wheels), que
sustituye a la página de Beacons `beacons.ai/rossvtienda`. El plan completo está en
[`PLAN_DE_TRABAJO.md`](PLAN_DE_TRABAJO.md) y la auditoría de seguridad en
[`docs/auditoria-seguridad.md`](docs/auditoria-seguridad.md).

Los pedidos se hacen por WhatsApp: cada producto tiene un botón que abre el chat con un mensaje
ya escrito (producto, precio y las opciones que el cliente eligió).

## Páginas

| Página | Dirección | Qué tiene |
|---|---|---|
| Inicio | `/` | Portada, secciones del catálogo, destacados, personalizados, cómo pedir y redes |
| Catálogo | `/catalogo/` | Todos los productos por sección |
| Sección | `/rosas/`, `/girasoles/`, `/hot-wheels/` | Productos de una sección |
| Producto | `/rosas/ramo-chico-de-rosas/` | Galería de fotos, precio, opciones y botón de WhatsApp |
| Personalizados | `/pedidos-personalizados/` | Formulario que arma un mensaje de WhatsApp con la idea del cliente |
| Galería | `/galeria/` | Ramos entregados, fotos del catálogo y opiniones de clientes |
| Cómo pedir | `/como-pedir/` | Pasos y preguntas frecuentes |
| Contacto | `/contacto/` | WhatsApp, Instagram, TikTok, Facebook y correo |
| Aviso de privacidad | `/privacidad/` | Datos del responsable, uso de datos, derechos ARCO y cookies |
| Administración | `/admin/` | Cómo entrar al panel (no aparece en Google) |

Tipografías: **Playfair Display** (títulos) y **Lato** (texto).

## Panel de administración

Todo el contenido se edita desde **[Pages CMS](https://app.pagescms.org)**, un panel gratuito que
guarda los cambios en este repositorio. Cada cambio se publica solo en uno o dos minutos. La
configuración del panel está en [`.pages.yml`](.pages.yml).

Desde el panel se puede editar:

| Sección del panel | Qué se cambia | Archivo |
|---|---|---|
| Productos | Nombre, sección, precio, **varias fotos**, opciones, disponible, destacado, orden y descripción | `src/content/productos/*.md` |
| Datos de la tienda | Nombre, lema, WhatsApp, correo, redes, Google (indexación, verificación, Analytics) y responsable de los datos | `src/data/tienda.json` |
| Portada | Textos del inicio, fotos del collage y bloque de personalizados | `src/data/portada.json` |
| Secciones del catálogo | Nombres, descripciones y foto de cada sección | `src/data/categorias.json` |
| Cómo pedir | Pasos y preguntas frecuentes | `src/data/como-pedir.json` |
| Pedidos personalizados | Introducción, ideas y ocasiones del formulario | `src/data/personalizados.json` |
| Galería | Fotos de ramos entregados | `src/data/galeria.json` |
| Opiniones | Opiniones reales de clientes (con su permiso) | `src/data/opiniones.json` |
| Aviso de privacidad | Texto del aviso | `src/content/paginas/privacidad.md` |

Las fotos se guardan en [`src/assets/`](src/assets/).

### Primera vez

1. Entra a https://app.pagescms.org e inicia sesión con tu cuenta de GitHub.
2. Autoriza la app de Pages CMS para el repositorio **SuprSalva/RosasViri**.
3. Elige el repositorio y la rama **main**.

Para que otra persona (por ejemplo, quien atiende la tienda) pueda editar, necesita una cuenta de
GitHub. Invítala en **Settings → Collaborators** del repositorio. Activa la verificación en dos
pasos en todas las cuentas con acceso.

### Consejos

- **Fotos:** usa JPG, PNG o WEBP. La primera foto de un producto es la del catálogo; puedes
  arrastrarlas para cambiar el orden. Las fotos tomadas con celular pueden llevar la ubicación GPS:
  desactívala en la cámara o sube fotos que te hayas enviado por WhatsApp, que ya no la llevan.
- **Producto agotado:** desactiva "Disponible". No hace falta borrarlo.
- **Nuevas secciones del catálogo:** agregar una sección nueva (además de Rosas, Girasoles y Hot
  Wheels) requiere un cambio en `.pages.yml` para que aparezca como opción en los productos.
- **Si algo está mal escrito** (por ejemplo, un WhatsApp sin código de país o una foto que no
  existe), la publicación se detiene y el sitio anterior sigue en línea. El error aparece en la
  pestaña **Actions** de GitHub con el detalle de qué corregir.

## Aparecer en Google

El sitio ya está listo para Google: títulos y descripciones por página, sitemap, datos
estructurados de productos (con precio y fotos), rutas de navegación y datos de la tienda. La
opción "Mostrar el sitio en Google" está activada en **Datos de la tienda**.

1. Entra a [Google Search Console](https://search.google.com/search-console) y agrega una propiedad
   de tipo **Prefijo de URL** con `https://suprsalva.github.io/RosasViri/`.
2. Elige verificar con **Etiqueta HTML**, copia la etiqueta y pégala en el panel, en **Datos de la
   tienda → Google → Código de verificación**. Espera a que se publique y pulsa **Verificar**.
3. En Search Console, ve a **Sitemaps** y envía `https://suprsalva.github.io/RosasViri/sitemap-index.xml`.
4. Crea o actualiza el **Perfil de Empresa de Google** con el enlace al sitio.

Cuando conectes un dominio propio, repite estos pasos con el dominio nuevo.

## Cookies y privacidad

- El sitio **no usa cookies** mientras no se active Google Analytics.
- Para medir visitas, pega el ID de Google Analytics (empieza con `G-`) en **Datos de la tienda →
  Google**. A partir de ahí aparece el aviso de cookies: Analytics solo se carga si la persona
  acepta, y puede cambiar su decisión en "Preferencias de cookies" al pie de la página. La sección
  de cookies del aviso de privacidad se actualiza sola.
- **Aviso de privacidad:** llena el **nombre completo y el domicilio del responsable** en **Datos de
  la tienda → Responsable**; mientras falten, la página dice "Por completar". Se recomienda que un
  abogado revise el texto antes del lanzamiento.

## Trabajar en la computadora

Requiere Node.js 22 o más reciente.

```sh
npm install
npm run dev       # vista previa en http://localhost:4321/RosasViri/
npm run check     # revisa errores
npm run build     # genera el sitio en dist/
```

La política de seguridad de contenido (CSP) solo funciona en el sitio construido; para probarla usa
`npm run build` y `npx astro preview`.

## Publicación

El sitio se publica en GitHub Pages con [`.github/workflows/publicar.yml`](.github/workflows/publicar.yml)
cada vez que hay cambios en `main`, y queda en https://suprsalva.github.io/RosasViri/.
[Dependabot](.github/dependabot.yml) revisa cada semana las actualizaciones de seguridad.

### Conectar el dominio propio

1. En `astro.config.mjs`, cambia `site` por el dominio (por ejemplo `https://rossvtienda.com`)
   y `base` por `'/'`.
2. Crea el archivo `public/CNAME` con el dominio (por ejemplo `rossvtienda.com`).
3. En GitHub, **Settings → Pages → Custom domain**, escribe el dominio y activa **Enforce HTTPS**.
4. Configura el DNS del dominio según las instrucciones de GitHub Pages.
5. Repite los pasos de [Aparecer en Google](#aparecer-en-google) con el dominio nuevo.
