"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { trackingDemo } from "@/content/site";
import { easeSalida } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { RouteMap } from "@/components/tracking/route-map";

/**
 * Transparencia: la ruta de una donación de ejemplo se dibuja con el scroll y el comprobante se completa a la par.
 * En móvil no se fija: el comprobante avanza solo cuando entra en pantalla.
 */
export function TrackingSection() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, amount: 0.6 });
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // El recorrido termina un poco antes del final para que la entrega se alcance a ver quieta
  const route = useTransform(scrollYProgress, [0.05, 0.85], [0, 1], { clamp: true });
  useMotionValueEvent(route, "change", (p) => desktop && setReached(Math.min(3, Math.floor(p * 3 + 0.02))));

  const shown = desktop ? reached : cardInView ? 3 : -1;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="seguimiento-titulo"
      className={`relative z-10 -mt-10 rounded-t-[36px] bg-bosque-900 text-white ${desktop ? "h-[320svh]" : "py-20"}`}
    >
      <div className={desktop ? "sticky top-0 flex h-svh items-center pt-16" : ""}>
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:px-12">
          <div>
            <h2
              id="seguimiento-titulo"
              className="font-display text-[clamp(2.4rem,3.8vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance"
            >
              Sigue tu ayuda hasta que llega
            </h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-white/70">
              Cada donación queda registrada: cuándo salió, por dónde va y en qué punto se entregó.
            </p>

            <Receipt ref={cardRef} shown={shown} desktop={desktop} />
          </div>

          <figure>
            {desktop && (
              <div
                className="relative mx-auto aspect-[560/520] w-full overflow-hidden rounded-[32px] bg-bosque-950/60 ring-1 ring-white/10"
                style={{ maxWidth: "calc(62svh * 560 / 520)" }}
              >
                <RouteMap progress={route} />
              </div>
            )}
            <figcaption className="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-white/50 lg:text-center">
              La transparencia también es ayuda: en el caso de los carrotanques de La Guajira, la Contraloría encontró un
              presunto sobrecosto de 7.760 millones de pesos (Blu Radio).
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Receipt({ shown, desktop, ref }: { shown: number; desktop: boolean; ref: React.Ref<HTMLDivElement> }) {
  const { steps } = trackingDemo;
  const done = Math.max(0, shown);

  return (
    <div ref={ref} className="mt-8 max-w-md rounded-[28px] bg-white p-5 text-tinta shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-maiz-100 px-3 py-1 text-[12px] font-semibold text-maiz-800">Ejemplo de seguimiento</span>
        <span className="text-[13px] font-medium tabular-nums text-niebla">#{trackingDemo.code}</span>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]">{trackingDemo.amount}</p>
      <p className="text-sm text-niebla">{trackingDemo.destination}</p>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-papel">
        <motion.div
          className="h-full origin-left rounded-full bg-bosque-700"
          initial={false}
          animate={{ scaleX: shown < 0 ? 0 : (done + 1) / steps.length }}
          transition={{ duration: 0.7, ease: easeSalida }}
        />
      </div>

      <ol className="mt-4 space-y-1">
        {steps.map((step, i) => {
          const state = i < done || (i === done && done === steps.length - 1) ? "done" : i === done ? "current" : "pending";
          const visible = shown >= 0 && i <= shown;
          return (
            <motion.li
              key={step.title}
              initial={false}
              animate={{ opacity: visible || desktop ? 1 : 0.4 }}
              transition={{ delay: desktop ? 0 : i * 0.35 }}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors duration-500 ${
                state === "current" ? "bg-bosque-50" : ""
              }`}
            >
              <span
                className={`relative grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                  state === "done" ? "bg-bosque-700 text-white" : state === "current" ? "bg-maiz-400 text-bosque-950" : "ring-1 ring-linea"
                }`}
              >
                <AnimatePresence>
                  {state === "done" && (
                    <motion.span
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
                    >
                      <Check className="size-4" strokeWidth={3} aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
                {state === "current" && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-maiz-400/50 motion-reduce:hidden" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{step.title}</span>
                <span className="block truncate text-[13px] text-niebla">{step.detail}</span>
              </span>
              <span className="shrink-0 text-[12px] tabular-nums text-niebla">{state === "pending" ? "" : step.time}</span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
