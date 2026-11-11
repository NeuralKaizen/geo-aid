"use client";

import { useSyncExternalStore } from "react";

/*
 * Lo que la persona hace en el prototipo (donar, tomar un turno, registrar una necesidad, reportar, abrir un punto)
 * queda guardado en este navegador con localStorage, y "Mi portal" lo muestra junto a la historia de ejemplo.
 * No sale del navegador: no hay servidor ni base de datos.
 */

type Base = { id: string; code: string; createdAt: string };

export type DonationRecord = Base & {
  kind: "donacion";
  amount: number;
  /** destino legible, p. ej. "Vereda La Palma, Morales (Cauca)" o "Donde más se necesite" */
  destination: string;
  method: string;
  frequency: "unica" | "mensual";
};

export type ShiftRecord = Base & {
  kind: "turno";
  shiftId: string;
  task: string;
  place: string;
  city: string;
  /** fecha del turno en formato AAAA-MM-DD */
  date: string;
  hours: string;
};

export type NeedRecord = Base & {
  kind: "necesidad";
  needs: string[];
  place: string;
  people: number;
  forCommunity: boolean;
};

export type ReportRecord = Base & {
  kind: "reporte";
  personName: string;
  place: string;
};

export type TipRecord = Base & {
  kind: "pista";
  personName: string;
};

export type PointRecord = Base & {
  kind: "punto";
  name: string;
  place: string;
};

export type ActivityRecord = DonationRecord | ShiftRecord | NeedRecord | ReportRecord | TipRecord | PointRecord;
export type ActivityKind = ActivityRecord["kind"];

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type NewActivity = DistributiveOmit<ActivityRecord, "id" | "createdAt">;

const KEY = "geoaid:actividad";
const listeners = new Set<() => void>();
let cache: ActivityRecord[] | null = null;

function read(): ActivityRecord[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: ActivityRecord[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento (modo privado, cuota llena): sigue funcionando en memoria mientras la pestaña viva
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Actividad guardada, de la más reciente a la más antigua. `null` en el servidor y antes de hidratar. */
export function useActivity(): ActivityRecord[] | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Guarda un registro y lo devuelve con su id y fecha. Llamar solo desde eventos (clic, envío). */
export function addActivity<T extends NewActivity>(record: T): T & { id: string; createdAt: string } {
  const saved = { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write([saved as ActivityRecord, ...read()]);
  return saved;
}

export function removeActivity(id: string) {
  write(read().filter((record) => record.id !== id));
}

/** Código corto y legible para radicados y seguimientos, p. ej. "GA-48213". Solo en eventos del cliente. */
export function newCode(prefix: string) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
}
