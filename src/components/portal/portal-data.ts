import type { ActivityKind, ActivityRecord } from "@/lib/activity";
import { addDays, daysBetween, fromKey, toKey } from "@/lib/dates";
import { pesos } from "@/lib/format";
import { fechaYHora } from "@/components/voluntariado/fechas";
import {
  caseKinds,
  donationSteps,
  exampleDonations,
  exampleNeed,
  exampleShifts,
  type PortalStep,
} from "@/content/portal";
import { horario, SHIFT_HOURS } from "@/content/voluntariado";

/*
 * Junta la historia de ejemplo con lo que la persona hizo en esta sesión y lo deja listo para cada pestaña.
 * Lo de la sesión lleva `recordId` (para poder borrarlo) y `session: true` (para marcarlo).
 */

type Origin = { key: string; session: boolean; recordId?: string };

export type DonationItem = Origin & {
  code: string;
  amount: number;
  destination: string;
  method: string;
  frequency: "unica" | "mensual";
  date: string;
  steps: PortalStep[];
  reached: number;
  /** a dónde llegó o hacia dónde va; vacío en las de la sesión */
  municipio?: string;
  delivered?: string;
};

export type ShiftItem = Origin & {
  code: string;
  task: string;
  place: string;
  city: string;
  dateKey: string;
  hours: string;
};

export type CaseKind = keyof typeof caseKinds;

export type CaseItem = Origin & {
  code: string;
  kind: CaseKind;
  title: string;
  detail: string;
  date: string;
  steps: PortalStep[];
  reached: number;
};

export type RecentItem = Origin & { kind: ActivityKind; title: string; detail: string; date: string };

export type PortalData = ReturnType<typeof buildPortal>;

const isoFromKey = (key: string) => `${key}T12:00:00`;

export function buildPortal(activity: ActivityRecord[], todayKey: string) {
  const today = fromKey(todayKey);

  /* Donaciones */
  const donations: DonationItem[] = [
    ...activity.flatMap((record): DonationItem[] =>
      record.kind === "donacion"
        ? [
            {
              key: record.id,
              session: true,
              recordId: record.id,
              code: record.code,
              amount: record.amount,
              destination: record.destination,
              method: record.method,
              frequency: record.frequency,
              date: record.createdAt,
              steps: donationSteps.map((title, i) =>
                i === 0 ? { title, detail: "Solo en este navegador", time: fechaYHora(record.createdAt) } : { title },
              ),
              reached: 0,
            },
          ]
        : [],
    ),
    ...exampleDonations.map((donation) => ({ ...donation, key: donation.code, session: false })),
  ];

  /* Turnos: los de la sesión y los de ejemplo, separados en próximos y pasados */
  const shifts: ShiftItem[] = [
    ...activity.flatMap((record): ShiftItem[] =>
      record.kind === "turno"
        ? [
            {
              key: record.id,
              session: true,
              recordId: record.id,
              code: record.code,
              task: record.task,
              place: record.place,
              city: record.city,
              dateKey: record.date,
              hours: record.hours,
            },
          ]
        : [],
    ),
    ...exampleShifts.map((shift) => ({
      key: shift.code,
      session: false,
      code: shift.code,
      task: shift.task,
      place: shift.place,
      city: shift.city,
      dateKey: "date" in shift ? shift.date : toKey(addDays(today, shift.inDays)),
      hours: horario(shift.start),
    })),
  ];
  const upcoming = shifts.filter((shift) => shift.dateKey >= todayKey).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const past = shifts.filter((shift) => shift.dateKey < todayKey).sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  /* Necesidades, reportes, pistas y puntos */
  const cases: CaseItem[] = [
    ...activity.flatMap((record): CaseItem[] => {
      if (record.kind === "donacion" || record.kind === "turno") return [];
      const steps = caseKinds[record.kind].steps.map((title, i) =>
        i === 0 ? { title, detail: "Solo en este navegador", time: fechaYHora(record.createdAt) } : { title },
      );
      const base = { key: record.id, session: true, recordId: record.id, code: record.code, kind: record.kind, date: record.createdAt, steps, reached: 0 };
      switch (record.kind) {
        case "necesidad":
          return [
            {
              ...base,
              title: record.needs.length ? record.needs.join(", ") : "Necesidad registrada",
              detail: `${record.place} · ${record.people} ${record.people === 1 ? "persona" : "personas"}${record.forCommunity ? " · para la comunidad" : ""}`,
            },
          ];
        case "reporte":
          return [{ ...base, title: record.personName, detail: `Visto por última vez en ${record.place}` }];
        case "pista":
          return [{ ...base, title: `Sobre ${record.personName}`, detail: "Pista enviada al equipo de verificación" }];
        case "punto":
          return [{ ...base, title: record.name, detail: record.place }];
      }
    }),
    {
      key: exampleNeed.code,
      session: false,
      code: exampleNeed.code,
      kind: "necesidad",
      title: exampleNeed.needs.join(", "),
      detail: `${exampleNeed.place} · ${exampleNeed.people} personas · para la comunidad`,
      date: exampleNeed.date,
      steps: exampleNeed.steps,
      reached: exampleNeed.reached,
    },
  ];

  /* Actividad reciente: todo junto, de lo más nuevo a lo más viejo */
  const recent: RecentItem[] = [
    ...donations.map((d) => ({
      key: `d-${d.key}`,
      session: d.session,
      kind: "donacion" as const,
      title: `Donaste ${pesos(d.amount)}${d.frequency === "mensual" ? " al mes" : ""}`,
      detail: d.destination,
      date: d.date,
    })),
    ...shifts.map((s) => {
      const example = exampleShifts.find((shift) => shift.code === s.code);
      const booked = s.session
        ? activity.find((record) => record.id === s.recordId)?.createdAt
        : example && "bookedAt" in example
          ? example.bookedAt
          : undefined;
      return {
        key: `t-${s.key}`,
        session: s.session,
        kind: "turno" as const,
        title: booked ? "Tomaste un turno" : `Hiciste un turno de ${SHIFT_HOURS} horas`,
        detail: `${s.task}, ${s.place}`,
        date: booked ?? isoFromKey(s.dateKey),
      };
    }),
    ...cases.map((c) => ({
      key: `c-${c.key}`,
      session: c.session,
      kind: c.kind,
      title: recentCaseTitle(c),
      detail: c.detail,
      date: c.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /* Cifras de impacto */
  const delivered = exampleDonations.filter((d) => d.reached === d.steps.length - 1);
  const municipios = [...new Set(delivered.map((d) => d.municipio))];
  const stats = {
    donated: donations.reduce((sum, d) => sum + d.amount, 0),
    donationCount: donations.length,
    municipios,
    hours: past.length * SHIFT_HOURS,
    pastCount: past.length,
    shiftCount: shifts.length,
    upcomingCount: upcoming.length,
  };

  /* A dónde llegó tu ayuda: lo entregado, lo que va en camino y lo recién recibido */
  const places = donations.map((d) => ({
    key: d.key,
    session: d.session,
    status: d.reached === d.steps.length - 1 ? ("entregada" as const) : d.reached > 0 ? ("en-camino" as const) : ("recibida" as const),
    place: d.municipio ?? d.destination,
    detail: d.delivered ?? "Todavía no tiene destino asignado",
    amount: d.amount,
  }));

  const sessionIds = activity.map((record) => record.id);

  return { donations, upcoming, past, cases, recent, stats, places, sessionIds };
}

function recentCaseTitle(item: CaseItem) {
  switch (item.kind) {
    case "necesidad":
      return "Registraste una necesidad";
    case "reporte":
      return `Reportaste a ${item.title}`;
    case "pista":
      return "Enviaste una pista";
    case "punto":
      return "Registraste un punto de acopio";
  }
}

/** "Hoy", "Mañana" o "En 5 días" */
export function countdown(dateKey: string, todayKey: string) {
  const days = daysBetween(fromKey(todayKey), fromKey(dateKey));
  return days === 0 ? "Hoy" : days === 1 ? "Mañana" : `En ${days} días`;
}
