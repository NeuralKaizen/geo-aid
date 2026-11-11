"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, MoveRight } from "lucide-react";
import { helpOptions, type HelpOption } from "@/content/site";
import { useMediaQuery } from "@/lib/use-media-query";
import { QuickDonate } from "@/components/hero/quick-donate";

type Layout = { travel: number; viewport: number; height: number; centers: number[] };

/**
 * La hoja que sube sobre el hero. En escritorio se queda fija y el scroll vertical mueve las tarjetas de lado.
 * Por debajo de 1024 px es un carrusel nativo con snap, precedido por la donación rápida (que en escritorio va en el hero).
 */
export function HowToHelp() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout>({ travel: 0, viewport: 1, height: 0, centers: [] });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const viewport = window.innerWidth;
      setLayout({
        travel: Math.max(0, track.scrollWidth - viewport),
        viewport,
        height: window.innerHeight,
        centers: cardRefs.current.map((card) => (card ? card.offsetLeft + card.offsetWidth / 2 : 0)),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -layout.travel]);
  const pinned = desktop && layout.travel > 0;

  return (
    <section
      ref={sectionRef}
      id="como-ayudar"
      aria-labelledby="como-ayudar-titulo"
      className="relative z-10 -mt-10 rounded-t-[36px] bg-papel shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.45)]"
      style={{ height: pinned ? layout.height + layout.travel : undefined }}
    >
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "pb-20 pt-14"}>
        {/* En móvil el título va arriba y no como una diapositiva más del carrusel */}
        {!pinned && (
          <>
            <div className="px-5 sm:px-8">
              <Intro pinned={false} />
            </div>
            <div className="mx-auto mb-12 mt-10 max-w-md px-4">
              <QuickDonate variant="light" />
            </div>
          </>
        )}
        <motion.div
          ref={trackRef}
          style={{ x: pinned ? x : 0 }}
          className={`flex items-stretch gap-4 px-5 sm:px-8 md:gap-6 lg:px-[max(3rem,calc((100vw-1224px)/2))] ${
            pinned ? "w-max" : "snap-x snap-mandatory scroll-px-5 overflow-x-auto pb-4 [scrollbar-width:none] sm:scroll-px-8"
          }`}
        >
          {pinned && (
            <div className="flex w-[25rem] shrink-0 flex-col justify-center pr-10">
              <Intro pinned />
            </div>
          )}

          {helpOptions.map((option, i) => (
            <HelpCard
              key={option.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              option={option}
              progress={scrollYProgress}
              center={layout.centers[i]}
              layout={layout}
              animated={pinned}
            />
          ))}
        </motion.div>

        {pinned && (
          <div className="mx-auto mt-10 flex w-full max-w-[1224px] items-center gap-4 px-12">
            <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-linea">
              <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left rounded-full bg-bosque-700" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Intro({ pinned }: { pinned: boolean }) {
  return (
    <>
      <h2
        id="como-ayudar-titulo"
        className="font-display text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-bosque-900"
      >
        Cómo ayudar
      </h2>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-niebla">
        Cinco formas de ayudar, coordinadas desde un mismo lugar para que ninguna ayuda se repita ni se quede sin llegar.
      </p>
      <p className={`flex items-center gap-3 text-sm font-medium text-bosque-700 ${pinned ? "mt-10" : "mt-6"}`}>
        <MoveRight className="size-5 motion-safe:animate-[pulse_2s_ease-in-out_infinite]" aria-hidden />
        {pinned ? "Sigue bajando" : "Desliza para ver las cinco"}
      </p>
    </>
  );
}

function HelpCard({
  option,
  progress,
  center = 0,
  layout,
  animated,
  ref,
}: {
  option: HelpOption;
  progress: MotionValue<number>;
  center?: number;
  layout: Layout;
  animated: boolean;
  ref: React.Ref<HTMLElement>;
}) {
  // Progreso en el que esta tarjeta pasa por el centro de la pantalla
  const at = layout.travel ? (center - layout.viewport / 2) / layout.travel : 0;
  const span = layout.travel ? layout.viewport / layout.travel : 1;
  const photoX = useTransform(progress, [at - span, at + span], ["14%", "-14%"]);
  const scale = useTransform(progress, [at - span, at, at + span], [0.9, 1, 0.9]);
  const rotate = useTransform(progress, [at - span, at, at + span], [2.5, 0, -2.5]);

  return (
    <motion.article
      ref={ref}
      style={animated ? { scale, rotate } : undefined}
      className="grid w-[86vw] shrink-0 snap-center grid-rows-[15rem_auto] overflow-hidden rounded-[32px] bg-white p-2.5 ring-1 ring-linea md:h-[min(36rem,70svh)] md:w-[min(54rem,78vw)] md:grid-cols-[1.05fr_1fr] md:grid-rows-1"
    >
      <div className="relative overflow-hidden rounded-[24px] bg-bosque-100">
        <motion.div style={animated ? { x: photoX, scale: 1.3 } : undefined} className="absolute inset-0">
          <Image
            src={option.photo.src}
            alt={option.photo.alt}
            fill
            // Las tarjetas entran deslizándose de lado: con carga perezosa la foto se decodificaría en pleno scroll
            loading="eager"
            fetchPriority="low"
            sizes="(min-width: 768px) 440px, 86vw"
            className="object-cover"
            style={{ objectPosition: option.photo.position }}
          />
        </motion.div>
        <p className="absolute bottom-3 right-4 text-[10px] text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
          {option.photo.credit}
        </p>
      </div>

      <div className="flex flex-col justify-between gap-8 p-5 md:p-8 lg:p-10">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-bosque-50 text-bosque-700">
            <option.icon className="size-[22px]" aria-hidden />
          </span>
          <h3 className="mt-6 font-display text-[2.25rem] font-semibold leading-[1] tracking-[-0.04em] text-tinta lg:text-[2.75rem]">
            {option.title}
          </h3>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-niebla">{option.body}</p>
        </div>

        <div>
          <div className="inline-flex flex-col rounded-2xl bg-maiz-100/70 px-4 py-3 ring-1 ring-maiz-400/50">
            <span className="border-b border-dashed border-maiz-400 pb-1 text-[12px] font-medium text-maiz-800">
              {option.fact.label}
            </span>
            <span className="pt-1 font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-bosque-900">
              {option.fact.value}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={option.primary.href}
              transitionTypes={["nav-forward"]}
              className="inline-flex h-12 items-center rounded-full bg-bosque-800 px-6 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-bosque-700"
            >
              {option.primary.label}
            </Link>
            <Link
              href={option.secondary.href}
              transitionTypes={["nav-forward"]}
              className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-bosque-800 ring-1 ring-linea transition-colors duration-300 hover:bg-bosque-50 hover:ring-bosque-200"
            >
              {option.secondary.label}
              <ArrowRight
                className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
