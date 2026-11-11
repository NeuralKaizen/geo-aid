"use client";

import { motion, type Variants } from "motion/react";
import { ArrowDown, HandHeart, MapPinned, PackageCheck, type LucideIcon } from "lucide-react";
import { overallCoverage, percent } from "@/components/donaciones/metrics";
import { NavLink } from "@/components/transitions/nav-link";
import { button } from "@/components/ui/styles";
import { ExampleTag } from "@/components/ui/form";
import { weeklyDonations, zones } from "@/content/donaciones";
import { photos } from "@/content/site";
import { numero } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

/*
 * Textos sobre la foto de cabecera. Las tres cifras van en vidrio, como la tarjeta del hero, y entran por partes
 * cuando la foto ya aterrizó. La de cobertura trae su barra porque es la única que es una proporción.
 */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeSalida } },
};

const fill: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: overallCoverage, transition: { duration: 1.4, delay: 0.5, ease: easeSalida } },
};

type Figure = { icon: LucideIcon; value: string; label: string; bar?: boolean };

const figures: Figure[] = [
  { icon: MapPinned, value: String(zones.length), label: "zonas con faltantes" },
  { icon: PackageCheck, value: `${percent(overallCoverage)} %`, label: "de lo pedido ya llegó", bar: true },
  { icon: HandHeart, value: numero(weeklyDonations), label: "donaciones esta semana" },
];

const glass = "rounded-[22px] bg-bosque-950/45 ring-1 ring-white/15 backdrop-blur-[18px] backdrop-saturate-[1.2]";

export function BoardHero() {
  return (
    <motion.div
      variants={group}
      initial="hidden"
      animate="show"
      className="relative flex min-h-[min(84svh,720px)] flex-col justify-end px-5 pb-6 pt-32 text-white sm:px-8 sm:pb-8 lg:px-12 lg:pb-12"
    >
      {/* Velo para que el texto se lea sobre cualquier parte de la foto */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-bosque-950/95 via-bosque-950/55 to-bosque-950/5 lg:bg-[linear-gradient(to_top,rgb(6_39_36/0.92),rgb(6_39_36/0.35)_55%,rgb(6_39_36/0.05)),linear-gradient(to_right,rgb(6_39_36/0.55),transparent_60%)]"
      />
      <p className="absolute right-5 top-5 max-w-[16rem] text-right text-[11px] leading-snug text-white/60 sm:right-7 sm:top-6">
        {photos.donaciones.credit}
      </p>

      <div className="relative mx-auto grid w-full max-w-[1240px] items-end gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
        <div>
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-md"
          >
            <HandHeart className="size-3.5 text-maiz-400" aria-hidden />
            Tablero de necesidades
          </motion.p>
          <motion.h1
            id="donaciones-titulo"
            variants={item}
            className="mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,6.2vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-balance"
          >
            Lo que falta en cada zona, a la vista
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/80 sm:text-lg">
            Cada zona publica lo que le falta y cuánto ya llegó. Tú eliges a dónde va tu aporte y ves el día en que se
            entrega.
          </motion.p>
          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            <NavLink href="/donar" className={button({ variant: "accent", size: "lg" })}>
              Donar ahora
            </NavLink>
            <a href="#seguimiento" className={button({ variant: "outlineLight", size: "lg" })}>
              Sigue tu donación
              <ArrowDown className="size-4 transition-transform duration-500 ease-salida group-hover:translate-y-0.5" aria-hidden />
            </a>
          </motion.div>
        </div>

        <div>
          <ul className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-2.5">
            {figures.map((figure) => (
              <motion.li key={figure.label} variants={item} className={`${glass} p-3.5 sm:p-4 lg:px-5 lg:py-4`}>
                <figure.icon className="size-4 text-maiz-400" aria-hidden />
                <p className="mt-2.5 font-display text-[clamp(1.5rem,5vw,2.25rem)] font-semibold leading-none tracking-[-0.035em] tabular-nums lg:text-[2.25rem]">
                  {figure.value}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-white/70 sm:text-[13px]">{figure.label}</p>
                {figure.bar && (
                  <span aria-hidden className="mt-3 block h-1 overflow-hidden rounded-full bg-white/15">
                    <motion.span variants={fill} className="block h-full origin-left rounded-full bg-maiz-400" />
                  </span>
                )}
              </motion.li>
            ))}
          </ul>
          <motion.p variants={item} className="mt-3 flex items-center gap-2 text-[12px] text-white/65">
            <ExampleTag tone="dark">Ejemplo</ExampleTag>
            Cifras para mostrar cómo funcionará.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
