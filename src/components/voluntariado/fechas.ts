/*
 * Formatos de fecha para las fichas y la agenda. `fechaCorta` de @/lib/format devuelve "sáb 14 de nov" y aquí hace
 * falta cada parte por separado (día de la semana, número y mes) para armar la ficha como la del hero.
 */

const weekdayShort = new Intl.DateTimeFormat("es-CO", { weekday: "short" });
const weekdayLong = new Intl.DateTimeFormat("es-CO", { weekday: "long" });
const monthShort = new Intl.DateTimeFormat("es-CO", { month: "short" });
const monthLong = new Intl.DateTimeFormat("es-CO", { month: "long" });
const time = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit" });

const clean = (text: string) => text.replace(/\./g, "").trim();

/** "sáb" */
export function diaCorto(date: Date) {
  return clean(weekdayShort.format(date));
}

/** "sábado" */
export function diaLargo(date: Date) {
  return weekdayLong.format(date);
}

/** "nov" */
export function mesCorto(date: Date) {
  return clean(monthShort.format(date));
}

/** "sábado 14 de noviembre" */
export function fechaConDia(date: Date) {
  return `${diaLargo(date)} ${date.getDate()} de ${monthLong.format(date)}`;
}

/** "14 nov 2026" */
export function fechaSimple(date: Date) {
  return `${date.getDate()} ${mesCorto(date)} ${date.getFullYear()}`;
}

/** "14 nov, 9:40 a. m." a partir de un ISO. Conserva los puntos de "a. m.". */
export function fechaYHora(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${mesCorto(date)}, ${time.format(date)}`;
}

export function capitalizar(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
