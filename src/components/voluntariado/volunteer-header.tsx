import { ArrowDown, Clock, HandHelping, MessageSquareText, Users } from "lucide-react";
import { MorphPhoto, OverPhoto } from "@/components/page-shell";
import { photos } from "@/content/site";
import { volunteerHeader } from "@/content/voluntariado";

const chipIcons = [Clock, HandHelping, MessageSquareText];

/** Cabecera: la foto del hero aterriza aquí con el morph y encima van el título y los tres datos del turno. */
export function VolunteerHeader() {
  return (
    <section aria-labelledby="voluntariado-titulo" className="relative mx-3 h-[clamp(32rem,74svh,41rem)] overflow-hidden rounded-[28px] bg-bosque-900">
      <MorphPhoto slug="voluntariado" photo={photos.voluntariado} radius="rounded-[28px]" />
      <OverPhoto>
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bosque-950/95 via-bosque-950/45 to-bosque-950/5 md:bg-gradient-to-r md:from-bosque-950/90 md:via-bosque-950/45 md:to-transparent">
          <div className="mx-auto w-full max-w-[1240px] px-6 pb-8 sm:px-8 md:pb-14 lg:px-10">
            <p className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3.5 text-[13px] font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-md">
              <Users className="size-4 text-maiz-400" aria-hidden />
              {volunteerHeader.tag}
            </p>
            <h1
              id="voluntariado-titulo"
              className="mt-5 max-w-[12ch] font-display text-[clamp(2.75rem,6.4vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-white text-balance"
            >
              {volunteerHeader.title}
            </h1>
            <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-white/80 md:text-lg">{volunteerHeader.body}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {volunteerHeader.chips.map((chip, i) => {
                const Icon = chipIcons[i];
                return (
                  <li
                    key={chip}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-white/12 px-4 text-[14px] font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-md"
                  >
                    <Icon className="size-4 text-maiz-400" aria-hidden />
                    {chip}
                  </li>
                );
              })}
            </ul>

            <a
              href={volunteerHeader.cta.href}
              className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-maiz-400 px-6 text-[15px] font-semibold text-bosque-950 transition-[filter] duration-300 hover:brightness-105"
            >
              {volunteerHeader.cta.label}
              <ArrowDown className="size-4 transition-transform duration-500 ease-salida group-hover:translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </OverPhoto>
    </section>
  );
}
