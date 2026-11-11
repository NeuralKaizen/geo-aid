"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Store } from "lucide-react";
import { ExampleTag } from "@/components/ui/form";
import { eyebrow, sectionTitle } from "@/components/ui/styles";
import { allocation, suggestedAmount } from "@/content/donaciones";
import { pesos } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

type PartId = (typeof allocation)[number]["id"];

/*
 * Colores de la marca, alternando claros y oscuros entre vecinos. La parte no depende solo del color: cada bloque lleva
 * su porcentaje adentro (en blanco o casi negro según lo claro del fondo) y la leyenda repite nombre y cifra.
 */
const tones: Record<PartId, { fill: string; ink: string }> = {
  compras: { fill: "bg-bosque-700", ink: "text-white" },
  transporte: { fill: "bg-maiz-400", ink: "text-bosque-950" },
  kits: { fill: "bg-brote-300", ink: "text-bosque-950" },
  operacion: { fill: "bg-bosque-200", ink: "text-bosque-950" },
};

const summary = allocation.map((part) => `${part.label}: ${part.share} %`).join("; ");
const main = allocation[0];

/** A dónde va cada peso: una barra que se dibuja al entrar y una leyenda con lo que eso significa en la donación sugerida */
export function Allocation() {
  const [active, setActive] = useState<PartId | null>(null);

  return (
    <section aria-labelledby="peso-titulo" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <p className={eyebrow}>A dónde va cada peso</p>
          <h2 id="peso-titulo" className={`mt-3 ${sectionTitle}`}>
            De cada $100, ${main.share} se vuelven comida y agua compradas cerca de la zona
          </h2>
          <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-niebla">
            El dinero es la ayuda que más rápido se mueve. Se convierte en mercados y agua comprados en el municipio o en la
            ciudad más cercana, sin pagar transporte desde otras ciudades.
          </p>
          <p className="mt-6 flex max-w-lg items-start gap-3 rounded-2xl bg-white p-4 text-[14px] leading-relaxed text-tinta/85 ring-1 ring-linea">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-bosque-50 text-bosque-700">
              <Store className="size-4" aria-hidden />
            </span>
            Comprar cerca también descongestiona los centros de acopio. En agosto, Bogotá cerró los suyos el 16 y el 17
            porque no daban abasto.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: easeSalida }}
          className="rounded-[28px] bg-white p-5 ring-1 ring-linea sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] font-semibold text-tinta">Cómo se reparte una donación</p>
            <ExampleTag>Reparto de ejemplo</ExampleTag>
          </div>

          {/*
           * La barra se descubre de izquierda a derecha una sola vez, como si se trazara. El aviso de "ya se ve" lo da el
           * contenedor: un elemento recortado por completo no cuenta como visible para el navegador.
           */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.8 }} className="mt-6">
            <motion.div
              role="img"
              aria-label={`Reparto de cada donación. ${summary}.`}
              variants={{
                hidden: { clipPath: "inset(0 100% 0 0)" },
                show: { clipPath: "inset(0 0% 0 0)", transition: { duration: 1.6, delay: 0.3, ease: easeSalida } },
              }}
              className="flex h-7 gap-[2px]"
            >
              {allocation.map((part) => (
                <span
                  key={part.id}
                  style={{ flexBasis: `${part.share}%` }}
                  onMouseEnter={() => setActive(part.id)}
                  onMouseLeave={() => setActive(null)}
                  className={`flex min-w-0 items-center rounded-[4px] px-2 transition-opacity duration-300 ${tones[part.id].fill} ${
                    active && active !== part.id ? "opacity-35" : ""
                  }`}
                >
                  {/* Solo se escribe el porcentaje donde cabe; si no, lo dice la leyenda */}
                  {part.share >= 10 && (
                    <span
                      aria-hidden
                      className={`text-[12px] font-semibold tabular-nums ${tones[part.id].ink} ${part.share < 30 ? "hidden sm:inline" : ""}`}
                    >
                      {part.share} %
                    </span>
                  )}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <ul className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {allocation.map((part, i) => (
              <motion.li
                key={part.id}
                onMouseEnter={() => setActive(part.id)}
                onMouseLeave={() => setActive(null)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: easeSalida }}
                className={`transition-opacity duration-300 ${
                  active && active !== part.id ? "opacity-45" : ""
                }`}
              >
                <p className="flex items-center gap-2.5">
                  <span aria-hidden className={`size-3 rounded-[4px] ${tones[part.id].fill}`} />
                  <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-tinta tabular-nums">
                    {part.share} %
                  </span>
                </p>
                <p className="mt-2 text-[15px] font-semibold leading-snug text-tinta">{part.label}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-niebla">{part.detail}</p>
                <p className="mt-2 text-[13px] text-tinta/80 tabular-nums">
                  De {pesos(suggestedAmount)}: <strong className="font-semibold">{pesos((suggestedAmount * part.share) / 100)}</strong>
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
