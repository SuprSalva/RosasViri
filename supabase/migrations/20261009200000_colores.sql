-- Colores de un producto: la misma flor en varios colores, cada uno con su
-- foto. En el sitio, el cliente elige uno y va en el mensaje de WhatsApp.
--
-- [{ "nombre": "Azul", "foto": "/src/assets/productos/x.jpg", "disponible": true }]

alter table public.productos
  add column colores jsonb not null default '[]' check (jsonb_typeof(colores) = 'array');

comment on column public.productos.colores is 'Colores en que se ofrece el producto, cada uno con su foto y si está disponible.';
