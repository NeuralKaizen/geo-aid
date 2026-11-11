"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { ExampleTag } from "@/components/ui/form";
import { temas, type Noticia } from "@/content/noticias";
import { easeSalida } from "@/lib/motion";

/*
 * Tarjetas de noticia. Toda la tarjeta se puede tocar: el titular es un botón cuyo ::after cubre la tarjeta, así la
 * tarjeta sigue siendo un <article> con su encabezado (un <button> no puede contener encabezados).
 */

const cover =
  "text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-maiz-400";

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

/** Sin foto, la tarjeta muestra la fecha en grande: así el ritmo de la grilla se mantiene. */
function DatePanel({ noticia, size }: { noticia: Noticia; size: "lead" | "card" }) {
  const [day, month] = noticia.fecha.split(" ");
  return (
    <div
      className={`relative flex flex-col justify-end overflow-hidden bg-bosque-900 text-white ${
        size === "lead" ? "min-h-[16rem] p-8" : "h-36 p-5"
      }`}
    >
      <span aria-hidden className="absolute -right-6 -top-10 font-display text-[11rem] font-semibold leading-none text-white/[0.04]">
        {day}
      </span>
      <span className={`${serif} font-medium leading-none tracking-[-0.03em] ${size === "lead" ? "text-[5.5rem]" : "text-[3.25rem]"}`}>
        {day}
      </span>
      <span className="mt-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-maiz-400">{month}</span>
    </div>
  );
}

function Photo({ noticia, sizes, className = "" }: { noticia: Noticia; sizes: string; className?: string }) {
  if (!noticia.foto) return null;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={noticia.foto.src}
        alt={noticia.foto.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-salida group-hover:scale-[1.04]"
        style={{ objectPosition: noticia.foto.position }}
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
        Foto ilustrativa
      </span>
    </div>
  );
}

const enter = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
  transition: { duration: 0.6, ease: easeSalida },
};

/** La noticia más reciente, a lo ancho. */
export function LeadStory({ noticia, ejemplo, onOpen }: { noticia: Noticia; ejemplo: boolean; onOpen: () => void }) {
  return (
    <motion.article
      layout
      {...enter}
      className="group relative grid overflow-hidden rounded-[28px] bg-white ring-1 ring-linea transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(6,39,36,0.5)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      {noticia.foto ? (
        <Photo noticia={noticia} sizes="(min-width: 1024px) 58vw, 100vw" className="min-h-[16rem] lg:min-h-[24rem]" />
      ) : (
        <DatePanel noticia={noticia} size="lead" />
      )}
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <p className="mb-4 inline-flex w-fit rounded-full bg-maiz-100 px-3 py-1 text-[12px] font-semibold text-maiz-800">Lo más reciente</p>
        <Meta noticia={noticia} />
        <h3 className={`${serif} mt-3 text-[clamp(1.7rem,2.6vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.015em] text-tinta text-balance`}>
          <button type="button" onClick={onOpen} className={`${cover} after:rounded-[28px]`}>
            {noticia.titular}
          </button>
        </h3>
        <p className="mt-4 text-[16px] leading-relaxed text-niebla">{noticia.resumen}</p>
        <p className="mt-auto flex items-center justify-between gap-4 pt-8 text-[13px] text-niebla">
          <Origin noticia={noticia} ejemplo={ejemplo} />
          <span className="inline-flex items-center gap-1.5 font-semibold text-bosque-700">
            Leer la noticia
            <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
          </span>
        </p>
      </div>
    </motion.article>
  );
}

export function NewsCard({ noticia, ejemplo, onOpen }: { noticia: Noticia; ejemplo: boolean; onOpen: () => void }) {
  return (
    <motion.article
      layout
      {...enter}
      className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-linea transition-shadow duration-500 hover:shadow-[0_26px_50px_-36px_rgba(6,39,36,0.5)]"
    >
      {noticia.foto ? (
        <Photo noticia={noticia} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="h-44" />
      ) : (
        <DatePanel noticia={noticia} size="card" />
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Meta noticia={noticia} />
        <h3 className={`${serif} mt-2.5 text-[21px] font-medium leading-[1.15] tracking-[-0.01em] text-tinta`}>
          <button type="button" onClick={onOpen} className={`${cover} after:rounded-[24px]`}>
            {noticia.titular}
          </button>
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-niebla">{noticia.resumen}</p>
        <p className="mt-auto flex items-center justify-between gap-3 pt-5 text-[12.5px] text-niebla">
          <Origin noticia={noticia} ejemplo={ejemplo} />
          <span className="inline-flex items-center gap-1 font-semibold text-bosque-700">
            Leer
            <ArrowRight className="size-3.5 transition-transform duration-500 ease-salida group-hover:translate-x-0.5" aria-hidden />
          </span>
        </p>
      </div>
    </motion.article>
  );
}
