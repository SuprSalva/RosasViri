# Plan de trabajo: sitio web propio para sustituir `beacons.ai/rossvtienda`

**Objetivo:** reemplazar la página actual de Beacons de **Rossvtienda** (flores de listón
satinado y ramos con carritos Hot Wheels) por un sitio web propio, con dominio propio, que haga
todo lo que hace hoy la página de Beacons (catálogo, redes, contacto) y que además **sí permita
recibir pedidos**, sin comisiones de terceros, sin publicidad de Beacons y con la imagen de la marca.

**Repositorio:** `SuprSalva/RosasViri`.

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
**"Haz tu pedido por WhatsApp"** con el enlace `https://wa.me/52XXXXXXXXXX` y poner en la
descripción de cada producto "Pedidos por WhatsApp: <número>". Esto no reemplaza el sitio nuevo,
pero evita perder ventas mientras se construye.

---

## Resumen

| Fase | Qué se hace | Duración estimada | Estado |
|---|---|---|---|
| 0. Inventario y decisiones | Capturar todo lo que hay en Beacons y fijar alcance | 1–2 días | **En curso** (capturas recibidas) |
| 1. Diseño y contenido | Identidad visual, estructura, fotos y textos | 3–5 días | Pendiente |
| 2. Desarrollo | Construir el sitio en este repo | 5–8 días | Pendiente |
| 3. SEO, analítica y legal | Metadatos, medición y avisos legales | 1–2 días | Pendiente |
| 4. Pruebas | Celulares, velocidad, enlaces, pedidos | 1–2 días | Pendiente |
| 5. Lanzamiento y migración | Dominio, cambio de enlaces en redes, retiro de Beacons | 1–2 días | Pendiente |
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
- [ ] **Enlaces exactos** de TikTok e Instagram y el correo de contacto.
- [ ] **Número de WhatsApp** para pedidos (¿WhatsApp Business?).
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
| Quién actualiza productos | Dueña, desarrollo o ambos | Archivos sencillos + panel de edición opcional (ver 2.4) |

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

1. **Inicio (`/`)**: logo, nombre, redes, botón grande "Haz tu pedido por WhatsApp" y el
   catálogo completo por secciones, igual que hoy, para que la clientela lo reconozca.
2. **Categorías** (`/rosas`, `/girasoles`, `/hot-wheels`): se pueden compartir por separado en
   historias y anuncios.
3. **Producto** (`/producto/<nombre>`): galería, precio, descripción y opciones:
   - Rosas y girasoles: **color de rosas a elegir**.
   - Hot Wheels: **color de rosas** y **preferencia de carritos** (sujeto a existencias).
   - Botón "Pedir por WhatsApp" con el mensaje ya escrito.
4. **Cómo pedir (`/como-pedir`)**: pasos, formas de pago, tiempo de elaboración, entregas o
   envíos, anticipo y cambios. También cuidados de las flores de listón.
5. **Contacto (`/contacto`)**: WhatsApp, correo, redes y zona de entrega.
6. **Aviso de privacidad (`/privacidad`)** y **página 404**.

### 1.3 Identidad visual

- [ ] Conservar la paleta actual (tabla de la sección 0.1) como base del diseño.
- [ ] Logo en SVG: el original o uno redibujado a partir de la captura.
- [ ] Favicon con el tulipán en "V", más una imagen de vista previa (1200×630) para WhatsApp,
      Facebook e Instagram.
- [ ] Tipografías de Google Fonts parecidas a las actuales: una serif gruesa para el nombre y una
      redondeada y amigable para títulos y tarjetas. Siempre con acentos y ñ.
- [ ] Diseño pensado primero para celular: la clientela llega desde Instagram y TikTok.
- [ ] Maqueta del inicio y de la ficha de producto, aprobada antes de programar.

### 1.4 Contenido

- [ ] Fotos: las actuales (fondo liso de pared, luz natural) funcionan bien. Solo hacen falta los
      archivos originales. Ideal: una foto de cada color disponible.
- [ ] Descripción completa de **cada** producto, al estilo de la del "Ramo chico de rosas":
      cuántas flores, material, tipo de papel, moño, colores disponibles y tamaño aproximado.
- [ ] Textos de "Cómo pedir": tiempo de elaboración, anticipo, formas de pago (transferencia,
      efectivo, etc.), entregas y costo de envío.
- [ ] Mensaje de WhatsApp prellenado, por ejemplo:
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
- **Productos en archivos Markdown** dentro del repo. Agregar un ramo es agregar un archivo.
- **Hosting gratuito:** GitHub Pages con publicación automática en cada cambio. Cloudflare Pages
  o Netlify son alternativas equivalentes.
- **Formulario de contacto** (opcional): Formspree o Web3Forms, en su plan gratuito.

### 2.2 Estructura propuesta del repositorio

```
RosasViri/
├── PLAN_DE_TRABAJO.md
├── README.md                    # Cómo editar productos y publicar
├── docs/referencia-beacons/     # Capturas de la página actual
├── astro.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── og-image.jpg             # Vista previa al compartir el enlace
├── src/
│   ├── assets/productos/        # Fotos originales de cada ramo
│   ├── content/
│   │   └── productos/           # Un archivo .md por producto
│   ├── data/
│   │   └── tienda.json          # Nombre, WhatsApp, redes, correo, categorías y su orden
│   ├── components/              # Encabezado, Redes, TarjetaProducto, Galeria, BotonWhatsApp...
│   ├── layouts/Base.astro       # <head>, SEO, vista previa, analítica
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [categoria].astro    # /rosas, /girasoles, /hot-wheels
│   │   ├── producto/[slug].astro
│   │   ├── como-pedir.astro
│   │   ├── contacto.astro
│   │   ├── privacidad.astro
│   │   └── 404.astro
│   └── styles/global.css        # Paleta: #F2E6D8, #E7EAA7, #575B20, #81844B, #3B2E28...
└── .github/workflows/deploy.yml
```

Ejemplo real de ficha (`src/content/productos/ramo-chico-de-rosas.md`):

```md
---
nombre: "Ramo chico de rosas"
categoria: "rosas"
resumen: "7 rosas clásicas"
precio: 220
fotos:
  - ../../assets/productos/ramo-chico-de-rosas-1.jpg
  - ../../assets/productos/ramo-chico-de-rosas-2.jpg
opciones:
  - nombre: "Color de rosas"
    tipo: "texto"          # o una lista de colores disponibles
disponible: true
destacado: true
orden: 2
---
Ramo de 7 rosas eternas de color a elección envueltas en papel coreano con un moño decorativo.
```

### 2.3 Tareas de desarrollo (en orden)

1. [ ] Crear el proyecto Astro, configurar la publicación en GitHub Pages y subir una página de
       prueba. Así el flujo de publicación queda probado desde el día 1.
2. [ ] Estilos base con la paleta y las tipografías de la marca.
3. [ ] Layout base: `<head>` con título, descripción, vista previa para redes y favicon.
4. [ ] Componentes: encabezado con logo en óvalo, redes (TikTok, Instagram, correo, WhatsApp),
       botón flotante de WhatsApp y pie de página.
5. [ ] Colección de productos con validación de campos, para que un precio o una foto mal
       escritos den error al publicar en vez de romper el sitio en silencio.
6. [ ] Inicio con las tres secciones en tarjetas de 2 columnas, como hoy.
7. [ ] Páginas por categoría.
8. [ ] Ficha de producto: galería deslizable, opciones (color o carritos) y enlace
       `https://wa.me/<número>?text=...` que arma el mensaje con lo elegido.
9. [ ] Etiqueta de **"Agotado"** o **"Por temporada"** para no borrar productos.
10. [ ] Páginas de Cómo pedir, Contacto, Privacidad y 404.
11. [ ] Accesibilidad: texto alternativo en cada foto ("Ramo de 7 rosas color durazno en papel
        blanco con dorado"), buen contraste y botones grandes.
12. [ ] `README.md` con instrucciones para agregar ramos, cambiar precios o marcar agotados sin
        saber programar.

### 2.4 Edición de productos por la dueña (opcional, recomendado)

- **Opción simple:** editar los archivos desde la web de GitHub (botón de lápiz) o desde la app
  de GitHub en el celular. Cada cambio se publica solo en 1–2 minutos.
- **Opción con panel:** conectar un CMS gratuito basado en Git (por ejemplo Pages CMS o Decap
  CMS), con un formulario "Nombre, Precio, Fotos, Disponible" y subida de fotos desde el celular.

**Definición de terminado de la Fase 2:** todas las páginas funcionan en la URL de prueba de
GitHub Pages con el catálogo real completo.

---

## Fase 3: SEO, analítica y legal (1–2 días)

### SEO

- [ ] Título y descripción por página, con palabras que la gente busca: "ramos de rosas de
      listón", "rosas eternas", "ramo de Hot Wheels", "girasoles de listón" + ciudad.
- [ ] Datos estructurados `Product` (con precio) en cada ficha y `LocalBusiness` o `Store` en el
      inicio.
- [ ] `sitemap.xml` y `robots.txt`.
- [ ] Imagen de vista previa para que el enlace se vea bonito al mandarlo por WhatsApp.
- [ ] Alta en **Google Search Console** y envío del sitemap.
- [ ] Crear el **Perfil de Empresa de Google** (Google Maps) con el enlace al sitio, aunque sea
      solo con zona de entrega y sin dirección pública.

### Analítica

- [ ] Cloudflare Web Analytics (gratis, sin cookies) o Google Analytics 4.
- [ ] Contar cada clic en "Pedir por WhatsApp", por producto: dice qué ramos interesan más.
- [ ] Enlaces con UTM por red, por ejemplo `?utm_source=tiktok` e `?utm_source=instagram`, para
      saber qué red trae más pedidos.
- [ ] Pixel de TikTok o Meta **solo** si se van a pagar anuncios, con aviso de cookies.

### Legal

- [ ] Aviso de privacidad (en México, conforme a la LFPDPPP) si el sitio recoge nombre, teléfono
      o correo.
- [ ] Políticas claras de anticipo, cambios y cancelaciones en "Cómo pedir".
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

1. [ ] **Comprar el dominio** (Cloudflare Registrar, Namecheap o Porkbun; para `.mx`, Akky).
2. [ ] Apuntar el dominio a GitHub Pages, activar HTTPS y probar con `www` y sin `www`.
3. [ ] **Cambiar el enlace** en las biografías de TikTok e Instagram, en el perfil y catálogo de
       WhatsApp Business, en el Perfil de Empresa de Google y en cualquier otro lugar anotado en
       la Fase 0.
4. [ ] Generar un **código QR nuevo** al dominio para tarjetas, etiquetas de los ramos y bolsas.
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
- Mostrar datos para transferencia o depósito en la página "Cómo pedir".

---

## Riesgos y cómo evitarlos

| Riesgo | Cómo evitarlo |
|---|---|
| Se siguen perdiendo pedidos mientras se construye el sitio | **Acción inmediata:** botón de WhatsApp en Beacons desde hoy |
| Se pierden visitas de enlaces viejos a Beacons | Mantener Beacons con el botón "Nos mudamos" 2 o 3 meses |
| Las fotos del sitio se ven borrosas | Usar archivos originales, nunca capturas |
| La dueña no puede actualizar productos o precios | Archivos simples + README + panel CMS opcional |
| El sitio se ve mal dentro de TikTok o Instagram | Probar en esos navegadores integrados (Fase 4) |
| Pedidos de Hot Wheels con carritos que ya no hay | Aclarar "sujeto a existencias" y confirmar modelos por WhatsApp |
| No está listo para San Valentín | Lanzar en octubre o noviembre y dejar enero solo para ajustes |
| Vence el dominio y el sitio se cae | Renovación automática y correo de aviso vigente |

---

## Responsables

| Tarea | Responsable |
|---|---|
| Catálogo completo, fotos, logo, textos, precios y aprobaciones | Dueña de la tienda |
| Diseño, desarrollo, SEO, pruebas y publicación | Desarrollo (en este repo) |
| Compra del dominio y cuentas (Google, analítica) | Dueña (las cuentas deben quedar a nombre de la tienda) |
| Cambio de enlaces en TikTok, Instagram y WhatsApp | Dueña, con la lista de la Fase 5 |

---

## Preguntas abiertas

1. ¿Qué productos hay debajo de lo que se ve en las capturas? (nombre, descripción, precio)
2. ¿Cuál es el número de WhatsApp para pedidos?
3. ¿Cuáles son los enlaces exactos de TikTok e Instagram y el correo?
4. ¿Los precios son en pesos mexicanos? ¿En qué ciudad o zona entregan, y hacen envíos?
5. ¿Cuánto tarda la elaboración de un ramo y piden anticipo? ¿Qué formas de pago aceptan?
6. ¿Qué colores de rosas y de papel ofrecen?
7. ¿Tienen el logo en archivo original y las fotos en buena calidad?
8. ¿Qué dominio prefieren (`rossvtienda.com`, `rossvtienda.mx`, otro)?
