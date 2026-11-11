"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { CalendarCheck, Repeat } from "lucide-react";
import { needIcons } from "@/components/donaciones/need-icons";
import { Impact } from "@/components/donar/impact";
import { amountOf, resolveDestination, type Draft, type Errors } from "@/components/donar/options";
import { StepHeading } from "@/components/donar/step-heading";
import { ChoiceCard, Field } from "@/components/ui/form";
import { amountPresets, minimumAmount, suggestedAmount } from "@/content/donaciones";
import { numero, pesos } from "@/lib/format";

/** Paso 2: cuánto y cada cuánto, con lo que eso cubre debajo */
export function StepAmount({
  draft,
  errors,
  onChange,
  focusOnMount,
}: {
  draft: Draft;
  errors: Errors;
  onChange: (patch: Partial<Draft>) => void;
  focusOnMount: boolean;
}) {
  const pillId = useId();
  const name = useId();
  const amount = amountOf(draft);
  const destination = resolveDestination(draft.destination);

  return (
    <div>
      <StepHeading
        eyebrow="Paso 2 de 4"
        focusOnMount={focusOnMount}
        description={`Destino: ${destination.short}. Debajo ves lo que alcanza a cubrir.`}
      >
        ¿Cuánto quieres donar?
      </StepHeading>

      <fieldset className="mt-7">
        <legend className="sr-only">Monto en pesos</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {amountPresets.map((preset) => {
            const checked = draft.amount === preset;
            return (
              <label
                key={preset}
                className={`relative isolate flex h-[4.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl ring-1 ring-inset transition-[box-shadow,color] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-maiz-400 ${
                  checked ? "text-white ring-bosque-800" : "bg-white text-tinta ring-linea hover:ring-bosque-200"
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={preset}
                  checked={checked}
                  onChange={() => onChange({ amount: preset, custom: "" })}
                  className="sr-only"
                />
                {checked && (
                  <motion.span
                    layoutId={pillId}
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-2xl bg-bosque-800"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                  />
                )}
                <span className="font-display text-[20px] font-semibold tracking-[-0.02em] tabular-nums">{pesos(preset)}</span>
                {preset === suggestedAmount && (
                  <span className={`text-[11.5px] font-semibold ${checked ? "text-maiz-400" : "text-maiz-800"}`}>Sugerida</span>
                )}
              </label>
            );
          })}
        </div>

        <div className="mt-4">
          <Field label="Otro monto" hint={`Desde ${pesos(minimumAmount)}`} error={errors.amount}>
            {(props) => (
              <label
                className={`flex h-12 w-full cursor-text items-center gap-1 rounded-2xl bg-white px-4 text-[15px] text-tinta ring-inset transition-shadow duration-300 focus-within:ring-2 focus-within:ring-bosque-600 ${
                  props["aria-invalid"]
                    ? "ring-2 ring-alerta"
                    : draft.amount === "otro"
                      ? "ring-2 ring-bosque-600"
                      : "ring-1 ring-linea hover:ring-bosque-200"
                }`}
              >
                <span aria-hidden className="font-semibold text-niebla">
                  $
                </span>
                <input
                  {...props}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Escribe un monto"
                  value={draft.custom ? numero(Number(draft.custom)) : ""}
                  // Solo cambia la opción si hace falta: así, al recibir el foco por un error, el error no se borra
                  onFocus={() => draft.amount !== "otro" && onChange({ amount: "otro" })}
                  onChange={(event) => onChange({ amount: "otro", custom: event.target.value.replace(/\D/g, "").slice(0, 9) })}
                  className="h-full min-w-0 flex-1 bg-transparent font-semibold tabular-nums outline-none placeholder:font-normal placeholder:text-niebla/70"
                />
              </label>
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="mb-3 text-[13px] font-semibold text-tinta">¿Cada cuánto?</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <ChoiceCard
            name={`${name}-frecuencia`}
            value="unica"
            checked={draft.frequency === "unica"}
            onChange={(checked) => checked && onChange({ frequency: "unica" })}
            icon={<CalendarCheck className="size-5" aria-hidden />}
            title="Una vez"
            description="Un solo aporte"
          />
          <ChoiceCard
            name={`${name}-frecuencia`}
            value="mensual"
            checked={draft.frequency === "mensual"}
            onChange={(checked) => checked && onChange({ frequency: "mensual" })}
            icon={<Repeat className="size-5" aria-hidden />}
            title="Cada mes"
            description="El mismo aporte cada mes, hasta que lo canceles"
          />
        </div>
      </fieldset>

      <div className="mt-7">
        {amount >= minimumAmount ? (
          <Impact amount={amount} frequency={draft.frequency} unit={destination.unit} icon={needIcons[destination.unitType]} />
        ) : (
          <p className="rounded-[24px] bg-papel px-5 py-6 text-[14.5px] text-niebla ring-1 ring-inset ring-linea">
            Escribe un monto desde {pesos(minimumAmount)} para ver lo que cubre.
          </p>
        )}
      </div>
    </div>
  );
}
