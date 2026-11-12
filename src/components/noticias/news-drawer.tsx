"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { HelpPanel } from "@/components/noticias/help-options";
import { Origin } from "@/components/noticias/news-card";
import { ExampleTag } from "@/components/ui/form";
import { eyebrow } from "@/components/ui/styles";
import { temas, type Emergencia, type Noticia } from "@/content/noticias";
import { useMediaQuery } from "@/lib/use-media-query";
import { easeEntrada, easeSalida } from "@/lib/motion";

const CLOSE_MS = 240;

/**
 * La noticia completa en un <dialog> nativo: atrapa el foco, se cierra con Escape o tocando afuera y devuelve el foco
 * a la tarjeta. En escritorio entra desde la derecha; en móvil sube como una hoja. La cabecera y los botones de
 * anterior y siguiente quedan fijos; solo cambia el contenido.
 */
export function NewsDrawer({
  emergencia,
  noticia,
  onClose,
  onNavigate,
}: {
  emergencia: Emergencia;
  noticia: Noticia | null;
  onClose: () => void;
  onNavigate: (noticia: Noticia) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [closing, setClosing] = useState(false);
  // Mientras se anima la salida la noticia ya es null: se sigue mostrando la última
  const [shown, setShown] = useState<Noticia | null>(noticia);
  if (noticia && noticia !== shown) setShown(noticia);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (noticia && !node.open) {
      node.showModal();
      lenis?.stop();
    }
    if (!noticia && node.open) node.close();
  }, [noticia, lenis]);

  useEffect(() => {
    const node = dialog.current;
    const resume = () => lenis?.start();
    node?.addEventListener("close", resume);
    return () => node?.removeEventListener("close", resume);
  }, [lenis]);

  // Al pasar a otra noticia, el contenido vuelve arriba
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [shown?.id]);

  function requestClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, CLOSE_MS);
  }

  /** Antes de ir a otra página se cierra al instante: el diálogo vive encima de todo y taparía el telón. */
  function closeNow() {
    dialog.current?.close();
    onClose();
  }

  const index = shown ? emergencia.noticias.findIndex((item) => item.id === shown.id) : -1;
  const newer = index > 0 ? emergencia.noticias[index - 1] : undefined;
  const older = index >= 0 && index < emergencia.noticias.length - 1 ? emergencia.noticias[index + 1] : undefined;
  const hidden = desktop ? { x: 48, opacity: 0 } : { y: 64, opacity: 0 };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="noticia-titular"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-bosque-950/55 backdrop:backdrop-blur-[2px] open:flex open:items-end lg:open:items-stretch lg:open:justify-end"
    >
      {shown && (
        <motion.div
          key={noticia ? "abierta" : "cerrando"}
          initial={hidden}
          animate={closing ? { ...hidden, transition: { duration: CLOSE_MS / 1000, ease: easeEntrada } } : { x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: easeSalida }}
          data-lenis-prevent
          className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-papel shadow-[0_-20px_60px_-30px_rgba(6,39,36,0.6)] lg:h-full lg:max-h-none lg:max-w-[600px] lg:rounded-l-[28px] lg:rounded-tr-none"
        >
          <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-linea lg:hidden" />
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-linea px-6 py-3.5 sm:px-8">
            <p className="min-w-0 truncate text-[13px] text-niebla">
              <span className="font-semibold text-tinta">{emergencia.nombre}</span> · Noticia {index + 1} de {emergencia.noticias.length}
            </p>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Cerrar la noticia"
              className="grid size-10 shrink-0 place-items-center rounded-full text-tinta ring-1 ring-inset ring-linea transition-colors hover:bg-white"
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          </header>

          <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={shown.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: easeSalida }}
                className="px-6 pb-10 pt-7 sm:px-8"
              >
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
                  <span className="font-semibold uppercase tracking-[0.12em] text-bosque-600">{temas[shown.tema]}</span>
                  <span aria-hidden className="text-niebla">·</span>
                  <time dateTime={shown.iso} className="text-niebla">
                    {shown.fecha}
                  </time>
                  <span aria-hidden className="text-niebla">·</span>
                  <span className="text-niebla">
                    <Origin noticia={shown} ejemplo={emergencia.ejemplo} />
                  </span>
                </p>
                <h2
                  id="noticia-titular"
                  className={`${serif} mt-3 text-[clamp(1.9rem,3vw,2.5rem)] font-medium leading-[1.06] tracking-[-0.015em] text-tinta text-balance`}
                >
                  {shown.titular}
                </h2>

                {shown.foto && (
                  <figure className="mt-6">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                      <Image
                        src={shown.foto.src}
                        alt={shown.foto.alt}
                        fill
                        sizes="(min-width: 1024px) 540px, 100vw"
                        className="object-cover"
                        style={{ objectPosition: shown.foto.position }}
                      />
                    </div>
                    <figcaption className="mt-2 text-[12px] leading-snug text-niebla">
                      Foto ilustrativa: no es de esta noticia. {shown.foto.credit}
                    </figcaption>
                  </figure>
                )}

                <section className="mt-7">
                  <h3 className={eyebrow}>Qué pasó</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-tinta/85">{shown.resumen}</p>
                </section>

                <section className="mt-6 rounded-[22px] bg-bosque-900 p-6 text-white">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-maiz-400">Qué significa para ti</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-white/85">{shown.significa}</p>
                </section>

                <HelpPanel ayudas={shown.ayudas} onNavigate={closeNow} className="mt-4" />

                <section className="mt-7 border-t border-linea pt-5">
                  <h3 className={eyebrow}>Fuente</h3>
                  {shown.fuente ? (
                    <p className="mt-2 text-[14px] leading-relaxed text-niebla">
                      <strong className="font-semibold text-tinta">{shown.fuente.medio}</strong> ({shown.fuente.fecha}).{" "}
                      <cite className="italic">{shown.fuente.titulo}</cite>
                    </p>
                  ) : emergencia.ejemplo ? (
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-[14px] leading-relaxed text-niebla">
                      <ExampleTag>Noticia de ejemplo</ExampleTag>
                      No viene de ningún medio: muestra cómo se vería el portal con varias emergencias.
                    </p>
                  ) : (
                    <p className="mt-2 text-[14px] leading-relaxed text-niebla">
                      Viene del diagnóstico con el que nació GeoAid. No tiene una nota de prensa propia entre nuestras fuentes.
                    </p>
                  )}
                </section>
              </motion.article>
            </AnimatePresence>
          </div>

          <footer className="grid shrink-0 grid-cols-2 gap-3 border-t border-linea px-6 py-4 sm:px-8">
            <button
              type="button"
              disabled={!newer}
              onClick={() => newer && onNavigate(newer)}
              className="group flex min-h-12 items-center gap-2 rounded-2xl px-3 text-left text-[13px] text-niebla transition-colors hover:bg-white disabled:opacity-35"
            >
              <ArrowLeft className="size-4 shrink-0 transition-transform duration-500 ease-salida group-hover:-translate-x-0.5" aria-hidden />
              <span>
                <span className="block font-semibold text-tinta">Más reciente</span>
                {newer && <span className="line-clamp-1">{newer.titular}</span>}
              </span>
            </button>
            <button
              type="button"
              disabled={!older}
              onClick={() => older && onNavigate(older)}
              className="group flex min-h-12 items-center justify-end gap-2 rounded-2xl px-3 text-right text-[13px] text-niebla transition-colors hover:bg-white disabled:opacity-35"
            >
              <span>
                <span className="block font-semibold text-tinta">Más antigua</span>
                {older && <span className="line-clamp-1">{older.titular}</span>}
              </span>
              <ArrowRight className="size-4 shrink-0 transition-transform duration-500 ease-salida group-hover:translate-x-0.5" aria-hidden />
            </button>
          </footer>
        </motion.div>
      )}
    </dialog>
  );
}
