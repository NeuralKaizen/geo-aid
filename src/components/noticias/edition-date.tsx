"use client";

import { fromKey, useTodayKey } from "@/lib/dates";
import { fechaLarga } from "@/lib/format";

/*
 * Fechas que dependen de hoy: solo existen en el navegador (en el servidor la página se prerenderiza una vez).
 * Mientras tanto queda un esqueleto del mismo alto para que la línea no salte al hidratar.
 */

function Skeleton({ width, tone = "light" }: { width: string; tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-[0.9em] translate-y-[0.1em] animate-pulse rounded ${tone === "light" ? "bg-white/20" : "bg-linea"} ${width}`}
    />
  );
}

/** "Miércoles 11 de noviembre de 2026", como la fecha de la edición de un diario. */
export function EditionDate() {
  const today = useTodayKey();
  if (!today) return <Skeleton width="w-48" />;
  const date = fromKey(today);
  const text = `${fechaLarga(date)} de ${date.getFullYear()}`;
  return <time dateTime={today}>{text.charAt(0).toUpperCase() + text.slice(1)}</time>;
}
