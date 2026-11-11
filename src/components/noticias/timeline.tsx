"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { SourceRef } from "@/components/noticias/source-ref";
import { NavLink } from "@/components/transitions/nav-link";
import { hitos, temas, type Hito, type Tema } from "@/content/noticias";
import { easeSalida } from "@/lib/motion";

type Filtro = Tema | "todo";

/*
 * El eje se llena de maíz a medida que se lee: el frente del relleno va fijo a esta altura de la pantalla y cada
 * punto se enciende justo cuando el relleno lo alcanza (usan la misma línea de referencia).
 */
const READ_LINE = "62%";

const entrada: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeSalida } },
};

const temaLabel = Object.fromEntries(temas.map((tema) => [tema.id, tema.label])) as Record<Tema, string>;

/** Cronología: la pieza central de la bitácora. Filtrable por tema; los hitos se reacomodan con animaciones de layout. */
export function Timeline() {
  const [filtro, setFiltro] = useState<Filtro>("todo");
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: [`start ${READ_LINE}`, `end ${READ_LINE}`] });

  const visibles = filtro === "todo" ? hitos : hitos.filter((hito) => hito.tema === filtro);

  return (
    <section aria-labelledby="cronologia-titulo" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <p className="border-t-2 border-tinta pt-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-tinta">Cronología</p>
          <h2
            id="cronologia-titulo"
            className={`${serif} mt-5 text-[clamp(2.4rem,4vw,3.5rem)] font-normal leading-[1] tracking-[-0.025em] text-tinta text-balance`}
          >
            Ocho fechas que explican la emergencia
          </h2>
          <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed text-niebla">
            Del día del sismo al último corte oficial. Cada hito trae su fuente al pie y lo que significa si quieres ayudar.
          </p>

          <Filters value={filtro} onChange={setFiltro} />
          <p aria-live="polite" className="mt-4 text-[13px] text-niebla">
            {filtro === "todo"
              ? `Mostrando los ${hitos.length} hitos`
              : `Mostrando ${visibles.length} de ${hitos.length} hitos: ${temaLabel[filtro].toLowerCase()}`}
          </p>
        </header>

        <ol ref={listRef} className="relative">
          {/* Eje: una regla fina de fondo y el relleno en maíz que avanza con el scroll */}
          <span aria-hidden className="absolute bottom-0 left-3 top-3 w-px -translate-x-1/2 bg-tinta/15 sm:left-[8.25rem]" />
          <motion.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-0 left-3 top-3 w-[3px] origin-top -translate-x-1/2 rounded-full bg-maiz-400 sm:left-[8.25rem]"
          />

          <AnimatePresence mode="popLayout">
            {visibles.map((hito) => (
              <Milestone key={hito.id} hito={hito} />
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  );
}

function Filters({ value, onChange }: { value: Filtro; onChange: (filtro: Filtro) => void }) {
  const options: { id: Filtro; label: string; count: number }[] = [
    { id: "todo", label: "Todo", count: hitos.length },
    ...temas.map((tema) => ({ ...tema, count: hitos.filter((hito) => hito.tema === tema.id).length })),
  ];

  return (
    <div role="group" aria-label="Filtrar la cronología por tema" className="mt-8 flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`relative isolate inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium ring-1 ring-inset transition-[color,box-shadow] duration-300 ${
              active ? "text-white ring-transparent" : "text-tinta/75 ring-tinta/15 hover:text-tinta hover:ring-tinta/35"
            }`}
          >
            {active && (
              <motion.span
                layoutId="tema-activo"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-tinta"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            {option.label}
            <span className={`text-[12px] tabular-nums ${active ? "text-white/60" : "text-niebla"}`}>{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function Milestone({ hito }: { hito: Hito }) {
  const dotRef = useRef<HTMLSpanElement>(null);
  // De 0 a 1 en un tramo corto alrededor de la línea de lectura: el punto se enciende cuando el relleno llega
  const { scrollYProgress: lit } = useScroll({ target: dotRef, offset: [`center ${READ_LINE}`, "center 56%"] });
  const day = hito.diaSismo === 0 ? "Día del sismo" : `Día ${hito.diaSismo}`;

  return (
    <motion.li
      layout="position"
      variants={entrada}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ layout: { duration: 0.6, ease: easeSalida } }}
      className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 pb-14 last:pb-2 sm:grid-cols-[6rem_2rem_minmax(0,1fr)] sm:gap-x-5 lg:pb-16"
    >
      <p className="hidden pt-0.5 text-right sm:block">
        <time dateTime={hito.iso} className="block">
          <span className={`${serif} block text-[2.6rem] leading-none tracking-[-0.02em] text-tinta tabular-nums`}>
            {hito.fecha.dia}
          </span>
          <span className="mt-1.5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-tinta">
            {hito.fecha.mes} {hito.fecha.anio}
          </span>
        </time>
        <span className="mt-1 block text-[12px] text-niebla">{day}</span>
      </p>

      {/* Punto del eje: un anillo fijo y el relleno en maíz que se enciende con el scroll */}
      <span aria-hidden className="relative flex justify-center pt-3 sm:pt-3.5">
        <span ref={dotRef} className="relative grid size-[15px] place-items-center rounded-full bg-papel ring-2 ring-tinta/25">
          <motion.span style={{ scale: lit, opacity: lit }} className="absolute -inset-[2px] rounded-full bg-maiz-400 ring-4 ring-maiz-400/25" />
        </span>
      </span>

      <article aria-labelledby={`hito-${hito.id}`}>
        <p className="mb-2 text-[12.5px] text-niebla sm:hidden">
          <time dateTime={hito.iso} className="font-semibold uppercase tracking-[0.12em] text-tinta">
            {hito.fecha.dia} {hito.fecha.mes} {hito.fecha.anio}
          </time>{" "}
          · {day}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-bosque-600">{temaLabel[hito.tema]}</span>
          {hito.fuente && <SourceRef id={hito.fuente} />}
        </div>
        <h3
          id={`hito-${hito.id}`}
          className={`${serif} mt-3 text-[clamp(1.6rem,2.3vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.015em] text-tinta text-balance`}
        >
          <span className="sr-only">{hito.fechaCompleta}: </span>
          {hito.titular}
        </h3>
        {hito.detalle && <p className="mt-3 max-w-[38rem] text-[16px] leading-relaxed text-tinta/85">{hito.detalle}</p>}

        <div className="mt-5 max-w-[38rem] border-l-2 border-maiz-400 pl-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-tinta">Qué significa</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-niebla">{hito.significa}</p>
        </div>

        {hito.enlace && (
          <NavLink
            href={hito.enlace.href}
            className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-bosque-800"
          >
            <span className="relative">
              {hito.enlace.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-bosque-800/30 transition-colors duration-300 group-hover:bg-maiz-400"
              />
            </span>
            <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
          </NavLink>
        )}
      </article>
    </motion.li>
  );
}
