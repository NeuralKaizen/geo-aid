"use client";

import { motion } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import { StatusPill } from "@/components/noticias/crisis-status";
import { serif } from "@/components/noticias/fonts";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { button, eyebrow } from "@/components/ui/styles";
import type { Emergencia } from "@/content/noticias";
import { numero } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

/** Qué está pasando, en lenguaje simple, con sus cifras al lado y los caminos para ayudar. */
export function CrisisOverview({ emergencia }: { emergencia: Emergencia }) {
  return (
    <>
      <section
        aria-labelledby="que-esta-pasando"
        className="mx-auto mt-10 grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:px-10"
      >
        <div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className={eyebrow}>Qué está pasando</span>
            <StatusPill estado={emergencia.estado} />
          </p>
          <h2
            id="que-esta-pasando"
            className={`${serif} mt-4 text-[clamp(2.2rem,4.2vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-tinta text-balance`}
          >
            {emergencia.nombre}
          </h2>
          <p className="mt-5 max-w-2xl text-[19px] leading-relaxed text-tinta/80">{emergencia.resumen}</p>

          {emergencia.ejemplo && (
            <p className="mt-6 flex max-w-2xl items-start gap-3 rounded-2xl bg-maiz-100/70 px-4 py-3.5 text-[14px] leading-snug text-maiz-800">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold">Emergencia de ejemplo.</strong> Muestra cómo se ve el portal cuando hay varias
                crisis a la vez. Sus cifras y noticias no son reales.
              </span>
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-2.5">
            {emergencia.ayudar.map((action, index) => (
              <NavLink key={action.label} href={action.href} className={button({ variant: index === 0 ? "primary" : "secondary" })}>
                {action.label}
                <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
              </NavLink>
            ))}
          </div>
        </div>

        {emergencia.cifras.length > 0 ? (
          <dl className="self-start overflow-hidden rounded-[28px] bg-white ring-1 ring-linea">
            {emergencia.cifras.map((cifra, index) => (
              <motion.div
                key={cifra.etiqueta}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + index * 0.08, ease: easeSalida }}
                className="flex flex-col-reverse border-t border-linea px-6 py-5 first:border-t-0 sm:px-7"
              >
                <dt className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[14px] text-niebla">
                  <span>{cifra.etiqueta}</span>
                  {cifra.fuente === "Ejemplo" ? <ExampleTag /> : <span className="text-[12px]">{cifra.fuente}</span>}
                </dt>
                <dd className={`${serif} flex items-baseline gap-2 text-[clamp(2.4rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.025em] text-tinta`}>
                  {cifra.antes && <span className="text-[0.45em] italic text-niebla">{cifra.antes}</span>}
                  {cifra.valor}
                </dd>
              </motion.div>
            ))}
          </dl>
        ) : (
          <div className="self-start rounded-[28px] bg-bosque-900 p-7 text-white">
            <p className={`${serif} text-[26px] font-medium leading-[1.15]`}>Por qué la seguimos</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              No tiene cifras propias en GeoAid. La seguimos por lo que enseña: si una ayuda no se puede rastrear, nadie puede
              comprobar qué llegó ni a quién.
            </p>
          </div>
        )}
      </section>

      {emergencia.comparacion && <Comparison comparacion={emergencia.comparacion} />}
    </>
  );
}

/** Dos cortes de una misma cifra en barras proporcionales. Lo que creció se marca en maíz. Solo compara: no explica causas. */
function Comparison({ comparacion }: { comparacion: NonNullable<Emergencia["comparacion"]> }) {
  const [antes, despues] = comparacion.cortes;
  const max = Math.max(antes.valor, despues.valor);
  const base = antes.valor / max;

  return (
    <section className="mx-auto mt-6 max-w-[1240px] px-5 sm:px-8 lg:px-10">
      <div className="grid gap-8 rounded-[28px] bg-white p-6 ring-1 ring-linea sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14 lg:p-10">
        <div>
          <h3 className={`${serif} text-[clamp(1.6rem,2.4vw,2.1rem)] font-medium leading-[1.1] tracking-[-0.015em] text-tinta`}>
            {comparacion.titular}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-niebla">
            Entre el {antes.fecha} y el {despues.fecha}, el conteo pasó de {numero(antes.valor)} a {numero(despues.valor)}{" "}
            {comparacion.unidad}: {numero(despues.valor - antes.valor)} más. Son dos cortes de fuentes distintas, puestos lado a lado.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {[antes, despues].map((corte, index) => (
            <div key={corte.fecha}>
              <p className="flex items-baseline justify-between gap-4">
                <span className="text-[13px] text-niebla">
                  <strong className="font-semibold text-tinta">{corte.fecha}</strong> · {corte.fuente}
                </span>
                <span className={`${serif} text-[clamp(1.6rem,2.6vw,2.25rem)] font-medium leading-none tracking-[-0.02em] text-tinta`}>
                  {numero(corte.valor)}
                </span>
              </p>
              <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-papel">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.1, delay: 0.1, ease: easeSalida }}
                  style={{ width: `${base * 100}%` }}
                  className="h-full origin-left rounded-l-full bg-bosque-800"
                />
                {index === 1 && (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.9, delay: 0.9, ease: easeSalida }}
                    style={{ width: `${(corte.valor / max - base) * 100}%` }}
                    className="h-full origin-left rounded-r-full bg-maiz-400"
                  />
                )}
              </div>
              {index === 1 && (
                <p className="mt-2 text-[12.5px] font-semibold text-maiz-800" style={{ marginLeft: `${base * 100}%` }}>
                  +{numero(despues.valor - antes.valor)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
