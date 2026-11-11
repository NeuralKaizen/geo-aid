"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import type { AgendaDay } from "@/components/voluntariado/schedule";

export type DaySummary = {
  day: AgendaDay;
  /** turnos que pasan los filtros */
  count: number;
  /** por turno: si todavía tiene cupos (para los trazos de la ficha) */
  open: boolean[];
};

/**
 * La tira de días es la estructura de la agenda: 7 fichas desde hoy, cada una con cuántos turnos hay con los
 * filtros puestos y un trazo por turno (maíz si tiene cupos). Funciona como pestañas: flechas, Inicio y Fin.
 */
export function DayStrip({
  days,
  selected,
  onSelect,
}: {
  days: DaySummary[];
  selected: number;
  onSelect: (offset: number) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const last = days.length - 1;
    const next =
      event.key === "ArrowRight"
        ? Math.min(last, selected + 1)
        : event.key === "ArrowLeft"
          ? Math.max(0, selected - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    onSelect(next);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Días de la agenda"
      onKeyDown={onKeyDown}
      className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0 md:pb-0"
    >
      {days.map(({ day, count, open }) => {
        const active = day.offset === selected;
        return (
          <button
            key={day.key}
            ref={(element) => {
              refs.current[day.offset] = element;
            }}
            type="button"
            role="tab"
            id={`dia-${day.offset}`}
            aria-selected={active}
            aria-controls="agenda-dia"
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(day.offset)}
            className={`relative isolate flex w-[5.5rem] shrink-0 snap-start flex-col items-center rounded-[22px] px-2 pb-3 pt-3 text-center transition-colors duration-300 md:w-auto ${
              active ? "text-white" : "bg-white text-tinta ring-1 ring-inset ring-linea hover:ring-bosque-200"
            }`}
          >
            {active && (
              <motion.span
                layoutId="dia-activo"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-[22px] bg-bosque-900"
                transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
              />
            )}
            <span
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${active ? "text-maiz-400" : "text-bosque-600"}`}
            >
              {day.label}
            </span>
            <span className="mt-1 font-display text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
              {day.dayNumber}
            </span>
            <span className={`text-[12px] ${active ? "text-white/60" : "text-niebla"}`}>{day.month}</span>

            {/* Un trazo por turno del día: se ve de un vistazo qué días tienen cupos */}
            <span aria-hidden className="mt-2.5 flex h-2.5 items-end gap-[3px]">
              {open.length === 0 ? (
                <span className={`h-[3px] w-5 rounded-full ${active ? "bg-white/20" : "bg-linea"}`} />
              ) : (
                open.map((hasRoom, i) => (
                  <span
                    key={i}
                    className={`h-full w-[5px] rounded-[2px] ${
                      hasRoom ? "bg-maiz-400" : active ? "bg-white/25" : "bg-bosque-200"
                    }`}
                  />
                ))
              )}
            </span>
            <span className={`mt-1.5 text-[12px] font-medium ${active ? "text-white/80" : "text-niebla"}`}>
              {count === 0 ? "Sin turnos" : count === 1 ? "1 turno" : `${count} turnos`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
