"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { BlockTitle, ConfirmInline, InviteCard, OriginTag } from "@/components/portal/bits";
import { countdown, type PortalData, type ShiftItem } from "@/components/portal/portal-data";
import { DateTile } from "@/components/voluntariado/date-tile";
import { SHIFT_HOURS } from "@/content/voluntariado";
import { removeActivity } from "@/lib/activity";
import { fromKey } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";

/** Turnos: los próximos con su ficha de fecha (los de la sesión se pueden cancelar) y los ya hechos con sus horas. */
export function ShiftsTab({ data, todayKey }: { data: PortalData; todayKey: string }) {
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const hasSession = data.upcoming.some((shift) => shift.session);

  function cancel(shift: ShiftItem) {
    if (!shift.recordId) return;
    removeActivity(shift.recordId);
    setCancelling(null);
    setMessage(`Cancelaste el turno de ${shift.task.toLowerCase()} del ${fromKey(shift.dateKey).getDate()}. El cupo vuelve a quedar libre.`);
    // El botón que tenía el foco desapareció con el turno: el foco vuelve al título de la lista
    document.getElementById("turnos-proximos")?.focus();
  }

  return (
    <div className="flex flex-col gap-8">
      {!hasSession && (
        <InviteCard
          icon={CalendarCheck}
          title="Toma un turno de 4 horas"
          body="Eliges día, ciudad y tarea en la agenda. Tu turno aparece aquí con su fecha."
          actions={[{ label: "Ver la agenda", href: "/voluntariado#agenda" }]}
        />
      )}

      <section aria-labelledby="turnos-proximos">
        <div className="outline-none" id="turnos-proximos" tabIndex={-1}>
          <BlockTitle aside={`${data.upcoming.length} ${data.upcoming.length === 1 ? "turno" : "turnos"}`}>Próximos turnos</BlockTitle>
        </div>
        <p aria-live="polite" className="text-[14px] text-bosque-800 empty:hidden [&:not(:empty)]:mt-2">
          {message}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {data.upcoming.map((shift) => (
              <motion.li
                key={shift.key}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, ease: easeSalida }}
                className={`rounded-[24px] bg-white p-4 sm:p-5 ${shift.session ? "ring-2 ring-bosque-600" : "ring-1 ring-linea"}`}
              >
                <div className="flex gap-4">
                  <DateTile date={fromKey(shift.dateKey)} tone={shift.session ? "dark" : "outline"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-bosque-700">{countdown(shift.dateKey, todayKey)}</span>
                      <OriginTag session={shift.session} />
                    </div>
                    <h4 className="mt-2 font-display text-[18px] font-semibold leading-snug tracking-[-0.02em] text-tinta">{shift.task}</h4>
                    <p className="mt-1 flex items-start gap-1.5 text-[13.5px] text-niebla">
                      <MapPin className="mt-[3px] size-3.5 shrink-0" aria-hidden />
                      {shift.place}, {shift.city}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-niebla">
                      <Clock className="size-3.5 shrink-0" aria-hidden />
                      {shift.hours}
                    </p>
                  </div>
                </div>

                {shift.session && (
                  <div className="mt-4 border-t border-linea pt-4">
                    {cancelling === shift.key ? (
                      <ConfirmInline
                        question="¿Cancelar este turno? Tu cupo vuelve a quedar libre para otra persona."
                        confirmLabel="Sí, cancelar turno"
                        cancelLabel="No, lo mantengo"
                        onConfirm={() => cancel(shift)}
                        onCancel={() => setCancelling(null)}
                      />
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[13px] tabular-nums text-niebla">Código {shift.code}</span>
                        <button
                          type="button"
                          onClick={() => setCancelling(shift.key)}
                          className="inline-flex h-10 items-center rounded-full px-4 text-[14px] font-semibold text-alerta ring-1 ring-inset ring-alerta/30 transition-colors hover:bg-alerta/[0.06]"
                        >
                          Cancelar turno
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      <section aria-labelledby="turnos-pasados">
        <BlockTitle id="turnos-pasados" aside={`${data.past.length * SHIFT_HOURS} horas en ${data.past.length} turnos`}>
          Turnos hechos
        </BlockTitle>
        <ul className="mt-4 divide-y divide-linea rounded-[24px] bg-white px-4 ring-1 ring-linea sm:px-5">
          {data.past.map((shift) => (
            <li key={shift.key} className="flex items-center gap-4 py-4">
              <DateTile date={fromKey(shift.dateKey)} size="sm" tone="muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-tinta">{shift.task}</p>
                <p className="truncate text-[13.5px] text-niebla">
                  {shift.place}, {shift.city}
                </p>
                {shift.session && (
                  <span className="mt-1 block">
                    <OriginTag session />
                  </span>
                )}
              </div>
              <p className="shrink-0 font-display text-[20px] font-semibold tabular-nums tracking-[-0.02em] text-bosque-700">
                <span aria-hidden>{SHIFT_HOURS} h</span>
                <span className="sr-only">{SHIFT_HOURS} horas</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-niebla">Los turnos sin marca de sesión son de ejemplo.</p>
      </section>
    </div>
  );
}
