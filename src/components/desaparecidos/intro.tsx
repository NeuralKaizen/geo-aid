"use client";

import { motion } from "motion/react";
import { ExampleTag } from "@/components/ui/form";
import { cifras } from "@/content/desaparecidos";
import { easeSalida } from "@/lib/motion";

/** Una frase que marca el tono de la página y las cifras de reencuentros, con aire y sin adornos. */
export function Intro() {
  return (
    <section aria-labelledby="intro-titulo" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: easeSalida }}
        >
          <h2
            id="intro-titulo"
            className="font-display text-[clamp(2rem,3.6vw,3.3rem)] font-medium leading-[1.08] tracking-[-0.035em] text-tinta text-balance"
          >
            Cada reporte es una familia que espera noticias. Aquí todo se hace con calma y con cuidado.
          </h2>
          <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-niebla">
            Puedes buscar a alguien, contar lo que sabes o reportar a una persona. Verificamos cada reporte antes de
            publicarlo y nunca mostramos datos que pongan a alguien en riesgo.
          </p>
        </motion.div>

        <div>
          <dl>
            {cifras.map((cifra, i) => (
              <motion.div
                key={cifra.etiqueta}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: 0.15 + i * 0.15 }}
                className="flex items-baseline gap-5 border-t border-linea py-5 last:border-b"
              >
                <dt className="order-2 text-[15px] leading-snug text-niebla">{cifra.etiqueta}</dt>
                <dd className="order-1 w-[6.5rem] shrink-0 font-display text-[2.75rem] font-medium leading-none tracking-[-0.04em] text-tinta tabular-nums">
                  {cifra.valor}
                </dd>
              </motion.div>
            ))}
          </dl>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-niebla">
            <ExampleTag>Cifras de ejemplo</ExampleTag>
            Así se verán cuando GeoAid esté en marcha.
          </p>
        </div>
      </div>
    </section>
  );
}
