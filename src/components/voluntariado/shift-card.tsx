"use client";

import { ArrowRight, Check, Clock, MapPin, Route } from "lucide-react";
import { NavLink } from "@/components/transitions/nav-link";
import { button } from "@/components/ui/styles";
import { SlotStrokes } from "@/components/voluntariado/slot-strokes";
import type { Shift } from "@/components/voluntariado/schedule";
import { cityLabel, hora, horario, SHIFT_HOURS, taskById } from "@/content/voluntariado";

/**
 * Un turno de la agenda. En pantallas medianas la hora va a la izquierda, sobre la línea del día, como en una
 * agenda de papel; en móvil va arriba, dentro de la tarjeta.
 */
export function ShiftCard({
  shift,
  taken,
  mine,
  started,
  onTake,
}: {
  shift: Shift;
  /** cupos tomados en vivo (incluye el tuyo) */
  taken: number;
  mine: boolean;
  /** turno de hoy que ya empezó */
  started: boolean;
  onTake: (shift: Shift) => void;
}) {
  const task = taskById[shift.task];
  const Icon = task.icon;
  const free = shift.total - taken;
  const full = free <= 0 && !mine;
  const titleId = `turno-${shift.shiftId}`;

  return (
    <article aria-labelledby={titleId} className="grid grid-cols-[minmax(0,1fr)] gap-x-6 sm:grid-cols-[6.75rem_minmax(0,1fr)]">
      {/* Columna de la hora con la línea del día */}
      <div className="relative hidden border-r border-linea pb-4 pr-5 text-right sm:block">
        <span
          aria-hidden
          className={`absolute -right-[5px] top-[9px] size-[9px] rounded-full ring-4 ring-papel ${
            full || started ? "bg-linea" : "bg-maiz-400"
          }`}
        />
        <p className="font-display text-[19px] font-semibold leading-tight tracking-[-0.02em] text-tinta">{hora(shift.start)}</p>
        <p className="mt-0.5 text-[13px] text-niebla">a {hora(shift.start + SHIFT_HOURS)}</p>
      </div>

      <div className="pb-4">
        <div
          className={`rounded-[24px] bg-white p-5 ring-1 transition-shadow duration-500 sm:p-6 ${
            mine ? "ring-2 ring-bosque-600" : "ring-linea"
          }`}
        >
          <p className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-niebla sm:hidden">
            <Clock className="size-3.5" aria-hidden />
            {horario(shift.start)} · {SHIFT_HOURS} horas
          </p>

          <div className="flex items-start gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-bosque-50 text-bosque-700">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h4 id={titleId} className="font-display text-[19px] font-semibold leading-snug tracking-[-0.02em] text-tinta">
                {task.label}
                <span className="sr-only">, {horario(shift.start)}</span>
              </h4>
              <p className="mt-1 flex items-start gap-1.5 text-[14px] text-niebla">
                <MapPin className="mt-[3px] size-3.5 shrink-0" aria-hidden />
                <span>
                  {shift.place} · <span className="font-medium text-tinta/80">{cityLabel[shift.city]}</span>
                </span>
              </p>
              {shift.note && (
                <p className="mt-0.5 flex items-start gap-1.5 text-[14px] text-niebla">
                  <Route className="mt-[3px] size-3.5 shrink-0" aria-hidden />
                  {shift.note}
                </p>
              )}
            </div>
          </div>

          <ul aria-label="Requisitos" className="mt-4 flex flex-wrap gap-1.5">
            {task.requirements.map((requirement) => (
              <li
                key={requirement}
                className={`rounded-full px-2.5 py-1 text-[12.5px] font-medium ${
                  task.professional ? "bg-maiz-100 text-maiz-800" : "bg-papel text-tinta/75"
                }`}
              >
                {requirement}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-4 border-t border-linea pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2 text-[14px]">
                <span className={`font-semibold ${full ? "text-niebla" : "text-tinta"}`}>
                  {full ? "Sin cupos" : `Quedan ${free}`}
                </span>
                <span className="text-niebla">de {shift.total} cupos</span>
              </p>
              <SlotStrokes taken={taken} total={shift.total} mine={mine} className="mt-2" />
            </div>

            <ShiftAction shift={shift} mine={mine} full={full} started={started} onTake={onTake} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ShiftAction({
  shift,
  mine,
  full,
  started,
  onTake,
}: {
  shift: Shift;
  mine: boolean;
  full: boolean;
  started: boolean;
  onTake: (shift: Shift) => void;
}) {
  if (mine) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-bosque-50 py-1.5 pl-3 pr-1.5 max-sm:justify-between">
        <span className="flex items-center gap-1.5 text-[14px] font-semibold text-bosque-800">
          <Check className="size-4" strokeWidth={2.6} aria-hidden />
          Tomaste este turno
        </span>
        {/* Aquí vuelve el foco al cerrar el diálogo, porque el botón que lo abrió ya no existe */}
        <NavLink
          href="/portal?pestana=turnos"
          data-return-focus={shift.shiftId}
          className={button({ variant: "secondary", size: "sm" })}
        >
          Ver en Mi portal
        </NavLink>
      </div>
    );
  }

  if (started) {
    return <p className="text-[14px] font-medium text-niebla">Este turno ya empezó</p>;
  }

  return (
    <button
      type="button"
      disabled={full}
      data-return-focus={shift.shiftId}
      onClick={() => onTake(shift)}
      className={`${button({ variant: "primary", size: "md" })} max-sm:w-full`}
    >
      {full ? "Turno lleno" : "Tomar este turno"}
      {!full && <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />}
    </button>
  );
}
