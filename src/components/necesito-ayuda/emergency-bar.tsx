import { Phone } from "lucide-react";
import { emergencyLine } from "@/content/site";

/** Línea de emergencias fija debajo de la barra del sitio: se ve en todas las pantallas del asistente. */
export function EmergencyBar() {
  return (
    <div className="sticky top-[5.25rem] z-20 px-3">
      <a
        href={`tel:${emergencyLine.number}`}
        className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-3 rounded-2xl bg-maiz-400 pl-4 pr-2 text-bosque-950 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.6)] transition-[filter] duration-300 hover:brightness-105 sm:pl-5"
      >
        <span className="flex items-center gap-2.5 text-[16px] leading-tight sm:text-[17px]">
          <Phone className="size-5 shrink-0" aria-hidden />
          <span>
            En una emergencia llama al <strong className="font-display text-[19px] font-semibold">{emergencyLine.number}</strong>
          </span>
        </span>
        <span className="inline-flex h-10 shrink-0 items-center rounded-xl bg-bosque-950 px-4 text-[15px] font-semibold text-white">
          Llamar
        </span>
      </a>
    </div>
  );
}
