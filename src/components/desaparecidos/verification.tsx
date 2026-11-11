"use client";

import { motion } from "motion/react";
import { pasos, principios } from "@/content/desaparecidos";
import { easeSalida } from "@/lib/motion";

/**
 * Cómo verificamos cada reporte: cuatro pasos y lo que nunca se publica. Es la única hoja oscura de la página. El
 * único movimiento es la regla de cada paso, que se traza en orden cuando la sección entra en pantalla.
 */
export function Verification() {
  return (
    <section id="verificamos" aria-labelledby="verificamos-titulo" className="mt-28 scroll-mt-20 px-3 lg:mt-36">
      <div className="rounded-[36px] bg-bosque-900 py-20 text-white lg:py-28">
        {/* Mismo ancho y relleno que el resto de la página, para que los bordes del texto queden alineados */}
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-24">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">Cómo verificamos cada reporte</p>
              <h2
                id="verificamos-titulo"
                className="mt-4 font-display text-[clamp(2.2rem,4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-balance"
              >
                Nada se publica sin revisarlo antes
              </h2>
            </div>
            <p className="max-w-md text-[15.5px] leading-relaxed text-white/65">
              Así funcionará GeoAid. Hoy es un prototipo universitario: los reportes de esta página son de ejemplo y nada se
              envía a las autoridades.
            </p>
          </div>

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          >
            {pasos.map((paso, i) => (
              <li key={paso.titulo} className="relative pt-7">
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/15" />
                <motion.span
                  aria-hidden
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 1.1, delay: 0.2 + i * 0.25, ease: easeSalida } },
                  }}
                  className={`absolute inset-x-0 top-0 h-px origin-left ${i === pasos.length - 1 ? "bg-maiz-400" : "bg-white/70"}`}
                />
                <span className="font-display text-[15px] font-medium tabular-nums text-white/55">
                  <span className="sr-only">Paso </span>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em]">{paso.titulo}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{paso.texto}</p>
              </li>
            ))}
          </motion.ol>

          <div className="mt-20 grid gap-10 border-t border-white/15 pt-12 lg:mt-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
            <div>
              <h3 className="font-display text-[1.75rem] font-medium leading-tight tracking-[-0.03em]">Lo que nunca publicamos</h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/60">
                Un reporte debe ayudar a encontrar a alguien, no ponerlo en riesgo a él ni a su familia.
              </p>
            </div>
            <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {principios.map(({ icon: Icon, titulo, texto }) => (
                <li key={titulo} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10">
                    <Icon className="size-[18px] text-white/80" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold">{titulo}</span>
                    <span className="mt-1 block text-[14.5px] leading-snug text-white/60">{texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
