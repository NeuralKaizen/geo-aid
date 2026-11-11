/** Formatos en español de Colombia, compartidos por todas las páginas. */

const pesosFormat = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
const numberFormat = new Intl.NumberFormat("es-CO");

/** 85000 → "$85.000" */
export function pesos(value: number) {
  return `$${pesosFormat.format(value)}`;
}

/** 489862 → "489.862" */
export function numero(value: number) {
  return numberFormat.format(value);
}

/** Partes de una fecha sin los puntos de las abreviaturas ("sáb.", "nov.") */
function partes(date: Date, options: Intl.DateTimeFormatOptions) {
  const out: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
  for (const part of new Intl.DateTimeFormat("es-CO", options).formatToParts(date)) {
    out[part.type] = part.type === "dayPeriod" ? part.value : part.value.replace(/\./g, "");
  }
  return out;
}

/** "sáb 14 nov" */
export function fechaCorta(date: Date) {
  const p = partes(date, { weekday: "short", day: "numeric", month: "short" });
  return `${p.weekday} ${p.day} ${p.month}`;
}

/** "sábado 14 de noviembre" */
export function fechaLarga(date: Date) {
  const p = partes(date, { weekday: "long", day: "numeric", month: "long" });
  return `${p.weekday} ${p.day} de ${p.month}`;
}

/** "14 nov 2026, 9:40 a. m." a partir de un ISO */
export function fechaHora(iso: string) {
  const p = partes(new Date(iso), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod ?? ""}`.trim();
}
