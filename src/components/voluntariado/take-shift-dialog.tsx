"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Clock, MapPin, Route, X } from "lucide-react";
import { ExampleTag } from "@/components/ui/form";
import { DateTile } from "@/components/voluntariado/date-tile";
import type { Shift } from "@/components/voluntariado/schedule";
import { ShiftConfirmation } from "@/components/voluntariado/shift-confirmation";
import { ShiftForm, type ShiftFormValues } from "@/components/voluntariado/shift-form";
import { cityLabel, horario, SHIFT_HOURS, taskById } from "@/content/voluntariado";
import { addActivity, newCode } from "@/lib/activity";
import { fromKey } from "@/lib/dates";
import { easeCortina, easeSalida } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

const noop = () => () => {};
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Panel para tomar un turno: entra por la derecha en escritorio y desde abajo en móvil. Atrapa el foco, se cierra
 * con Escape y devuelve el foco a la tarjeta del turno. Va en un portal porque el <main> crea su propio contexto de
 * apilamiento y la barra flotante quedaría encima.
 */
export function TakeShiftDialog({
  shift,
  taken,
  mine,
  onClose,
}: {
  shift: Shift | null;
  taken: number;
  mine: boolean;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {shift && <Panel key={shift.shiftId} shift={shift} taken={taken} mine={mine} onClose={onClose} />}
    </AnimatePresence>,
    document.body,
  );
}

type Done = { firstName: string; code: string };

function Panel({ shift, taken, mine, onClose }: { shift: Shift; taken: number; mine: boolean; onClose: () => void }) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  const task = taskById[shift.task];
  const date = fromKey(shift.dateKey);
  const free = shift.total - taken;

  // Cierra y devuelve el foco a la tarjeta (al botón, o al enlace a Mi portal si el turno ya es tuyo)
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = () => {
      onClose();
      const id = CSS.escape(shift.shiftId);
      document.querySelector<HTMLElement>(`[data-return-focus="${id}"]`)?.focus({ preventScroll: true });
    };
  });
  const close = () => closeRef.current();

  // Fondo quieto, foco adentro y Escape para salir
  useEffect(() => {
    panelRef.current?.focus();
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer.current);
    };
  }, [lenis]);

  function trapFocus(event: React.KeyboardEvent) {
    if (event.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function submit(values: ShiftFormValues) {
    setSending(true);
    // Sin servidor: una pequeña espera para que se sienta el envío, y el registro queda en este navegador
    timer.current = window.setTimeout(() => {
      const saved = addActivity({
        kind: "turno",
        code: newCode("VT"),
        shiftId: shift.shiftId,
        task: task.label,
        place: shift.place,
        city: cityLabel[shift.city],
        date: shift.dateKey,
        hours: horario(shift.start),
      });
      setSending(false);
      setDone({ firstName: values.name.split(/\s+/)[0], code: saved.code });
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <motion.button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 cursor-default bg-bosque-950/50 backdrop-blur-[3px]"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tomar-turno-titulo"
        tabIndex={-1}
        onKeyDown={trapFocus}
        data-lenis-prevent
        initial={desktop ? { x: "105%" } : { y: "100%" }}
        animate={desktop ? { x: 0 } : { y: 0 }}
        exit={desktop ? { x: "105%", transition: { duration: 0.4, ease: easeCortina } } : { y: "100%", transition: { duration: 0.35, ease: easeCortina } }}
        transition={{ duration: 0.6, ease: easeSalida }}
        className="absolute flex flex-col overflow-y-auto overscroll-contain bg-papel shadow-[0_40px_100px_-30px_rgba(6,39,36,0.6)] outline-none max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[94svh] max-md:rounded-t-[28px] md:inset-y-3 md:right-3 md:w-[31rem] md:rounded-[28px]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-papel/90 px-5 pb-3 pt-4 backdrop-blur-md sm:px-6">
          <h2 id="tomar-turno-titulo" className="font-display text-[20px] font-semibold tracking-[-0.02em] text-tinta">
            {done ? "Turno tomado" : "Tomar este turno"}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="grid size-11 place-items-center rounded-full text-tinta/70 transition-colors hover:bg-white hover:text-tinta"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 pb-6 sm:px-6">
          {/* Resumen del turno con su ficha de fecha */}
          <section aria-label="Resumen del turno" className="rounded-[24px] bg-bosque-900 p-5 text-white">
            <div className="flex gap-4">
              <DateTile date={date} />
              <div className="min-w-0">
                <p className="font-display text-[18px] font-semibold leading-snug tracking-[-0.015em]">{task.label}</p>
                <p className="mt-1.5 flex items-start gap-1.5 text-[13.5px] text-white/70">
                  <MapPin className="mt-[3px] size-3.5 shrink-0" aria-hidden />
                  {shift.place}, {cityLabel[shift.city]}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-white/70">
                  <Clock className="size-3.5 shrink-0" aria-hidden />
                  {horario(shift.start)} · {SHIFT_HOURS} horas
                </p>
                {shift.note && (
                  <p className="mt-0.5 flex items-start gap-1.5 text-[13.5px] text-white/70">
                    <Route className="mt-[3px] size-3.5 shrink-0" aria-hidden />
                    {shift.note}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/12 pt-3">
              <p className="text-[13px]">
                <span className="font-semibold">{mine ? "Tu cupo está apartado" : `Quedan ${free} cupos`}</span>
                <span className="text-white/55"> de {shift.total}</span>
              </p>
              <ExampleTag tone="dark">Turno de ejemplo</ExampleTag>
            </div>
          </section>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={done ? "listo" : "formulario"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.5, ease: easeSalida }}
            >
              {done ? (
                <ShiftConfirmation
                  shift={shift}
                  firstName={done.firstName}
                  code={done.code}
                  taken={taken}
                  onClose={close}
                />
              ) : (
                <ShiftForm sending={sending} onSubmit={submit} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
