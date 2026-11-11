import { ArrowDown, Phone } from "lucide-react";
import { MorphPhoto, OverPhoto } from "@/components/page-shell";
import { button } from "@/components/ui/styles";
import { emergencyLine, photos } from "@/content/site";

/**
 * Cabecera sobria: la foto del hero llega en color y se asienta en gris (el morph interpola el filtro, y es a
 * propósito). Encima, el título y una franja con la línea de emergencias que se ve antes que cualquier otra cosa.
 */
export function Header() {
  return (
    <section aria-labelledby="desaparecidos-titulo" className="px-3">
      <div className="relative isolate h-[min(84svh,760px)] min-h-[640px] overflow-hidden rounded-[28px] bg-bosque-950">
        <MorphPhoto slug="desaparecidos" photo={photos.desaparecidos} radius="rounded-[28px]" className="grayscale" />
        <OverPhoto>
          <div className="absolute inset-0 flex flex-col justify-end rounded-[28px] bg-[linear-gradient(to_bottom,rgba(6,39,36,0.4)_0%,rgba(6,39,36,0.32)_22%,rgba(6,39,36,0.66)_42%,rgba(6,39,36,0.9)_68%,rgba(6,39,36,0.96)_100%)] text-white">
            <p className="absolute right-5 top-5 hidden text-[11.5px] text-white/60 sm:block">{photos.desaparecidos.credit}</p>
            <div className="mx-auto w-full max-w-[1240px] px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/65">Personas desaparecidas</p>
              <h1
                id="desaparecidos-titulo"
                className="mt-4 max-w-[13ch] font-display text-[clamp(2.75rem,6.2vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.04em] text-balance"
              >
                Ayúdanos a reencontrar familias
              </h1>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/75 sm:text-lg">
                Consulta reportes verificados, cuenta lo que sabes o reporta a alguien que estás buscando.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <a href="#consultar" className={button({ variant: "light" })}>
                  Consultar reportes
                  <ArrowDown className="size-4 transition-transform duration-500 ease-salida group-hover:translate-y-0.5" aria-hidden />
                </a>
                <a href="#reportar" className={button({ variant: "outlineLight" })}>
                  Reportar a una persona
                </a>
              </div>

              {/* La franja de emergencia: todo el bloque es el enlace, para que sea fácil de tocar en el celular */}
              <a
                href={`tel:${emergencyLine.number}`}
                className="group mt-8 flex items-center gap-4 rounded-[20px] bg-white p-3 pr-4 text-tinta shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:bg-papel sm:mt-10 sm:p-4 sm:pr-5"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-alerta text-white">
                  <Phone className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.45rem]">
                    Si es una emergencia, llama al {emergencyLine.number}
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-niebla">
                    GeoAid es un prototipo y no reemplaza a las autoridades.
                  </span>
                </span>
                <span className={`${button({ variant: "primary" })} max-sm:hidden`} aria-hidden>
                  Llamar al {emergencyLine.number}
                </span>
              </a>
              <p className="mt-3 text-[11px] text-white/55 sm:hidden">{photos.desaparecidos.credit}</p>
            </div>
          </div>
        </OverPhoto>
      </div>
    </section>
  );
}
