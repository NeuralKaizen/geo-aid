"use client";

import { motion, type Variants } from "motion/react";
import { Building2, Check } from "lucide-react";
import { ExampleTag } from "@/components/ui/form";
import { bringList, foundationNote, shiftSteps } from "@/content/voluntariado";
import { easeSalida } from "@/lib/motion";

const steps: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const step: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeSalida } },
};

/* La línea del turno se dibuja de izquierda a derecha (de arriba abajo en móvil) mientras aparecen los pasos */
const lineX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.4, ease: easeSalida } },
};

const lineY: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1.4, ease: easeSalida } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.1, ease: easeSalida } }),
};

/** Qué pasa en un turno, qué llevar y una nota para las fundaciones que quieran publicar los suyos. */
export function ShiftGuide() {
  return (
    <section aria-labelledby="turno-guia-titulo" className="mx-3 mt-24 rounded-[28px] bg-bosque-900 py-16 text-white md:mt-32 md:rounded-[36px] md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-maiz-400">Qué esperar</p>
        <h2
          id="turno-guia-titulo"
          className="mt-3 max-w-2xl font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance"
        >
          Así es un turno de cuatro horas
        </h2>
        <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/70">
          Un turno de mañana en el Centro de acopio Norte, paso a paso. No necesitas experiencia: al llegar te explican todo.
        </p>

        <motion.ol
          variants={steps}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-12 grid gap-8 md:mt-16 lg:grid-cols-4 lg:gap-6"
        >
          <motion.span
            aria-hidden
            variants={lineX}
            className="absolute left-5 right-0 top-5 hidden h-px origin-left bg-gradient-to-r from-maiz-400 via-white/30 to-white/10 lg:block"
          />
          <motion.span
            aria-hidden
            variants={lineY}
            className="absolute bottom-4 left-5 top-5 w-px origin-top bg-gradient-to-b from-maiz-400 via-white/30 to-white/10 lg:hidden"
          />
          {shiftSteps.map((item, i) => (
            <motion.li key={item.title} variants={step} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 lg:block">
              <span
                className={`relative grid size-10 place-items-center rounded-full font-display text-[15px] font-semibold ${
                  i === 0 ? "bg-maiz-400 text-bosque-950" : "bg-bosque-800 text-white ring-1 ring-inset ring-white/20"
                }`}
              >
                {i + 1}
              </span>
              <div className="lg:mt-5 lg:pr-4">
                <p className="text-[13px] font-semibold tabular-nums text-maiz-400">{item.time}</p>
                <h3 className="mt-1 font-display text-[21px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{item.body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-[1.2fr_1fr]"
        >
          <motion.div custom={0} variants={card} className="rounded-[28px] bg-white p-6 text-tinta md:p-8">
            <h3 className="font-display text-[24px] font-semibold tracking-[-0.025em]">Qué llevar</h3>
            <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {bringList.map((thing) => (
                <li key={thing} className="flex items-start gap-3 text-[15px] leading-snug">
                  <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-bosque-50 text-bosque-700">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {thing}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-linea pt-4 text-[14px] leading-relaxed text-niebla">
              El chaleco y los guantes te los prestan en el centro. Si es tu primera vez, te ponen con alguien que ya sabe.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={card}
            className="flex flex-col rounded-[28px] bg-white/[0.06] p-6 ring-1 ring-inset ring-white/12 md:p-8"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-maiz-400">
              <Building2 className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 font-display text-[22px] font-semibold leading-tight tracking-[-0.025em]">{foundationNote.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">{foundationNote.body}</p>
            <p className="mt-auto flex items-center gap-2 pt-6 text-[13px] text-white/55">
              <ExampleTag tone="dark">Próximamente</ExampleTag>
              {foundationNote.status}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
