"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, SearchX } from "lucide-react";
import { urgencyOf, urgencyStyles, zoneCoverage, type Urgency } from "@/components/donaciones/metrics";
import { needIcons } from "@/components/donaciones/need-icons";
import { ZoneCard } from "@/components/donaciones/zone-card";
import { FilterChip, Select } from "@/components/ui/form";
import { button, eyebrow, sectionTitle } from "@/components/ui/styles";
import { departments, needTypes, zones, type NeedType, type Zone } from "@/content/donaciones";
import { easeSalida } from "@/lib/motion";

type SortId = "urgente" | "casi" | "familias";

/** Zonas que se ven antes de "Ver todas": con el orden por urgencia, son las que más necesitan ayuda */
const FIRST_ROWS = 6;

const sorts: { id: SortId; label: string; summary: string; compare: (a: Zone, b: Zone) => number }[] = [
  {
    id: "urgente",
    label: "Más urgente",
    summary: "de la menos cubierta a la más cubierta",
    compare: (a, b) => zoneCoverage(a) - zoneCoverage(b),
  },
  {
    id: "casi",
    label: "Casi completas",
    summary: "de la más cerca de completar a la más lejos",
    compare: (a, b) => zoneCoverage(b) - zoneCoverage(a),
  },
  {
    id: "familias",
    label: "Más familias",
    summary: "de la que tiene más familias a la que tiene menos",
    compare: (a, b) => b.families - a.families,
  },
];

const legend: { level: Urgency; rule: string }[] = [
  { level: "critica", rule: "menos del 40 % cubierto" },
  { level: "alta", rule: "entre 40 y 69 %" },
  { level: "media", rule: "70 % o más" },
];

const urgencyCounts = zones.reduce<Record<Urgency, number>>(
  (counts, zone) => {
    counts[urgencyOf(zoneCoverage(zone))] += 1;
    return counts;
  },
  { critica: 0, alta: 0, media: 0 },
);

/**
 * Tablero de necesidades: filtros por departamento y por tipo, orden, y las zonas como filas que se reordenan con
 * `layout`. Los filtros de tipo se suman (Agua + Salud muestra las zonas que piden cualquiera de los dos).
 */
export function NeedsBoard() {
  const [department, setDepartment] = useState("todos");
  const [types, setTypes] = useState<NeedType[]>([]);
  const [sort, setSort] = useState<SortId>("urgente");
  const [showAll, setShowAll] = useState(false);
  const sortName = useId();
  const pillId = useId();

  const inDepartment = useMemo(
    () => zones.filter((zone) => department === "todos" || zone.department === department),
    [department],
  );

  const visible = useMemo(() => {
    const { compare } = sorts.find((option) => option.id === sort)!;
    return inDepartment
      .filter((zone) => types.length === 0 || zone.needs.some((need) => types.includes(need.type)))
      .sort(compare);
  }, [inDepartment, types, sort]);

  const toggleType = (type: NeedType) =>
    setTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));

  const clear = () => {
    setDepartment("todos");
    setTypes([]);
  };

  const filtered = department !== "todos" || types.length > 0;
  const activeSort = sorts.find((option) => option.id === sort)!;
  const shown = showAll ? visible : visible.slice(0, FIRST_ROWS);
  const hidden = visible.length - shown.length;

  return (
    <section aria-labelledby="tablero-titulo" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:px-10 lg:pt-28">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className={eyebrow}>Tablero de necesidades</p>
          <h2 id="tablero-titulo" className={`mt-3 max-w-2xl ${sectionTitle}`}>
            Qué le falta a cada zona hoy
          </h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-niebla">
            Las comunidades publican lo que necesitan y alguien de la zona lo confirma. Cada barra muestra cuánto ya llegó
            de lo que pidieron, y la urgencia sale de esa cobertura.
          </p>
        </div>

        <ul aria-label="Cómo se calcula la urgencia" className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] lg:flex-col lg:gap-1.5">
          {legend.map(({ level, rule }) => (
            <li key={level} className="flex items-center gap-2 text-niebla">
              <span aria-hidden className={`size-2 rounded-full ${urgencyStyles[level].dot}`} />
              <span className="font-semibold text-tinta">{urgencyStyles[level].label}</span>
              <span>{rule}</span>
              <span className="tabular-nums text-tinta/70">· {urgencyCounts[level]}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Barra de filtros */}
      <div className="mt-10 grid gap-5 rounded-[28px] bg-white p-4 ring-1 ring-linea sm:p-5 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-end lg:gap-8">
        <fieldset className="min-w-0">
          <legend className="mb-2 text-[13px] font-semibold text-tinta">Tipo de necesidad</legend>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <FilterChip pressed={types.length === 0} onClick={() => setTypes([])}>
              Todas
            </FilterChip>
            {needTypes.map((type) => {
              const Icon = needIcons[type.id];
              return (
                <FilterChip
                  key={type.id}
                  pressed={types.includes(type.id)}
                  onClick={() => toggleType(type.id)}
                  count={inDepartment.filter((zone) => zone.needs.some((need) => need.type === type.id)).length}
                >
                  <Icon className="size-4" aria-hidden />
                  {type.label}
                </FilterChip>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="tablero-departamento" className="text-[13px] font-semibold text-tinta">
            Departamento
          </label>
          <Select id="tablero-departamento" value={department} onChange={(event) => setDepartment(event.target.value)}>
            <option value="todos">Todos ({zones.length})</option>
            {departments.map((name) => (
              <option key={name} value={name}>
                {name} ({zones.filter((zone) => zone.department === name).length})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Resultado y orden */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p aria-live="polite" className="text-[14px] text-niebla">
            <strong className="font-semibold text-tinta tabular-nums">
              {visible.length} {visible.length === 1 ? "zona" : "zonas"}
            </strong>
            {visible.length > 1 && <>, {activeSort.summary}</>}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex h-11 items-center text-[14px] font-semibold text-bosque-700 underline decoration-bosque-200 underline-offset-4 hover:decoration-bosque-700"
            >
              Quitar filtros
            </button>
          )}
        </div>

        <fieldset className="flex items-center gap-3">
          <legend className="sr-only">Ordenar por</legend>
          <span aria-hidden className="hidden text-[13px] font-medium text-niebla md:inline">
            Ordenar por
          </span>
          <div className="grid flex-1 grid-cols-3 rounded-full bg-white p-1 ring-1 ring-inset ring-linea sm:flex-none">
            {sorts.map((option) => {
              const checked = option.id === sort;
              return (
                <label
                  key={option.id}
                  className={`relative isolate flex h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-1.5 text-center text-[13px] font-medium leading-tight sm:text-[13.5px] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-maiz-400 sm:px-4 ${
                    checked ? "text-white" : "text-tinta/75 hover:text-tinta"
                  }`}
                >
                  <input
                    type="radio"
                    name={sortName}
                    value={option.id}
                    checked={checked}
                    onChange={() => setSort(option.id)}
                    className="sr-only"
                  />
                  {checked && (
                    <motion.span
                      layoutId={pillId}
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-bosque-800"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                    />
                  )}
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <ul className="mt-4 grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((zone) => (
            <motion.li
              key={zone.slug}
              layout="position"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              transition={{ layout: { duration: 0.6, ease: easeSalida }, duration: 0.4, ease: easeSalida }}
            >
              <ZoneCard zone={zone} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {hidden > 0 && (
        <motion.div layout="position" className="mt-6 flex justify-center">
          <button type="button" onClick={() => setShowAll(true)} className={button({ variant: "secondary", size: "md" })}>
            Ver {hidden === 1 ? "la zona que falta" : `las ${hidden} zonas que faltan`}
            <ChevronDown className="size-4" aria-hidden />
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeSalida }}
            className="flex flex-col items-center rounded-[28px] bg-white px-6 py-14 text-center ring-1 ring-linea"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-papel text-bosque-700">
              <SearchX className="size-5" aria-hidden />
            </span>
            <p className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-tinta">
              Ninguna zona coincide con estos filtros
            </p>
            <p className="mt-1.5 max-w-sm text-[14.5px] text-niebla">
              Prueba con otro departamento o con otro tipo de necesidad.
            </p>
            <button type="button" onClick={clear} className={`mt-5 ${button({ variant: "secondary", size: "sm" })}`}>
              Quitar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
