-- Los colores pasan a ser bolitas para elegir (como en las tiendas en línea) y
-- las fotos se asignan a un color desde la lista de fotos del producto. Solo
-- cambia la descripción de las columnas: la forma la valida el sitio al publicar.
--
--   colores: [{ "id": "a1b2c3d4", "nombre": "Azul", "muestra": "#1f4fa3", "disponible": true }]
--   fotos:   [{ "src": "/src/assets/productos/x.jpg", "alt": "...", "color": "a1b2c3d4" }]
--            (sin "color", la foto es para todos los colores)

comment on column public.productos.colores is 'Colores del producto como bolitas: id, nombre, muestra (#rrggbb) y si está disponible. Las fotos se asignan con el id del color.';
comment on column public.productos.fotos is 'Fotos del producto: src, alt opcional y color opcional (id de uno de sus colores; sin él, es para todos). La primera es la de la tarjeta.';
