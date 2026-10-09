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

## Administración

Hay dos paneles:

- **Catálogo** (productos, precios, fotos y secciones): el panel propio del sitio en
  [`/admin/`](https://suprsalva.github.io/RosasViri/admin/). Guarda los datos en una base de datos
  de [Supabase](https://supabase.com) y las fotos en este repositorio.
- **Textos del sitio** (portada, datos de la tienda, cómo pedir, galería, opiniones, aviso de
  privacidad): [Pages CMS](https://app.pagescms.org), configurado en [`.pages.yml`](.pages.yml).

En los dos, cada cambio se publica solo en uno o dos minutos.

### Panel del catálogo (`/admin/`)

Se entra con correo y contraseña. Desde ahí se puede:

- Crear y editar productos: nombre, sección, precio, texto corto, descripción, **varias fotos**
  (subir, ordenar, describir, quitar), preguntas para el cliente, destacado y orden.
- Marcar un producto como agotado con el interruptor **Disponible**, directo en la lista.
- Crear y editar secciones del catálogo, con su foto de portada.
- **Eliminar sin perder nada:** lo eliminado deja de verse en el sitio y pasa a la **Papelera**,
  desde donde se restaura. La base de datos no permite borrar productos ni secciones de verdad.

Al subir una foto, el panel la reduce a 1600 px, la guarda como JPG y le quita los datos ocultos
(como la ubicación GPS del celular).

**Dar acceso a una persona:** en Supabase, **Authentication → Users → Invite user** con su correo
(le llega un enlace para crear su contraseña). Después, en **SQL Editor**, dale permiso:

```sql
insert into public.administradores (usuario)
select id from auth.users where email = 'correo@ejemplo.com';
```

Nadie puede registrarse solo. Para quitar el acceso, borra a la persona en **Authentication → Users**.

### Cómo está hecho

| Parte | Dónde |
|---|---|
| Tablas, permisos y reglas (eliminación lógica) | [`supabase/migrations/`](supabase/migrations/) |
| Servicio que sube fotos al repositorio y lanza la publicación | [`supabase/functions/panel/`](supabase/functions/panel/index.ts) |
| Panel | [`src/pages/admin.astro`](src/pages/admin.astro) y [`src/lib/panel/`](src/lib/panel/) |
| Lectura del catálogo al publicar | [`src/lib/basedatos.ts`](src/lib/basedatos.ts) y [`src/content.config.ts`](src/content.config.ts) |

- El sitio lee el catálogo **al publicarse**, con la clave pública (solo lectura, solo lo activo).
  Si la base de datos no responde o viene vacía, la publicación se detiene y el sitio anterior
  sigue en línea.
- La conexión pública está en [`.env`](.env) (`PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`);
  no son secretos.
- El servicio `panel` necesita estos secretos en Supabase (**Edge Functions → Secrets**):
  `TOKEN_GITHUB` (clave de GitHub *fine-grained* solo para este repositorio, con **Contents: Read
  and write** y **Actions: Read and write**) y `ORIGENES` (`https://suprsalva.github.io`).
- Una publicación automática semanal evita que el proyecto gratis de Supabase se pause por falta de
  uso.

### Consejos

- **Producto agotado:** apaga "Disponible". No hace falta eliminarlo.
- **Si algo está mal escrito** en Pages CMS (por ejemplo, un WhatsApp sin código de país o una foto
  que no existe), la publicación se detiene y el sitio anterior sigue en línea. El error aparece en
  la pestaña **Actions** de GitHub con el detalle de qué corregir.

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

## Enlaces para redes sociales

Usa estos enlaces (y no el del sitio a secas) en cada lugar donde se comparta la tienda. Así
Google Analytics dice de qué red llega cada visita y cada pedido por WhatsApp (en **Informes →
Adquisición → Adquisición de tráfico**, por *Fuente/medio de la sesión*).

| Dónde | Enlace |
|---|---|
| Biografía de Instagram | `https://suprsalva.github.io/RosasViri/?utm_source=instagram&utm_medium=social&utm_campaign=biografia` |
| Biografía de TikTok | `https://suprsalva.github.io/RosasViri/?utm_source=tiktok&utm_medium=social&utm_campaign=biografia` |
| Facebook | `https://suprsalva.github.io/RosasViri/?utm_source=facebook&utm_medium=social&utm_campaign=biografia` |
| Perfil y catálogo de WhatsApp Business | `https://suprsalva.github.io/RosasViri/?utm_source=whatsapp&utm_medium=social&utm_campaign=perfil` |
| Estados de WhatsApp | `https://suprsalva.github.io/RosasViri/?utm_source=whatsapp&utm_medium=social&utm_campaign=estados` |
| Perfil de Empresa de Google | `https://suprsalva.github.io/RosasViri/?utm_source=google&utm_medium=organic&utm_campaign=perfil-empresa` |
| Código QR (tarjetas, etiquetas, bolsas) | `https://suprsalva.github.io/RosasViri/?utm_source=qr&utm_medium=impreso&utm_campaign=tarjeta` |
| Página de Beacons ("Nos mudamos") | `https://suprsalva.github.io/RosasViri/?utm_source=beacons&utm_medium=referral&utm_campaign=mudanza` |

- Para una publicación o temporada, cambia `utm_campaign` (por ejemplo `utm_campaign=san-valentin`).
  Usa siempre minúsculas y guiones, sin espacios ni acentos.
- Funcionan con cualquier página, no solo con el inicio: por ejemplo
  `https://suprsalva.github.io/RosasViri/girasoles/?utm_source=tiktok&utm_medium=social&utm_campaign=flores-amarillas`.
- Al conectar el dominio propio, cambia `https://suprsalva.github.io/RosasViri/` por el dominio
  en todos los enlaces (y genera el QR con el enlace nuevo).
- La red de origen se cuenta aunque la persona acepte las cookies en otra página que no sea la de
  llegada: el sitio la recuerda durante la visita.

## Cookies y privacidad

- El sitio **no usa cookies** mientras no se active Google Analytics.
- Para medir visitas, pega el ID de Google Analytics (empieza con `G-`) en **Datos de la tienda →
  Google**. A partir de ahí aparece el aviso de cookies: Analytics solo se carga si la persona
  acepta, y puede cambiar su decisión en "Preferencias de cookies" al pie de la página. La sección
  de cookies del aviso de privacidad se actualiza sola.
- **Clics en WhatsApp:** cada clic en un botón de WhatsApp (y cada envío del formulario de
  pedidos personalizados) se registra en Analytics como el evento `pedido_whatsapp`, con el
  `producto` ("General" en los botones que no son de un producto), la `pagina` y el precio. Para
  ver los productos en los informes, en Analytics ve a **Administrar → Definiciones
  personalizadas → Crear dimensión personalizada** y crea una de tipo *Evento* con el parámetro
  `producto` (y otra con `pagina`, si quieres). Solo se cuentan las visitas que aceptaron las
  cookies.
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

Por defecto, `npm run dev` lee el catálogo de la base de datos real (la de `.env`). Si subes fotos
desde el panel, llegan a GitHub: haz `git pull` para verlas en tu computadora (mientras tanto, el
servidor local las omite con un aviso).

**Base de datos de prueba en tu computadora** (necesita Docker Desktop abierto):

```sh
npx supabase start      # levanta Supabase local con el catálogo actual
npx supabase db reset   # vuelve a dejarla como al inicio
npx supabase stop       # la apaga
```

Para que el sitio use la base local, crea `.env.local` con `PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
y la `ANON_KEY` que muestra `npx supabase status`. Los correos (invitaciones, recuperar
contraseña) se ven en http://127.0.0.1:54324.

La política de seguridad de contenido (CSP) solo funciona en el sitio construido; para probarla usa
`npm run build` y `npx astro preview`.

En la computadora, `npm run build` deja el HTML de `dist/` con saltos de línea para poder leerlo; al
publicar en GitHub se comprime en un solo renglón. Para ver localmente la versión exacta que se
publica: `$env:CI = 'true'; npm run build` (PowerShell) o `CI=true npm run build` (Git Bash).

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
