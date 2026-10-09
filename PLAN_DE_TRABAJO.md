# Plan de trabajo: sitio web propio para sustituir `beacons.ai/rossvtienda`

**Objetivo:** reemplazar la página actual de Beacons de **Rossvtienda** (flores de listón
satinado y ramos con carritos Hot Wheels) por un sitio web propio, con dominio propio, que haga
todo lo que hace hoy la página de Beacons (catálogo, redes, contacto) y que además **sí permita
recibir pedidos**, sin comisiones de terceros, sin publicidad de Beacons y con la imagen de la marca.

**Repositorio:** `SuprSalva/RosasViri`.
**Sitio:** https://rossvtienda.com (dominio comprado; en lo que se conecta, sigue en
https://suprsalva.github.io/RosasViri/).
**Última actualización:** 9 de octubre de 2026.

---

## ⚠️ Hallazgo importante: hoy la tienda de Beacons no puede vender

En la captura [`06-checkout-sin-pago.jpg`](docs/referencia-beacons/06-checkout-sin-pago.jpg), al
tocar **"Comprar ahora"** el cliente llega a un formulario que dice:

> **Payment not available.** This creator has not connected any payment methods. Please check in later.

Además, ese formulario pregunta *"¿A quién debemos enviar el archivo?"*: los productos están
configurados como **producto digital** (un archivo descargable) y no como producto físico con entrega.

**Consecuencia:** todo cliente que intenta comprar desde Beacons llega a un callejón sin salida,
en inglés. Hoy se pueden estar perdiendo pedidos.

**Acción inmediata (hoy, antes de construir nada):** en Beacons, agregar arriba de todo un botón
**"Haz tu pedido por WhatsApp"** con el enlace `https://wa.me/524792025177` y poner en la
descripción de cada producto "Pedidos por WhatsApp: 479 202 5177". Esto no reemplaza el sitio nuevo,
pero evita perder ventas mientras se construye.

---

## Resumen

| Fase | Qué se hace | Duración estimada | Estado |
|---|---|---|---|
| 0. Inventario y decisiones | Capturar todo lo que hay en Beacons y fijar alcance | 1–2 días | **En curso** (redes, correo y WhatsApp confirmados; faltan productos y fotos originales) |
| 1. Diseño y contenido | Identidad visual, estructura, fotos y textos | 3–5 días | **En curso** (paleta, fuentes, logo provisional e íconos listos; faltan fotos originales y descripciones) |
| 2. Desarrollo | Construir el sitio en este repo | 5–8 días | **Casi lista** (sitio en línea, catálogo en Supabase con panel propio; falta el contenido real) |
| 3. SEO, analítica y legal | Metadatos, medición y avisos legales | 1–2 días | **En curso** (SEO, cookies, clics en WhatsApp y UTM listos; faltan Google y datos del responsable) |
| 4. Pruebas | Celulares, velocidad, enlaces, pedidos | 1–2 días | Pendiente |
| 5. Lanzamiento y migración | Dominio, cambio de enlaces en redes, retiro de Beacons | 1–2 días | **En curso** (dominio comprado; falta conectarlo en Cloudflare) |
| 6. Seguimiento y Fase 2 | Medir, ajustar y (opcional) pagos en línea | continuo | Pendiente |

**Tiempo total para el lanzamiento:** unas **3–4 semanas** a tiempo parcial.
**Costo fijo mínimo:** solo el dominio (unos 12–20 USD al año). El hosting es gratuito.

### Fechas clave de venta (si la tienda opera en México)

Conviene que el sitio esté en línea y probado **antes** de las temporadas fuertes de flores:

| Fecha | Temporada | Qué preparar |
|---|---|---|
| 1–2 de noviembre | Día de Muertos | ¿Cempasúchil de listón? Publicar 2–3 semanas antes |
| Diciembre | Navidad e intercambios | Ramos de regalo, Hot Wheels para regalo |
| **14 de febrero** | San Valentín (la más fuerte) | Sitio 100 % listo en enero; tiempos de entrega claros |
| 21 de marzo | "Flores amarillas" | Girasoles destacados en el inicio |
| **10 de mayo** | Día de las Madres | Ramos de rosas grandes destacados |

Con un arranque a inicios de octubre, el lanzamiento caería a finales de octubre: a tiempo para
Día de Muertos y Navidad, y con margen para afinar antes del 14 de febrero.

**Al 7 de octubre:** lo técnico está listo; lo que frena el lanzamiento es el contenido (fotos,
productos que faltan, precios por confirmar) y el dominio. Para Día de Muertos ya no hay las 2–3
semanas de margen: si se quiere vender esa temporada, lanzar con las fotos actuales y cambiarlas
después desde el panel. Navidad sigue siendo una meta cómoda.

---

## Fase 0: inventario y decisiones

### 0.1 Lo que ya sabemos (según las capturas del 29/09/2026)

Capturas de referencia en [`docs/referencia-beacons/`](docs/referencia-beacons/).

**Perfil**

- **Nombre:** Rossvtienda (usuario `@rossvtienda`).
- **Logo:** flor (tulipán) verde oliva cuyo tallo y hojas forman una **"V"**, dentro de un
  óvalo color crema.
- **Redes y contacto:** íconos de **TikTok**, **Instagram** y **correo electrónico**. No aparece
  WhatsApp.
- **Sin biografía** ni botones de enlaces: la página es directamente el catálogo.

**Colores (medidos de las capturas)**

| Uso | Color |
|---|---|
| Fondo de la página | `#F2E6D8` (beige) |
| Óvalo del logo | `#F6F3EE` (crema) |
| Verde oliva del logo | `#81844B` |
| Fondo de las tarjetas de producto | `#E7EAA7` (verde limón pálido) |
| Botón "Ver más" | `#575B20` (oliva oscuro) con texto crema |
| Botón "Comprar ahora" | `#A2A757` (oliva claro) |
| Texto | `#3B2E28` (café oscuro) |

**Tipografías:** el nombre "Rossvtienda" usa una serif gruesa (tipo *slab*). Los títulos de
sección y las tarjetas usan una letra redondeada, estilo manuscrito.

**Catálogo visible**

Precios en `$`; lo más probable es que sean pesos mexicanos (MXN), por confirmar.

| Categoría | Producto | Descripción en Beacons | Precio |
|---|---|---|---|
| **Rosas de listón satinado** | Rosa eterna | Rosas clásicas | $50 |
| | Ramo chico de rosas | Rosas clásicas. Ficha: *"Ramo de 7 rosas eternas de color a elección envueltas en papel coreano con un moño decorativo"* (5 fotos) | $220 |
| | Ramo 12 rosas clásicas | 12 rosas | $370 |
| | Ramo de rosas mediano | 24 rosas | $680 |
| | *(al menos 2 productos más, cortados en la captura)* | ? | ? |
| **Girasoles de listón satinado** | Único Girasol | Girasol clásico movible | $90 |
| | Ramo chico girasoles | — | $250 |
| | Mix Girasol y Rosas | — | $290 |
| **Ramos de Hot Wheels y flores de listón** *("carritos y color de rosas a elegir")* | Carrito 1 | Ramo 1 carrito 1 rosa | $90 |
| | Carrito 2 | Ramo 3 carritos 3 rosas | $290 |
| | Carrito 3 | Ramo 3 carritos 5 rosas *(se ve a medias; confirmar)* | $380 *(confirmar)* |
| | Carrito duo | Ramo 2 carritos 2 rosas *(se ve a medias; confirmar)* | $220 *(confirmar)* |

**Cómo funciona hoy la página**

- **Inicio:** logo, nombre, íconos de redes y luego el catálogo por secciones, en tarjetas de
  2 columnas con foto, nombre, descripción corta, precio y botón "(Ver mas)".
- **Ficha de producto** (`shop.beacons.ai/...`): carrusel de fotos, botón de compartir, nombre,
  precio, botón "Comprar ahora", descripción y "Conoce al creador @rossvtienda".
- **Compra:** no funciona (ver el hallazgo de arriba).
- **Publicidad de Beacons:** una barra fija "Beacons — Try for free!" tapa la parte baja de las
  tarjetas, y la página dice "Hecho con Beacons".
- **Detalles de texto a corregir:** faltan acentos ("clasicas", "clasico", "Ver mas").

### 0.2 Lo que falta reunir

- [ ] **Resto del catálogo:** los productos que no salen en las capturas (al menos 2 de rosas y
      quizá más de Hot Wheels), con nombre, descripción, precio y el orden de las secciones.
- [ ] **Fotos originales** de cada producto, en la mejor calidad posible, incluidas las 5 fotos
      de cada ficha. Las capturas no sirven como fotos del sitio.
- [ ] **Logo original** (archivo PNG grande o SVG). Si no existe, se redibuja en SVG a partir de
      la captura.
- [x] **Enlaces exactos** de TikTok e Instagram y el correo de contacto.
- [x] **Número de WhatsApp** para pedidos: 52 479 202 5177.
- [ ] **Estadísticas de Beacons** (visitas y clics de los últimos 30–90 días), como línea base.
- [ ] **Suscriptores o contactos** registrados en Beacons, si hay: exportar a CSV.
- [ ] **Dónde está publicado el enlace de Beacons:** biografías, estados, tarjetas, etiquetas,
      códigos QR.

### 0.3 Decisiones

| Decisión | Opciones | Recomendación |
|---|---|---|
| Nombre en el sitio | Rossvtienda | ✅ **Rossvtienda** (confirmado por las capturas) |
| Dominio | `rossvtienda.com`, `rossvtienda.mx`, `rossvtienda.com.mx` | Un `.com` o `.mx` con el mismo nombre de las redes. Revisar disponibilidad. |
| Forma de pedido al lanzar | a) Pedido por WhatsApp · b) Carrito con pago en línea | ✅ **a) WhatsApp**: los ramos llevan elección de colores y carritos, y eso se acuerda mejor platicando. Además, hoy no hay ningún método de pago conectado. El pago en línea queda para la Fase 6. |
| Plataforma | a) Sitio propio en este repo · b) Shopify, Tiendanube u otra | ✅ **a) Sitio propio**: el catálogo es de unos 15 productos, así que no hace falta una plataforma de pago mensual. |
| Quién actualiza productos | Dueña, desarrollo o ambos | ✅ **La dueña**, desde el panel propio en `/admin/`; los textos del sitio, desde Pages CMS (ver 2.4) |

**Definición de terminado de la Fase 0:** catálogo completo, fotos y logo originales reunidos,
enlaces de redes y WhatsApp confirmados, y decisiones tomadas.

---

## Fase 1: diseño y contenido (3–5 días)

### 1.1 Equivalencias entre Beacons y el sitio nuevo

| En Beacons | En el sitio nuevo |
|---|---|
| Logo en óvalo + nombre | Encabezado igual, con el mismo logo y colores (la marca se reconoce al instante) |
| Íconos TikTok, Instagram y correo | Los mismos, **más WhatsApp**, en el encabezado y el pie |
| Secciones con tarjetas de 2 columnas | Mismo formato, con acentos corregidos y **sin la barra de Beacons** tapando precios |
| Ficha con carrusel de fotos | Ficha con galería deslizable, precio, descripción y opciones |
| "Comprar ahora" (no funciona) | **"Pedir por WhatsApp"**, con mensaje prellenado con producto, precio y opciones elegidas |
| "Conoce al creador" | Sección breve "Sobre Rossvtienda" (hecho a mano, materiales, tiempos) |
| Botón compartir | Botón compartir (usa el menú nativo del celular) |

### 1.2 Mapa del sitio

Estructura elegida: **portada de tienda** (29/09/2026).

1. **Inicio (`/`)**: portada con frase y collage de fotos, "Elige tu ramo" (las tres secciones
   con foto, número de modelos y precio desde), destacados, bloque de pedidos personalizados,
   cómo pedir en 3 pasos y redes.
2. **Catálogo (`/catalogo/`)**: todos los productos por sección.
3. **Secciones** (`/rosas/`, `/girasoles/`, `/hot-wheels/`): se pueden compartir por separado.
4. **Producto** (`/rosas/<producto>/`): galería, precio, descripción, opciones (color de rosas y,
   en Hot Wheels, carritos) y botón "Pedir por WhatsApp" con el mensaje ya escrito.
5. **Pedidos personalizados (`/pedidos-personalizados/`)**: qué se puede personalizar y un
   formulario (ocasión, fecha, colores, presupuesto, detalles) que arma el mensaje de WhatsApp.
6. **Galería (`/galeria/`)**: ramos entregados, fotos del catálogo y opiniones reales de clientes.
7. **Cómo pedir (`/como-pedir/`)**: pasos y preguntas frecuentes.
8. **Contacto (`/contacto/`)**: WhatsApp, Instagram, TikTok y correo.
9. **Aviso de privacidad (`/privacidad/`)**, con la sección de cookies.
10. **Página 404**, y páginas de error propias en el panel (401, 403 y 500).
11. **Administración (`/admin/`)**: panel del catálogo, fuera de Google.

### 1.3 Identidad visual

- [x] Conservar la paleta actual (tabla de la sección 0.1) como base del diseño.
- [x] Logo en SVG redibujado a partir de la captura. Falta cambiarlo por el original, si existe.
- [x] Favicon con el tulipán en "V", más una imagen de vista previa (1200×630) para WhatsApp,
      Facebook e Instagram.
- [x] Tipografías: **Playfair Display** para títulos y **Lato** para texto (opción "Elegante",
      elegida el 29/09/2026).
- [x] Diseño pensado primero para celular: la clientela llega desde Instagram y TikTok.
- [ ] Maqueta del inicio y de la ficha de producto, aprobada antes de programar.

### 1.4 Contenido

- [ ] Fotos: las actuales (fondo liso de pared, luz natural) funcionan bien. Solo hacen falta los
      archivos originales. Ideal: una foto de cada color disponible.
- [ ] Descripción completa de **cada** producto, al estilo de la del "Ramo chico de rosas":
      cuántas flores, material, tipo de papel, moño, colores disponibles y tamaño aproximado.
- [ ] Textos de "Cómo pedir": tiempo de elaboración, anticipo, formas de pago (transferencia,
      efectivo, etc.), entregas y costo de envío.
- [x] Mensaje de WhatsApp prellenado, por ejemplo:
      > Hola Rossvtienda 🌷 Quiero pedir: **Ramo chico de rosas** ($220).
      > Color de rosas: ____. ¿Para qué fecha lo tendrían?

      Y para Hot Wheels:
      > Hola Rossvtienda 🌷 Quiero pedir: **Carrito 2** ($290).
      > Color de rosas: ____. Carritos que me gustan: ____. ¿Para qué fecha lo tendrían?

**Definición de terminado de la Fase 1:** maqueta aprobada y todo el contenido (textos, fotos y
logo) en una carpeta compartida.

---

## Fase 2: desarrollo (5–8 días)

### 2.1 Tecnología recomendada

- **Astro**: generador de sitios estáticos. Páginas muy rápidas, buenas para Google y sin
  servidor que mantener.
- **CSS propio** con los colores de la marca como variables. Las imágenes se optimizan solas
  (WebP o AVIF, varios tamaños): importante porque todo el catálogo son fotos.
- **Catálogo en Supabase** (plan gratuito): productos y secciones en una base de datos que se
  edita desde el panel `/admin/`. El sitio la lee **al publicarse**, así que sigue siendo estático.
  Las fotos viven en el repositorio. *(Al principio los productos eran archivos Markdown; se
  cambió el 29 de septiembre para tener un panel propio, más sencillo para la dueña.)*
- **Hosting gratuito:** Cloudflare Pages, con publicación automática desde GitHub Actions en cada
  cambio. *(Hasta el 9 de octubre fue GitHub Pages; se cambió porque sus condiciones no permiten
  usarlo para una tienda en línea y más adelante se cobrará en el sitio. Cloudflare además deja
  mandar encabezados de seguridad.)*
- **Formularios:** no hacen falta. Pedidos y personalizados arman un mensaje de WhatsApp.

### 2.2 Estructura del repositorio

```
RosasViri/
├── PLAN_DE_TRABAJO.md
├── README.md                        # Cómo administrar, enlaces para redes y publicar
├── .pages.yml                       # Pages CMS: textos del sitio
├── .env                             # Conexión pública con Supabase (no es secreta)
├── docs/
│   ├── auditoria-seguridad.md
│   └── referencia-beacons/          # Capturas de la página de Beacons
├── astro.config.mjs                 # Dirección del sitio (rossvtienda.com) y CSP
├── public/                          # favicon, íconos, manifest, og-image.jpg y _headers
├── supabase/
│   ├── migrations/                  # Tablas, permisos y eliminación lógica
│   └── functions/panel/             # Servicio que sube fotos y lanza la publicación
├── src/
│   ├── assets/productos/            # Fotos de los productos
│   ├── data/                        # tienda.json, portada, cómo pedir, galería, opiniones...
│   ├── content/paginas/             # Texto del aviso de privacidad
│   ├── content.config.ts            # Lee el catálogo de Supabase y valida precios y fotos
│   ├── components/                  # Logo, Encabezado, Redes, TarjetaProducto, AvisoCookies...
│   ├── layouts/Base.astro           # <head>, SEO, vista previa y aviso de cookies
│   ├── lib/                         # WhatsApp, catálogo, base de datos y el panel (lib/panel/)
│   ├── pages/                       # Inicio, catálogo, secciones, fichas, personalizados,
│   │                                # galería, cómo pedir, contacto, privacidad, admin y 404
│   └── styles/global.css            # Paleta: #F2E6D8, #E7EAA7, #575B20, #81844B, #3B2E28...
└── .github/workflows/publicar.yml   # Publicación en Cloudflare Pages (cambios, panel y cada lunes)
```

Cómo administrar el catálogo y los textos está explicado en el [`README.md`](README.md).

### 2.3 Tareas de desarrollo (en orden)

1. [x] Crear el proyecto Astro y el flujo de publicación en GitHub Pages (activo y en línea).
2. [x] Estilos base con la paleta y las tipografías de la marca (Playfair Display y Lato).
3. [x] Layout base: `<head>` con título, descripción, vista previa para redes y favicon.
4. [x] Componentes: encabezado con logo en óvalo, redes (TikTok, Instagram, correo, WhatsApp),
       botón flotante de WhatsApp y pie de página.
5. [x] Colección de productos con validación de campos, para que un precio o una foto mal
       escritos den error al publicar en vez de romper el sitio en silencio.
6. [x] Inicio con las tres secciones en tarjetas de 2 columnas, como hoy.
7. [x] Páginas por categoría.
8. [x] Ficha de producto: galería deslizable, opciones (color o carritos), botón de compartir y
       enlace `https://wa.me/<número>?text=...` que arma el mensaje con lo elegido.
9. [x] Etiqueta de **"Agotado"** (`disponible: false`) para no borrar productos.
10. [x] Páginas de Cómo pedir (con contacto y preguntas frecuentes) y 404.
11. [x] Accesibilidad: texto alternativo en cada foto, buen contraste, botones grandes y
        navegación con teclado.
12. [x] `README.md` con instrucciones para agregar ramos, cambiar precios o marcar agotados sin
        saber programar.
13. [ ] Cambiar las fotos provisionales (recortadas de las capturas) por las originales, y el
        logo redibujado por el archivo original.
14. [ ] Agregar los productos que faltan y confirmar los precios de **Carrito 3** ($380) y
        **Carrito duo** ($220). (Redes, correo y WhatsApp ya están confirmados.) Revisar si
        **"rosa-roja"**, creado desde el panel, es un producto real o una prueba.
15. [x] Panel de administración (Pages CMS) para todo el contenido y varias fotos por producto.
16. [x] Aviso de privacidad, aviso de cookies, `favicon.ico`, íconos, configuración para Google y
        auditoría de seguridad ([`docs/auditoria-seguridad.md`](docs/auditoria-seguridad.md)).
        Falta llenar el nombre y domicilio del responsable en Pages CMS.
17. [x] Catálogo en Supabase con panel propio en `/admin/`: productos y secciones, varias fotos
        (se reducen y se les quita el GPS), disponible/agotado, destacados y orden.
18. [x] Eliminación lógica con **Papelera** (nada se borra de verdad) y pruebas del panel.
19. [x] Páginas de error propias: 404 del sitio y 401, 403 y 500 del panel.
20. [x] Publicación automática semanal para que el proyecto gratis de Supabase no se pause.
21. [x] Que el panel no funcione dentro de un marco de otro sitio (auditoría, #18).

### 2.4 Panel de administración

Hay **dos paneles** (instrucciones en el [`README.md`](README.md#administración)):

- **Catálogo** (productos, precios, fotos y secciones): panel propio en `/admin/`, con correo y
  contraseña. Guarda en Supabase y sube las fotos al repositorio. Solo entran las personas
  invitadas y agregadas a la tabla `administradores`.
- **Textos del sitio** (datos de la tienda, portada, cómo pedir, personalizados, galería,
  opiniones y aviso de privacidad): **Pages CMS** (https://app.pagescms.org), con la cuenta de
  GitHub.

En los dos, cada cambio se publica solo en 1–2 minutos.

**Definición de terminado de la Fase 2:** todas las páginas funcionan en https://rossvtienda.com
con el catálogo real completo.

---

## Fase 3: SEO, analítica y legal (1–2 días)

### SEO

- [x] Título y descripción por página. Falta agregar la ciudad cuando se confirme.
- [x] Datos estructurados `Product` (con precio y fotos) y `BreadcrumbList` en cada ficha;
      `Organization` y `WebSite` en el inicio.
- [x] `sitemap.xml` (sin `/admin/` ni 404), `robots.txt`, `favicon.ico`, íconos y manifest.
- [x] Imagen de vista previa para que el enlace se vea bonito al mandarlo por WhatsApp.
- [ ] Alta en **Google Search Console** (verificación desde el panel) y envío del sitemap. Pasos
      en el [`README.md`](README.md#aparecer-en-google).
- [ ] Crear el **Perfil de Empresa de Google** (Google Maps) con el enlace al sitio, aunque sea
      solo con zona de entrega y sin dirección pública.

### Analítica

- [x] Google Analytics 4 listo: se activa pegando el ID en el panel y solo mide a quien acepta
      las cookies.
- [x] Contar cada clic en "Pedir por WhatsApp", por producto: dice qué ramos interesan más
      (evento `pedido_whatsapp`; ver el [`README.md`](README.md#cookies-y-privacidad)).
- [x] Enlaces con UTM por red, por ejemplo `?utm_source=tiktok` e `?utm_source=instagram`, para
      saber qué red trae más pedidos (lista en el [`README.md`](README.md#enlaces-para-redes-sociales)).
- [ ] Pixel de TikTok o Meta **solo** si se van a pagar anuncios (habría que agregarlo al aviso
      de cookies y a la política de seguridad).

### Legal

- [x] Aviso de privacidad y sección de cookies en `/privacidad/`. Pendiente: nombre y domicilio
      del responsable, y revisión de un abogado.
- [ ] Políticas claras de anticipo, cambios y cancelaciones en "Cómo pedir". Hoy solo dice que el
      pago total se liquida al ver la foto del pedido terminado; falta cuánto es el anticipo y qué
      pasa si se cancela.
- [ ] "Hot Wheels" es marca de Mattel: se puede describir el producto ("ramo con carritos Hot
      Wheels"), pero no usar su logo como parte de la marca Rossvtienda.

---

## Fase 4: pruebas (1–2 días)

- [ ] Revisar en iPhone (Safari) y Android (Chrome), también **dentro de la app de Instagram y
      de TikTok**, que es donde se abrirá casi siempre.
- [ ] Lighthouse con 90 o más en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- [ ] Todos los enlaces (TikTok, Instagram, correo, WhatsApp) llevan al lugar correcto.
- [ ] En **cada** producto, el botón de WhatsApp abre el chat correcto con nombre, precio y
      opciones correctos.
- [ ] Ningún botón o precio queda tapado en pantallas chicas.
- [ ] La vista previa del enlace se ve bien al pegarlo en WhatsApp.
- [ ] La dueña revisa textos, precios, acentos y fotos.

---

## Fase 5: lanzamiento y migración (1–2 días)

1. [x] **Comprar el dominio:** `rossvtienda.com`, en Hostinger (9 de octubre de 2026). Activar la
       renovación automática.
2. [ ] **Pasar el sitio a Cloudflare Pages y conectar el dominio**, con los pasos del
       [`README.md`](README.md#dominio-y-cloudflare-configuración-de-una-sola-vez): nameservers en
       Hostinger, proyecto y secretos, `www` y HTTPS, Supabase y apagar GitHub Pages. Probar con
       `www` y sin `www`.
3. [ ] **Cambiar el enlace** en las biografías de TikTok e Instagram, en el perfil y catálogo de
       WhatsApp Business, en el Perfil de Empresa de Google y en cualquier otro lugar anotado en
       la Fase 0. Usar los **enlaces con UTM** del [`README.md`](README.md#enlaces-para-redes-sociales),
       ya con el dominio nuevo.
4. [ ] Generar un **código QR nuevo** al dominio (con su enlace UTM) para tarjetas, etiquetas de
       los ramos y bolsas.
5. [ ] Publicar el lanzamiento en TikTok e Instagram (video mostrando la página nueva).
6. [ ] **No borrar Beacons de inmediato.** Durante 2 o 3 meses, dejar en la página de Beacons un
       solo botón grande: "Nuestra tienda se mudó a **<dominio>**".
7. [ ] Pasado ese periodo, confirmar que no queden datos ni suscripciones en Beacons y cerrar la
       cuenta o cancelar el plan si es de pago.

### Lista de verificación el día del lanzamiento

- [ ] El dominio abre con candado (HTTPS).
- [ ] Están todos los productos, con precios correctos.
- [ ] Un pedido de prueba por WhatsApp llega bien y con las opciones elegidas.
- [ ] La analítica registra visitas y clics en WhatsApp.
- [ ] Las biografías de TikTok e Instagram ya apuntan al dominio nuevo.

---

## Fase 6: seguimiento y mejoras

### Primer mes

- Revisar cada semana visitas, clics en WhatsApp por producto y red de origen, y comparar con las
  estadísticas de Beacons.
- Subir al inicio los ramos más pedidos y ajustar según la temporada (ver "Fechas clave").

### Mantenimiento

- Mantener productos, precios y agotados al día.
- Agregar productos de temporada (Día de Muertos, San Valentín, 10 de mayo) con anticipación.
- Actualizar dependencias del proyecto cada trimestre y activar la renovación automática del
  dominio.

### Opcional: pago en línea

Cuando el volumen de pedidos lo justifique:

- Aceptar anticipo o pago completo en línea con **Mercado Pago**, **Stripe** o **PayPal**,
  empezando con enlaces de pago por producto (no requieren servidor).
- El cobro se hace en la página de Mercado Pago o Stripe: los datos de la tarjeta nunca pasan por
  el sitio. Si después se quiere un carrito, lo que necesita servidor (crear el cobro y recibir el
  aviso de "ya pagó") puede ir en una función de Supabase, como el servicio `panel`. El sitio ya
  está en Cloudflare Pages, que sí permite tiendas en línea.
- Mostrar datos para transferencia o depósito en la página "Cómo pedir".

---

## Riesgos y cómo evitarlos

| Riesgo | Cómo evitarlo |
|---|---|
| Se siguen perdiendo pedidos mientras se construye el sitio | **Acción inmediata:** botón de WhatsApp en Beacons desde hoy |
| Se pierden visitas de enlaces viejos a Beacons | Mantener Beacons con el botón "Nos mudamos" 2 o 3 meses |
| Las fotos del sitio se ven borrosas | Usar archivos originales, nunca capturas |
| La dueña no puede actualizar productos o precios | Panel propio en `/admin/` + Pages CMS + README |
| Supabase (plan gratis) se pausa por falta de uso | Publicación automática cada lunes, que lee la base de datos |
| Supabase no responde al publicar | La publicación se detiene y el sitio anterior sigue en línea |
| Alguien toma la sesión del panel desde otro proyecto de `suprsalva.github.io` | Panel en el dominio propio, cerrar sesión en el panel viejo y apagar GitHub Pages (ver la [auditoría](docs/auditoria-seguridad.md), #13) |
| El sitio se ve mal dentro de TikTok o Instagram | Probar en esos navegadores integrados (Fase 4) |
| Pedidos de Hot Wheels con carritos que ya no hay | Aclarar "sujeto a existencias" y confirmar modelos por WhatsApp |
| No está listo para San Valentín | Lanzar en octubre o noviembre y dejar enero solo para ajustes |
| Vence el dominio y el sitio se cae | Renovación automática en Hostinger y correo de aviso vigente |
| Vence la clave de Cloudflare y los cambios dejan de publicarse | Anotar su fecha de vencimiento; renovarla en Cloudflare y actualizar el secreto `CLOUDFLARE_API_TOKEN` en GitHub |

---

## Responsables

| Tarea | Responsable |
|---|---|
| Catálogo completo, fotos, logo, textos, precios y aprobaciones | Dueña de la tienda |
| Diseño, desarrollo, SEO, pruebas y publicación | Desarrollo (en este repo) |
| Compra del dominio y cuentas (Google, analítica, Cloudflare) | Dueña (las cuentas deben quedar a nombre de la tienda) |
| Cambio de enlaces en TikTok, Instagram y WhatsApp | Dueña, con la lista de la Fase 5 |

---

## Preguntas abiertas

Resueltas: número de WhatsApp (52 479 202 5177), enlaces de TikTok e Instagram, correo y dominio
(`rossvtienda.com`).

1. ¿Qué productos hay debajo de lo que se ve en las capturas? (nombre, descripción, precio)
2. ¿Los precios de Carrito 3 ($380) y Carrito duo ($220) son correctos?
3. ¿Los precios son en pesos mexicanos? ¿En qué ciudad o zona entregan, y hacen envíos?
4. ¿Cuánto tarda la elaboración de un ramo y cuánto es el anticipo? ¿Qué formas de pago aceptan?
   ¿Qué pasa si se cancela un pedido?
5. ¿Qué colores de rosas y de papel ofrecen?
6. ¿Tienen el logo en archivo original y las fotos en buena calidad?
7. ¿Nombre completo y domicilio del responsable para el aviso de privacidad?
