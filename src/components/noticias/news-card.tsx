"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HelpPanel } from "@/components/noticias/help-options";
import { serif } from "@/components/noticias/fonts";
import { ExampleTag } from "@/components/ui/form";
import { temas, type Noticia } from "@/content/noticias";
import { easeSalida } from "@/lib/motion";

/*
 * Cada noticia es una fila: lo que pasó a la izquierda y, al lado, cómo ayudar. En móvil la ayuda queda debajo.
 * El titular es un botón cuyo ::after cubre solo la columna de la noticia: las formas de ayudar son enlaces propios y
 * un enlace no puede ir dentro de otro.
 */

const cover =
  "text-left after:absolute after:-inset-2 after:rounded-[20px] after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-maiz-400";

/** De dónde viene: el medio, "Ejemplo" o el diagnóstico del proyecto. */
export function Origin({ noticia, ejemplo }: { noticia: Noticia; ejemplo: boolean }) {
  if (ejemplo) return <ExampleTag />;
  if (noticia.fuente) return <span className="font-semibold text-tinta/80">{noticia.fuente.medio}</span>;
  return <span>Diagnóstico de GeoAid</span>;
}

function Meta({ noticia }: { noticia: Noticia }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[12px]">
      <span className="font-semibold uppercase tracking-[0.12em] text-bosque-600">{temas[noticia.tema]}</span>
      <span aria-hidden className="text-niebla">·</span>
      <time dateTime={noticia.iso} className="text-niebla">
        {noticia.fecha}
      </time>
    </p>
  );
}

const enter = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
  transition: { duration: 0.6, ease: easeSalida },
};

export function NewsRow({
  noticia,
  ejemplo,
  lead = false,
  onOpen,
}: {
  noticia: Noticia;
  ejemplo: boolean;
  /** la más reciente: con la foto grande y el titular más grande */
  lead?: boolean;
  onOpen: () => void;
}) {
  const foto = noticia.foto;
  const layout = foto
    ? lead
      ? "grid gap-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-center xl:grid-cols-[16rem_minmax(0,1fr)]"
      : "grid gap-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start"
    : "";

  return (
    <motion.article
      layout
      {...enter}
      className="grid gap-5 border-t border-linea py-8 first:border-t-0 first:pt-2 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_29rem]"
    >
      <div className={`group relative ${layout}`}>
        {foto && (
          <div
            className={`relative overflow-hidden ${lead ? "aspect-[4/3] rounded-[22px]" : "hidden aspect-square rounded-[18px] sm:block"}`}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes={lead ? "(min-width: 640px) 17rem, 100vw" : "8rem"}
              className="object-cover transition-transform duration-700 ease-salida group-hover:scale-[1.04]"
              style={{ objectPosition: foto.position }}
            />
            {lead && (
              <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                Foto ilustrativa
              </span>
            )}
          </div>
        )}
        <div className="min-w-0">
          {lead && (
            <p className="mb-3 inline-flex rounded-full bg-maiz-100 px-3 py-1 text-[12px] font-semibold text-maiz-800">Lo más reciente</p>
          )}
          <Meta noticia={noticia} />
          <h3
            className={`${serif} mt-2.5 font-medium leading-[1.1] tracking-[-0.012em] text-tinta transition-colors duration-300 group-hover:text-bosque-700 text-balance ${
              lead ? "text-[clamp(1.7rem,2.3vw,2.1rem)]" : "text-[clamp(1.4rem,2vw,1.7rem)]"
            }`}
          >
            <button type="button" onClick={onOpen} className={cover}>
              {noticia.titular}
            </button>
          </h3>
          <p className="mt-3 max-w-[38rem] text-[15.5px] leading-relaxed text-niebla">{noticia.resumen}</p>
          <p className="mt-4 flex max-w-[38rem] items-center justify-between gap-4 text-[13px] text-niebla">
            <Origin noticia={noticia} ejemplo={ejemplo} />
            <span className="inline-flex items-center gap-1.5 font-semibold text-bosque-700">
              Leer la noticia
              <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
            </span>
          </p>
        </div>
      </div>

      <HelpPanel ayudas={noticia.ayudas} />
    </motion.article>
  );
}
