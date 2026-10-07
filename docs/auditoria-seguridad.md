# Auditoría de seguridad — Rossvtienda

**Primera revisión:** 29 de septiembre de 2026 (sitio estático y Pages CMS).
**Actualización:** 7 de octubre de 2026, tras agregar el catálogo en Supabase, el panel propio en
`/admin/`, el servicio `panel`, el conteo de clics en WhatsApp y los enlaces con UTM.

**Alcance:** sitio web (Astro, estático en GitHub Pages), panel del catálogo (`/admin/`), base de
datos y autenticación (Supabase), servicio `panel` (Supabase Edge Functions), Pages CMS y flujo de
publicación (GitHub Actions).

## Resumen

El sitio público sigue siendo **estático**: no tiene cuentas de clientes ni pagos, y no guarda
datos personales de quien lo visita. Lo que cambió es que ahora hay una **parte con inicio de
sesión**: el panel `/admin/`, que escribe en una base de datos y, a través del servicio `panel`,
sube fotos al repositorio y lanza la publicación.

No se encontraron vulnerabilidades críticas. Hay **un hallazgo de riesgo medio** (el panel comparte
dirección con otros proyectos de GitHub Pages, ver #13) que se resuelve al conectar el dominio
propio, y algunos puntos bajos pendientes. Las dependencias (#1), el marco ajeno (#18) y la
fijación de acciones (#20) se corrigieron el mismo día.

## Resultados

### Sitio público

| # | Área | Resultado | Acción |
|---|---|---|---|
| 1 | Dependencias (`npm audit`) | 7 de octubre: 2 avisos altos en paquetes que solo se usan al construir el sitio (`http-cache-semantics` y `source-map-js`); no llegaban al navegador de los visitantes | ✅ Corregido con `npm audit fix`: 0 vulnerabilidades |
| 2 | Secretos en el código | Ninguno. `.env` solo tiene la dirección de Supabase y la **clave pública**, que está pensada para ir en el navegador; lo que protege los datos son las reglas de la base de datos (#9) | — |
| 3 | Inyección de código (XSS) | El sitio no usa `innerHTML`, `eval` ni `document.write`. El panel arma todo con `textContent` (`src/lib/panel/dom.ts`). Los datos para Google escapan `<` | ✅ Correcto |
| 4 | Política de seguridad de contenido (CSP) | CSP estricta con hashes en cada página. `connect-src` solo permite el propio sitio y el proyecto de Supabase; `img-src` agrega `blob:` y `raw.githubusercontent.com` para ver en el panel las fotos recién subidas | ✅ Correcto |
| 5 | Recursos de terceros | Fuentes y scripts se sirven desde el propio sitio. Google Analytics solo entra en la CSP si hay un ID configurado | ✅ Correcto |
| 6 | Enlaces externos | Todos con `rel="noopener noreferrer"` y `Referrer-Policy: strict-origin-when-cross-origin` | ✅ Correcto |
| 7 | Cookies y privacidad | Sin cookies si no hay Analytics. Con Analytics, nada se carga antes de aceptar. El evento `pedido_whatsapp` y la campaña UTM **solo se envían después de aceptar**; la campaña se guarda mientras tanto en `sessionStorage` (no sale del navegador y el aviso de privacidad lo explica) | ✅ Correcto (probado el 7 de octubre) |
| 8 | Páginas internas en Google | `/admin/` y la 404 tienen `noindex` y están fuera del sitemap | ✅ Correcto |
| 9 | Reporte de problemas | `/.well-known/security.txt` (RFC 9116) con el correo de la tienda | ✅ Correcto |

### Base de datos y panel

| # | Área | Resultado | Acción |
|---|---|---|---|
| 10 | Permisos en la base de datos | Seguridad por filas (RLS) activa en las 3 tablas. El público solo **lee** lo activo; crear y editar exige estar en `administradores`. **Nadie tiene permiso de borrar filas** (ni el público ni el panel): solo se marcan como eliminadas | ✅ Correcto |
| 11 | Función `es_admin()` | `security definer` con `search_path = ''` (evita que se suplanten tablas) y sin permiso de ejecución para el público | ✅ Correcto |
| 12 | Registro de cuentas | Registro abierto desactivado (`enable_signup = false`) y sin cuentas anónimas: solo se entra por invitación. Contraseña de al menos 10 caracteres en la configuración local | ⏳ Confirmar lo mismo en el proyecto real: **Authentication → Sign In / Providers** (registro desactivado) y **Authentication → Policies** (longitud mínima y *Leaked password protection*) |
| 13 | **Dirección compartida** | El panel vive en `https://suprsalva.github.io`, la misma dirección (origen) que **otros 7 proyectos** de la cuenta con GitHub Pages (`El-Zarape`, `Mi-Auto`, `OcultaFoto`, `Prueba2`, `PruebaGitHub`, `PruebaGitHub2` y `SuprSalva.github.io`). Para el navegador son el mismo sitio: cualquier código de esos proyectos puede leer la sesión del panel guardada en el navegador y usarla para editar el catálogo. Hoy esos proyectos son tuyos, así que el riesgo depende de que ninguno tenga un fallo o una dependencia comprometida | ⚠️ **Riesgo medio.** Se resuelve al **conectar el dominio propio** (el panel queda en su propia dirección). Mientras tanto: desactiva GitHub Pages en los proyectos de prueba que ya no uses y no des acceso al panel a más personas |
| 14 | Servicio `panel` | Revisa la sesión **dentro** del servicio (`getUser` + `es_admin`) y responde 401 o 403. Las fotos se validan por su contenido real (JPG, PNG o WebP; máximo 8 MB) y el nombre del archivo lo arma el servidor, así que no se puede escribir fuera de `src/assets/productos/` | ✅ Correcto |
| 15 | Clave de GitHub del servicio | Clave *fine-grained* limitada a este repositorio (Contents y Actions). Vive solo en los secretos de Supabase, nunca en el navegador | Recomendación: ponerle **fecha de vencimiento** y anotarla para renovarla a tiempo |
| 16 | Ubicación en las fotos | El panel `/admin/` reduce la foto, la vuelve a guardar como JPG y le quita los datos ocultos (GPS) **antes** de subirla. **Pages CMS no lo hace**: las fotos de la portada y de la galería que se suban por ahí quedan tal cual en el repositorio y se publican | ⏳ Recomendación: subir por Pages CMS solo fotos enviadas por WhatsApp (ya no llevan la ubicación) o con la ubicación de la cámara desactivada |
| 17 | Enlaces de invitación | El panel usa el flujo *implicit*: el enlace del correo trae la sesión en la dirección, y el panel la borra de la barra en cuanto la lee. Es lo que permite abrir la invitación en otro dispositivo | Aceptado |
| 18 | Marco ajeno (clickjacking) | GitHub Pages no permite el encabezado `frame-ancestors`, así que otro sitio podría mostrar el panel dentro de un marco e inducir clics. Ahora que hay inicio de sesión, el riesgo ya no es nulo, aunque es bajo: eliminar pide confirmación y nada se borra de verdad (todo se recupera de la Papelera) | ✅ Corregido: dentro de un marco, el panel no arranca (no lee la sesión ni muestra el formulario) y muestra un aviso con un botón para abrirlo directamente. Con el dominio propio, Cloudflare puede agregar además el encabezado `frame-ancestors` |
| 19 | Verificación en dos pasos | El panel no pide un segundo factor | Opcional: activar TOTP en Supabase (**Authentication → Multi-Factor**) y pedirlo en el panel |

### Publicación

| # | Área | Resultado | Acción |
|---|---|---|---|
| 20 | Flujo de publicación | Permisos mínimos (`contents: read`, `pages: write`, `id-token: write`), `npm ci` y revisión de tipos antes de construir. Si la base de datos falla o viene vacía, no se publica | ✅ Corregido: las 4 acciones van fijadas por SHA (con la versión en un comentario), así un cambio en una etiqueta de otro repositorio no altera la publicación. Dependabot sigue proponiendo las versiones nuevas |
| 21 | Validación de datos | Cada publicación valida WhatsApp, correo, enlaces, precios y que las fotos existan. Un error en el panel o en Pages CMS detiene la publicación y el sitio anterior sigue en línea | ✅ Correcto |
| 22 | HTTPS | GitHub Pages sirve el sitio con HTTPS | Al conectar el dominio, activar **Enforce HTTPS** |

## Recomendaciones pendientes

En orden de importancia:

1. **Conectar el dominio propio** (resuelve #13). Hasta entonces,
   desactivar GitHub Pages en los proyectos de prueba que ya no se usen.
2. **Verificación en dos pasos (2FA)** en las cuentas de GitHub y de Supabase con acceso al
   proyecto. Quien entra a cualquiera de las dos puede cambiar el sitio.
3. **Revisar la configuración de Supabase** del proyecto real (#12): registro desactivado,
   contraseña mínima de 10 caracteres y *Leaked password protection*.
4. **Dar acceso solo a quien lo necesite**: en GitHub (Settings → Collaborators y GitHub Apps; Pages
   CMS necesita escritura) y en Supabase (tabla `administradores`).
5. **Activar las alertas de seguridad** en GitHub (Settings → Code security): *Dependabot alerts* y
   *Secret scanning*.
6. **Clave de GitHub del servicio con vencimiento** (#15).
7. **Fotos sin ubicación en Pages CMS** (#16).
8. **Correo público.** El correo aparece en el sitio y puede recibir spam. Como alternativa, se
   puede usar un correo dedicado a la tienda.

## Cómo se probó

- 29 de septiembre: `npm audit`, búsqueda de patrones de claves en todos los archivos, recorrido
  automático de las 22 páginas (enlaces, errores de JavaScript y CSP) y prueba del aviso de cookies.
- 7 de octubre:
  - `npm audit` (2 avisos altos, ver #1; tras `npm audit fix`, 0).
  - Lectura de las reglas de la base de datos (`supabase/migrations/`), del servicio `panel` y de la
    configuración de autenticación (`supabase/config.toml`).
  - Búsqueda de `innerHTML`, `eval` y similares en el sitio y el panel: ninguno.
  - Lista pública de proyectos de la cuenta con GitHub Pages activo (#13).
  - Prueba en el navegador, con un ID de Analytics de prueba, de que el evento `pedido_whatsapp` y
    la campaña UTM no se envían antes de aceptar ni después de rechazar.
  - Prueba en el navegador del panel dentro de un marco (muestra solo el aviso) y abierto
    directamente (muestra el formulario de entrada).
