"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { CrisisSince, StatusPill } from "@/components/noticias/crisis-status";
import { serif } from "@/components/noticias/fonts";
import { ExampleTag } from "@/components/ui/form";
import { emergencias } from "@/content/noticias";

/**
 * Las emergencias como pestañas grandes que se montan sobre el borde de la cabecera. En móvil se deslizan de lado.
 * Se manejan con las flechas del teclado, como cualquier grupo de pestañas.
 */
export function CrisisSwitcher({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | undefined;
    if (event.key in keys) next = (index + keys[event.key] + emergencias.length) % emergencias.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = emergencias.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    onSelect(emergencias[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <div className="relative z-10 mx-auto -mt-24 max-w-[1240px] lg:-mt-28 lg:px-10">
      <div
        role="tablist"
        aria-label="Emergencias en seguimiento"
        className="flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-6 pt-1 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
      >
        {emergencias.map((emergencia, index) => {
          const active = emergencia.id === selected;
          return (
            <button
              key={emergencia.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`emergencia-${emergencia.id}`}
              aria-selected={active}
              aria-controls="emergencia-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(emergencia.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`group relative flex w-[78vw] max-w-[19rem] shrink-0 snap-start flex-col rounded-[24px] bg-white p-5 text-left transition-[box-shadow,transform] duration-500 ease-salida sm:w-[19rem] lg:w-auto lg:max-w-none ${
                active
                  ? "shadow-[0_30px_60px_-34px_rgba(6,39,36,0.6)] ring-2 ring-bosque-800"
                  : "shadow-[0_22px_44px_-34px_rgba(6,39,36,0.55)] ring-1 ring-linea hover:-translate-y-1 hover:ring-bosque-200"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <StatusPill estado={emergencia.estado} />
                {emergencia.ejemplo && <ExampleTag />}
              </span>
              <span className={`${serif} mt-4 block text-[23px] font-medium leading-[1.08] tracking-[-0.01em] text-tinta`}>
                {emergencia.nombre}
              </span>
              <span className="mb-5 mt-1.5 block text-[13px] text-niebla">
                {emergencia.lugar} · <CrisisSince emergencia={emergencia} />
              </span>
              <span className="mt-auto flex items-baseline gap-2 border-t border-linea pt-3.5">
                <span className={`${serif} text-[28px] font-medium leading-none tracking-[-0.02em] text-tinta`}>
                  {emergencia.cifraClave.valor}
                </span>
                <span className="text-[13px] leading-tight text-niebla">{emergencia.cifraClave.etiqueta}</span>
              </span>
              {active && (
                <motion.span
                  layoutId="emergencia-elegida"
                  aria-hidden
                  className="absolute inset-x-6 -bottom-[2px] h-[3px] rounded-full bg-maiz-400"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
