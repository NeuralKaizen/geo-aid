"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, HandHeart, Heart } from "lucide-react";
import { donationDestinations } from "@/content/site";
import { easeSalida } from "@/lib/motion";

const pesos = new Intl.NumberFormat("es-CO");

const field =
  "group/field flex flex-col justify-center rounded-2xl border border-linea px-4 py-2.5 transition-[border-color,box-shadow] duration-300 hover:border-bosque-200 focus-within:border-bosque-600 focus-within:ring-4 focus-within:ring-bosque-100";

export function QuickDonate() {
  const [amount, setAmount] = useState("50.000");

  return (
    <motion.form
      action="/donar"
      method="get"
      aria-label="Donación rápida"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 1, ease: easeSalida }}
      className="grid gap-2 rounded-[22px] bg-white p-2.5 shadow-[0_28px_60px_-30px_rgba(6,39,36,0.6)] ring-1 ring-linea/80 sm:grid-cols-[1.35fr_1fr_auto]"
    >
      <label className={field}>
        <span className="text-[12px] font-medium text-niebla">Destino de tu donación</span>
        <span className="relative mt-0.5 flex items-center gap-2">
          <HandHeart className="size-[18px] shrink-0 text-bosque-700" aria-hidden />
          <select
            name="destino"
            defaultValue={donationDestinations[0]}
            className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-semibold text-tinta outline-none"
          >
            {donationDestinations.map((destination) => (
              <option key={destination}>{destination}</option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 size-4 text-niebla transition-transform duration-300 group-focus-within/field:rotate-180"
            aria-hidden
          />
        </span>
      </label>

      <label className={field}>
        <span className="text-[12px] font-medium text-niebla">Monto</span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[15px] font-semibold text-niebla">$</span>
          <input
            name="monto"
            inputMode="numeric"
            autoComplete="off"
            value={amount}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
              setAmount(digits ? pesos.format(Number(digits)) : "");
            }}
            className="w-full bg-transparent text-[15px] font-semibold text-tinta outline-none tabular-nums"
          />
          <span className="text-[12px] font-medium text-niebla">COP</span>
        </span>
      </label>

      <button
        type="submit"
        className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-bosque-800 px-7 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-bosque-700 sm:h-auto"
      >
        Donar
        <span className="grid size-7 place-items-center rounded-full bg-maiz-400 text-bosque-900 transition-transform duration-500 ease-salida group-hover:rotate-[-12deg] group-hover:scale-110">
          <Heart className="size-3.5 fill-current" aria-hidden />
        </span>
      </button>
    </motion.form>
  );
}
