import { dataNote, sources } from "@/content/site";

/*
 * Bitácora del terremoto. Todo lo de esta página es real: sale de `sources` y `dataNote` (en site.ts) o de los hechos
 * del planteamiento del proyecto. Los titulares se redactan fieles a cada fuente y "Qué significa" es la voz de GeoAid.
 */

/* Fuentes */

export type Fuente = {
  id: string;
  /** medio o entidad, p. ej. "Infobae" */
  medio: string;
  /** fecha completa de la publicación */
  fecha: string;
  /** fecha corta para los chips, p. ej. "14 ago" */
  fechaCorta: string;
  titulo: string;
};

/** Toma una cita de `sources` ("Medio (fecha). Título") y la separa en sus partes. */
function cita(id: string, prefijo: string, fechaCorta: string): Fuente {
  const texto = sources.find((source) => source.startsWith(prefijo));
  const partes = texto?.match(/^(.+?) \((.+?)\)\. (.+)$/);
  if (!partes) throw new Error(`No encontré la fuente "${prefijo}" en site.ts`);
  return { id, medio: partes[1], fecha: partes[2], fechaCorta, titulo: partes[3] };
}

/**
 * Notas al pie en el orden en que aparecen en la página (primero las cifras, después la cronología y al final el
 * contexto). El número de cada nota es su posición en esta lista.
 */
export const fuentes: Fuente[] = [
  { id: "ungrd", medio: "UNGRD", fecha: "10 de octubre de 2026", fechaCorta: "10 oct", titulo: dataNote },
  cita("urna", "Urna de Cristal", "31 ago"),
  cita("infobae-cruz-roja", "Infobae (14 de agosto", "14 ago"),
  cita("pulzo", "Pulzo", "17 ago"),
  cita("vanguardia", "Vanguardia", "5 oct"),
  cita("infobae-defensoria", "Infobae (10 de octubre", "10 oct"),
  cita("blu-radio", "Blu Radio", "12 mar 2024"),
];

export function fuente(id: string) {
  const index = fuentes.findIndex((item) => item.id === id);
  if (index < 0) throw new Error(`Fuente desconocida: ${id}`);
  return { ...fuentes[index], numero: index + 1 };
}

/* Las cifras */

export const cifras = [
  {
    id: "damnificados",
    antes: "",
    valor: "489.862",
    etiqueta: "personas damnificadas",
    fuente: "ungrd",
    corte: "10 de oct. de 2026",
  },
  {
    id: "municipios",
    antes: "",
    valor: "500",
    etiqueta: "municipios con personas damnificadas",
    fuente: "ungrd",
    corte: "10 de oct. de 2026",
  },
  {
    id: "fallecidos",
    antes: "Más de",
    valor: "300",
    etiqueta: "personas fallecidas",
    fuente: "urna",
    corte: "31 de ago. de 2026",
  },
];

/** Dos cortes publicados de la cifra de damnificados. Solo se comparan; no se especula sobre las causas. */
export const comparacion = {
  titular: "La cifra de damnificados casi se duplicó en seis semanas",
  cortes: [
    { fecha: "31 de agosto", valor: 260_000, fuente: "urna" },
    { fecha: "10 de octubre", valor: 489_862, fuente: "ungrd" },
  ],
};

/* Cronología */

export type Tema = "sismo" | "ayudas" | "registro" | "control";

export const temas: { id: Tema; label: string }[] = [
  { id: "sismo", label: "El sismo" },
  { id: "ayudas", label: "Ayudas" },
  { id: "registro", label: "Registro" },
  { id: "control", label: "Control" },
];

export type Hito = {
  id: string;
  /** día, mes abreviado y año, para la columna de fecha */
  fecha: { dia: string; mes: string; anio: string };
  /** la misma fecha en formato AAAA-MM-DD, para <time> */
  iso: string;
  /** la fecha completa, para lectores de pantalla */
  fechaCompleta: string;
  /** días desde el sismo (el 10 de agosto es el día 0) */
  diaSismo: number;
  tema: Tema;
  /** id de la nota al pie; sin fuente cuando el hecho viene del planteamiento del proyecto */
  fuente?: string;
  titular: string;
  /** un hecho más de la misma fuente */
  detalle?: string;
  /** lo que significa para quien quiere ayudar, en la voz de GeoAid */
  significa: string;
  enlace?: { label: string; href: string };
};

export const hitos: Hito[] = [
  {
    id: "sismo",
    fecha: { dia: "10", mes: "ago", anio: "2026" },
    iso: "2026-08-10",
    fechaCompleta: "10 de agosto de 2026",
    diaSismo: 0,
    tema: "sismo",
    fuente: "urna",
    titular: "Un terremoto sacude a Colombia",
    significa:
      "Aquí empieza esta bitácora. Desde este día contamos lo que se ha publicado sobre la emergencia, siempre con su fuente al pie.",
  },
  {
    id: "cruz-roja",
    fecha: { dia: "14", mes: "ago", anio: "2026" },
    iso: "2026-08-14",
    fechaCompleta: "14 de agosto de 2026",
    diaSismo: 4,
    tema: "ayudas",
    fuente: "infobae-cruz-roja",
    titular: "La Cruz Roja aclara qué donaciones necesitan las víctimas y cuáles no",
    detalle: "No recibe ropa usada, medicamentos ni comida perecedera.",
    significa:
      "Una donación que no sirve ocupa espacio y manos que hacen falta para lo urgente. Antes de llevar algo, mira qué recibe cada centro.",
    enlace: { label: "Ver qué recibe cada centro", href: "/centros-de-acopio" },
  },
  {
    id: "bogota-cierra",
    fecha: { dia: "17", mes: "ago", anio: "2026" },
    iso: "2026-08-17",
    fechaCompleta: "17 de agosto de 2026",
    diaSismo: 7,
    tema: "ayudas",
    fuente: "pulzo",
    titular: "Bogotá finaliza la recolección de donaciones por el terremoto",
    detalle: "Los centros de acopio cerraron el 16 y el 17 de agosto porque estaban saturados.",
    significa:
      "Un centro lleno no puede recibir ni clasificar más. Por eso GeoAid muestra la capacidad de cada centro: así sabes si todavía recibe antes de salir de tu casa.",
    enlace: { label: "Ver la capacidad de cada centro", href: "/centros-de-acopio" },
  },
  {
    id: "balance-agosto",
    fecha: { dia: "31", mes: "ago", anio: "2026" },
    iso: "2026-08-31",
    fechaCompleta: "31 de agosto de 2026",
    diaSismo: 21,
    tema: "sismo",
    fuente: "urna",
    titular: "El terremoto deja más de 300 muertos y 260.000 damnificados",
    significa:
      "Es el balance de finales de agosto. Lo usamos como punto de partida para ver cómo cambió la cifra de damnificados en las semanas siguientes.",
  },
  {
    id: "cierre-registro",
    fecha: { dia: "4", mes: "sep", anio: "2026" },
    iso: "2026-09-04",
    fechaCompleta: "4 de septiembre de 2026",
    diaSismo: 25,
    tema: "registro",
    titular: "Cierra el Registro Único de Damnificados",
    detalle: "Familias de zonas rurales quedan por fuera.",
    significa:
      "Si tu familia o tu vereda no alcanzó a registrarse, en GeoAid puedes contar qué les falta para que se vea y la ayuda pueda llegar.",
    enlace: { label: "Registrar una necesidad", href: "/necesito-ayuda" },
  },
  {
    id: "procuraduria",
    fecha: { dia: "5", mes: "oct", anio: "2026" },
    iso: "2026-10-05",
    fechaCompleta: "5 de octubre de 2026",
    diaSismo: 56,
    tema: "control",
    fuente: "vanguardia",
    titular: "La Procuraduría pide a la UNGRD agilizar las ayudas para los damnificados",
    significa:
      "Los organismos de control están pendientes de que la ayuda llegue a tiempo. Cuando cada entrega queda registrada, es más fácil saber qué llegó y qué falta.",
  },
  {
    id: "defensoria",
    fecha: { dia: "10", mes: "oct", anio: "2026" },
    iso: "2026-10-10",
    fechaCompleta: "10 de octubre de 2026",
    diaSismo: 61,
    tema: "registro",
    fuente: "infobae-defensoria",
    titular: "A dos meses del terremoto, la Defensoría pide reabrir el registro de damnificados",
    significa:
      "Si el registro se reabre, más familias podrían quedar incluidas. Mientras tanto, en GeoAid cualquier comunidad puede contar lo que le falta.",
  },
  {
    id: "corte-ungrd",
    fecha: { dia: "10", mes: "oct", anio: "2026" },
    iso: "2026-10-10",
    fechaCompleta: "10 de octubre de 2026",
    diaSismo: 61,
    tema: "sismo",
    fuente: "ungrd",
    titular: "La UNGRD reporta 489.862 damnificados en 500 municipios",
    significa:
      "Es el corte oficial más reciente y el que usamos en todo GeoAid. Casi medio millón de personas en 500 municipios: la ayuda tiene que llegar a muchos lugares a la vez.",
  },
];

/* Contexto: por qué importa seguir cada entrega */

export const contexto = {
  fecha: "12 de marzo de 2024",
  fuente: "blu-radio",
  titular: "Por qué importa poder seguir cada entrega",
  cuerpo: [
    "En marzo de 2024, la Contraloría presentó sus conclusiones sobre el caso de los carrotanques para La Guajira.",
    "No hace parte de este terremoto, pero deja una lección que sí aplica aquí: si una ayuda no se puede seguir, nadie puede comprobar qué llegó ni a quién.",
  ],
  geoaid:
    "Por eso en GeoAid cada donación tiene un código y un recorrido que puedes consultar, desde que sale hasta que se entrega.",
  enlace: { label: "Así seguimos cada donación", href: "/donaciones" },
};
