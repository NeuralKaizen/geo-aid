import { serif } from "@/components/noticias/fonts";
import { fuentes } from "@/content/noticias";

/** Notas al pie: las citas completas, numeradas en el orden en que aparecen en la página. */
export function SourcesList() {
  return (
    <section id="fuentes" aria-labelledby="fuentes-titulo" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32">
      <div className="grid gap-8 border-t-2 border-tinta pt-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <h2
            id="fuentes-titulo"
            className={`${serif} text-[clamp(2rem,3vw,2.6rem)] font-normal leading-[1.05] tracking-[-0.02em] text-tinta`}
          >
            Notas y fuentes
          </h2>
          <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-niebla">
            Cada dato de esta página remite a una de estas notas. Las citas van tal como las reunió el equipo de GeoAid.
          </p>
        </div>

        <div>
          <ol className="gap-x-10 sm:columns-2">
            {fuentes.map((fuente, i) => (
              <li
                key={fuente.id}
                id={`fuente-${fuente.id}`}
                className="-mx-3 grid break-inside-avoid grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded-xl px-3 py-4"
              >
                <span className={`${serif} text-[1.6rem] leading-none text-tinta tabular-nums`}>{i + 1}</span>
                <p className="border-b border-tinta/10 pb-4 text-[14.5px] leading-relaxed text-tinta/85">
                  <span className="font-semibold text-tinta">{fuente.medio}</span> ({fuente.fecha}).{" "}
                  <cite className={`${serif} text-[16px] italic`}>{fuente.titulo}</cite>.
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-niebla">
            El cierre del Registro Único de Damnificados, el 4 de septiembre, hace parte del diagnóstico con el que nació
            GeoAid y no tiene una nota de prensa en esta lista.
          </p>
        </div>
      </div>
    </section>
  );
}
