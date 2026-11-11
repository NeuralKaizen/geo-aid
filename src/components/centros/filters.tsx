"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Ban, Info, X } from "lucide-react";
import {
  items,
  pointTypes,
  redCrossGuide,
  rejectedItems,
  type City,
  type PointType,
  type RejectedId,
  type WantId,
} from "@/content/centros";
import { FilterChip } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { NavLink } from "@/components/transitions/nav-link";
import { easeSalida } from "@/lib/motion";

const typeOrder: PointType[] = ["oficial", "comunal", "parroquia", "casa"];

/*
 * En el celular los chips se deslizan de lado para no apilar diez en cinco líneas: los de "qué llevar" van en dos filas
 * que se mueven juntas, así se alcanzan a ver más de entrada. Desde sm las filas desaparecen (display: contents) y
 * todos los chips se acomodan en varias líneas.
 */
const scrollRow = "-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0";
const wantRows = [
  [...items, ...rejectedItems].slice(0, 5),
  [...items, ...rejectedItems].slice(5),
];

export function Filters({
  wanted,
  types,
  itemCounts,
  typeCounts,
  onToggleWant,
  onToggleType,
  onClear,
  notice,
}: {
  wanted: WantId[];
  types: PointType[];
  itemCounts: Record<WantId, number>;
  typeCounts: Record<PointType, number>;
  onToggleWant: (id: WantId) => void;
  onToggleType: (type: PointType) => void;
  onClear: () => void;
  /** aviso que aparece justo debajo de los chips que lo provocan */
  notice?: ReactNode;
}) {
  const active = wanted.length + types.length > 0;

  return (
    <div className="rounded-[28px] bg-white p-5 ring-1 ring-linea sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="llevar-titulo" className="font-display text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em] text-tinta">
            ¿Qué quieres llevar?
          </h2>
          <p className="mt-1 text-[15px] text-niebla">Elige una o varias cosas y te mostramos los puntos que las reciben hoy.</p>
        </div>
        {active && (
          <button type="button" onClick={onClear} className={`${button({ variant: "ghost", size: "sm" })} -mr-2`}>
            <X className="size-4" aria-hidden />
            Borrar filtros
          </button>
        )}
      </div>

      <div role="group" aria-labelledby="llevar-titulo" className={`mt-4 ${scrollRow}`}>
        <div className="flex w-max flex-col gap-2 sm:contents">
          {wantRows.map((row, i) => (
            <div key={i} className="flex gap-2 sm:contents">
              {row.map((item) => (
                <FilterChip
                  key={item.id}
                  pressed={wanted.includes(item.id)}
                  onClick={() => onToggleWant(item.id)}
                  count={itemCounts[item.id]}
                >
                  {item.label}
                </FilterChip>
              ))}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>{notice}</AnimatePresence>

      <div className="mt-5 border-t border-linea pt-5">
        <p id="tipo-titulo" className="text-[13px] font-semibold uppercase tracking-[0.12em] text-niebla">
          Tipo de punto
        </p>
        <div role="group" aria-labelledby="tipo-titulo" className={`mt-3 flex gap-2 ${scrollRow}`}>
          {typeOrder.map((type) => {
            const Icon = pointTypes[type].icon;
            return (
              <FilterChip key={type} pressed={types.includes(type)} onClick={() => onToggleType(type)} count={typeCounts[type]}>
                <Icon className="size-4" aria-hidden />
                {pointTypes[type].short}
              </FilterChip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Aviso cuando la persona elige algo que ningún punto recibe: la guía real de la Cruz Roja y la salida útil. */
export function RejectedNotice({ chosen, onRemove }: { chosen: RejectedId[]; onRemove: (id: RejectedId) => void }) {
  const chosenItems = rejectedItems.filter((item) => chosen.includes(item.id));
  const names = chosenItems.map((item) => item.label.toLowerCase());
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} ni ${names.at(-1)}` : names[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easeSalida } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      role="status"
      className="mt-4 overflow-hidden rounded-[22px] bg-maiz-100 p-4 ring-1 ring-inset ring-maiz-400/50 sm:p-5"
    >
      <div className="grid gap-5">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-maiz-800">
            <Ban className="size-4" aria-hidden />
            Mejor no lo lleves
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.4rem,2.2vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em] text-tinta text-balance">
            Ningún punto recibe {list}
          </h3>
          <ul className="mt-4 space-y-3">
            {chosenItems.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3">
                <p className="text-[14.5px] leading-snug text-tinta/85">
                  <strong className="font-semibold text-tinta">{item.label}.</strong> {item.reason}
                </p>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Quitar ${item.label.toLowerCase()} de lo que quieres llevar`}
                  className="-mr-1.5 -mt-1 grid size-9 shrink-0 place-items-center rounded-full text-niebla transition-colors hover:bg-maiz-100 hover:text-tinta"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-4 ring-1 ring-maiz-400/30 sm:p-5">
          <blockquote>
            <p className="text-[15.5px] leading-relaxed text-tinta">{redCrossGuide.text}</p>
            <footer className="mt-2 text-[13px] text-niebla">
              Fuente: <cite className="not-italic">{redCrossGuide.sourceShort}</cite>
            </footer>
          </blockquote>
          <div>
            <p className="text-[14px] leading-snug text-niebla">
              El dinero se convierte en mercados y kits comprados cerca de la zona, sin pagar transporte.
            </p>
            <NavLink href="/donar" className={`${button({ variant: "primary" })} mt-3 w-full sm:w-auto`}>
              Donar dinero
              <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
            </NavLink>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Contexto real de una ciudad (por ahora, el cierre de los centros de Bogotá en agosto). */
export function CityNote({ note }: { note: NonNullable<City["note"]> }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeSalida } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="mt-4 flex items-start gap-3 rounded-2xl bg-bosque-50 px-4 py-3.5 text-[14.5px] leading-snug text-bosque-900 ring-1 ring-inset ring-bosque-100"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-bosque-600" aria-hidden />
      <span>
        {note.text} <span className="text-niebla">Fuente: {note.source.replace(/\. .*$/, "")}.</span>
      </span>
    </motion.p>
  );
}
