"use client";

import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { SourceRef } from "@/components/noticias/source-ref";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { contexto } from "@/content/noticias";
import { trackingDemo } from "@/content/site";
import { easeSalida } from "@/lib/motion";

/**
 * Tarjeta de contexto, aparte de la cronología: un caso de 2024 que no es de este terremoto pero explica por qué
 * GeoAid deja seguir cada entrega. Abajo, el recorrido de la donación de ejemplo del inicio, ya entregada.
 */
export function ContextNote() {
  return (
    <motion.article
      aria-labelledby="contexto-titulo"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: easeSalida }}
      className="flex flex-col rounded-[28px] bg-bosque-900 p-6 text-white sm:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-maiz-400">Contexto</p>
        <p className="flex items-center gap-2.5 text-[13px] text-white/65">
          <time dateTime="2024-03-12">{contexto.fecha}</time>
          <SourceRef id={contexto.fuente} tone="dark" />
        </p>
      </div>

      <h2
        id="contexto-titulo"
        className={`${serif} mt-8 max-w-[18ch] text-[clamp(2rem,3.2vw,2.85rem)] font-normal leading-[1.04] tracking-[-0.02em] text-balance`}
      >
        {contexto.titular}
      </h2>
      <div className="mt-5 max-w-xl space-y-3 text-[16px] leading-relaxed text-white/75">
        {contexto.cuerpo.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}
      </div>

      <Route />

      <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/90">{contexto.geoaid}</p>
      {/* Al fondo de la tarjeta, alineado con el botón de la suscripción cuando quedan lado a lado */}
      <div className="mt-auto pt-8">
        <NavLink href={contexto.enlace.href} className={`${button({ variant: "light" })} max-sm:w-full`}>
          {contexto.enlace.label}
          <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
        </NavLink>
      </div>
    </motion.article>
  );
}

/** El recorrido de la donación de ejemplo (`trackingDemo`): la línea se dibuja y cada parada se marca en orden. */
function Route() {
  const { stops, code } = trackingDemo;

  return (
    <div className="mt-8 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-semibold">
          Donación <span className="tabular-nums">#{code}</span>
        </p>
        <ExampleTag tone="dark">Ejemplo de seguimiento</ExampleTag>
      </div>
      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.8 }}
        aria-label="Recorrido de la donación"
        className="relative mt-5 grid grid-cols-4"
      >
        <motion.span
          aria-hidden
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, delay: 0.2, ease: easeSalida } } }}
          className="absolute left-[12.5%] right-[12.5%] top-[11px] h-[2px] origin-left bg-maiz-400"
        />
        {stops.map((stop, i) => (
          <li key={stop} className="relative flex flex-col items-center gap-2 text-center">
            <motion.span
              variants={{
                hidden: { scale: 0.4, opacity: 0 },
                show: { scale: 1, opacity: 1, transition: { delay: 0.25 + i * 0.32, type: "spring", bounce: 0.4 } },
              }}
              className="grid size-6 place-items-center rounded-full bg-maiz-400 text-bosque-950"
            >
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
            </motion.span>
            <span className="text-[12px] leading-tight text-white/75">{stop}</span>
          </li>
        ))}
      </motion.ol>
    </div>
  );
}
