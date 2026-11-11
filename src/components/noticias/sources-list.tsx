import { serif } from "@/components/noticias/fonts";
import { eyebrow } from "@/components/ui/styles";
import { listaFuentes } from "@/content/noticias";

/** Todas las fuentes reales del portal, y qué no tiene fuente y por qué. */
export function SourcesList() {
  return (
    <section aria-labelledby="fuentes" className="mx-auto mt-20 max-w-[1240px] px-5 sm:px-8 lg:mt-24 lg:px-10">
      <div className="grid gap-8 border-t border-linea pt-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <p className={eyebrow}>Fuentes</p>
          <h2 id="fuentes" className={`${serif} mt-2 text-[28px] font-medium leading-tight tracking-[-0.015em] text-tinta`}>
            De dónde sale cada noticia
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-niebla">
            Las noticias del terremoto y de La Guajira salen de estas fuentes. El cierre del registro, el 4 de septiembre, viene
            del diagnóstico con el que nació GeoAid. Las lluvias del Pacífico y los incendios de la Orinoquía son de ejemplo.
          </p>
        </div>
        <ol className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          {listaFuentes.map((fuente) => (
            <li key={`${fuente.medio}-${fuente.fecha}`} className="border-t border-linea pt-3 text-[13.5px] leading-relaxed text-niebla">
              <strong className="font-semibold text-tinta">{fuente.medio}</strong> ({fuente.fecha}).{" "}
              <cite className={`${serif} text-[15px] italic text-tinta/80`}>{fuente.titulo}</cite>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
