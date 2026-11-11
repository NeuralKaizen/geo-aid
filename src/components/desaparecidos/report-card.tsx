import { Check, ShieldCheck } from "lucide-react";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import type { Reporte } from "@/content/desaparecidos";

/** Iniciales para el avatar: primera letra del nombre y la inicial del apellido ("María Fernanda R." → "MR"). */
function initials(name: string) {
  const parts = name.replace(/\./g, "").split(" ").filter(Boolean);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Tarjeta de un reporte: sin foto, solo iniciales, y los datos mínimos para reconocer a la persona. Si ya hubo
 * reencuentro, en lugar de pedir pistas lo dice con calma.
 */
export function ReportCard({ report, onTip }: { report: Reporte; onTip: (button: HTMLButtonElement) => void }) {
  const found = report.estado === "reencontrada";
  const foundLabel = report.genero === "f" ? "Reencontrada" : "Reencontrado";

  return (
    <article aria-labelledby={`${report.id}-nombre`} className="flex h-full flex-col rounded-[28px] bg-white p-6 ring-1 ring-linea">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={`grid size-14 shrink-0 place-items-center rounded-full font-display text-[17px] font-medium tracking-[-0.01em] ${
            found ? "bg-bosque-900 text-white" : "bg-bosque-50 text-bosque-900 ring-1 ring-inset ring-bosque-100"
          }`}
        >
          {initials(report.nombre)}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 id={`${report.id}-nombre`} className="font-display text-[1.3rem] font-medium leading-tight tracking-[-0.02em] text-tinta">
            {report.nombre}
          </h3>
          <p className="mt-1 text-[14px] leading-snug text-niebla">
            {report.edad} años · {report.municipio}, {report.departamento}
          </p>
        </div>
      </div>

      <p
        className={`mt-5 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-[12.5px] font-semibold ${
          found ? "bg-bosque-900 text-white" : "text-tinta ring-1 ring-inset ring-tinta/20"
        }`}
      >
        {found ? (
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        ) : (
          <span aria-hidden className="size-1.5 rounded-full bg-tinta/60" />
        )}
        <span className="sr-only">Estado: </span>
        {found ? foundLabel : "Buscando"}
      </p>

      <dl className="mt-5 border-t border-linea pt-4">
        <dt className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-niebla">Visto por última vez</dt>
        <dd className="mt-1.5 text-[15px] leading-snug text-tinta">
          {report.vistoEl}
          <span className="text-niebla"> · {report.vistoEn}</span>
        </dd>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-5 text-[12.5px] text-niebla">
        <span className="inline-flex items-center gap-1.5 font-medium text-bosque-700">
          <ShieldCheck className="size-4" aria-hidden />
          Reporte verificado
        </span>
        <span>Reportado el {report.reportadoEl}</span>
        <ExampleTag />
      </div>

      {found ? (
        <p className="mt-5 rounded-2xl bg-bosque-50 px-4 py-3 text-[14px] leading-snug text-bosque-900">
          Se reencontró con su familia el {report.reencuentro}.
        </p>
      ) : (
        <button
          type="button"
          onClick={(event) => onTip(event.currentTarget)}
          className={`${button({ variant: "secondary" })} mt-5 w-full`}
        >
          ¿Sabes algo?
          <span className="sr-only"> Deja una pista sobre {report.nombre}</span>
        </button>
      )}
    </article>
  );
}
