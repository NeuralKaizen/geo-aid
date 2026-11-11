import { useSyncExternalStore } from "react";
import type { ActivityRecord, ShiftRecord } from "@/lib/activity";
import { addDays, fromKey, toKey } from "@/lib/dates";
import { shiftTemplates, type ShiftTemplate } from "@/content/voluntariado";
import { capitalizar, diaCorto, fechaConDia, mesCorto } from "@/components/voluntariado/fechas";

/** Un día de la agenda, ya formateado para la tira de días y los títulos. */
export type AgendaDay = {
  key: string;
  offset: number;
  date: Date;
  /** "Hoy", "Mañana" o "Vie" */
  label: string;
  weekday: string;
  dayNumber: number;
  month: string;
  /** "Sábado 14 de noviembre" */
  long: string;
};

/** Un turno con fecha: la plantilla del contenido más el día en que cae. */
export type Shift = ShiftTemplate & { shiftId: string; dateKey: string; offset: number };

export const AGENDA_DAYS = 7;

export function weekFrom(todayKey: string): AgendaDay[] {
  const today = fromKey(todayKey);
  return Array.from({ length: AGENDA_DAYS }, (_, offset) => {
    const date = addDays(today, offset);
    return {
      key: toKey(date),
      offset,
      date,
      label: offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : capitalizar(diaCorto(date)),
      weekday: diaCorto(date),
      dayNumber: date.getDate(),
      month: mesCorto(date),
      long: capitalizar(fechaConDia(date)),
    };
  });
}

/** Turnos de un día, de los más temprano a los más tarde. */
export function shiftsOn(day: AgendaDay): Shift[] {
  return shiftTemplates
    .filter((template) =>
      "weekday" in template.when ? template.when.weekday === day.date.getDay() : template.when.offset === day.offset,
    )
    .map((template) => ({ ...template, shiftId: `${template.id}@${day.key}`, dateKey: day.key, offset: day.offset }))
    .sort((a, b) => a.start - b.start);
}

/** Turnos que la persona tomó en este navegador, por id de turno. */
export function takenByMe(activity: ActivityRecord[] | null) {
  const mine = new Map<string, ShiftRecord>();
  for (const record of activity ?? []) if (record.kind === "turno") mine.set(record.shiftId, record);
  return mine;
}

/** Cupos tomados en vivo: los del contenido más el de la persona, si lo tomó. */
export function liveTaken(shift: Shift, mine: boolean) {
  return Math.min(shift.total, shift.taken + (mine ? 1 : 0));
}

const noop = () => () => {};

/**
 * Hora actual (0 a 23) solo en el navegador; `null` en el servidor y al hidratar. Sirve para no ofrecer un turno de
 * hoy que ya empezó. Se lee una vez por render: no hace falta que cambie en vivo.
 */
export function useCurrentHour(): number | null {
  return useSyncExternalStore(noop, () => new Date().getHours(), () => null);
}
