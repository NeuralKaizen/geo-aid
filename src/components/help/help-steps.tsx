"use client";

import { motion, type Variants } from "motion/react";
import { helpSteps } from "@/content/site";
import { easeCortina, easeSalida } from "@/lib/motion";

const STEP_DELAY = 0.45;

const track: Variants = {
  hidden: { scaleX: 0, scaleY: 0 },
  show: { scaleX: 1, scaleY: 1, transition: { duration: STEP_DELAY * (helpSteps.length - 1) + 0.2, ease: easeCortina } },
};

const dot = (i: number): Variants => ({
  hidden: { backgroundColor: "#ffffff", color: "#5d706c", scale: 0.85 },
  show: {
    backgroundColor: "#0e4a44",
    color: "#ffffff",
    scale: 1,
    transition: { delay: i * STEP_DELAY, duration: 0.5, ease: easeSalida },
  },
});

const copy = (i: number): Variants => ({
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { delay: i * STEP_DELAY + 0.1, duration: 0.7, ease: easeSalida } },
});

export function HelpSteps() {
  return (
    <div className="mt-24 md:mt-28">
      <h3 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-bosque-900">Así llega tu ayuda</h3>
      <p className="mt-2 max-w-xl text-niebla">
        Cada entrega queda registrada, así que puedes ver a dónde fue lo que diste.
      </p>

      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className="relative mt-10 grid gap-9 md:grid-cols-3 md:gap-8"
      >
        {/* Línea que une los pasos: vertical en móvil, horizontal en escritorio */}
        <span aria-hidden className="absolute bottom-6 left-[22px] top-6 w-px bg-linea md:hidden">
          <motion.span variants={track} className="absolute inset-0 origin-top bg-bosque-600" />
        </span>
        <span
          aria-hidden
          className="absolute left-[22px] right-[calc((100%-4rem)/3-22px)] top-[22px] hidden h-px bg-linea md:block"
        >
          <motion.span variants={track} className="absolute inset-0 origin-left bg-bosque-600" />
        </span>

        {helpSteps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 md:flex-col md:gap-6">
            <motion.span
              variants={dot(i)}
              className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-semibold ring-1 ring-linea"
            >
              {i + 1}
            </motion.span>
            <motion.div variants={copy(i)} className="pt-2 md:max-w-[19rem] md:pt-0">
              <h4 className="font-display text-xl font-semibold tracking-[-0.02em] text-tinta">{step.title}</h4>
              <p className="mt-2 leading-relaxed text-niebla">{step.body}</p>
            </motion.div>
          </li>
        ))}
      </motion.ol>
    </div>
  );
}
