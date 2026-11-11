"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { Origin } from "@/components/noticias/news-card";
import { eyebrow } from "@/components/ui/styles";
import { temas, type Emergencia, type Noticia } from "@/content/noticias";
import { daysBetween, fromKey, useTodayKey } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/**
 * La historia de la emergencia sobre un eje de días: cada noticia es un punto en el día en que salió. Pasar el
 * puntero o el foco por un punto muestra la noticia abajo; tocarlo la abre. Mientras la emergencia sigue abierta, el
 * eje llega hasta hoy (solo se sabe en el navegador; antes de hidratar termina en la última noticia).
 */
export function CrisisAxis({ emergencia, onOpen }: { emergencia: Emergencia; onOpen: (noticia: Noticia) => void }) {
  const today = useTodayKey();
  const [previewId, setPreviewId] = useState(emergencia.noticias[0].id);

  const start = fromKey(emergencia.inicio);
  const last = fromKey(emergencia.noticias[0].iso);
  const open = emergencia.estado === "activa" || emergencia.estado === "alerta";
  const end = open && today ? fromKey(today) : last;
  const total = Math.max(1, daysBetween(start, end));
  const at = (iso: string) => (daysBetween(start, fromKey(iso)) / total) * 100;

  // Noticias del mismo día comparten punto
  const days = new Map<string, Noticia[]>();
  for (const noticia of [...emergencia.noticias].reverse()) days.set(noticia.iso, [...(days.get(noticia.iso) ?? []), noticia]);

  // Inicio de cada mes dentro del eje, como referencia
  const months: { label: string; left: number }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth() + 1, 1, 12);
  while (cursor <= end) {
    months.push({ label: MONTHS[cursor.getMonth()], left: (daysBetween(start, cursor) / total) * 100 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const preview = emergencia.noticias.find((noticia) => noticia.id === previewId) ?? emergencia.noticias[0];
  // Un día de eje mide al menos 11 px: los puntos cercanos no se pisan y en pantallas chicas el eje se desliza
  const minWidth = Math.max(640, total * 11);

  return (
    <section aria-labelledby="dia-por-dia" className="mx-auto mt-20 max-w-[1240px] px-5 sm:px-8 lg:mt-28 lg:px-10">
      <div className="flex flex-col gap-2 border-t-2 border-tinta pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={eyebrow}>Día por día</p>
          <h2
            id="dia-por-dia"
            className={`${serif} mt-2 text-[clamp(2rem,3.4vw,2.85rem)] font-medium leading-[1.04] tracking-[-0.02em] text-tinta`}
          >
            Así ha avanzado
          </h2>
        </div>
        <p className="text-[14px] text-niebla">Pasa por un punto para ver la noticia de ese día.</p>
      </div>

      <div className="-mx-5 mt-8 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
        <div className="relative mx-4 h-28" style={{ minWidth }}>
          {/* Eje */}
          <div className="absolute inset-x-0 top-10 h-px bg-linea" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeSalida }}
            className="absolute inset-x-0 top-[39px] h-[3px] origin-left rounded-full bg-bosque-800"
          />

          {months.map((month) => (
            <span
              key={`${month.label}-${month.left}`}
              aria-hidden
              className="absolute top-0 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.14em] text-niebla/70"
              style={{ left: `${month.left}%` }}
            >
              {month.label}
            </span>
          ))}

          {/* Mientras la emergencia sigue abierta, el eje termina en hoy */}
          {open && today && (
            <span className="absolute right-0 top-16 flex flex-col items-end text-[12px] font-semibold text-tinta">
              <span aria-hidden className="absolute -top-[30px] right-0 size-3 rounded-full bg-maiz-400 ring-4 ring-maiz-400/25" />
              Hoy · día {total}
            </span>
          )}

          {[...days.entries()].map(([iso, noticias], index) => {
            const active = noticias.some((noticia) => noticia.id === preview.id);
            const left = at(iso);
            return (
              <motion.button
                key={iso}
                type="button"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.6, delay: 0.3 + index * 0.06 }}
                onMouseEnter={() => setPreviewId(noticias[0].id)}
                onFocus={() => setPreviewId(noticias[0].id)}
                onClick={() => onOpen(noticias[0])}
                aria-label={`${noticias[0].fecha}: ${noticias.map((noticia) => noticia.titular).join(". ")}`}
                className="group absolute top-[29px] grid size-6 -translate-x-1/2 place-items-center rounded-full"
                style={{ left: `${left}%` }}
              >
                <span
                  className={`grid size-4 place-items-center rounded-full ring-2 transition-[background-color,transform] duration-300 group-hover:scale-125 ${
                    active ? "scale-125 bg-maiz-400 ring-white" : "bg-white ring-bosque-800"
                  }`}
                >
                  {noticias.length > 1 && <span className="text-[9px] font-bold text-bosque-950">{noticias.length}</span>}
                </span>
                <span
                  aria-hidden
                  className={`absolute top-8 whitespace-nowrap text-[11.5px] transition-colors ${active ? "font-semibold text-tinta" : "text-niebla"}`}
                >
                  {noticias[0].fecha.replace(/ \d{4}$/, "")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Vista previa de la noticia del punto elegido */}
      <div className="mt-6 min-h-[11rem] rounded-[28px] bg-white p-6 ring-1 ring-linea sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={preview.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: easeSalida }}
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10"
          >
            <div className="max-w-3xl">
              <p className="flex flex-wrap items-center gap-x-2 text-[12px]">
                <span className="font-semibold uppercase tracking-[0.12em] text-bosque-600">{temas[preview.tema]}</span>
                <span aria-hidden className="text-niebla">·</span>
                <span className="text-niebla">
                  {preview.fecha} · día {Math.max(0, daysBetween(start, fromKey(preview.iso)))}
                </span>
                <span aria-hidden className="text-niebla">·</span>
                <span className="text-niebla">
                  <Origin noticia={preview} ejemplo={emergencia.ejemplo} />
                </span>
              </p>
              <p className={`${serif} mt-2.5 text-[clamp(1.4rem,2.2vw,1.85rem)] font-medium leading-[1.15] tracking-[-0.01em] text-tinta`}>
                {preview.titular}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-niebla">{preview.resumen}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpen(preview)}
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-bosque-800 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-bosque-700 md:self-auto"
            >
              Leer la noticia
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
