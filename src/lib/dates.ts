"use client";

import { useSyncExternalStore } from "react";

/*
 * La fecha de hoy solo existe en el navegador: en el servidor la página se prerenderiza una vez y una fecha fija
 * quedaría vieja (además, Cache Components no deja leer la hora durante el prerender). Los componentes que
 * dependen de "hoy" muestran un esqueleto hasta hidratar.
 */

const noop = () => () => {};

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** Hoy como "AAAA-MM-DD" en la zona horaria de la persona, o `null` en el servidor y antes de hidratar. */
export function useTodayKey(): string | null {
  return useSyncExternalStore(noop, todayKey, () => null);
}

/** Convierte "AAAA-MM-DD" en una fecha local al mediodía (evita saltos de día por zona horaria). */
export function fromKey(key: string) {
  return new Date(`${key}T12:00:00`);
}

export function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Días enteros entre dos fechas locales. */
export function daysBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

/** Fecha del terremoto */
export const QUAKE_DATE = "2026-08-10";
