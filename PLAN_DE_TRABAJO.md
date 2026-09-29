# Plan de trabajo: sitio web propio para sustituir `beacons.ai/rossvtienda`

**Objetivo:** reemplazar la página actual de Beacons (https://beacons.ai/rossvtienda) por un
sitio web propio, con dominio propio, que haga todo lo que hace hoy la página de Beacons
(enlaces, redes, tienda, contacto) y que además sea de la tienda: sin comisiones de terceros,
con mejor posicionamiento en Google y con la imagen de la marca.

**Repositorio:** `SuprSalva/RosasViri` (este repo; hoy está vacío).

> **Nota:** desde el entorno donde se escribió este plan no se pudo abrir la página de Beacons
> (el acceso a `beacons.ai` está bloqueado por la red). Por eso la **Fase 0** empieza por un
> inventario completo del contenido actual. Hasta completarlo, las secciones que dependen de ese
> contenido quedan marcadas como *por confirmar*.

---

## Resumen

| Fase | Qué se hace | Duración estimada | Entregable |
|---|---|---|---|
| 0. Inventario y decisiones | Capturar todo lo que hay en Beacons y fijar alcance | 1–2 días | Inventario completo + decisiones firmadas |
| 1. Diseño y contenido | Identidad visual, estructura de páginas, fotos y textos | 3–5 días | Maqueta aprobada + contenido listo |
| 2. Desarrollo | Construir el sitio en este repo | 5–8 días | Sitio funcionando en URL de prueba |
| 3. SEO, analítica y legal | Metadatos, medición y avisos legales | 1–2 días | Sitio listo para indexar |
| 4. Pruebas | Revisión en celulares, velocidad, enlaces, pedidos | 1–2 días | Lista de pruebas en verde |
| 5. Lanzamiento y migración | Dominio, cambio de enlaces en redes, retiro de Beacons | 1–2 días | Sitio en línea con dominio propio |
| 6. Seguimiento y Fase 2 | Medir, ajustar y (opcional) pagos en línea | continuo | Reporte mensual y mejoras |

**Tiempo total para el lanzamiento:** unas **3–4 semanas** trabajando a tiempo parcial.
**Costo fijo mínimo:** solo el dominio (unos 12–20 USD al año). El hosting es gratuito.

---

## Fase 0: inventario y decisiones (1–2 días)

### 0.1 Inventario de la página actual de Beacons

Llenar esta lista revisando la página y el panel de Beacons. Capturas de pantalla de la página
completa (en celular y en computadora) sirven como referencia.

- [ ] **Perfil:** nombre exacto de la tienda, foto o logo, biografía o descripción.
- [ ] **Botones o enlaces:** texto exacto de cada botón y a dónde lleva (en orden).
- [ ] **Redes sociales:** Instagram, Facebook, TikTok, WhatsApp, etc. (usuario y URL).
- [ ] **Tienda o catálogo:** por cada producto, nombre, precio, fotos, descripción, variantes
      (talla, color, tamaño) y disponibilidad.
- [ ] **Forma de venta actual:** ¿se paga dentro de Beacons, por WhatsApp, por transferencia o en
      persona? ¿Hay pedidos o pagos pendientes en Beacons?
- [ ] **Formularios:** captura de correos o teléfonos, formulario de contacto.
- [ ] **Suscriptores:** exportar a CSV la lista de contactos o correos desde el panel de Beacons.
- [ ] **Estadísticas:** anotar visitas y clics por botón de los últimos 30 a 90 días. Esta es la
      línea base para comparar después del cambio.
- [ ] **Colores, tipografías y estilo** que se usan hoy.
- [ ] **Dónde está publicado el enlace de Beacons:** biografía de Instagram, Facebook, TikTok,
      estado de WhatsApp, tarjetas, bolsas, etiquetas, códigos QR impresos, anuncios, etc.
- [ ] **Fotos originales** en la mejor resolución disponible (no las comprimidas de Beacons).

### 0.2 Decisiones que hay que tomar

| Decisión | Opciones | Recomendación |
|---|---|---|
| Nombre de la marca en el sitio | "Ross V Tienda", "Rosas Viri", otro | Por confirmar |
| Dominio | `.com`, `.com.mx`, `.shop` | Un `.com` corto y fácil de dictar por teléfono. Revisar disponibilidad antes de elegir. |
| Forma de cobro en el lanzamiento | a) Pedido por WhatsApp · b) Carrito con pago en línea | **a) Pedido por WhatsApp** para lanzar rápido, sin comisiones y sin trámites. El pago en línea queda para la Fase 2. |
| Plataforma | a) Sitio propio en este repo · b) Tienda en Shopify, Tiendanube u otra | **a) Sitio propio** (gratis, rápido y 100 % de la marca). Conviene b) solo si hay más de unos 100 productos con inventario que cambia a diario. |
| Quién actualiza productos | Dueña, desarrollador o ambos | Datos de productos en archivos sencillos, con panel de edición opcional (ver 2.4). |

**Definición de terminado de la Fase 0:** el inventario está completo, las fotos están reunidas,
la lista de suscriptores está exportada y las decisiones de la tabla están tomadas.

---

## Fase 1: diseño y contenido (3–5 días)

### 1.1 Equivalencias entre Beacons y el sitio nuevo

| En Beacons | En el sitio nuevo |
|---|---|
| Foto de perfil + bio | Encabezado de la página de inicio con logo, nombre y frase corta |
| Botones de enlaces | Sección de enlaces destacados en el inicio, con el mismo estilo "link in bio" |
| Íconos de redes | Barra de redes en el encabezado y el pie de página |
| Tienda de Beacons | Catálogo, ficha de cada producto y botón "Pedir por WhatsApp" |
| Formulario o captura de correos | Formulario gratuito (Formspree o Web3Forms) + lista en MailerLite o Brevo, importando el CSV exportado |
| Estadísticas de Beacons | Cloudflare Web Analytics o Google Analytics 4, con parámetros UTM por red social |

### 1.2 Mapa del sitio

1. **Inicio (`/`)**: funciona como el "link in bio" (logo, bio, botones principales, redes) y
   muestra productos destacados. Es lo que se ve al tocar el enlace desde Instagram o Facebook.
2. **Catálogo (`/tienda`)**: todos los productos, con filtros por categoría.
3. **Producto (`/tienda/<producto>`)**: fotos, precio, variantes, descripción y botón
   "Pedir por WhatsApp" con un mensaje ya escrito.
4. **Cómo comprar (`/como-comprar`)**: pasos del pedido, formas de pago, envíos o entregas,
   tiempos y cambios o devoluciones.
5. **Contacto (`/contacto`)**: WhatsApp, redes, horario, ubicación o zona de entrega y formulario.
6. **Aviso de privacidad y términos (`/privacidad`, `/terminos`)**.
7. **Página 404** con enlaces de regreso a la tienda.

### 1.3 Identidad visual

- [ ] Logo en SVG o PNG con fondo transparente, más un ícono cuadrado para favicon y
      vista previa en redes.
- [ ] Paleta de 3 a 5 colores (principal, acento, fondo, texto).
- [ ] Una o dos tipografías de Google Fonts.
- [ ] Diseño pensado primero para celular: casi todas las visitas vendrán de Instagram,
      Facebook y WhatsApp.
- [ ] Maqueta (boceto) del inicio y de la ficha de producto, aprobada antes de programar.

### 1.4 Contenido

- [ ] Fotos de producto con fondo limpio y luz natural, en formato vertical y cuadrado, al menos
      1200 px por lado.
- [ ] Descripción de cada producto: qué es, medidas o tallas, materiales y cuidados.
- [ ] Textos de "Cómo comprar", envíos, pagos y devoluciones.
- [ ] Mensaje de WhatsApp prellenado, por ejemplo:
      *"Hola, me interesa **{producto}** ({variante}) de {precio}. ¿Está disponible?"*

**Definición de terminado de la Fase 1:** maqueta aprobada y todo el contenido (textos + fotos)
en una carpeta compartida.

---

## Fase 2: desarrollo (5–8 días)

### 2.1 Tecnología recomendada

- **Astro**: generador de sitios estáticos. Produce páginas muy rápidas, buenas para SEO y sin
  servidor que mantener.
- **CSS propio** (sin frameworks pesados). Las imágenes se optimizan automáticamente
  (WebP o AVIF, varios tamaños).
- **Datos de productos** en archivos Markdown o JSON dentro del repo (una "colección" de Astro).
  Agregar un producto es agregar un archivo.
- **Hosting gratuito:** GitHub Pages con despliegue automático por GitHub Actions en cada cambio.
  Cloudflare Pages o Netlify son alternativas equivalentes.
- **Formularios:** Formspree o Web3Forms (plan gratuito), sin servidor propio.

### 2.2 Estructura propuesta del repositorio

```
RosasViri/
├── PLAN_DE_TRABAJO.md
├── README.md                 # Cómo correr, editar productos y publicar
├── astro.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── og-image.jpg          # Imagen de vista previa en redes y WhatsApp
├── src/
│   ├── content/
│   │   └── productos/        # Un archivo .md por producto
│   ├── data/
│   │   └── sitio.json        # Nombre, bio, WhatsApp, redes, enlaces del inicio
│   ├── components/           # Encabezado, TarjetaProducto, BotonWhatsApp, Redes, Pie...
│   ├── layouts/
│   │   └── Base.astro        # <head>, SEO, Open Graph, analítica
│   ├── pages/
│   │   ├── index.astro
│   │   ├── tienda/index.astro
│   │   ├── tienda/[slug].astro
│   │   ├── como-comprar.astro
│   │   ├── contacto.astro
│   │   ├── privacidad.astro
│   │   └── 404.astro
│   └── styles/global.css
└── .github/workflows/deploy.yml
```

Ejemplo de ficha de producto (`src/content/productos/ejemplo.md`):

```md
---
nombre: "Nombre del producto"
precio: 350
moneda: "MXN"            # por confirmar
categoria: "Categoría"
fotos: ["./fotos/ejemplo-1.jpg", "./fotos/ejemplo-2.jpg"]
variantes: ["Chico", "Mediano", "Grande"]
disponible: true
destacado: true
---
Descripción del producto, medidas, materiales y cuidados.
```

### 2.3 Tareas de desarrollo (en orden)

1. [ ] Crear el proyecto Astro, configurar el despliegue en GitHub Pages y publicar una página
       de prueba. Así el flujo de publicación queda probado desde el día 1.
2. [ ] Layout base: `<head>` con título, descripción, Open Graph, favicon y fuentes.
3. [ ] Componentes: encabezado, redes, botón de WhatsApp flotante y pie de página.
4. [ ] Página de inicio estilo "link in bio" con los mismos enlaces que Beacons.
5. [ ] Colección de productos, con validación de campos para que un error en un archivo no
       rompa el sitio en silencio.
6. [ ] Catálogo con filtro por categoría y etiqueta de "agotado".
7. [ ] Ficha de producto: galería, selector de variante y enlace `https://wa.me/<número>?text=...`
       con el mensaje prellenado.
8. [ ] Páginas de Cómo comprar, Contacto (con formulario), Privacidad, Términos y 404.
9. [ ] Accesibilidad básica: textos alternativos en fotos, contraste, navegación con teclado.
10. [ ] `README.md` con instrucciones para agregar o editar productos sin saber programar.

### 2.4 Edición de productos por la dueña (opcional, recomendado)

- **Opción simple:** editar los archivos desde la web de GitHub (botón de lápiz). Cada guardado
  publica el sitio solo.
- **Opción con panel:** conectar un CMS gratuito basado en Git (por ejemplo Pages CMS o
  Decap CMS). Da un formulario con campos "Nombre, Precio, Fotos...", sin tocar código.

**Definición de terminado de la Fase 2:** todas las páginas funcionan en la URL de prueba de
GitHub Pages con contenido real.

---

## Fase 3: SEO, analítica y legal (1–2 días)

### SEO

- [ ] Título y descripción únicos por página. Datos estructurados `Product` en cada ficha y
      `LocalBusiness` en el inicio (si hay tienda física o zona de entrega).
- [ ] `sitemap.xml` y `robots.txt` (con la integración oficial de Astro).
- [ ] Imagen Open Graph para que el enlace se vea bien al compartirlo en WhatsApp o Facebook.
- [ ] Alta en **Google Search Console** y envío del sitemap.
- [ ] Crear o actualizar el **Perfil de Empresa de Google** con el enlace al sitio nuevo.

### Analítica

- [ ] Cloudflare Web Analytics (gratis, sin cookies) o Google Analytics 4.
- [ ] Contar como "evento" cada clic en "Pedir por WhatsApp". Es la métrica de ventas principal.
- [ ] Enlaces con UTM por canal, por ejemplo `?utm_source=instagram&utm_medium=bio`, para saber
      de qué red llega cada visita.
- [ ] Meta Pixel **solo** si se van a pagar anuncios en Facebook o Instagram, con aviso de cookies.

### Legal

- [ ] Aviso de privacidad según la ley del país donde opera la tienda (en México, la
      LFPDPPP), sobre todo si el sitio recoge nombre, teléfono o correo.
- [ ] Políticas de envío, cambios y devoluciones.

---

## Fase 4: pruebas (1–2 días)

- [ ] Revisar en iPhone (Safari) y Android (Chrome), también **dentro del navegador de
      Instagram y de Facebook**, que es donde se abrirá la mayoría de las veces.
- [ ] Lighthouse con 90 o más en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- [ ] Todos los enlaces funcionan y no hay ninguno roto.
- [ ] El botón de WhatsApp abre el chat correcto con el mensaje correcto en cada producto.
- [ ] El formulario llega al correo de la tienda.
- [ ] La vista previa del enlace se ve bien al pegarlo en WhatsApp y Facebook (se revisa con el
      depurador de compartir de Meta).
- [ ] Revisión final de textos, precios y ortografía por la dueña.

---

## Fase 5: lanzamiento y migración (1–2 días)

1. [ ] **Comprar el dominio** (Cloudflare Registrar, Namecheap o Porkbun; para `.com.mx`, Akky).
2. [ ] Apuntar el dominio a GitHub Pages, activar HTTPS y probar `www` y sin `www`.
3. [ ] **Cambiar el enlace** en: biografía de Instagram, Facebook (página y botón de acción),
       TikTok, WhatsApp Business (perfil y catálogo), Perfil de Empresa de Google y cualquier
       otro lugar anotado en el inventario de la Fase 0.
4. [ ] Generar un **código QR nuevo** al dominio para tarjetas, bolsas y etiquetas.
5. [ ] Importar los suscriptores exportados de Beacons a MailerLite o Brevo, y enviar un aviso
       de "¡Estrenamos página!".
6. [ ] Publicar el lanzamiento en redes (historia + publicación).
7. [ ] **No borrar Beacons de inmediato.** Durante 2 o 3 meses dejar la página de Beacons con un
       solo botón grande: "Nuestra tienda se mudó a **<dominio>**". Así no se pierden visitas de
       publicaciones viejas, QR impresos o enlaces guardados.
8. [ ] Pasado ese periodo, confirmar que no queden pedidos, pagos ni suscripciones activas en
       Beacons, y cancelar el plan si es de pago.

### Lista de verificación el día del lanzamiento

- [ ] El dominio abre con candado (HTTPS).
- [ ] El inicio muestra los mismos enlaces que tenía Beacons.
- [ ] Un pedido de prueba por WhatsApp llega bien.
- [ ] La analítica registra visitas.
- [ ] El enlace de la biografía de Instagram ya apunta al dominio nuevo.

---

## Fase 6: seguimiento y mejoras

### Primer mes

- Revisar cada semana visitas, clics en WhatsApp y canal de origen, y comparar con las
  estadísticas de Beacons de la Fase 0.
- Ajustar el orden de productos y botones según lo que más se usa.

### Mantenimiento

- Mantener productos, precios y agotados al día (idealmente cada semana).
- Actualizar dependencias del proyecto cada trimestre.
- Renovación anual del dominio con renovación automática activada.

### Fase 2 opcional: pago en línea

Cuando el volumen de pedidos lo justifique:

- Agregar carrito y pago con **Stripe**, **Mercado Pago** o **PayPal** (según país y preferencia),
  empezando con enlaces de pago por producto, que no requieren servidor.
- Si el catálogo crece mucho o se necesita inventario automático, evaluar mover solo la tienda
  a Shopify o Tiendanube y dejar este sitio como portada de la marca.

---

## Riesgos y cómo evitarlos

| Riesgo | Cómo evitarlo |
|---|---|
| Se pierden visitas de enlaces viejos a Beacons | Mantener Beacons con un botón "Nos mudamos" durante 2 o 3 meses |
| Se pierden suscriptores o pedidos de Beacons | Exportar el CSV y revisar pedidos o pagos pendientes antes de cerrar (Fase 0 y Fase 5) |
| La dueña no puede actualizar productos | Productos en archivos simples + README + panel CMS opcional |
| El sitio se ve mal dentro de Instagram o Facebook | Probar en esos navegadores integrados (Fase 4) |
| Vence el dominio y el sitio se cae | Renovación automática y correo de aviso vigente |
| Precios o fotos desactualizados | Revisión semanal y etiqueta de "agotado" en lugar de borrar productos |

---

## Responsables

| Tarea | Responsable |
|---|---|
| Inventario, fotos, textos, precios y aprobaciones | Dueña de la tienda |
| Diseño, desarrollo, SEO, pruebas y publicación | Desarrollo (en este repo) |
| Compra del dominio y cuentas (Google, analítica, formularios) | Dueña (las cuentas deben quedar a nombre de la tienda) |
| Cambio de enlaces en redes | Dueña, con la lista de la Fase 5 |

---

## Preguntas abiertas (para arrancar)

1. ¿Qué contiene exactamente la página de Beacons hoy? Bastan capturas de pantalla o la lista
   de la sección 0.1.
2. ¿Nombre oficial de la marca y dominio deseado?
3. ¿En qué país y ciudad opera la tienda, y en qué moneda se cobra?
4. ¿Cuántos productos hay, y cada cuánto cambian?
5. ¿Hoy se cobra dentro de Beacons? ¿Hay pedidos o pagos pendientes ahí?
6. ¿Número de WhatsApp para pedidos? ¿Es WhatsApp Business?
7. ¿Hacen envíos, entregas en punto de encuentro o tienen tienda física?
8. ¿Existe ya un logo y colores de marca, o hay que definirlos?
