"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, Clock, MapPin, ShieldCheck, Users } from "lucide-react";
import {
  needCoverage,
  placeOf,
  urgencyOf,
  urgencyStyles,
  zoneCoverage,
  zonesByUrgency,
} from "@/components/donaciones/metrics";
import { needIcons } from "@/components/donaciones/need-icons";
import type { Place, TerritoryStatus } from "@/components/home/territory-map";
import { AnimatedNumber } from "@/components/portal/animated-number";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import type { Zone } from "@/content/donaciones";
import { numero } from "@/lib/format";
import { easeSalida } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

/* MapLibre pesa y necesita WebGL: se baja solo en el navegador y solo cuando la hoja está por verse */
const TerritoryMap = dynamic(() => import("@/components/home/territory-map"), { ssr: false });

/*
 * Dónde queda cada zona. Las veredas del tablero son de ejemplo: el punto está en su municipio real del Cauca, pero no
 * señala una vereda exacta. `bearing` es hacia dónde mira la cámara al llegar.
 */
const spots: Record<string, { coords: [number, number]; bearing: number }> = {
  "vereda-la-palma": { coords: [-76.655, 2.772], bearing: -28 },
  "vereda-el-carmen": { coords: [-76.598, 2.64], bearing: 24 },
  "corregimiento-siberia": { coords: [-76.53, 2.79], bearing: -12 },
};

const zones = zonesByUrgency.filter((zone) => zone.slug in spots).slice(0, 3);

const places: Place[] = zones.map((zone) => {
  const need = zone.needs[0];
  return {
    id: zone.slug,
    name: zone.name,
    note: `Faltan ${numero(need.goal - need.delivered)} ${need.unit}`,
    ...spots[zone.slug],
  };
});

const credit = "Imagen: Sentinel-2 cloudless 2020, EOX (datos Copernicus modificados) · Relieve: Mapzen, AWS Terrain Tiles";

/** Cuánto scroll (en zonas) dura la hoja fija: un vuelo por cada zona siguiente y un resto para ver quieta la última */
const TRAVEL = zones.length - 1 + 0.5;

/*
 * "Lo que más falta hoy" sobre el territorio. En escritorio la hoja se queda fija: mientras sube, la cámara baja desde
 * el norte del Cauca hasta la primera zona, y el scroll la lleva volando a las siguientes; el panel de vidrio cambia
 * con cada una. En móvil (o con movimiento reducido) no se fija: las zonas se eligen con pestañas y el mapa va a la
 * elegida. De cada zona se destaca su necesidad principal, la misma con la que Donar explica qué cubre un aporte.
 */
export function UrgentNeeds() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const near = useInView(sectionRef, { once: true, margin: "250% 0px" });
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<TerritoryStatus>("cargando");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { scrollYProgress: arrive } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const t = useTransform(scrollYProgress, (p) => p * TRAVEL);
  // El panel cambia cuando el vuelo ya va más cerca de la zona siguiente que de la anterior
  useMotionValueEvent(t, "change", (value) => pinned && setActive(Math.min(zones.length - 1, Math.floor(value + 0.38))));

  const headY = useTransform(arrive, [0.35, 1], [70, 0]);
  const headOpacity = useTransform(arrive, [0.35, 0.9], [0, 1]);
  const flight = useMemo(() => ({ arrive, t }), [arrive, t]);

  const map = near && (
    <TerritoryMap
      places={places}
      active={active}
      flight={pinned ? flight : undefined}
      leftInset={pinned ? 0.4 : 0}
      onStatus={setStatus}
    />
  );
  const veil = (
    <div
      aria-hidden
      className={`absolute inset-0 bg-bosque-950 transition-opacity duration-1000 ${status === "listo" ? "opacity-0" : "opacity-100"}`}
    />
  );

  return (
    <section
      ref={sectionRef}
      id="falta-hoy"
      aria-labelledby="falta-hoy-titulo"
      className="relative z-10 -mt-10 rounded-t-[36px] bg-bosque-950 text-white shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.5)]"
      style={{ height: pinned ? `${100 + TRAVEL * 95}svh` : undefined }}
    >
      {pinned ? (
        <div className="sticky top-0 h-svh overflow-hidden rounded-t-[36px]">
          {/* key: al pasar de un modo a otro el mapa se monta de nuevo con su cámara */}
          <div key="vuelo" className="absolute inset-0">
            {map}
            {veil}
          </div>
          {/* Sombra a la izquierda y arriba para que el texto se lea sobre la imagen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,39,36,0.92)_0%,rgba(6,39,36,0.7)_30%,rgba(6,39,36,0)_62%),linear-gradient(180deg,rgba(6,39,36,0.75)_0%,rgba(6,39,36,0)_22%)]"
          />

          <div className="pointer-events-none relative mx-auto flex h-full max-w-[1320px] flex-col justify-center px-12 pb-9 pt-24">
            <motion.div style={{ y: headY, opacity: headOpacity }} className="pointer-events-auto w-[min(27rem,38vw)]">
              <Heading />
              <div className="mt-5">
                <ZonePanel zone={zones[active]} index={active} />
              </div>
            </motion.div>
          </div>

          <div className="absolute right-12 top-28 flex items-center gap-3">
            <ExampleTag tone="dark">Zonas de ejemplo</ExampleTag>
            <NavLink href="/donaciones" className={`${button({ variant: "outlineLight", size: "sm" })} bg-bosque-950/40 backdrop-blur-md`}>
              Ver todas las zonas
              <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
            </NavLink>
          </div>
          <Steps active={active} t={t} />
          <p className="absolute bottom-3 left-12 text-[11px] text-white/45">{credit}</p>
        </div>
      ) : (
        <div className="px-5 pb-24 pt-16 sm:px-8">
          <Heading />
          <div className="relative mt-8 h-[46svh] min-h-72 overflow-hidden rounded-[28px] bg-bosque-900 ring-1 ring-white/10">
            <div key="pestanas" className="absolute inset-0">
              {map}
              {veil}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-white/45">{credit}</p>
          <div role="tablist" aria-label="Zonas" className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {zones.map((zone, i) => (
              <button
                key={zone.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`h-11 shrink-0 rounded-full px-4 text-[14px] font-semibold transition-colors duration-300 ${
                  i === active ? "bg-maiz-400 text-bosque-950" : "text-white/80 ring-1 ring-inset ring-white/25"
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <ZonePanel zone={zones[active]} index={active} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <NavLink href="/donaciones" className={button({ variant: "outlineLight", size: "sm" })}>
              Ver todas las zonas
              <ArrowRight className="size-4" aria-hidden />
            </NavLink>
            <ExampleTag tone="dark">Zonas de ejemplo</ExampleTag>
          </div>
        </div>
      )}
    </section>
  );
}

function Heading() {
  return (
    <>
      <h2
        id="falta-hoy-titulo"
        className="font-display text-[clamp(2.25rem,3.4vw,3.25rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-balance"
      >
        Lo que más falta hoy
      </h2>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-white/75">
        Cada comunidad cuenta qué le falta. Aquí se ve dónde está y cuánto queda por cubrir.
      </p>
    </>
  );
}

/** Panel de vidrio con la zona al frente. Al cambiar de zona, el contenido sale hacia arriba y el nuevo entra desde abajo. */
function ZonePanel({ zone, index }: { zone: Zone; index: number }) {
  const [main, ...others] = zone.needs;
  const MainIcon = needIcons[main.type];
  const level = urgencyOf(zoneCoverage(zone));

  return (
    <div className="overflow-hidden rounded-[28px] bg-bosque-950/55 ring-1 ring-white/15 backdrop-blur-[18px] backdrop-saturate-[1.2]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={zone.slug}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: easeSalida }}
          className="p-5 lg:px-6"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold leading-none text-tinta">
              <span aria-hidden className={`size-1.5 rounded-full ${urgencyStyles[level].dot}`} />
              Urgencia {urgencyStyles[level].label.toLowerCase()}
            </span>
            <span className="font-display text-sm font-semibold tabular-nums text-white/60">
              0{index + 1} / 0{zones.length}
            </span>
          </div>

          <h3 className="mt-3.5 font-display text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.035em]">{zone.name}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {placeOf(zone)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5 shrink-0" aria-hidden />
              {numero(zone.families)} familias
            </span>
          </p>

          <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/12 pt-4">
            <div>
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-white/85">
                <MainIcon className="size-4 shrink-0 text-maiz-400" aria-hidden />
                {main.item}
              </p>
              <p className="mt-2 font-display text-[3.25rem] font-semibold leading-[0.9] tracking-[-0.05em]">
                <AnimatedNumber value={main.goal - main.delivered} format={numero} />
              </p>
              <p className="mt-1.5 text-[13.5px] text-white/65">{main.unit} por llegar</p>
            </div>
            <p className="pb-1 text-right text-[13px] leading-snug text-white/65 tabular-nums">
              Han llegado
              <br />
              {numero(main.delivered)} de {numero(main.goal)}
            </p>
          </div>
          <Bar value={needCoverage(main)} className="mt-4 h-2" />

          <ul aria-label="También les falta" className="mt-4 space-y-2.5 lg:[@media(max-height:760px)]:hidden">
            {others.map((need) => {
              const Icon = needIcons[need.type];
              return (
                <li key={need.item}>
                  <p className="flex items-baseline justify-between gap-3 text-[13.5px]">
                    <span className="flex min-w-0 items-center gap-2 font-medium text-white/85">
                      <Icon className="size-3.5 shrink-0 self-center text-white/60" aria-hidden />
                      <span className="truncate">{need.item}</span>
                    </span>
                    <span className="shrink-0 text-[12.5px] tabular-nums text-white/60">
                      {numero(need.delivered)} de {numero(need.goal)}
                    </span>
                  </p>
                  <Bar value={needCoverage(need)} className="mt-1.5 h-1" />
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <NavLink href={`/donar?zona=${zone.slug}`} className={button({ variant: "accent" })}>
              Aportar a esta zona
              <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
            </NavLink>
            <p className="space-y-1 text-[12px] text-white/55">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden />
                {zone.updated}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" aria-hidden />
                {zone.verifiedBy}
              </span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Bar({ value, className }: { value: number; className: string }) {
  return (
    <span aria-hidden className={`block overflow-hidden rounded-full bg-white/15 ${className}`}>
      <motion.span
        className="block h-full origin-left rounded-full bg-maiz-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: value }}
        transition={{ duration: 1.1, delay: 0.15, ease: easeSalida }}
      />
    </span>
  );
}

/** A la derecha: en cuál zona va el recorrido y cuánto falta del vuelo a la siguiente */
function Steps({ active, t }: { active: number; t: MotionValue<number> }) {
  return (
    <ol className="absolute right-12 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2" aria-label="Recorrido por las zonas">
      {zones.map((zone, i) => (
        <li key={zone.slug} aria-current={i === active} className="h-14 w-1 overflow-hidden rounded-full bg-white/25">
          <StepFill index={i} t={t} />
          <span className="sr-only">{zone.name}</span>
        </li>
      ))}
    </ol>
  );
}

function StepFill({ index, t }: { index: number; t: MotionValue<number> }) {
  const scaleY = useTransform(t, (value) => Math.min(1, Math.max(0, value - index + 1)));
  return <motion.span style={{ scaleY }} className="block h-full origin-top rounded-full bg-maiz-400" />;
}
