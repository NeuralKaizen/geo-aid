"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { easeSalida } from "@/lib/motion";

export type TicketStep = { title: string; detail: string; time: string; done: boolean };

/**
 * El resultado de una búsqueda: monto y destino arriba, las cuatro paradas como una línea que se dibuja hasta donde
 * llegó la donación y, debajo, cada paso con su hora. Los pasos pendientes quedan en gris, sin hora inventada.
 */
export function TrackingTicket({
  tag,
  code,
  amount,
  destination,
  stops,
  steps,
  note,
}: {
  tag: ReactNode;
  code: string;
  amount: string;
  destination: string;
  stops: string[];
  steps: TicketStep[];
  note: string;
}) {
  const reached = steps.filter((step) => step.done).length;
  const last = stops.length - 1;
  // La línea llega hasta la última parada cumplida
  const progress = last === 0 ? 1 : Math.max(0, reached - 1) / last;

  return (
    <article aria-label={`Seguimiento de la donación ${code}`} className="rounded-[24px] bg-white p-5 text-tinta shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        {tag}
        <span className="text-[13px] font-medium text-niebla tabular-nums">#{code}</span>
      </div>
      <p className="mt-4 font-display text-[2rem] font-semibold leading-none tracking-[-0.035em] tabular-nums">{amount}</p>
      <p className="mt-1.5 text-[14px] text-niebla">{destination}</p>

      {/* Las paradas: la línea se dibuja hasta la última que se cumplió */}
      <div className="relative mt-6">
        <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[7px] h-0.5 rounded-full bg-linea" />
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 1.1, delay: 0.25, ease: easeSalida }}
          className="absolute left-[12.5%] right-[12.5%] top-[7px] h-0.5 origin-left rounded-full bg-bosque-700"
        />
        <ol className="relative grid grid-cols-4">
          {stops.map((stop, i) => {
            const done = i < reached;
            return (
              <li key={stop} className="flex flex-col items-center px-1 text-center">
                <motion.span
                  aria-hidden
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.45, duration: 0.5, delay: 0.25 + i * 0.22 }}
                  className={`size-4 rounded-full ring-4 ring-white ${done ? "bg-bosque-700" : "bg-white shadow-[inset_0_0_0_2px_var(--color-linea)]"}`}
                />
                <span className={`mt-2 text-[11.5px] leading-tight ${done ? "font-semibold text-tinta" : "text-niebla"}`}>
                  {stop}
                  <span className="sr-only">{done ? ": cumplida" : ": pendiente"}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <ol className="mt-6 space-y-1 border-t border-dashed border-linea pt-4">
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.12, ease: easeSalida }}
            className={`flex items-center gap-3 rounded-2xl px-2 py-2 ${!step.done && i === reached ? "bg-maiz-100/60" : ""}`}
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full ${
                step.done ? "bg-bosque-700 text-white" : i === reached ? "bg-maiz-400 text-bosque-950" : "ring-1 ring-inset ring-linea"
              }`}
            >
              {step.done && (
                <motion.span
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.5, delay: 0.45 + i * 0.12 }}
                >
                  <Check className="size-4" strokeWidth={3} aria-hidden />
                </motion.span>
              )}
              {!step.done && <span className="text-[12px] font-semibold tabular-nums">{i + 1}</span>}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[15px] font-semibold ${step.done ? "" : "text-tinta/70"}`}>{step.title}</span>
              <span className="block text-[13px] leading-snug text-niebla">{step.detail}</span>
            </span>
            <span className={`shrink-0 text-right text-[12px] tabular-nums ${step.done ? "text-tinta/80" : "text-niebla"}`}>
              {step.time}
            </span>
          </motion.li>
        ))}
      </ol>

      <p className="mt-4 rounded-2xl bg-papel px-4 py-3 text-[13px] leading-relaxed text-niebla">{note}</p>
    </article>
  );
}
