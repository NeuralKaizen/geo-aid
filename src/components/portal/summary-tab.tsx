"use client";

import { motion, type Variants } from "motion/react";
import { MapPin, Sparkles } from "lucide-react";
import { AnimatedNumber } from "@/components/portal/animated-number";
import { BlockTitle, InviteCard, kindIcons, OriginTag } from "@/components/portal/bits";
import type { PortalData } from "@/components/portal/portal-data";
import { fechaSimple } from "@/components/voluntariado/fechas";
import { numero, pesos } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const tile: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSalida } },
};

const statusStyles = {
  entregada: { label: "Entregada", chip: "bg-bosque-50 text-bosque-800", pin: "bg-bosque-700 text-white" },
  "en-camino": { label: "En camino", chip: "bg-maiz-100 text-maiz-800", pin: "bg-maiz-400 text-bosque-950" },
  recibida: { label: "Recibida", chip: "bg-papel text-tinta/70", pin: "bg-papel text-niebla ring-1 ring-inset ring-linea" },
};

const statusOrder = { entregada: 0, "en-camino": 1, recibida: 2 };

/** Resumen: cifras de impacto que cuentan, a dónde llegó la ayuda y lo último que pasó. */
export function SummaryTab({ data }: { data: PortalData }) {
  const { stats } = data;
  const sessionCount = data.sessionIds.length;
  const places = [...data.places].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <div className="flex flex-col gap-8">
      {/* En móvil: el total ocupa toda la fila y las otras tres cifras van juntas debajo */}
      <motion.dl
        variants={grid}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-2.5 sm:gap-3 xl:grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))]"
      >
        <motion.div variants={tile} className="col-span-3 rounded-[24px] bg-bosque-900 p-5 text-white sm:p-6 xl:col-span-1">
          <dt className="text-[13px] text-white/65">Total donado</dt>
          <dd className="mt-3 font-display text-[clamp(2.25rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-maiz-400">
            <AnimatedNumber value={stats.donated} format={pesos} />
          </dd>
          <dd className="mt-2 text-[13px] text-white/60">
            en {stats.donationCount} {stats.donationCount === 1 ? "donación" : "donaciones"}
          </dd>
        </motion.div>
        <Stat
          label="Municipios"
          value={stats.municipios.length}
          caption={`Llegó a ${stats.municipios.map((m) => m.split(",")[0]).join(" y ")}`}
        />
        <Stat label="Horas de voluntariado" value={stats.hours} caption={`en ${stats.pastCount} ${stats.pastCount === 1 ? "turno" : "turnos"} hechos`} />
        <Stat
          label="Turnos"
          value={stats.shiftCount}
          caption={`${stats.upcomingCount} ${stats.upcomingCount === 1 ? "próximo" : "próximos"}`}
        />
      </motion.dl>

      {sessionCount === 0 ? (
        <InviteCard
          icon={Sparkles}
          title="Lo que hagas hoy aparece aquí"
          body="Dona, toma un turno o registra una necesidad, y vuelve: lo verás junto a la historia de Laura."
          actions={[
            { label: "Tomar un turno", href: "/voluntariado#agenda" },
            { label: "Donar", href: "/donar" },
          ]}
        />
      ) : (
        <p className="flex flex-wrap items-center gap-2 rounded-2xl bg-bosque-50 px-4 py-3 text-[14.5px] text-bosque-900">
          <Sparkles className="size-4 text-bosque-700" aria-hidden />
          En esta sesión hiciste {sessionCount} {sessionCount === 1 ? "cosa" : "cosas"}. Las verás marcadas en cada pestaña.
        </p>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="llego-titulo" className="rounded-[28px] bg-white p-5 ring-1 ring-linea sm:p-6">
          <BlockTitle id="llego-titulo">A dónde llegó tu ayuda</BlockTitle>
          <ul className="mt-4 divide-y divide-linea">
            {places.map((place) => {
              const style = statusStyles[place.status];
              return (
                <li key={place.key} className="flex items-start gap-3.5 py-3.5 first:pt-1 last:pb-0">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full ${style.pin}`}>
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[15px] font-semibold text-tinta">{place.place}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${style.chip}`}>{style.label}</span>
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-niebla">{place.detail}</span>
                    {place.session && (
                      <span className="mt-1.5 block">
                        <OriginTag session />
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 pt-0.5 text-[14px] font-semibold tabular-nums text-tinta">{pesos(place.amount)}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="reciente-titulo" className="rounded-[28px] bg-white p-5 ring-1 ring-linea sm:p-6">
          <BlockTitle id="reciente-titulo">Actividad reciente</BlockTitle>
          <ol className="mt-4">
            {data.recent.slice(0, 6).map((item, i, list) => {
              const Icon = kindIcons[item.kind];
              return (
                <li key={item.key} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3.5 pb-4 last:pb-0">
                  {i < list.length - 1 && <span aria-hidden className="absolute bottom-0 left-[17.5px] top-9 w-px bg-linea" />}
                  <span
                    className={`grid size-9 place-items-center rounded-full ${
                      item.session ? "bg-maiz-400 text-bosque-950" : "bg-bosque-50 text-bosque-700"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-[15px] font-semibold text-tinta">{item.title}</span>
                      <span className="text-[12.5px] tabular-nums text-niebla">{fechaSimple(new Date(item.date))}</span>
                    </span>
                    <span className="block truncate text-[13.5px] text-niebla">{item.detail}</span>
                    {item.session && (
                      <span className="mt-1.5 block">
                        <OriginTag session />
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
      <p className="-mt-4 text-[13px] text-niebla">Las donaciones, turnos y lugares sin marca de sesión son de ejemplo.</p>
    </div>
  );
}

/** En móvil la cifra va arriba (las tarjetas son angostas); desde sm, la etiqueta arriba como en el total. */
function Stat({ label, value, caption }: { label: string; value: number; caption: string }) {
  return (
    <motion.div variants={tile} className="flex flex-col rounded-[24px] bg-white p-4 ring-1 ring-linea sm:p-6">
      <dt className="mt-2 text-[12.5px] font-medium leading-snug text-tinta/80 sm:mt-0 sm:text-[13px] sm:font-normal sm:text-niebla">
        {label}
      </dt>
      <dd className="order-first font-display text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-tinta sm:order-none sm:mt-3">
        <AnimatedNumber value={value} format={numero} />
      </dd>
      <dd className="mt-1 text-[12px] leading-snug text-niebla sm:mt-2 sm:text-[13px]">{caption}</dd>
    </motion.div>
  );
}
