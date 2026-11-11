"use client";

import { ArrowRight, Check, ClipboardList, House, Users } from "lucide-react";
import { PrototypeNote } from "@/components/necesito-ayuda/controls";

const choices = [
  {
    forCommunity: false,
    icon: House,
    title: "Para mí o mi familia",
    body: "Tú y las personas que viven contigo.",
  },
  {
    forCommunity: true,
    icon: Users,
    title: "Para mi comunidad o vereda",
    body: "Varias familias de un barrio, una vereda o un resguardo.",
  },
];

/** Primera pantalla: dos botones enormes y, con la misma claridad, qué es y qué no es esta página. */
export function IntroStep({ chosen, onChoose }: { chosen: boolean | null; onChoose: (forCommunity: boolean) => void }) {
  return (
    <>
      <div className="grid gap-3">
        {choices.map((choice) => {
          const selected = chosen === choice.forCommunity;
          return (
            <button
              key={choice.title}
              type="button"
              aria-pressed={selected}
              onClick={() => onChoose(choice.forCommunity)}
              className={`group flex min-h-28 items-center gap-4 rounded-[26px] p-4 text-left transition-[background-color,transform] duration-300 active:scale-[0.985] sm:min-h-32 sm:gap-5 sm:p-6 ${
                selected ? "bg-maiz-400 text-bosque-950" : "bg-white text-tinta hover:bg-bosque-50"
              }`}
            >
              <span
                className={`grid size-13 shrink-0 place-items-center rounded-2xl sm:size-16 ${
                  selected ? "bg-bosque-950 text-maiz-400" : "bg-bosque-50 text-bosque-800"
                }`}
              >
                <choice.icon className="size-6 sm:size-7" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[clamp(1.3rem,3vw,1.75rem)] font-semibold leading-tight tracking-[-0.025em]">
                  {choice.title}
                </span>
                <span className={`mt-1 block text-[16px] leading-snug ${selected ? "text-bosque-950/75" : "text-niebla"}`}>
                  {choice.body}
                </span>
              </span>
              {selected ? (
                <Check className="size-6 shrink-0" strokeWidth={2.5} aria-hidden />
              ) : (
                <ArrowRight
                  className="size-6 shrink-0 text-bosque-700 transition-transform duration-500 ease-salida group-hover:translate-x-1"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-3">
        <div className="flex gap-3.5 rounded-[22px] bg-white/[0.07] p-4 ring-1 ring-inset ring-white/12 sm:p-5">
          <ClipboardList className="mt-0.5 size-6 shrink-0 text-brote-300" aria-hidden />
          <p className="text-[16px] leading-relaxed text-white/85">
            <strong className="font-semibold text-white">¿Quedaste por fuera del registro oficial?</strong> El Registro Único de
            Damnificados cerró el 4 de septiembre y muchas familias rurales no alcanzaron a quedar. Aquí tu necesidad igual
            cuenta: no te pedimos estar en ese registro.
          </p>
        </div>
        <PrototypeNote>
          <strong className="font-semibold text-white">GeoAid es un prototipo universitario.</strong> Esta solicitud no llega a
          ninguna entidad y no genera una entrega real. Si estás en peligro o alguien está herido, llama ya al{" "}
          <a href="tel:123" className="font-semibold text-maiz-400 underline underline-offset-4">
            123
          </a>
          .
        </PrototypeNote>
      </div>
    </>
  );
}
