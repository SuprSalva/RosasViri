-- Catálogo de Rossvtienda: secciones (categorías) y productos.
--
-- Cualquiera puede leer el catálogo (el sitio lo lee al publicarse). Solo las
-- cuentas de la tabla `administradores` pueden cambiarlo; nadie puede
-- registrarse solo, las cuentas se crean desde el panel de Supabase.
--
-- Las fotos no se guardan aquí: viven en el repositorio (src/assets/) y aquí
-- solo se guarda su ruta, por ejemplo "/src/assets/productos/rosa-eterna-1.jpg".
--
-- Eliminación lógica: nada se borra de verdad. "Eliminar" llena la columna
-- `eliminado` con la fecha; el sitio deja de mostrarlo y desde la Papelera del
-- panel se puede restaurar. La base de datos no permite borrar filas.

create table public.categorias (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text not null check (length(trim(nombre)) > 0),
  corto text not null check (length(trim(corto)) > 0),
  descripcion text not null default '',
  foto text not null check (foto like '/src/assets/%'),
  orden integer not null default 100,
  eliminado timestamptz,
  actualizado timestamptz not null default now()
);

comment on column public.categorias.eliminado is 'Fecha en que se eliminó (vacío = activa). Se restaura desde la Papelera.';
comment on column public.categorias.id is 'Dirección de la sección en el sitio (rosas → /rosas/). No se cambia.';

create table public.productos (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text not null check (length(trim(nombre)) > 0),
  categoria text not null references public.categorias (id) on update cascade on delete restrict,
  resumen text not null default '',
  precio numeric(10, 2) not null check (precio > 0),
  descripcion text not null default '',
  -- [{ "src": "/src/assets/productos/x.jpg", "alt": "..." }]; la primera es la de la tarjeta.
  fotos jsonb not null check (jsonb_typeof(fotos) = 'array' and jsonb_array_length(fotos) > 0),
  -- [{ "nombre": "Color de rosas", "ejemplo": "rojo, rosa..." }]
  opciones jsonb not null default '[]' check (jsonb_typeof(opciones) = 'array'),
  disponible boolean not null default true,
  destacado boolean not null default false,
  orden integer not null default 100,
  eliminado timestamptz,
  actualizado timestamptz not null default now()
);

comment on column public.productos.eliminado is 'Fecha en que se eliminó (vacío = activo). Se restaura desde la Papelera.';
comment on column public.productos.id is 'Dirección del producto en el sitio (/rosas/rosa-eterna/). No se cambia.';

create index productos_categoria on public.productos (categoria);

create function public.marcar_actualizado() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.actualizado = now();
  return new;
end;
$$;

create trigger categorias_actualizado before update on public.categorias
  for each row execute function public.marcar_actualizado();
create trigger productos_actualizado before update on public.productos
  for each row execute function public.marcar_actualizado();

-- Reglas de la eliminación lógica (códigos propios para que el panel explique qué pasó):
--   RV001  no se elimina una sección que todavía tiene productos activos.
--   RV002  no se puede tener un producto activo dentro de una sección eliminada.
create function public.revisar_eliminar_categoria() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.eliminado is not null and old.eliminado is null
     and exists (select 1 from public.productos where categoria = new.id and eliminado is null) then
    raise exception 'La sección "%" todavía tiene productos.', new.id using errcode = 'RV001';
  end if;
  return new;
end;
$$;

create trigger categorias_eliminar before update of eliminado on public.categorias
  for each row execute function public.revisar_eliminar_categoria();

create function public.revisar_categoria_activa() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.eliminado is null
     and exists (select 1 from public.categorias where id = new.categoria and eliminado is not null) then
    raise exception 'La sección "%" está eliminada.', new.categoria using errcode = 'RV002';
  end if;
  return new;
end;
$$;

create trigger productos_categoria_activa before insert or update on public.productos
  for each row execute function public.revisar_categoria_activa();

-- Quién puede usar el panel. Se agrega a mano desde el panel de Supabase.
create table public.administradores (
  usuario uuid primary key references auth.users (id) on delete cascade,
  agregado timestamptz not null default now()
);

create function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.administradores where usuario = (select auth.uid()));
$$;

revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.administradores enable row level security;

-- El público solo ve lo activo; la administración también ve la Papelera.
create policy "Cualquiera lee las secciones activas" on public.categorias
  for select to anon using (eliminado is null);
create policy "Sesión lee secciones activas, administración también eliminadas" on public.categorias
  for select to authenticated using (eliminado is null or (select public.es_admin()));
create policy "Administración crea secciones" on public.categorias
  for insert to authenticated with check ((select public.es_admin()));
create policy "Administración edita secciones" on public.categorias
  for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Cualquiera lee los productos activos" on public.productos
  for select to anon using (eliminado is null);
create policy "Sesión lee productos activos, administración también eliminados" on public.productos
  for select to authenticated using (eliminado is null or (select public.es_admin()));
create policy "Administración crea productos" on public.productos
  for insert to authenticated with check ((select public.es_admin()));
create policy "Administración edita productos" on public.productos
  for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

-- Cada quien solo puede ver si su propia cuenta es de administración.
create policy "Ver la propia fila" on public.administradores
  for select to authenticated using (usuario = (select auth.uid()));

-- Permisos de tabla (las políticas de arriba deciden qué filas). Sin DELETE:
-- desde el sitio o el panel nadie puede borrar filas, solo marcarlas.
revoke all on public.categorias, public.productos, public.administradores from anon, authenticated;
grant select on public.categorias, public.productos to anon, authenticated;
grant insert, update on public.categorias, public.productos to authenticated;
grant select on public.administradores to authenticated;
