"use client";

import { Fragment, useCallback, useEffect, useState, ViewTransition } from "react";
import { preload } from "react-dom";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Pause, Play } from "lucide-react";
import { heroSlides, type Action } from "@/content/site";
import { easeCortina, easeEntrada, easeSalida } from "@/lib/motion";
import { layer } from "@/lib/page-transition";
import { QuickDonate } from "@/components/hero/quick-donate";

const SLIDE_MS = 7000;
const WIPE_S = 1.15;
const count = heroSlides.length;

/*
 * La foto nueva entra como una cortina desde el lado hacia el que se navega; la anterior se queda debajo, se corre y
 * se oscurece. La cortina son dos capas que se desplazan en sentido contrario (afuera +100 %, adentro −100 %): se ve
 * igual que un clip-path pero la compone la GPU en vez de repintar la pantalla completa en cada cuadro.
 */
const frame: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%", zIndex: 2 }),
  center: { x: "0%", zIndex: 2, transition: { duration: WIPE_S, ease: easeCortina } },
  exit: { x: "0%", zIndex: 1, transition: { duration: WIPE_S } },
};

const counter: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%" }),
  center: { x: "0%", transition: { duration: WIPE_S, ease: easeCortina } },
  exit: { x: "0%", transition: { duration: WIPE_S } },
};

/* Oscurece la foto que sale con un velo de opacidad: se compone en la GPU, a diferencia de filter: brightness() */
const shade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 0 },
  exit: { opacity: 0.5, transition: { duration: WIPE_S, ease: easeCortina } },
};

const photo: Variants = {
  enter: (dir: number) => ({ scale: 1.2, x: dir >= 0 ? "10%" : "-10%" }),
  center: { scale: 1, x: "0%", transition: { duration: WIPE_S + 0.35, ease: easeSalida } },
  exit: (dir: number) => ({ x: dir >= 0 ? "-14%" : "14%", transition: { duration: WIPE_S, ease: easeCortina } }),
};

const copy: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.35 } },
  exit: { transition: { staggerChildren: 0.012 } },
};

const word: Variants = {
  hidden: { y: "108%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: easeSalida } },
  exit: { y: "-108%", transition: { duration: 0.35, ease: easeEntrada } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeSalida } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.3, ease: easeEntrada } },
};

export function HeroCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [focusInside, setFocusInside] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [covered, setCovered] = useState(false);

  // Mientras la hoja siguiente sube, la tarjeta se encoge, la foto se acerca, todo se oscurece y el texto se va.
  const { scrollY } = useScroll();
  const still = useMotionValue(0);
  const scrolled = useTransform(scrollY, (y) =>
    typeof window === "undefined" ? 0 : Math.min(1, Math.max(0, y / window.innerHeight)),
  );
  const progress = prefersReducedMotion ? still : scrolled;
  const cardScale = useTransform(progress, [0, 1], [1, 0.86]);
  const photoScale = useTransform(progress, [0, 1], [1, 1.14]);
  const copyY = useTransform(progress, [0, 1], [0, -180]);
  const copyOpacity = useTransform(progress, [0, 0.45], [1, 0]);
  const dim = useTransform(progress, [0.1, 1], [0, 0.75]);
  useMotionValueEvent(scrolled, "change", (p) => setCovered(p > 0.8));

  // Con "reducir movimiento" el carrusel arranca en pausa; la persona decide si lo reproduce.
  const paused = userPaused ?? !!prefersReducedMotion;
  const running = !paused && !focusInside && tabVisible && !covered;
  const slide = heroSlides[index];

  // Precarga la siguiente foto (la misma variante optimizada que pedirá <Image>) para que la cortina nunca descubra un vacío.
  const upcoming = getImageProps({ src: heroSlides[(index + 1) % count].photo.src, alt: "", fill: true, sizes: "100vw" }).props;
  preload(upcoming.src, { as: "image", imageSrcSet: upcoming.srcSet, imageSizes: upcoming.sizes, fetchPriority: "low" });

  const paginate = useCallback((dir: 1 | -1) => {
    setSlide(([current]) => [(current + dir + count) % count, dir]);
  }, []);

  const goTo = useCallback((target: number) => {
    setSlide((prev) => (prev[0] === target ? prev : [target, target > prev[0] ? 1 : -1]));
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function onKeyDown(event: React.KeyboardEvent) {
    if ((event.target as HTMLElement).closest("input, select, textarea")) return;
    if (event.key === "ArrowRight") paginate(1);
    if (event.key === "ArrowLeft") paginate(-1);
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Temas destacados"
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        // Solo el foco de teclado pausa: un clic en las flechas no debe congelar el carrusel.
        if ((event.target as HTMLElement).matches(":focus-visible")) setFocusInside(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusInside(false);
      }}
      className="sticky top-0 h-svh overflow-hidden bg-bosque-950"
    >
      <h1 className="sr-only">GeoAid: ayuda coordinada tras el terremoto del 10 de agosto</h1>

      {/*
       * La tarjeta es 56 px más grande que la pantalla por cada lado y tiene el radio fijo: en reposo las esquinas
       * quedan fuera de vista y aparecen solas al encogerse. Así solo se anima scale (GPU) y no border-radius, que
       * obligaría a repintar la foto completa en cada cuadro de scroll.
       */}
      <motion.div
        style={{ scale: cardScale }}
        onPanEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
            paginate(info.offset.x < 0 ? 1 : -1);
          }
        }}
        className="absolute -inset-14 isolate touch-pan-y overflow-hidden rounded-[48px] will-change-transform"
      >
        {/* Fotos */}
        <motion.div style={{ scale: photoScale }} className="absolute inset-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={slide.slug}
              custom={direction}
              variants={frame}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 overflow-hidden"
            >
              <motion.div custom={direction} variants={counter} className="absolute inset-0">
                <ViewTransition name={`seccion-${slide.slug}`} share="morph" default="none">
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div custom={direction} variants={photo} className="absolute inset-0">
                      <div className="absolute inset-0 animate-ken-burns">
                        <Image
                          src={slide.photo.src}
                          alt={slide.photo.alt}
                          fill
                          sizes="100vw"
                          preload={index === 0}
                          className="object-cover"
                          style={{ objectPosition: slide.photo.position }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </ViewTransition>
              </motion.div>
              <motion.div aria-hidden variants={shade} className="absolute inset-0 bg-black" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <ViewTransition enter={layer} exit={layer} default="none">
          <div className="absolute inset-0 z-10">
            {/* Velos para que el texto siempre se lea */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,39,36,0.88)_0%,rgba(6,39,36,0.62)_34%,rgba(6,39,36,0.12)_70%,rgba(6,39,36,0)_100%)] max-md:bg-bosque-950/50" />
              <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bosque-950/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bosque-950/90 via-bosque-950/35 to-transparent" />
            </div>

            <motion.div
              style={{ y: copyY, opacity: copyOpacity }}
              className="absolute inset-14 mx-auto flex max-w-[1320px] flex-col justify-end px-5 pb-[5.5rem] pt-28 sm:px-8 lg:px-12 lg:pb-24"
            >
              <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_22.5rem] xl:gap-16">
                {/* Texto */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={slide.slug}
                    role="group"
                    aria-roledescription="diapositiva"
                    aria-label={`${index + 1} de ${count}: ${slide.tab}`}
                    aria-live={running ? "off" : "polite"}
                    variants={copy}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="max-w-[46rem] text-white"
                  >
                    <motion.p
                      variants={rise}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2.5 pr-3.5 text-[13px] font-medium text-white/90 backdrop-blur-md"
                    >
                      <slide.icon className="size-4 text-maiz-400" aria-hidden />
                      {slide.tag}
                    </motion.p>

                    <h2 className="mt-5 font-display text-[clamp(2.6rem,min(5.6vw,9svh),5.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance">
                      {slide.title.split(" ").map((text, i) => (
                        <Fragment key={i}>
                          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                            <motion.span variants={word} className="inline-block origin-bottom-left">
                              {text}
                            </motion.span>
                          </span>{" "}
                        </Fragment>
                      ))}
                    </h2>

                    <motion.p
                      variants={rise}
                      className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-white/80 sm:text-lg"
                    >
                      {slide.body}
                    </motion.p>

                    <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
                      <HeroAction action={slide.primary} primary />
                      <HeroAction action={slide.secondary} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                <div className="hidden lg:block">
                  <QuickDonate variant="glass" />
                </div>
              </div>

              {/* Controles */}
              <div className="mt-10 flex items-end gap-6 lg:mt-12">
                <div
                  className="flex max-w-[44rem] flex-1 gap-2 sm:gap-3"
                  style={{ "--slide-ms": `${SLIDE_MS}ms` } as React.CSSProperties}
                >
                  {heroSlides.map((item, i) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Ver ${item.tab}`}
                      aria-current={i === index ? "true" : undefined}
                      className="group flex-1 py-2 text-left"
                    >
                      <span
                        className={`hidden truncate pb-2.5 text-[13px] font-medium transition-colors duration-500 sm:block ${
                          i === index ? "text-white" : "text-white/45 group-hover:text-white/85"
                        }`}
                      >
                        {item.tab}
                      </span>
                      <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/20 transition-colors group-hover:bg-white/40">
                        {i < index && <span className="absolute inset-0 rounded-full bg-white/55" />}
                        {i === index && (
                          <span
                            key={index}
                            className="absolute inset-0 origin-left animate-progreso rounded-full bg-maiz-400"
                            style={{ animationPlayState: running ? "running" : "paused" }}
                            onAnimationEnd={() => paginate(1)}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <RoundButton
                    label={paused ? "Reproducir carrusel" : "Pausar carrusel"}
                    onClick={() => setUserPaused(!paused)}
                  >
                    {paused ? (
                      <Play className="size-4 fill-current" aria-hidden />
                    ) : (
                      <Pause className="size-4 fill-current" aria-hidden />
                    )}
                  </RoundButton>
                  <RoundButton label="Tema anterior" onClick={() => paginate(-1)} className="max-sm:hidden">
                    <ChevronLeft className="size-5" aria-hidden />
                  </RoundButton>
                  <RoundButton label="Tema siguiente" onClick={() => paginate(1)} className="max-sm:hidden">
                    <ChevronRight className="size-5" aria-hidden />
                  </RoundButton>
                </div>
              </div>
            </motion.div>

            {/* Crédito de la foto, en vertical sobre el borde derecho */}
            <div className="pointer-events-none absolute right-[4.25rem] top-1/2 hidden -translate-y-1/2 md:block">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={slide.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="rotate-180 text-[11px] tracking-wide text-white/45 [writing-mode:vertical-rl]"
                >
                  {slide.photo.credit}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </ViewTransition>

        {/* Oscurece la tarjeta mientras la hoja de abajo la cubre */}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-bosque-950" />
      </motion.div>
    </section>
  );
}

function HeroAction({ action, primary = false }: { action: Action; primary?: boolean }) {
  const className = primary
    ? "group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-bosque-900 transition-colors duration-300 hover:bg-maiz-400"
    : "group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white ring-1 ring-white/40 transition-colors duration-300 hover:bg-white/10 hover:ring-white/70";
  const isDonation = action.href === "/donar";
  const content = (
    <>
      {isDonation && (
        <Heart className="size-4 transition-transform duration-500 ease-salida group-hover:scale-125" aria-hidden />
      )}
      {action.label}
      {!isDonation && (
        <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
      )}
    </>
  );

  if (action.href.startsWith("#")) {
    return (
      <a href={action.href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={action.href} transitionTypes={["nav-forward"]} className={className}>
      {content}
    </Link>
  );
}

function RoundButton({
  label,
  onClick,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      className={`grid size-11 place-items-center rounded-full text-white ring-1 ring-white/35 backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-bosque-900 ${className}`}
    >
      {children}
    </motion.button>
  );
}
