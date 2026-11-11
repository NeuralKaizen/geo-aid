"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Clock, MapPin, ShieldCheck, Truck, Users } from "lucide-react";
import {
  needCoverage,
  percent,
  placeOf,
  urgencyOf,
  urgencyStyles,
  zoneCoverage,
} from "@/components/donaciones/metrics";
import { needIcons } from "@/components/donaciones/need-icons";
import { UrgencyBadge } from "@/components/donaciones/urgency-badge";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import type { Zone } from "@/content/donaciones";
import { numero } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

/** Barra de cobertura: crece desde la izquierda la primera vez que se ve. El texto de al lado lleva el dato. */
function CoverageBar({ value, fill, className }: { value: number; fill: string; className: string }) {
  return (
    <span aria-hidden className={`block overflow-hidden rounded-full bg-linea/70 ${className}`}>
      <motion.span
        className={`block h-full origin-left rounded-full ${fill}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: value }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, delay: 0.15, ease: easeSalida }}
      />
    </span>
  );
}

/*
 * Una zona del tablero. En escritorio es una fila de tres columnas (quién, qué le falta, cuánto llegó) con las acciones
 * abajo a la derecha; en móvil se apila con la cobertura arriba a la derecha. "Ver detalle" abre las últimas entregas
 * debajo de la tarjeta, sin sacar a la persona del tablero.
 */
export function ZoneCard({ zone }: { zone: Zone }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const detailId = useId();
  const coverage = zoneCoverage(zone);
  const style = urgencyStyles[urgencyOf(coverage)];

  return (
    <article aria-labelledby={titleId} className="rounded-[28px] bg-white p-5 ring-1 ring-linea sm:p-6 lg:px-7">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-6 [grid-template-areas:'info_cov''needs_needs'] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_10.5rem] lg:gap-x-10 lg:[grid-template-areas:'info_needs_cov']">
        <div className="[grid-area:info]">
          <UrgencyBadge level={urgencyOf(coverage)} />
          <h3 id={titleId} className="mt-3 font-display text-[22px] font-semibold leading-tight tracking-[-0.025em] text-tinta">
            {zone.name}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] text-niebla">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {placeOf(zone)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-niebla">
            <Users className="size-3.5 shrink-0" aria-hidden />
            <span>
              <strong className="font-semibold text-tinta tabular-nums">{numero(zone.families)}</strong> familias
            </span>
          </p>
        </div>

        <div className="text-right [grid-area:cov] lg:text-left">
          <p className="font-display text-[clamp(2.25rem,4vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] text-tinta tabular-nums">
            {percent(coverage)}
            <span className="ml-1 text-[0.55em] tracking-normal">%</span>
          </p>
          <p className="mt-1.5 text-[12.5px] leading-snug text-niebla">de lo pedido ya llegó</p>
          <CoverageBar value={coverage} fill={style.fill} className="ml-auto mt-3 h-2 w-24 lg:ml-0 lg:w-full" />
        </div>

        <ul
          aria-label="Lo que le falta"
          className="grid content-start gap-x-8 gap-y-5 [grid-area:needs] sm:grid-cols-2 lg:grid-cols-1 lg:pt-1 xl:grid-cols-2"
        >
          {zone.needs.map((need) => {
            const Icon = needIcons[need.type];
            const share = needCoverage(need);
            return (
              <li key={need.item}>
                <p className="flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-tinta">
                    <Icon className="size-4 shrink-0 self-center text-bosque-600" aria-hidden />
                    <span className="truncate">{need.item}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-tinta tabular-nums">{percent(share)} %</span>
                </p>
                <CoverageBar value={share} fill={urgencyStyles[urgencyOf(share)].fill} className="mt-2 h-1" />
                <p className="mt-1.5 text-[12.5px] text-niebla tabular-nums">
                  {numero(need.delivered)} de {numero(need.goal)} {need.unit}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="mt-6 flex flex-col gap-4 border-t border-dashed border-linea pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-niebla">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            Actualizada: {zone.updated}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-bosque-600" aria-hidden />
            Verificada por: {zone.verifiedBy}
          </span>
          <ExampleTag />
        </div>
        <div className="order-first flex gap-2 lg:order-none">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((value) => !value)}
            className={`${button({ variant: "secondary", size: "sm" })} max-lg:h-11 sm:flex-1 lg:flex-none`}
          >
            {/* En móvil la etiqueta corta deja que "Aportar a esta zona" quepa en una línea */}
            <span className="sm:hidden">{open ? "Ocultar" : "Detalle"}</span>
            <span className="hidden sm:inline">{open ? "Ocultar detalle" : "Ver detalle"}</span>
            <ChevronDown
              className={`size-4 transition-transform duration-500 ease-salida ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          <NavLink
            href={`/donar?zona=${zone.slug}`}
            className={`${button({ size: "sm" })} flex-1 whitespace-nowrap max-lg:h-11 lg:flex-none`}
          >
            Aportar a esta zona
            <ArrowRight
              className="hidden size-4 transition-transform duration-500 ease-salida group-hover:translate-x-0.5 min-[400px]:block"
              aria-hidden
            />
          </NavLink>
        </div>
      </footer>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={detailId}
            key="detalle"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.55, ease: easeSalida } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.35, ease: easeSalida } }}
            className="overflow-hidden"
          >
            <ZoneDetail zone={zone} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function ZoneDetail({ zone }: { zone: Zone }) {
  return (
    <div className="mt-6 grid gap-8 border-t border-linea pt-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
      <section>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-bosque-600">Cada necesidad, en detalle</h4>
        <ul className="mt-2 divide-y divide-linea">
          {zone.needs.map((need) => {
            const missing = Math.max(0, need.goal - need.delivered);
            return (
              <li key={need.item} className="py-3.5">
                <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <span className="text-[15px] font-semibold text-tinta">{need.item}</span>
                  <span className="text-[13px] font-medium text-tinta tabular-nums">
                    Faltan {numero(missing)} {need.unit}
                  </span>
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-niebla">{need.detail}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-bosque-600">Últimas entregas</h4>
        <div className="relative mt-4">
          <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-linea" />
          <ol className="space-y-5 pl-7">
            {zone.deliveries.map((delivery, i) => (
              <motion.li
                key={`${delivery.date}-${delivery.what}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: easeSalida }}
                className="relative"
              >
                <span
                  aria-hidden
                  className={`absolute -left-7 top-1 size-[11px] rounded-full ring-4 ring-white ${
                    i === 0 ? "bg-bosque-700" : "bg-bosque-200"
                  }`}
                />
                <p className="text-[12.5px] font-medium text-niebla tabular-nums">{delivery.date}</p>
                <p className="mt-0.5 text-[15px] font-semibold text-tinta">{delivery.what}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-niebla">
                  <Truck className="size-3.5 shrink-0" aria-hidden />
                  {delivery.via}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
