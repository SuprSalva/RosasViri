# Auditoría de seguridad — Rossvtienda

**Fecha:** 29 de septiembre de 2026
**Alcance:** sitio web (Astro, sitio estático en GitHub Pages), panel de administración (Pages CMS)
y flujo de publicación (GitHub Actions).

## Resumen

No se encontraron vulnerabilidades críticas. El sitio es **estático**: no tiene servidor, base de
datos, cuentas de clientes ni pagos, y no guarda datos personales. Eso elimina la mayoría de los
riesgos habituales de una tienda en línea.

Se aplicaron **9 mejoras** durante la auditoría (marcadas como ✅ Corregido) y quedan
**recomendaciones** que dependen de configuraciones en GitHub o de hábitos al subir fotos.

## Resultados

| # | Área | Resultado | Acción |
|---|---|---|---|
| 1 | Dependencias (`npm audit`) | 0 vulnerabilidades en dependencias de producción y de desarrollo | ✅ Corregido: Dependabot revisa npm y GitHub Actions cada semana (`.github/dependabot.yml`) |
| 2 | Secretos en el código | Se revisaron 61 archivos buscando claves, tokens y contraseñas: ninguno encontrado. El sitio no necesita claves | — |
| 3 | Inyección de código (XSS) | No se usa `innerHTML`, `eval` ni `document.write`. Astro escapa todos los textos del panel | ✅ Corregido: los datos estructurados para Google escapan `<` para que un texto con `</script>` no pueda romper la página |
| 4 | Política de seguridad de contenido (CSP) | No existía | ✅ Corregido: CSP estricta con hashes en cada página (`script-src 'self'` + hashes, `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`). Prueba automática en las 22 páginas: 0 violaciones |
| 5 | Recursos de terceros | Fuentes y scripts se sirven desde el propio sitio (sin CDN de Google Fonts) | ✅ Corregido: se desactivó la incrustación de fuentes como `data:` para mantener la CSP estricta. Google Analytics solo se permite en la CSP si hay un ID configurado |
| 6 | Enlaces externos | Algunos enlaces que abren pestaña nueva no tenían `noreferrer` | ✅ Corregido: todos usan `rel="noopener noreferrer"` y la página declara `Referrer-Policy: strict-origin-when-cross-origin` |
| 7 | Cookies y privacidad | Sin cookies por defecto. Google Analytics, si se activa, **solo se carga después de aceptar** | ✅ Corregido: aviso de cookies, aviso de privacidad y opción de cambiar la decisión; al rechazar se borran las cookies `_ga` |
| 8 | Páginas internas en Google | `/admin/` y la 404 podían aparecer en el buscador | ✅ Corregido: `noindex` y fuera del sitemap |
| 9 | Reporte de problemas | No había un contacto de seguridad | ✅ Corregido: `/.well-known/security.txt` (RFC 9116), generado con el correo de la tienda |
| 10 | Validación de datos del panel | Un error al editar podía publicar un sitio roto | ✅ Corregido: cada publicación valida WhatsApp, correo, enlaces, precios y que las fotos existan; si algo falla, no se publica y el mensaje dice qué corregir |
| 11 | HTTPS | GitHub Pages sirve el sitio con HTTPS | Al conectar el dominio, activar **Enforce HTTPS** en Settings → Pages |
| 12 | Flujo de publicación | Permisos mínimos (`contents: read`, `pages: write`, `id-token: write`), instalación con `npm ci` y revisión de tipos antes de construir | Recomendación: fijar las acciones por SHA; Dependabot ya propondrá las versiones nuevas (las v4 actuales corren en Node 20 forzado a Node 24) |

## Recomendaciones pendientes

Estas no se pueden aplicar desde el código; hay que hacerlas en GitHub o al usar el panel.

1. **Verificación en dos pasos (2FA)** en todas las cuentas de GitHub con acceso al proyecto. Quien
   entra a GitHub puede editar el sitio desde el panel.
2. **Dar acceso solo a quien lo necesite** (Settings → Collaborators) y revisar las apps
   instaladas (Settings → GitHub Apps). Pages CMS necesita permiso de escritura en el contenido.
3. **Activar las alertas de seguridad** en Settings → Code security: *Dependabot alerts* y, si está
   disponible, *Secret scanning*.
4. **Ubicación en las fotos.** Las fotos tomadas con celular pueden llevar la ubicación GPS de donde
   se tomaron. La foto original que se sube al panel queda guardada en el repositorio y se publica
   con el sitio. Antes de subir fotos, desactiva la ubicación en la cámara o usa fotos enviadas por
   WhatsApp, que ya no la llevan.
5. **Encabezados que GitHub Pages no permite configurar**, como la protección contra que otro
   sitio muestre la tienda dentro de un marco (clickjacking), HSTS o Permissions-Policy. El riesgo es
   bajo porque el sitio no tiene acciones sensibles (ni inicio de sesión ni pagos). Si en el futuro
   se necesitan, se puede poner Cloudflare (gratis) delante del dominio propio.
6. **Correo público.** El correo aparece en el sitio y puede recibir spam. Es una decisión de
   negocio; como alternativa, se puede usar un correo dedicado a la tienda.

## Cómo se probó

- `npm audit` y `npm audit --omit=dev`: 0 vulnerabilidades.
- Búsqueda de patrones de claves (AWS, GitHub, Google, Slack, llaves privadas, contraseñas) en
  todos los archivos de texto del proyecto.
- Recorrido automático con Playwright de las 22 páginas: sin enlaces rotos, sin errores de
  JavaScript y sin violaciones de la CSP.
- Prueba del aviso de cookies con un ID de Analytics de prueba: 0 peticiones a Google antes de
  aceptar, se recuerda el rechazo, el botón de preferencias reabre el aviso y Analytics se carga
  solo después de aceptar.
