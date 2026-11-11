"use client";

import { motion, type Variants } from "motion/react";
import { Check, Package, Send, X } from "lucide-react";
import { audiences } from "@/content/site";
import { easeSalida } from "@/lib/motion";

const card: Variants = {
  hidden: { opacity: 0, y: 60, rotate: 1.5 },
  show: (i: number) => ({ opacity: 1, y: 0, rotate: 0, transition: { duration: 1, delay: i * 0.08, ease: easeSalida } }),
};

const spans: Record<(typeof audiences)[number]["id"], string> = {
  gobierno: "md:col-span-4",
  organizaciones: "md:col-span-2",
  ciudadania: "md:col-span-2",
  comunidades: "md:col-span-4",
};

/** Para quién es: cada tarjeta trae un pedazo de la interfaz que esa persona usaría. Todos los datos son de ejemplo. */
export function Audiences() {
  return (
    <section aria-labelledby="para-quien-titulo" className="relative z-10 -mt-10 rounded-t-[36px] bg-papel pb-28 pt-24 md:pt-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <h2
          id="para-quien-titulo"
          className="max-w-3xl font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-bosque-900 text-balance"
        >
          Un mismo tablero, cuatro formas de usarlo
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-niebla">
          Gobierno, organizaciones y ciudadanía ven la misma información. Así nadie repite entregas y nadie se queda por
          fuera.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-14 grid gap-4 md:grid-cols-6"
        >
          {audiences.map((audience, i) => (
            <motion.article
              key={audience.id}
              custom={i}
              variants={card}
              className={`flex flex-col justify-between gap-10 rounded-[32px] bg-white p-7 ring-1 ring-linea md:p-9 ${spans[audience.id]}`}
            >
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-tinta md:text-[1.75rem]">
                  {audience.title}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-niebla">{audience.body}</p>
              </div>
              <Widget id={audience.id} />
            </motion.article>
          ))}
        </motion.div>
        <p className="mt-4 text-[13px] text-niebla">Las cifras y nombres de estas tarjetas son de ejemplo.</p>
      </div>
    </section>
  );
}

function Widget({ id }: { id: (typeof audiences)[number]["id"] }) {
  switch (id) {
    case "gobierno":
      return <CoverageWidget />;
    case "organizaciones":
      return <AcceptsWidget />;
    case "ciudadania":
      return <DeliveredWidget />;
    case "comunidades":
      return <NeedWidget />;
  }
}

const zones = [
  { name: "Zona norte", value: 0.92 },
  { name: "Zona centro", value: 0.64 },
  { name: "Zona rural oriente", value: 0.31 },
  { name: "Territorio étnico sur", value: 0.12 },
];

function CoverageWidget() {
  return (
    <div className="rounded-2xl bg-papel p-5">
      <p className="text-[12px] font-medium text-niebla">Hogares que ya recibieron ayuda</p>
      <ul className="mt-4 space-y-3">
        {zones.map((zone, i) => (
          <li key={zone.name} className="grid grid-cols-[9.5rem_1fr_3rem] items-center gap-3 text-sm max-sm:grid-cols-[7rem_1fr_2.5rem]">
            <span className="truncate text-tinta">{zone.name}</span>
            <span className="h-2 overflow-hidden rounded-full bg-linea">
              <motion.span
                className={`block h-full origin-left rounded-full ${zone.value < 0.4 ? "bg-alerta" : "bg-bosque-700"}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: zone.value }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: easeSalida }}
              />
            </span>
            <span className="text-right tabular-nums text-niebla">{Math.round(zone.value * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AcceptsWidget() {
  return (
    <div className="space-y-3">
      <ChipRow icon="yes" items={["Agua", "Kits de aseo", "Alimentos no perecederos"]} />
      <ChipRow icon="no" items={["Ropa usada", "Medicamentos", "Perecederos"]} />
    </div>
  );
}

function ChipRow({ icon, items }: { icon: "yes" | "no"; items: string[] }) {
  const yes = icon === "yes";
  return (
    <div>
      <p className="text-[12px] font-medium text-niebla">{yes ? "Recibimos" : "No recibimos"}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.08, type: "spring", bounce: 0.4 }}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-medium ${
              yes ? "bg-bosque-50 text-bosque-800" : "bg-alerta/10 text-alerta"
            }`}
          >
            {yes ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function DeliveredWidget() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-bosque-900 p-4 text-white">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-maiz-400 text-bosque-950">
        <Package className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">Entregada</span>
        <span className="block truncate text-[13px] text-white/65">12 familias, punto de entrega rural</span>
      </span>
    </div>
  );
}

function NeedWidget() {
  return (
    <div className="grid gap-2 rounded-2xl bg-papel p-4 sm:grid-cols-[1fr_1fr_auto]">
      <span className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-linea">
        <span className="block text-[11px] text-niebla">Vereda</span>
        <span className="block text-sm font-semibold text-tinta">La Esperanza</span>
      </span>
      <span className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-linea">
        <span className="block text-[11px] text-niebla">Lo que falta</span>
        <span className="block text-sm font-semibold text-tinta">Agua y techo</span>
      </span>
      <span className="flex items-center justify-center gap-2 rounded-xl bg-bosque-800 px-4 py-2.5 text-sm font-semibold text-white">
        <Send className="size-4" aria-hidden />
        Enviar
      </span>
    </div>
  );
}
