"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { reach } from "@/components/donaciones/metrics";
import type { Frequency } from "@/components/donar/options";
import { ExampleTag } from "@/components/ui/form";
import type { UnitCost } from "@/content/donaciones";
import { pesos } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

/** Hasta cuántas unidades se dibujan; si alcanza para más, se dice con números */
const MAX_TILES = 10;

/**
 * Lo que cubre el monto, en vivo. Además de la frase, cada unidad (un kit, un día de comida) es una casilla que se
 * llena según lo que alcanza: con $85.000 y kits de $45.000 se ve una casilla llena y otra casi llena.
 */
export function Impact({
  amount,
  frequency,
  unit,
  icon: Icon,
}: {
  amount: number;
  frequency: Frequency;
  unit: UnitCost;
  icon: LucideIcon;
}) {
  const ratio = amount / unit.cost;
  const tiles = Math.min(MAX_TILES, Math.max(1, Math.ceil(ratio)));
  const extra = Math.ceil(ratio) - MAX_TILES;
  const monthly = frequency === "mensual";
  const covers = reach(amount, unit);

  return (
    <div className="rounded-[24px] bg-bosque-50 p-5 ring-1 ring-inset ring-bosque-100 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-bosque-700">Lo que cubre tu aporte</p>
        <ExampleTag>Costos de ejemplo</ExampleTag>
      </div>

      <p aria-live="polite" className="mt-3 font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.015em] text-tinta text-pretty">
        {monthly ? "Cada mes, con " : "Con "}
        <strong className="font-semibold tabular-nums">{pesos(amount)}</strong> cubres{" "}
        <strong className="font-semibold text-bosque-800">{covers}</strong> {unit.scope}.
      </p>

      <div aria-hidden className="mt-5 flex flex-wrap items-center gap-2">
        {/* Una casilla por unidad, llena hasta donde alcanza */}
        {Array.from({ length: tiles }, (_, i) => {
          const share = Math.max(0, Math.min(1, ratio - i));
          return (
            <span key={i} className="relative grid size-11 place-items-center rounded-xl bg-white ring-1 ring-inset ring-bosque-100">
              <Icon className="size-5 text-bosque-200" strokeWidth={1.75} aria-hidden />
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0 round 12px)" }}
                animate={{ clipPath: `inset(0 ${100 - share * 100}% 0 0 round 12px)` }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: easeSalida }}
                className="absolute inset-0 grid place-items-center rounded-xl bg-bosque-700"
              >
                <Icon className="size-5 text-white" strokeWidth={1.75} aria-hidden />
              </motion.span>
            </span>
          );
        })}
        {extra > 0 && <span className="ml-1 text-[14px] font-semibold text-bosque-800 tabular-nums">y {extra} más</span>}
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-niebla">
        Referencia: {pesos(unit.cost)} por {unit.singular}, con compras hechas cerca de la zona.
        {monthly && (
          <>
            {" "}
            En un año serían <span className="font-semibold text-tinta tabular-nums">{pesos(amount * 12)}</span>.
          </>
        )}
      </p>
    </div>
  );
}
