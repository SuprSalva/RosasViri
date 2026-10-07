# Auditoría de seguridad — Rossvtienda

**Primera revisión:** 29 de septiembre de 2026 (sitio estático).
**Actualización:** 7 de octubre de 2026 (panel del catálogo con Supabase).
**Alcance:** sitio web (Astro, sitio estático en GitHub Pages), panel del catálogo en `/admin/`
(Supabase: base de datos, cuentas y el servicio `panel`), Pages CMS y flujos de GitHub Actions.

## Resumen

No se encontraron vulnerabilidades críticas.

- El **sitio publicado sigue siendo estático**: no guarda datos de clientes, no tiene pagos y los
  formularios solo preparan mensajes de WhatsApp.
- El **panel del catálogo** agrega cuentas de administración y una base de datos. Los permisos están
  bien planteados: el público solo puede leer el catálogo activo, solo las cuentas de
  administración pueden crear o editar, nadie puede borrar filas y la clave de GitHub vive solo en
  el servidor.
- En la actualización del 7 de octubre se aplicaron **4 mejoras** (marcadas ✅ en la segunda tabla)
  y quedan **recomendaciones** que se configuran en Supabase o GitHub.

## 1. Sitio público (revisión del 29 de septiembre, vigente)

| # | Área | Resultado | Acción |
|---|---|---|---|
| 1 | Dependencias (`npm audit`) | 0 vulnerabilidades | ✅ Dependabot revisa npm y GitHub Actions cada semana (`.github/dependabot.yml`) |
| 2 | Secretos en el código | Ninguno en los archivos del proyecto | — |
| 3 | Inyección de código (XSS) | No se usa `innerHTML`, `eval` ni `document.write`. Astro escapa los textos | ✅ Los datos estructurados para Google escapan `<` |
| 4 | Política de seguridad de contenido (CSP) | No existía | ✅ CSP estricta con hashes en cada página. Prueba automática: 0 violaciones |
| 5 | Recursos de terceros | Fuentes y scripts servidos desde el propio sitio | ✅ Sin fuentes incrustadas como `data:`; Google Analytics solo si hay un ID |
| 6 | Enlaces externos | — | ✅ `rel="noopener noreferrer"` y `Referrer-Policy: strict-origin-when-cross-origin` |
| 7 | Cookies | Sin cookies por defecto | ✅ Google Analytics solo después de aceptar; se puede cambiar la decisión |
| 8 | Páginas internas en Google | — | ✅ `/admin/` y la 404 con `noindex` y fuera del sitemap |
| 9 | Reporte de problemas | — | ✅ `/.well-known/security.txt` |
| 10 | Validación de datos | — | ✅ Si un dato o una foto está mal, no se publica y el error dice qué corregir |
| 11 | HTTPS | GitHub Pages sirve con HTTPS | Al conectar un dominio, activar **Enforce HTTPS** |

## 2. Panel del catálogo con Supabase (revisión del 7 de octubre)

| # | Área | Resultado | Acción |
|---|---|---|---|
| 12 | Clave pública en `.env` | Es la clave `anon` (se comprobó su rol), hecha para ser pública. En el historial no hay claves de servicio | — |
| 13 | Permisos de la base de datos (RLS) | El público solo lee secciones y productos **activos**. Las cuentas con sesión solo pueden crear o editar si están en `administradores` (`es_admin()`, `security definer` con `search_path` vacío y sin permiso para `anon`). Nadie tiene permiso de borrar filas | — |
| 14 | Registro de cuentas | Cerrado en la configuración local (`enable_signup = false`). Aunque alguien lograra crear una cuenta, no podría cambiar nada sin estar en `administradores` | Comprobar que también esté cerrado en el proyecto real (ver recomendaciones) |
| 15 | Servicio `panel` (Edge Function) | Revisa la sesión con `auth.getUser` y el permiso con `es_admin()` antes de cualquier acción. CORS solo para los sitios de `ORIGENES`. Acepta solo JPG, PNG o WebP según los primeros bytes del archivo (no el nombre), hasta 8 MB, con nombre saneado, sufijo aleatorio y carpeta fija | — |
| 16 | Clave de GitHub (`TOKEN_GITHUB`) | Solo está en los secretos de Supabase; el navegador nunca la ve. Limitada a este repositorio con *Contents* y *Actions* | Caduca: anotar la fecha y renovarla antes |
| 17 | Fotos subidas desde el panel | El navegador las vuelve a guardar como JPG de máximo 1600 px, lo que **borra la ubicación GPS** y otros datos ocultos | — (las fotos subidas con Pages CMS no pasan por este proceso) |
| 18 | Correos en el historial público | El servicio de fotos ponía el correo de quien subía la foto en el mensaje del commit, y Pages CMS guardaba los cambios con el correo de quien editaba | ✅ El servicio usa un identificador corto de la cuenta y Pages CMS guarda a nombre de la app. **Hay que volver a subir el servicio a Supabase** para que aplique (README → *Actualizar el servicio del panel*). Los commits ya publicados no se reescriben |
| 19 | CSP con el panel | `connect-src` agrega solo el origen de Supabase; `img-src` agrega `blob:` y `raw.githubusercontent.com` para la vista previa de fotos recién subidas | — |
| 20 | Sesión del panel en el navegador | Supabase guarda la sesión en el almacenamiento del sitio. Todo lo publicado en `suprsalva.github.io` comparte ese almacenamiento, incluidos otros proyectos de la misma cuenta con GitHub Pages | Riesgo bajo mientras no se publiquen otros sitios con código de terceros en esa cuenta. Se resuelve del todo con un dominio propio |
| 21 | Disponibilidad (pausa de Supabase) | El plan gratis pausa el proyecto tras 7 días sin uso. La consulta era semanal y la del 5 de octubre no llegó a correr: GitHub no le asignó máquina | ✅ Nuevo flujo `mantener-supabase.yml`: consulta lunes, miércoles y viernes y avisa si falla |
| 22 | Dependencias | `npm audit`: 2 vulnerabilidades altas en dependencias indirectas que solo se usan al compilar (`http-cache-semantics` y `source-map-js`); el sitio publicado no las ejecuta | ✅ `npm audit fix` (solo cambia `package-lock.json`): 0 vulnerabilidades |
| 23 | Publicación ante fallas | Si la base de datos no responde o viene vacía, no se publica y el sitio anterior sigue en línea | — |
| 24 | Pruebas | Los permisos y el panel se probaron a mano con Supabase local; no hay pruebas automáticas | Recomendación opcional |

## Recomendaciones pendientes

Se configuran fuera del código, en Supabase o en GitHub.

1. **Supabase → Authentication:**
   - Desactiva **Allow new users to sign up**.
   - Pon como *Site URL* y *Redirect URLs* `https://suprsalva.github.io/RosasViri/admin/`. Si quedan
     en `localhost`, los correos de invitación y de recuperar contraseña no funcionan.
2. **Volver a subir el servicio `panel`** a Supabase para que ya no ponga correos en el historial
   (`npx supabase functions deploy panel --project-ref …`).
3. **Clave de GitHub del panel:** anota cuándo vence y renuévala antes. Si se filtra, revócala en
   GitHub → Settings → Developer settings y crea otra.
4. **Verificación en dos pasos** en GitHub y en Supabase para todas las cuentas con acceso, y
   contraseñas largas y distintas para las cuentas del panel.
5. **Pocas cuentas de administración.** Revisa de vez en cuando la tabla `administradores` y
   **Authentication → Users**, y quita a quien ya no necesite acceso.
6. **Correo en los commits hechos desde la computadora:** activa en GitHub **Keep my email
   addresses private** y usa el correo `@users.noreply.github.com` en git.
7. **Alertas de seguridad:** en GitHub → Settings → Code security, activa *Dependabot alerts* y
   *Dependabot security updates*.
8. **Protección contra marcos (clickjacking):** GitHub Pages no deja enviar el encabezado que impide
   mostrar `/admin/` dentro de otro sitio. El riesgo es bajo (lo eliminado va a la Papelera y se
   puede restaurar), pero se puede reforzar con un dominio propio detrás de Cloudflare o con un
   pequeño código que oculte el panel si se abre dentro de un marco.
9. **Fotos subidas con Pages CMS** (galería, portada): desactiva la ubicación en la cámara o usa fotos
   enviadas por WhatsApp, que ya no la llevan.
10. **Correo público.** El correo aparece en el sitio y puede recibir spam; es una decisión de
    negocio.

## Cómo se probó

**29 de septiembre:** `npm audit`, búsqueda de claves en el proyecto, recorrido automático con
Playwright de las 22 páginas (sin enlaces rotos, errores de JavaScript ni violaciones de la CSP) y
prueba del aviso de cookies con un ID de Analytics de prueba.

**7 de octubre:**

- `npm audit` antes y después de `npm audit fix`.
- Búsqueda de claves (GitHub, AWS, Google, Slack, `service_role`, `sb_secret_`, llaves privadas) en
  los 62 archivos de texto del proyecto y en el historial de los `.env`: ninguna.
- Rol de la clave de `.env`, comprobado leyendo su contenido sin publicarlo: `anon`.
- Revisión del código de las migraciones, del servicio `panel`, del panel y de la configuración
  de Supabase.
- Historial de ejecuciones de GitHub Actions.
- Compilación con un servidor de prueba que imita la base de datos, porque desde el entorno de la
  revisión no hay acceso a Supabase.
