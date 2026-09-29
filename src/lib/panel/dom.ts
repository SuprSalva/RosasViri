// Crea elementos del DOM. Todo el texto pasa por textContent, así que lo que
// se escribe en el panel nunca se interpreta como HTML.

type Atributos = Record<string, string | number | boolean | undefined | ((evento: Event) => void)>;
type Hijo = Node | string | number | false | null | undefined;

export function el<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  atributos: Atributos = {},
  ...hijos: Hijo[]
): HTMLElementTagNameMap[K] {
  const nodo = document.createElement(etiqueta);
  for (const [nombre, valor] of Object.entries(atributos)) {
    if (valor === undefined || valor === false) continue;
    if (typeof valor === 'function') nodo.addEventListener(nombre.replace(/^on/, ''), valor);
    else if (nombre in nodo && typeof valor !== 'string') (nodo as unknown as Record<string, unknown>)[nombre] = valor;
    else nodo.setAttribute(nombre, valor === true ? '' : String(valor));
  }
  for (const hijo of hijos) {
    if (hijo === false || hijo === null || hijo === undefined) continue;
    nodo.append(typeof hijo === 'number' ? String(hijo) : hijo);
  }
  return nodo;
}

export function $<T extends Element = HTMLElement>(selector: string, raiz: ParentNode = document): T {
  const nodo = raiz.querySelector<T>(selector);
  if (!nodo) throw new Error(`Falta ${selector} en la página del panel.`);
  return nodo;
}

/** "Ramo de 12 Rosas" → "ramo-de-12-rosas" (la dirección en el sitio). */
export function aDireccion(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
