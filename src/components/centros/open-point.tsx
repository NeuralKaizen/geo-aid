"use client";

import { motion, type Variants } from "motion/react";
import { CalendarClock, Umbrella, UserRound } from "lucide-react";
import { cities, openPointRequirements, verificationSteps } from "@/content/centros";
import { ExampleTag } from "@/components/ui/form";
import { OpenPointForm } from "@/components/centros/open-point-form";
import { easeSalida } from "@/lib/motion";

const requirementIcons = [Umbrella, CalendarClock, UserRound];

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const entry: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeSalida } },
};

const popayan = cities[0];

/** Cómo un garaje o una sala se vuelve punto de acopio, y el registro para abrir uno. */
export function OpenPoint() {
  return (
    <section
      id="abrir-un-punto"
      aria-labelledby="abrir-titulo"
      className="mx-auto mt-20 max-w-[1240px] scroll-mt-24 px-3 sm:px-5 lg:mt-28 lg:px-6"
    >
      <div className="grid gap-10 rounded-[36px] bg-bosque-900 px-5 py-10 text-white sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 lg:px-12 lg:py-16">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-maiz-400">Para vecinos</p>
          <h2
            id="abrir-titulo"
            className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-[1] tracking-[-0.04em] text-balance"
          >
            Abre un punto en tu casa
          </h2>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-white/75">
            En {popayan.name}, {popayan.neighbors} de los {popayan.total} puntos los abrieron vecinos en su garaje, su sala o el
            salón de la cuadra. Si tienes un espacio, esto es lo que necesitas.
          </p>

          <motion.ul
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-8 space-y-3"
          >
            {openPointRequirements.map((requirement, i) => {
              const Icon = requirementIcons[i];
              return (
                <motion.li
                  key={requirement.title}
                  variants={entry}
                  className="flex gap-4 rounded-[22px] bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-maiz-400 text-bosque-950">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-semibold tracking-[-0.02em]">{requirement.title}</h3>
                    <p className="mt-0.5 text-[14.5px] leading-snug text-white/70">{requirement.body}</p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>

          <div className="mt-10">
            <h3 className="flex flex-wrap items-center gap-3 font-display text-[19px] font-semibold tracking-[-0.02em]">
              Cómo se verifica
              <ExampleTag tone="dark">Así funcionaría</ExampleTag>
            </h3>
            <ol className="mt-4 space-y-3">
              {verificationSteps.map((step, i) => (
                <li key={step} className="flex gap-3.5 text-[15px] leading-snug text-white/75">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-[13px] font-semibold tabular-nums text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <OpenPointForm />
      </div>
    </section>
  );
}
