"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SearchX } from "lucide-react";
import { ReportCard } from "@/components/desaparecidos/report-card";
import { TipDialog } from "@/components/desaparecidos/tip-dialog";
import { Select, TextInput } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { reportes, type Estado, type Reporte } from "@/content/desaparecidos";
import { easeSalida } from "@/lib/motion";

type FiltroEstado = "todos" | Estado;

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const estados: { id: FiltroEstado; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "buscando", label: "Buscando" },
  { id: "reencontrada", label: "Reencontradas" },
];

const departamentos = Array.from(new Set(reportes.map((reporte) => reporte.departamento))).sort((a, b) => a.localeCompare(b, "es"));

/** Consultar: búsqueda por nombre o municipio, filtros por estado y departamento, y las tarjetas de cada reporte. */
export function Reports() {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState<FiltroEstado>("todos");
  const [departamento, setDepartamento] = useState("");
  const [tipFor, setTipFor] = useState<Reporte | null>(null);
  const [opener, setOpener] = useState<HTMLElement | null>(null);

  const q = normalize(query.trim());
  // Los conteos de estado respetan la búsqueda y el departamento, para que digan cuántos verías al tocarlos
  const base = reportes.filter(
    (reporte) =>
      (!departamento || reporte.departamento === departamento) &&
      (!q || normalize(`${reporte.nombre} ${reporte.municipio} ${reporte.departamento}`).includes(q)),
  );
  const results = base.filter((reporte) => estado === "todos" || reporte.estado === estado);
  const filtering = q !== "" || estado !== "todos" || departamento !== "";

  function reset() {
    setQuery("");
    setEstado("todos");
    setDepartamento("");
  }

  return (
    <section id="consultar" aria-labelledby="consultar-titulo" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 border-t border-linea pt-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-niebla">Consultar</p>
          <h2
            id="consultar-titulo"
            className="mt-3 font-display text-[clamp(2rem,3.4vw,2.9rem)] font-medium leading-[1.04] tracking-[-0.035em] text-tinta"
          >
            Reportes publicados
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-niebla">
          Busca por nombre o por municipio. Para proteger a las familias, solo mostramos el nombre y la inicial del apellido.
        </p>
      </div>

      <div role="search" aria-label="Buscar reportes" className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_15rem]">
        <div className="relative">
          <label htmlFor="buscar-reporte" className="sr-only">
            Buscar por nombre o municipio
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-niebla" aria-hidden />
          <TextInput
            id="buscar-reporte"
            type="search"
            placeholder="Nombre o municipio"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-11"
          />
        </div>

        <div role="group" aria-label="Estado del reporte" className="flex h-12 items-center gap-1 rounded-full bg-white p-1 ring-1 ring-inset ring-linea">
          {estados.map((option) => {
            const active = estado === option.id;
            const count = option.id === "todos" ? base.length : base.filter((reporte) => reporte.estado === option.id).length;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setEstado(option.id)}
                className={`relative isolate inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium transition-colors duration-300 sm:flex-none ${
                  active ? "text-white" : "text-tinta/70 hover:text-tinta"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="estado-activo"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-bosque-900"
                    transition={{ duration: 0.45, ease: easeSalida }}
                  />
                )}
                {option.label}
                <span className={`text-[12px] tabular-nums ${active ? "text-white/60" : "text-niebla"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <Select aria-label="Departamento" value={departamento} onChange={(event) => setDepartamento(event.target.value)}>
          <option value="">Todos los departamentos</option>
          {departamentos.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-[14px] text-niebla">
          {results.length === 0
            ? "Ningún reporte coincide con tu búsqueda"
            : filtering
              ? `${results.length} de ${reportes.length} ${reportes.length === 1 ? "reporte" : "reportes"}`
              : `${reportes.length} reportes publicados`}
        </p>
        {filtering && results.length > 0 && (
          <button type="button" onClick={reset} className="min-h-11 text-[14px] font-medium text-bosque-800 underline decoration-bosque-800/30 underline-offset-4 hover:decoration-bosque-800">
            Quitar filtros
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <motion.ul layout className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((reporte) => (
              <motion.li
                key={reporte.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease: easeSalida }}
              >
                <ReportCard
                  report={reporte}
                  onTip={(trigger) => {
                    setOpener(trigger);
                    setTipFor(reporte);
                  }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-3 flex flex-col items-center rounded-[28px] border border-dashed border-tinta/20 px-6 py-16 text-center"
        >
          <SearchX className="size-8 text-niebla" aria-hidden />
          <h3 className="mt-5 font-display text-[1.5rem] font-medium tracking-[-0.025em] text-tinta">No encontramos a nadie con esos datos</h3>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-niebla">
            Revisa cómo escribiste el nombre o prueba solo con el municipio. Si buscas a alguien que no aparece, puedes
            reportarlo.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <button type="button" onClick={reset} className={button({ variant: "secondary" })}>
              Quitar filtros
            </button>
            <a href="#reportar" className={button({ variant: "primary" })}>
              Reportar a una persona
            </a>
          </div>
        </motion.div>
      )}

      <TipDialog report={tipFor} returnFocus={opener} onClose={() => setTipFor(null)} />
    </section>
  );
}
