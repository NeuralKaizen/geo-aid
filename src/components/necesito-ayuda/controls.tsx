"use client";

import { useId, type ReactNode } from "react";
import { Check, Minus, Plus } from "lucide-react";

/*
 * Controles del asistente en tamaño grande y sobre fondo oscuro. Siguen el mismo patrón accesible que
 * components/ui/form (etiqueta, ayuda y error enlazados al control), pero con letra de 17 px, campos de 56 px y
 * etiquetas claras: esta página la usa gente con miedo, en un celular y a veces con poca luz.
 */

/** Para TextInput y Select compartidos: los mismos estilos, más altos y con letra más grande */
export const big = "h-14! text-[17px]!";

type ControlProps = { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean };

export function LargeField({
  label,
  hint,
  error,
  optional = false,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-ayuda`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[17px] font-semibold text-white">
        {label}
        {optional && <span className="text-[14px] font-normal text-white/60">Opcional</span>}
      </label>
      {hint && (
        <p id={hintId} className="-mt-1 text-[15px] leading-snug text-white/65">
          {hint}
        </p>
      )}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** Error legible sobre el fondo oscuro: rojo claro con ícono, no solo color */
export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-2 text-[15px] font-medium leading-snug text-[#ffb3a7]">
      <span aria-hidden className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-full bg-[#ffb3a7] text-[11px] font-bold text-bosque-950">
        !
      </span>
      {children}
    </p>
  );
}

/** Casilla grande y clara (persona con discapacidad, "No tengo celular", etc.) */
export function CheckCard({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-maiz-400 ${
        checked ? "bg-maiz-400 text-bosque-950" : "bg-white text-tinta"
      }`}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span
        aria-hidden
        className={`grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-300 ${
          checked ? "bg-bosque-950 text-maiz-400" : "ring-2 ring-inset ring-niebla/50"
        }`}
      >
        {checked && <Check className="size-4.5" strokeWidth={3} />}
      </span>
      <span>
        <span className="block text-[17px] font-semibold leading-snug">{label}</span>
        {hint && <span className={`block text-[14.5px] leading-snug ${checked ? "text-bosque-950/75" : "text-niebla"}`}>{hint}</span>}
      </span>
    </label>
  );
}

/** Contador con botones grandes de más y menos; el número también se puede escribir. */
export function Counter({
  label,
  hint,
  value,
  onChange,
  max = 999,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}) {
  const id = useId();
  const set = (next: number) => onChange(Math.max(0, Math.min(max, Number.isFinite(next) ? Math.round(next) : 0)));
  const step =
    "grid size-12 shrink-0 place-items-center rounded-2xl bg-bosque-50 text-bosque-800 transition-colors duration-300 hover:bg-bosque-100 active:scale-95 disabled:opacity-35 sm:size-14";

  return (
    <div className="flex items-center justify-between gap-3 rounded-[22px] bg-white py-3.5 pl-4 pr-3 text-tinta sm:px-5">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-[17px] font-semibold leading-tight sm:text-[18px]">
          {label}
        </label>
        <p id={`${id}-ayuda`} className="mt-0.5 text-[14px] leading-snug text-niebla sm:text-[14.5px]">
          {hint}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button type="button" onClick={() => set(value - 1)} disabled={value === 0} aria-label={`Quitar uno a ${label.toLowerCase()}`} className={step}>
          <Minus className="size-6" aria-hidden />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          aria-describedby={`${id}-ayuda`}
          onChange={(event) => set(event.target.valueAsNumber)}
          onFocus={(event) => event.target.select()}
          className="h-12 w-14 rounded-2xl bg-papel text-center font-display text-[24px] sm:h-14 sm:w-16 sm:text-[26px] font-semibold tabular-nums text-tinta outline-none ring-1 ring-inset ring-linea [appearance:textfield] focus:ring-2 focus:ring-bosque-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => set(value + 1)} disabled={value >= max} aria-label={`Sumar uno a ${label.toLowerCase()}`} className={step}>
          <Plus className="size-6" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Aviso de prototipo: siempre con la misma claridad, antes de enviar y en la confirmación. */
export function PrototypeNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3.5 rounded-[22px] bg-white/[0.07] p-4 ring-1 ring-inset ring-maiz-400/45 sm:p-5">
      <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-maiz-400 text-[15px] font-bold text-bosque-950">
        i
      </span>
      <div className="text-[16px] leading-relaxed text-white/85">{children}</div>
    </div>
  );
}
