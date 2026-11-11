"use client";

import { motion, type Variants } from "motion/react";
import { serif } from "@/components/noticias/fonts";
import { SourceRef } from "@/components/noticias/source-ref";
import { cifras, comparacion, fuente } from "@/content/noticias";
import { numero } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.1, ease: easeSalida } }),
};

/** Banda de cifras: números grandes en serif, cada uno con su fuente, su fecha de corte y su nota al pie. */
export function Figures() {
  return (
    <section aria-labelledby="cifras-titulo" className="mx-auto max-w-[1240px] px-5 pt-16 sm:px-8 lg:px-10 lg:pt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-tinta pb-3">
        <h2 id="cifras-titulo" className="text-[12px] font-semibold uppercase tracking-[0.2em] text-tinta">
          Las cifras
        </h2>
        <p className="text-[13px] text-niebla">Cada número con su fuente y su fecha</p>
      </div>

      <motion.dl
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="grid border-b border-tinta/15 md:grid-cols-3"
      >
        {cifras.map((cifra, i) => (
          <motion.div
            key={cifra.id}
            custom={i}
            variants={rise}
            className="flex flex-col gap-3 border-tinta/15 py-8 max-md:[&+&]:border-t md:px-8 md:first:pl-0 md:last:pr-0 md:[&+&]:border-l lg:py-10"
          >
            <dt className="order-2 max-w-[16rem] text-[15px] leading-snug text-tinta/80">{cifra.etiqueta}</dt>
            <dd
              className={`${serif} order-1 text-[clamp(3.5rem,6vw,5.6rem)] font-normal leading-[0.9] tracking-[-0.03em] text-tinta tabular-nums`}
            >
              {cifra.antes && <span className="mr-2.5 text-[0.36em] italic tracking-normal text-tinta/70">{cifra.antes}</span>}
              {cifra.valor}
            </dd>
            <dd className="order-3 flex flex-wrap items-center gap-2 text-[12.5px] text-niebla">
              <span>
                {fuente(cifra.fuente).medio} · corte al {cifra.corte}
              </span>
              <SourceRef id={cifra.fuente} compact />
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <Comparison />
    </section>
  );
}

/*
 * Dos cortes de la cifra de damnificados, lado a lado. La barra de octubre repite en verde lo que ya había en agosto
 * y marca en maíz solo lo que creció, así la diferencia se lee sin hacer cuentas. Solo se comparan los números
 * publicados: no se explica el porqué del aumento.
 */
function Comparison() {
  const [first, last] = comparacion.cortes;
  const share = first.valor / last.valor;
  const growth = last.valor - first.valor;

  return (
    <div className="grid gap-10 border-b border-tinta/15 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-14">
      <div>
        <h3 className={`${serif} text-[clamp(1.8rem,2.7vw,2.5rem)] font-normal leading-[1.08] tracking-[-0.015em] text-tinta text-balance`}>
          {comparacion.titular}
        </h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-niebla">
          Entre el {first.fecha} y el {last.fecha}, el conteo pasó de {numero(first.valor)} a {numero(last.valor)} personas:{" "}
          {numero(growth)} más. Son dos cortes publicados por fuentes distintas y aquí solo los ponemos lado a lado.
        </p>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        aria-label="Personas damnificadas en cada corte"
        className="flex flex-col justify-center gap-8"
      >
        {comparacion.cortes.map((corte, i) => {
          const isLast = i === comparacion.cortes.length - 1;
          return (
            <li key={corte.fecha}>
              <div className="flex items-end justify-between gap-4">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-niebla">
                  <span className="font-semibold text-tinta">{corte.fecha}</span>
                  <span aria-hidden>·</span>
                  {fuente(corte.fuente).medio}
                  <SourceRef id={corte.fuente} compact />
                </p>
                <p className={`${serif} text-[clamp(1.9rem,2.8vw,2.5rem)] leading-none tracking-[-0.02em] text-tinta tabular-nums`}>
                  {numero(corte.valor)}
                </p>
              </div>
              <div aria-hidden className="relative mt-3 h-4 bg-tinta/[0.06]">
                <motion.span
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 1.2, delay: 0.15 + i * 0.2, ease: easeSalida } },
                  }}
                  style={{ width: `${share * 100}%` }}
                  className="absolute inset-y-0 left-0 origin-left bg-bosque-800"
                />
                {isLast && (
                  <motion.span
                    variants={{
                      hidden: { scaleX: 0 },
                      show: { scaleX: 1, transition: { duration: 1.1, delay: 1.05, ease: easeSalida } },
                    }}
                    style={{ left: `${share * 100}%` }}
                    className="absolute inset-y-0 right-0 origin-left bg-maiz-400"
                  />
                )}
              </div>
              {isLast && (
                <motion.p
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.6, duration: 0.6 } } }}
                  style={{ paddingLeft: `${share * 100}%` }}
                  className="mt-2 text-[12.5px] text-maiz-800 max-sm:!pl-0"
                >
                  <span className="border-l-2 border-maiz-400 pl-2 font-semibold">+{numero(growth)} personas</span>
                </motion.p>
              )}
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
