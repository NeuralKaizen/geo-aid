"use client";

import { motion } from "motion/react";
import { cities } from "@/content/centros";
import { useCentros } from "@/components/centros/centros-context";

/** Ciudades en píldoras de vidrio sobre la foto. La elegida se marca con un fondo blanco que se desliza. */
export function CityPicker() {
  const { city, chooseCity } = useCentros();

  return (
    <div role="group" aria-label="Ciudad" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <div className="flex w-max gap-1.5 rounded-full bg-bosque-950/35 p-1.5 ring-1 ring-inset ring-white/15 backdrop-blur-md">
        {cities.map((option) => {
          const active = option.id === city;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => chooseCity(option.id)}
              className={`relative isolate h-11 rounded-full px-4 text-[15px] font-semibold transition-colors duration-300 sm:px-5 ${
                active ? "text-bosque-900" : "text-white/85 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="ciudad-elegida"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
                />
              )}
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
