import { Newspaper } from "lucide-react";
import { MorphPhoto, OverPhoto } from "@/components/page-shell";
import { EditionDate, QuakeDay } from "@/components/noticias/edition-date";
import { serif } from "@/components/noticias/fonts";
import { photos } from "@/content/site";

/**
 * Cabecera como la primera plana de un diario: la foto del hero aterriza aquí con el morph y encima va el mástil
 * (nombre de la sección y fecha de la edición), el titular en serif y la línea de fecha con el día desde el sismo.
 */
export function Masthead() {
  return (
    <section aria-labelledby="noticias-titulo" className="px-3">
      <div className="relative isolate h-[min(86svh,820px)] min-h-[620px] overflow-hidden rounded-[28px] bg-bosque-950">
        <MorphPhoto slug="noticias" photo={photos.noticias} radius="rounded-[28px]" />
        <OverPhoto>
          <div className="absolute inset-0 flex flex-col text-white">
            {/* Velo arriba para el mástil y abajo para el titular; el centro deja ver la foto */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-[28px] bg-[linear-gradient(to_bottom,rgba(6,39,36,0.78)_0%,rgba(6,39,36,0.18)_22%,rgba(6,39,36,0.38)_46%,rgba(6,39,36,0.8)_68%,rgba(6,39,36,0.95)_100%)]"
            />
            <div className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 pt-5 sm:px-8 lg:px-10 lg:pt-7">
              {/* Mástil: regla gruesa y regla fina, como en la cabecera de un periódico */}
              <div className="border-t-2 border-white/85 pt-[3px]">
                <div className="flex items-center justify-between gap-4 border-t border-white/40 pt-3 text-[12px]">
                  <p className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                    <Newspaper className="size-4 text-maiz-400" aria-hidden />
                    Bitácora del terremoto
                  </p>
                  <p className="hidden text-[13px] text-white/75 sm:block">
                    <EditionDate />
                  </p>
                </div>
              </div>

              <div className="mt-auto pb-7 lg:pb-11">
                <h1
                  id="noticias-titulo"
                  className={`${serif} max-w-[15ch] text-[clamp(3.1rem,7.4vw,7.25rem)] font-normal leading-[0.93] tracking-[-0.025em] text-balance`}
                >
                  Lo que sabemos desde el 10 de agosto
                </h1>
                <p
                  className={`${serif} mt-5 max-w-[40rem] text-[clamp(1.15rem,1.55vw,1.4rem)] italic leading-[1.4] text-white/80`}
                >
                  Una cronología con fuentes: las cifras oficiales, las decisiones que marcaron la ayuda y lo que cada una
                  significa si quieres ayudar.
                </p>
                <div className="mt-8 flex flex-col gap-2 border-t border-white/35 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <p className="text-[14px] font-semibold">
                    <QuakeDay />
                    <span className="px-2 font-normal text-white/45" aria-hidden>
                      ·
                    </span>
                    <span className="font-normal text-white/75">Cifras oficiales con corte al 10 de octubre de 2026</span>
                  </p>
                  <p className="text-[11.5px] text-white/60">{photos.noticias.credit}</p>
                </div>
              </div>
            </div>
          </div>
        </OverPhoto>
      </div>
    </section>
  );
}
