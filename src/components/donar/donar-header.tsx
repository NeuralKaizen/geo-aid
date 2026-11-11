"use client";

import { motion, type Variants } from "motion/react";
import { CalendarCheck, Info, MapPinned, Store, type LucideIcon } from "lucide-react";
import { emergencyLine } from "@/content/site";
import { easeSalida } from "@/lib/motion";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: easeSalida } },
};

const promises: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: MapPinned, title: "Eliges a dónde va", body: "Una zona, un tipo de ayuda o donde más se necesite." },
  { icon: Store, title: "Se compra cerca de la zona", body: "Sin pagar transporte desde otras ciudades." },
  { icon: CalendarCheck, title: "Ves el día en que llega", body: "Con tu código sigues cada parada." },
];

/** Cabecera corta y tranquila: el título, tres garantías y el aviso de prototipo antes de empezar */
export function DonarHeader() {
  return (
    <motion.header
      variants={group}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 lg:px-10 lg:pt-16"
    >
      <motion.p variants={item} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-bosque-600">
        Donar
      </motion.p>
      <motion.h1
        variants={item}
        className="mt-3 max-w-3xl font-display text-[clamp(2.5rem,5.4vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-tinta text-balance"
      >
        Tu aporte, de principio a fin
      </motion.h1>
      <motion.p variants={item} className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-niebla sm:text-lg">
        Eliges a dónde va y cuánto dar. Al final recibes un código para seguirlo hasta el día en que se entrega.
      </motion.p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {promises.map((promise) => (
          <motion.li key={promise.title} variants={item} className="flex items-start gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-linea">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bosque-50 text-bosque-700">
              <promise.icon className="size-[18px]" aria-hidden />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-tinta">{promise.title}</span>
              <span className="mt-0.5 block text-[13.5px] leading-snug text-niebla">{promise.body}</span>
            </span>
          </motion.li>
        ))}
      </ul>

      <motion.p
        variants={item}
        role="note"
        className="mt-4 flex gap-3 rounded-2xl bg-maiz-100 px-4 py-3 text-[14px] leading-relaxed text-maiz-800"
      >
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">GeoAid es un prototipo universitario.</strong> En esta página no se cobra nada y
          la información no llega a ninguna entidad. En una emergencia, llama al{" "}
          <a href={`tel:${emergencyLine.number}`} className="font-semibold underline underline-offset-2">
            {emergencyLine.number}
          </a>
          .
        </span>
      </motion.p>
    </motion.header>
  );
}
