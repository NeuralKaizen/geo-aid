"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Heart } from "lucide-react";
import { donationDestinations } from "@/content/site";
import { easeSalida } from "@/lib/motion";

const pesos = new Intl.NumberFormat("es-CO");
const presets = [20000, 50000, 100000];

const tones = {
  glass: {
    // Tinte oscuro para que el texto se lea igual sobre un cielo claro que sobre escombros
    card: "bg-bosque-950/60 text-white ring-1 ring-white/15 backdrop-blur-lg",
    muted: "text-white/65",
    field: "bg-white/10 ring-1 ring-white/15 focus-within:ring-white/60 hover:bg-white/15",
    chip: "text-white/80 ring-1 ring-white/20 hover:ring-white/50",
    chipOn: "text-bosque-950",
    pill: "bg-white",
    option: "text-tinta",
  },
  light: {
    card: "bg-white text-tinta ring-1 ring-linea shadow-[0_28px_60px_-34px_rgba(0,0,0,0.6)]",
    muted: "text-niebla",
    field: "bg-papel ring-1 ring-linea focus-within:ring-bosque-600 hover:ring-bosque-200",
    chip: "text-tinta/75 ring-1 ring-linea hover:ring-bosque-200",
    chipOn: "text-white",
    pill: "bg-bosque-800",
    option: "text-tinta",
  },
};

export function QuickDonate({ variant }: { variant: "glass" | "light" }) {
  const [amount, setAmount] = useState(50000);
  const tone = tones[variant];
  const pillId = useId();

  return (
    <motion.form
      action="/donar"
      method="get"
      aria-label="Donación rápida"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1, ease: easeSalida }}
      className={`rounded-[28px] p-5 ${tone.card}`}
    >
      <p className="font-display text-xl font-semibold tracking-[-0.02em]">Dona en segundos</p>
      <p className={`mt-1 text-sm leading-relaxed ${tone.muted}`}>Eliges a dónde va y luego ves el día en que llega.</p>

      <label className={`mt-4 flex flex-col rounded-2xl px-4 py-2.5 transition-[box-shadow,background-color] duration-300 ${tone.field}`}>
        <span className={`text-[12px] font-medium ${tone.muted}`}>Destino</span>
        <span className="relative flex items-center">
          <select
            name="destino"
            defaultValue={donationDestinations[0]}
            className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-semibold outline-none"
          >
            {donationDestinations.map((destination) => (
              <option key={destination} className={tone.option}>
                {destination}
              </option>
            ))}
          </select>
          <ChevronDown className={`pointer-events-none absolute right-0 size-4 ${tone.muted}`} aria-hidden />
        </span>
      </label>

      <fieldset className="mt-3">
        <legend className={`mb-2 text-[12px] font-medium ${tone.muted}`}>Monto en pesos</legend>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => {
            const on = amount === preset;
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={on}
                onClick={() => setAmount(preset)}
                className={`relative isolate h-10 rounded-full text-[14px] font-semibold tabular-nums transition-colors duration-300 ${on ? tone.chipOn : tone.chip}`}
              >
                {on && (
                  <motion.span
                    layoutId={pillId}
                    className={`absolute inset-0 -z-10 rounded-full ${tone.pill}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  />
                )}
                ${pesos.format(preset / 1000)} mil
              </button>
            );
          })}
        </div>
        <label className={`mt-2 flex items-center gap-1.5 rounded-2xl px-4 py-2.5 transition-[box-shadow,background-color] duration-300 ${tone.field}`}>
          <span className={`text-[12px] font-medium ${tone.muted}`}>Otro monto</span>
          <span className="ml-auto font-semibold">$</span>
          <input
            name="monto"
            inputMode="numeric"
            autoComplete="off"
            aria-label="Monto en pesos"
            value={amount ? pesos.format(amount) : ""}
            onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "").slice(0, 9)))}
            className="w-28 bg-transparent text-right text-[15px] font-semibold tabular-nums outline-none"
          />
        </label>
      </fieldset>

      <button
        type="submit"
        className="group mt-4 flex h-[3.25rem] w-full items-center justify-center gap-3 rounded-full bg-maiz-400 text-[15px] font-semibold text-bosque-950 transition-[filter,transform] duration-300 hover:brightness-105 active:scale-[0.98]"
      >
        Donar ${amount ? pesos.format(amount) : "0"}
        <Heart
          className="size-4 fill-current transition-transform duration-500 ease-salida group-hover:scale-125"
          aria-hidden
        />
      </button>
    </motion.form>
  );
}
