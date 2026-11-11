"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { PortalStep } from "@/content/portal";
import { easeSalida } from "@/lib/motion";

type State = "done" | "current" | "pending";

/** El último paso alcanzado es "actual", salvo que sea el final: entonces ya está hecho. */
function stateOf(index: number, reached: number, total: number): State {
  if (index < reached || (index === reached && reached === total - 1)) return "done";
  return index === reached ? "current" : "pending";
}

function Dot({ state, size = "md" }: { state: State; size?: "sm" | "md" }) {
  const box = size === "md" ? "size-8" : "size-7";
  return (
    <span
      className={`relative z-10 grid ${box} shrink-0 place-items-center rounded-full ${
        state === "done"
          ? "bg-bosque-700 text-white"
          : state === "current"
            ? "bg-maiz-400 text-bosque-950 ring-4 ring-maiz-400/25"
            : "bg-white ring-1 ring-inset ring-linea"
      }`}
    >
      {state === "done" && <Check className={size === "md" ? "size-4" : "size-3.5"} strokeWidth={3} aria-hidden />}
      {state === "current" && <span className="size-2 rounded-full bg-bosque-950" aria-hidden />}
    </span>
  );
}

const stateLabel: Record<State, string> = { done: "hecho", current: "en curso", pending: "pendiente" };

/** Seguimiento vertical, como el comprobante de la página de inicio. */
export function StepTimeline({ steps, reached }: { steps: PortalStep[]; reached: number }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const state = stateOf(i, reached, steps.length);
        const last = i === steps.length - 1;
        return (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: easeSalida }}
            className="relative grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-x-3.5 pb-5 last:pb-0"
          >
            {!last && (
              <span
                aria-hidden
                className={`absolute bottom-0 left-[15.5px] top-8 w-px ${i < reached ? "bg-bosque-700" : "bg-linea"}`}
              />
            )}
            <Dot state={state} />
            <span className="min-w-0 pt-1">
              <span className={`block text-[15px] font-semibold ${state === "pending" ? "text-niebla" : "text-tinta"}`}>
                {step.title}
                <span className="sr-only">: {stateLabel[state]}</span>
              </span>
              {state !== "pending" && step.detail && <span className="block text-[13.5px] text-niebla">{step.detail}</span>}
              {state === "pending" && <span className="block text-[13.5px] text-niebla/80">Pendiente</span>}
            </span>
            <span className="pt-1.5 text-[12.5px] tabular-nums text-niebla">{state !== "pending" ? step.time : ""}</span>
          </motion.li>
        );
      })}
    </ol>
  );
}

/** Pasos de estado en horizontal (recibida, en verificación, publicada, atendida). */
export function StepBar({ steps, reached }: { steps: PortalStep[]; reached: number }) {
  const total = steps.length;
  const progress = reached / (total - 1);
  // La línea va del centro de la primera columna al de la última, para pasar justo por cada punto
  const inset = `${50 / total}%`;
  return (
    <div className="relative">
      <span aria-hidden className="absolute top-3.5 h-px bg-linea" style={{ left: inset, right: inset }} />
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 1, delay: 0.2, ease: easeSalida }}
        className="absolute top-3.5 h-px origin-left bg-bosque-700"
        style={{ left: inset, right: inset }}
      />
      <ol className="relative grid gap-x-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {steps.map((step, i) => {
          const state = stateOf(i, reached, total);
          return (
            <li key={step.title} className="flex flex-col items-center gap-2 text-center">
              <Dot state={state} size="sm" />
              <span className={`text-[12.5px] leading-tight ${state === "pending" ? "text-niebla" : "font-semibold text-tinta"}`}>
                {step.title}
                <span className="sr-only">: {stateLabel[state]}</span>
              </span>
              {state !== "pending" && step.time && (
                <span className="-mt-1 text-[11.5px] leading-tight tabular-nums text-niebla">{step.time}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
