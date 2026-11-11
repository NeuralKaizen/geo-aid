"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { CalendarSearch } from "lucide-react";
import { ExampleTag } from "@/components/ui/form";
import { button, eyebrow, sectionTitle } from "@/components/ui/styles";
import { AgendaFilters, noFilters, type Filters } from "@/components/voluntariado/agenda-filters";
import { DayStrip, type DaySummary } from "@/components/voluntariado/day-strip";
import { liveTaken, shiftsOn, takenByMe, useCurrentHour, weekFrom, type Shift } from "@/components/voluntariado/schedule";
import { ShiftCard } from "@/components/voluntariado/shift-card";
import { TakeShiftDialog } from "@/components/voluntariado/take-shift-dialog";
import { cityLabel, shiftTemplates, taskById } from "@/content/voluntariado";
import { useActivity } from "@/lib/activity";
import { useTodayKey } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const entry: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeSalida } },
};

const cityCount = new Set(shiftTemplates.map((template) => template.city)).size;

/**
 * La agenda viva: 7 días desde hoy, filtros y los turnos del día elegido. Todo depende de la fecha de hoy, que solo
 * existe en el navegador, así que en el servidor se ve un esqueleto con la misma forma.
 */
export function Agenda() {
  const todayKey = useTodayKey();
  const activity = useActivity();
  const hour = useCurrentHour();
  const [selected, setSelected] = useState(0);
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [taking, setTaking] = useState<Shift | null>(null);

  const mine = useMemo(() => takenByMe(activity), [activity]);
  const week = useMemo(() => (todayKey ? weekFrom(todayKey).map((day) => ({ day, shifts: shiftsOn(day) })) : null), [todayKey]);

  const passes = (shift: Shift) =>
    (filters.city === null || shift.city === filters.city) &&
    (filters.task === null || shift.task === filters.task) &&
    (!filters.onlyOpen || liveTaken(shift, mine.has(shift.shiftId)) < shift.total || mine.has(shift.shiftId));

  return (
    <section id="agenda" aria-labelledby="agenda-titulo" className="mx-auto max-w-[1240px] px-5 pt-16 sm:px-8 md:pt-24 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <p className={eyebrow}>Agenda de turnos</p>
          <h2 id="agenda-titulo" className={`${sectionTitle} mt-3`}>
            Los próximos 7 días
          </h2>
        </div>
        <p className="flex max-w-sm flex-wrap items-center gap-2 text-[15px] leading-relaxed text-niebla">
          <ExampleTag>Turnos de ejemplo</ExampleTag>
          {shiftTemplates.length} turnos en {cityCount} ciudades. Elige un día y toma el que te sirva.
        </p>
      </div>

      {!week ? (
        <AgendaSkeleton />
      ) : (
        <AgendaBody
          week={week}
          selected={selected}
          onSelect={setSelected}
          filters={filters}
          onFilters={setFilters}
          passes={passes}
          mine={mine}
          hour={hour}
          onTake={setTaking}
        />
      )}

      <TakeShiftDialog
        shift={taking}
        taken={taking ? liveTaken(taking, mine.has(taking.shiftId)) : 0}
        mine={taking ? mine.has(taking.shiftId) : false}
        onClose={() => setTaking(null)}
      />
    </section>
  );
}

function AgendaBody({
  week,
  selected,
  onSelect,
  filters,
  onFilters,
  passes,
  mine,
  hour,
  onTake,
}: {
  week: { day: ReturnType<typeof weekFrom>[number]; shifts: Shift[] }[];
  selected: number;
  onSelect: (offset: number) => void;
  filters: Filters;
  onFilters: (next: Filters) => void;
  passes: (shift: Shift) => boolean;
  mine: ReturnType<typeof takenByMe>;
  hour: number | null;
  onTake: (shift: Shift) => void;
}) {
  const summaries: DaySummary[] = week.map(({ day, shifts }) => {
    const visible = shifts.filter(passes);
    return {
      day,
      count: visible.length,
      open: visible.map((shift) => liveTaken(shift, mine.has(shift.shiftId)) < shift.total),
    };
  });

  const { day, shifts } = week[selected];
  const visible = shifts.filter(passes);
  const freeSpots = visible.reduce((sum, shift) => sum + shift.total - liveTaken(shift, mine.has(shift.shiftId)), 0);
  const morning = visible.filter((shift) => shift.start < 12);
  const afternoon = visible.filter((shift) => shift.start >= 12);
  const nextWithShifts = summaries.find((summary) => summary.day.offset > selected && summary.count > 0);
  const started = (shift: Shift) => shift.offset === 0 && hour !== null && hour >= shift.start;

  const where = [filters.city && cityLabel[filters.city], filters.task && taskById[filters.task].short.toLowerCase()]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="mt-10">
        <DayStrip days={summaries} selected={selected} onSelect={onSelect} />
      </div>

      {/* minmax(0,1fr) en móvil: si no, las filas de filtros que se deslizan ensancharían toda la columna */}
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <aside aria-label="Filtros" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <AgendaFilters filters={filters} onChange={onFilters} />
        </aside>

        <div id="agenda-dia" role="tabpanel" aria-labelledby={`dia-${selected}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-linea pb-4">
            <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-tinta">{day.long}</h3>
            <p className="text-[14px] text-niebla" aria-live="polite">
              {visible.length === 0
                ? "Sin turnos con estos filtros"
                : `${visible.length} ${visible.length === 1 ? "turno" : "turnos"} · ${freeSpots} ${freeSpots === 1 ? "cupo libre" : "cupos libres"}`}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${day.key}-${filters.city}-${filters.task}-${filters.onlyOpen}`}
              variants={list}
              initial="hidden"
              animate="show"
              exit="exit"
              className="pt-6"
            >
              {visible.length === 0 ? (
                <motion.div variants={entry} className="rounded-[24px] border border-dashed border-bosque-200 px-6 py-10 text-center">
                  <CalendarSearch className="mx-auto size-7 text-bosque-600" aria-hidden />
                  <p className="mt-3 font-display text-[19px] font-semibold tracking-[-0.02em] text-tinta">
                    No hay turnos{where ? ` de ${where}` : ""} este día
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-[14.5px] text-niebla">
                    {nextWithShifts
                      ? `El ${nextWithShifts.day.long.toLowerCase()} hay ${nextWithShifts.count} con estos filtros.`
                      : "Prueba con otra ciudad o con otra tarea."}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                    {nextWithShifts && (
                      <button type="button" onClick={() => onSelect(nextWithShifts.day.offset)} className={button({ size: "sm" })}>
                        Ver {nextWithShifts.day.label === "Mañana" ? "mañana" : `el ${nextWithShifts.day.weekday} ${nextWithShifts.day.dayNumber}`}
                      </button>
                    )}
                    <button type="button" onClick={() => onFilters(noFilters)} className={button({ variant: "secondary", size: "sm" })}>
                      Quitar filtros
                    </button>
                  </div>
                </motion.div>
              ) : (
                [
                  { label: "Mañana", items: morning },
                  { label: "Tarde", items: afternoon },
                ]
                  .filter((group) => group.items.length > 0)
                  .map((group) => (
                    <div key={group.label} className="mb-2 last:mb-0">
                      <motion.p
                        variants={entry}
                        className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-niebla sm:pl-[7.5rem]"
                      >
                        En la {group.label.toLowerCase()}
                      </motion.p>
                      {group.items.map((shift) => (
                        <motion.div key={shift.shiftId} variants={entry}>
                          <ShiftCard
                            shift={shift}
                            taken={liveTaken(shift, mine.has(shift.shiftId))}
                            mine={mine.has(shift.shiftId)}
                            started={started(shift)}
                            onTake={onTake}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/** Misma forma que la agenda, para que nada salte al hidratar. */
function AgendaSkeleton() {
  return (
    <div aria-hidden className="mt-10 animate-pulse">
      <div className="-mx-5 flex gap-2 overflow-hidden px-5 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-7 md:px-0">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={`h-[8.75rem] w-[5.5rem] shrink-0 rounded-[22px] md:w-auto ${i === 0 ? "bg-bosque-900/80" : "bg-white"}`} />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-3">
          <div className="h-10 rounded-full bg-white" />
          <div className="h-10 w-4/5 rounded-full bg-white" />
          <div className="h-10 w-3/5 rounded-full bg-white" />
        </div>
        <div className="space-y-4">
          <div className="h-9 w-2/3 rounded-xl bg-white" />
          <div className="h-56 rounded-[24px] bg-white" />
          <div className="h-56 rounded-[24px] bg-white" />
        </div>
      </div>
    </div>
  );
}
