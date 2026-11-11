import { MorphPhoto, OverPhoto } from "@/components/page-shell";
import { EditionDate } from "@/components/noticias/edition-date";
import { serif } from "@/components/noticias/fonts";
import { emergencias } from "@/content/noticias";
import { photos } from "@/content/site";

/**
 * Cabecera del portal: dice en una línea qué es la página. Abajo deja aire para que las tarjetas de las emergencias
 * se monten sobre el borde de la foto.
 */
export function NewsHeader() {
  const abiertas = emergencias.filter((emergencia) => emergencia.estado === "activa" || emergencia.estado === "alerta").length;

  return (
    <div className="px-3">
      <div className="relative isolate min-h-[min(60svh,560px)] overflow-hidden rounded-[28px] bg-bosque-900">
        <MorphPhoto slug="noticias" photo={photos.noticias} />
        <OverPhoto>
          <div className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(90deg,rgba(6,39,36,0.92)_0%,rgba(6,39,36,0.7)_48%,rgba(6,39,36,0.25)_100%)]">
            <div className="mx-auto w-full max-w-[1240px] px-6 pb-32 pt-16 lg:px-10 lg:pb-36">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/65">
                <span className="text-maiz-400">Noticias</span>
                <span aria-hidden>·</span>
                <span className="font-medium normal-case tracking-normal">
                  <EditionDate />
                </span>
              </p>
              <h1
                className={`${serif} mt-4 max-w-4xl text-[clamp(2.6rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.025em] text-white text-balance`}
              >
                Lo que está pasando en cada emergencia
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80">
                Elige una emergencia y mira qué está pasando, sus últimas noticias y cómo ayudar. Cada noticia lleva su fuente.
              </p>
              <p className="mt-6 text-[13px] text-white/55">
                {emergencias.length} emergencias en seguimiento · {abiertas} abiertas hoy
              </p>
            </div>
          </div>
        </OverPhoto>
      </div>
    </div>
  );
}
