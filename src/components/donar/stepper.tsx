"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { steps } from "@/components/donar/options";
import { easeSalida } from "@/lib/motion";

/**
 * Los cuatro pasos con una barra de progreso. Se puede volver a cualquier paso ya visitado; hacia adelante solo se
 * avanza con "Continuar", que valida el paso actual.
 */
export function Stepper({ current, furthest, onGo }: { current: number; furthest: number; onGo: (step: number) => void }) {
  return (
    <nav aria-label="Pasos de la donación" className="border-b border-linea px-5 pb-5 pt-5 sm:px-8 lg:px-10">
      <div aria-hidden className="h-1 overflow-hidden rounded-full bg-papel">
        <motion.div
          className="h-full origin-left rounded-full bg-bosque-700"
          initial={false}
          animate={{ scaleX: (current + 1) / steps.length }}
          transition={{ duration: 0.8, ease: easeSalida }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-4 gap-2">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= furthest && !active;
          const content = (
            <>
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-[12.5px] font-semibold tabular-nums transition-colors duration-300 ${
                  done ? "bg-bosque-700 text-white" : active ? "bg-maiz-400 text-bosque-950" : "bg-papel text-niebla ring-1 ring-inset ring-linea"
                }`}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span
                className={`hidden text-[13.5px] sm:block ${active ? "font-semibold text-tinta" : done ? "font-medium text-tinta/80" : "text-niebla"}`}
              >
                {step.label}
              </span>
              <span className="sr-only sm:hidden">{step.label}</span>
              {done && <span className="sr-only">, listo</span>}
            </>
          );
          return (
            <li key={step.id} aria-current={active ? "step" : undefined}>
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onGo(i)}
                  className="-m-2 flex items-center gap-2.5 rounded-full p-2 pr-3.5 text-left transition-colors hover:bg-papel"
                >
                  {content}
                </button>
              ) : (
                <span className="flex items-center gap-2.5">{content}</span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[13px] font-medium text-tinta sm:hidden">
        Paso {current + 1} de {steps.length}: {steps[current].label}
      </p>
    </nav>
  );
}
