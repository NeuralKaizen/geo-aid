"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { NavLink } from "@/components/transitions/nav-link";
import { button } from "@/components/ui/styles";
import { fechaConDia } from "@/components/voluntariado/fechas";
import type { Shift } from "@/components/voluntariado/schedule";
import { PrototypeNotice } from "@/components/voluntariado/shift-form";
import { SlotStrokes } from "@/components/voluntariado/slot-strokes";
import { aLaHora, enLugar, prototypeNotice, taskById } from "@/content/voluntariado";
import { fromKey } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";

/** El mensaje que recibiría la persona, igual al que mandaría un centro de acopio. */
export function smsText(shift: Shift, firstName: string) {
  const date = fechaConDia(fromKey(shift.dateKey));
  return `GeoAid: Hola ${firstName}, te esperamos el ${date} ${aLaHora(shift.start)} ${enLugar(shift.place)}. ${
    taskById[shift.task].bring
  } Responde NO para cancelar.`;
}

/**
 * Confirmación: la vista previa del mensaje de texto, el cupo que ya cuenta como tuyo y el camino a "Mi portal".
 * El mensaje llega como en un teléfono: primero los puntos de "escribiendo" y luego la burbuja.
 */
export function ShiftConfirmation({
  shift,
  firstName,
  code,
  taken,
  onClose,
}: {
  shift: Shift;
  firstName: string;
  code: string;
  taken: number;
  onClose: () => void;
}) {
  const [arrived, setArrived] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // El formulario ya no existe: el foco pasa al título y el panel sube hasta él (debajo de su barra fija)
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    const timeout = window.setTimeout(() => setArrived(true), 750);
    return () => window.clearTimeout(timeout);
  }, []);

  const free = shift.total - taken;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3.5">
        <motion.span
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-bosque-700 text-white"
        >
          <Check className="size-5" strokeWidth={3} aria-hidden />
        </motion.span>
        <div>
          <h3
            ref={heading}
            tabIndex={-1}
            className="scroll-mt-24 font-display text-[24px] font-semibold leading-tight tracking-[-0.025em] text-tinta outline-none"
          >
            Tomaste el turno, {firstName}
          </h3>
          <p className="mt-1 text-[14px] text-niebla">
            Código <span className="font-semibold tabular-nums text-tinta">{code}</span> · así te llegaría la confirmación:
          </p>
        </div>
      </div>

      <figure className="rounded-[26px] bg-white p-4 ring-1 ring-inset ring-linea">
        <div className="flex items-center gap-3 border-b border-linea pb-3">
          <span className="grid size-9 place-items-center rounded-full bg-bosque-800 text-[12px] font-bold text-white">GA</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-tinta">GeoAid</span>
            <span className="block text-[12px] text-niebla">Mensaje de texto</span>
          </span>
          <span className="text-[12px] text-niebla">Ahora</span>
        </div>
        <div className="min-h-[7.25rem] pt-4" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {arrived ? (
              <motion.p
                key="mensaje"
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.55 }}
                className="max-w-[92%] origin-bottom-left rounded-[20px] rounded-bl-md bg-papel px-4 py-3 text-[14.5px] leading-snug text-tinta"
              >
                {smsText(shift, firstName)}
              </motion.p>
            ) : (
              <motion.span
                key="escribiendo"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className="inline-flex origin-bottom-left gap-1 rounded-[20px] rounded-bl-md bg-papel px-4 py-3.5"
              >
                <span className="sr-only">Llegando el mensaje</span>
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    aria-hidden
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                    className="size-1.5 rounded-full bg-niebla"
                  />
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <figcaption className="mt-3 text-[12px] text-niebla">Vista previa. En el prototipo no se envía ningún mensaje.</figcaption>
      </figure>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: easeSalida }}
        className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-linea"
      >
        <p className="flex items-baseline justify-between gap-3 text-[14px]">
          <span className="font-semibold text-tinta">Tu cupo ya cuenta</span>
          <span className="text-niebla">
            Quedan {free} de {shift.total}
          </span>
        </p>
        <SlotStrokes taken={taken} total={shift.total} mine className="mt-2" />
      </motion.div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <NavLink href="/portal?pestana=turnos" className={`${button({ variant: "primary", size: "md" })} sm:flex-1`}>
          Ver en Mi portal
          <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
        </NavLink>
        <button type="button" onClick={onClose} className={`${button({ variant: "secondary", size: "md" })} sm:flex-1`}>
          Volver a la agenda
        </button>
      </div>

      <PrototypeNotice text={prototypeNotice.after} />
    </div>
  );
}
