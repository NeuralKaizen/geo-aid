"use client";

import { Check } from "lucide-react";
import { FilterChip } from "@/components/ui/form";
import { cities, tasks, type CityId, type TaskId } from "@/content/voluntariado";

export type Filters = { city: CityId | null; task: TaskId | null; onlyOpen: boolean };

export const noFilters: Filters = { city: null, task: null, onlyOpen: false };

/**
 * Filtros de la agenda. En escritorio van en una columna fija al lado de los turnos; en móvil, en filas que se
 * deslizan de lado para no empujar la agenda hacia abajo.
 */
export function AgendaFilters({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
  const active = filters.city !== null || filters.task !== null || filters.onlyOpen;

  return (
    <div className="flex flex-col gap-5">
      <FilterGroup label="Ciudad">
        <FilterChip pressed={filters.city === null} onClick={() => onChange({ ...filters, city: null })}>
          Todas
        </FilterChip>
        {cities.map((city) => (
          <FilterChip
            key={city.id}
            pressed={filters.city === city.id}
            onClick={() => onChange({ ...filters, city: filters.city === city.id ? null : city.id })}
          >
            {city.label}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Tarea" stacked>
        <FilterChip pressed={filters.task === null} onClick={() => onChange({ ...filters, task: null })}>
          Todas las tareas
        </FilterChip>
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <FilterChip
              key={task.id}
              pressed={filters.task === task.id}
              onClick={() => onChange({ ...filters, task: filters.task === task.id ? null : task.id })}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              {task.short}
              {task.professional && <span className="text-[12px] opacity-70">· profesionales</span>}
            </FilterChip>
          );
        })}
      </FilterGroup>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChip pressed={filters.onlyOpen} onClick={() => onChange({ ...filters, onlyOpen: !filters.onlyOpen })}>
          <span
            aria-hidden
            className={`grid size-4 place-items-center rounded-[5px] ${
              filters.onlyOpen ? "bg-maiz-400 text-bosque-950" : "ring-1 ring-inset ring-niebla/50"
            }`}
          >
            {filters.onlyOpen && <Check className="size-3" strokeWidth={3.2} />}
          </span>
          Solo con cupos
        </FilterChip>
        {active && (
          <button
            type="button"
            onClick={() => onChange(noFilters)}
            className="h-10 rounded-full px-2 text-[14px] font-medium text-bosque-700 underline decoration-bosque-200 underline-offset-4 transition-colors hover:decoration-bosque-700"
          >
            Quitar filtros
          </button>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, stacked = false, children }: { label: string; stacked?: boolean; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-niebla">{label}</p>
      <div
        className={`-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 ${
          stacked ? "lg:flex-col lg:items-start" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
