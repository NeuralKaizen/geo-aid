"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { helpOptions, type HelpOption } from "@/content/site";
import { easeEntrada, easeSalida } from "@/lib/motion";

const count = helpOptions.length;
const mod = (k: number) => ((k % count) + count) % count;
const OFFSETS = [-2, -1, 0, 1, 2];
const morph = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };

type Rect = { x: number; y: number; width: number; height: number; radius: number; opacity: number; ring: number };

type Geometry = {
  mobile: boolean;
  height: number;
  card: { x: number; width: number };
  text: { x: number; y: number; width: number; height: number };
  imageTop: number;
  slot: (offset: number) => Rect;
};

/** Posición de cada foto según su distancia a la tarjeta central: 0 es la tarjeta, ±1 y ±2 son píldoras, ±3 queda fuera de escena. */
function geometry(width: number): Geometry {
  if (width < 768) {
    const pad = 10;
    const imageHeight = Math.round(Math.min(280, width * 0.66));
    return {
      mobile: true,
      height: 0,
      card: { x: 0, width },
      text: { x: 0, y: 0, width, height: 0 },
      imageTop: imageHeight + pad * 2,
      slot: (offset) => ({
        x: pad + offset * (width + 24),
        y: pad,
        width: width - pad * 2,
        height: imageHeight,
        radius: 20,
        opacity: offset === 0 ? 1 : 0,
        ring: 0,
      }),
    };
  }

  const wide = width >= 1100;
  const height = wide ? 480 : 450;
  const gap = 16;
  const pill1 = { width: wide ? 104 : 88, height: Math.round(height * 0.78) };
  const pill2 = { width: 76, height: Math.round(height * 0.5) };
  const outer = { width: 56, height: Math.round(height * 0.3) };
  const side = wide ? gap + pill1.width + gap + pill2.width : gap + pill1.width;
  const cardWidth = Math.min(820, width - side * 2);
  const cardX = (width - cardWidth) / 2;
  const pad = 14;
  const imageWidth = Math.round(cardWidth * 0.45);

  const xFor = (distance: number, sign: number) => {
    const sizes = [pill1.width, pill2.width, outer.width].slice(0, distance);
    const span = sizes.reduce((sum, size) => sum + size + gap, 0);
    return sign < 0 ? cardX - span : cardX + cardWidth + span - sizes[sizes.length - 1];
  };

  return {
    mobile: false,
    height,
    card: { x: cardX, width: cardWidth },
    text: { x: cardX + 40, y: 40, width: cardWidth - imageWidth - pad - 40 - 36, height: height - 80 },
    imageTop: 0,
    slot: (offset) => {
      if (offset === 0) {
        return {
          x: cardX + cardWidth - pad - imageWidth,
          y: pad,
          width: imageWidth,
          height: height - pad * 2,
          radius: 22,
          opacity: 1,
          ring: 0,
        };
      }
      const distance = Math.min(Math.abs(offset), 3);
      const size = [pill1, pill2, outer][distance - 1];
      return {
        x: xFor(distance, Math.sign(offset)),
        y: (height - size.height) / 2,
        width: size.width,
        height: size.height,
        radius: size.width / 2,
        opacity: distance === 1 || (distance === 2 && wide) ? 1 : 0,
        ring: 6,
      };
    },
  };
}

function toStyle(rect: Rect) {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    borderRadius: rect.radius,
    opacity: rect.opacity,
    boxShadow: `0px 0px 0px ${rect.ring}px rgba(255,255,255,1), 0px 24px 44px -26px rgba(6,39,36,${rect.ring ? 0.55 : 0})`,
  };
}

const panel: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: easeSalida } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.22, ease: easeEntrada } },
};

export function HelpCarousel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  // `active` no se reinicia al dar la vuelta: así cada foto conserva su identidad y la animación nunca cruza la escena.
  const [[active, direction], setActive] = useState<[number, number]>([0, 1]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const geo = useMemo(() => geometry(width || 1240), [width]);
  const option = helpOptions[mod(active)];

  const paginate = useCallback((dir: 1 | -1) => setActive(([k]) => [k + dir, dir]), []);
  const goTo = useCallback((k: number) => setActive((prev) => (prev[0] === k ? prev : [k, k > prev[0] ? 1 : -1])), []);

  return (
    <div
      aria-roledescription="carrusel"
      aria-label="Formas de ayudar"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") paginate(1);
        if (event.key === "ArrowLeft") paginate(-1);
      }}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2
            id="como-ayudar-titulo"
            className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-semibold leading-[1] tracking-[-0.04em] text-bosque-900"
          >
            Cómo ayudar
          </h2>
          <p className="mt-4 max-w-[30rem] text-lg leading-relaxed text-niebla">
            Cinco formas de ayudar, coordinadas desde un mismo lugar para que ninguna ayuda se repita ni se quede sin llegar.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-display text-sm font-medium tabular-nums text-niebla" aria-live="polite">
            <span className="text-tinta">{mod(active) + 1}</span> / {count}
          </p>
          <div className="flex gap-2">
            <StepButton label="Forma anterior" onClick={() => paginate(-1)}>
              <ChevronLeft className="size-5" aria-hidden />
            </StepButton>
            <StepButton label="Forma siguiente" onClick={() => paginate(1)}>
              <ChevronRight className="size-5" aria-hidden />
            </StepButton>
          </div>
        </div>
      </div>

      <motion.div
        ref={stageRef}
        onPanEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 50 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
            paginate(info.offset.x < 0 ? 1 : -1);
          }
        }}
        className="relative mt-12 touch-pan-y"
        style={{ height: geo.mobile ? undefined : geo.height, opacity: width ? 1 : 0 }}
      >
        {/* Tarjeta */}
        <div
          className={`rounded-[28px] bg-white shadow-[0_30px_70px_-40px_rgba(6,39,36,0.45)] ring-1 ring-linea/70 ${
            geo.mobile ? "relative" : "absolute inset-y-0"
          }`}
          style={geo.mobile ? { paddingTop: geo.imageTop } : { left: geo.card.x, width: geo.card.width }}
        >
          <div
            className={geo.mobile ? "px-5 pb-6 pt-5" : "absolute flex flex-col"}
            style={geo.mobile ? undefined : { left: 40, top: geo.text.y, width: geo.text.width, height: geo.text.height }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <OptionCopy key={option.id} option={option} mobile={geo.mobile} />
            </AnimatePresence>
          </div>
        </div>

        {/* Fotos */}
        <AnimatePresence initial={false} custom={direction}>
          {OFFSETS.map((offset) => {
            const k = active + offset;
            const item = helpOptions[mod(k)];
            const slot = geo.slot(offset);
            const variants: Variants = {
              enter: (dir: number) => toStyle(geo.slot(dir >= 0 ? 3 : -3)),
              place: toStyle(slot),
              leave: (dir: number) => toStyle(geo.slot(dir >= 0 ? -3 : 3)),
            };
            return (
              <motion.div
                key={k}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="place"
                exit="leave"
                transition={morph}
                className="absolute left-0 top-0 overflow-hidden bg-bosque-100"
                style={{ zIndex: 5 - Math.abs(offset), pointerEvents: slot.opacity ? "auto" : "none" }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: offset === 0 ? 1 : 1.2 }}
                  transition={morph}
                >
                  <Image
                    src={item.photo.src}
                    alt={offset === 0 ? item.photo.alt : ""}
                    fill
                    sizes="(min-width: 768px) 380px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: item.photo.position }}
                  />
                </motion.div>
                {offset !== 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(k)}
                    aria-label={`Ver: ${item.title}`}
                    tabIndex={slot.opacity ? 0 : -1}
                    className="absolute inset-0 bg-bosque-950/10 transition-colors duration-300 hover:bg-transparent"
                  />
                )}
                {offset === 0 && (
                  <motion.p
                    key={`credito-${k}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.7 } }}
                    className="absolute bottom-3 right-4 text-[10px] text-white/75 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]"
                  >
                    {item.photo.credit}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function OptionCopy({ option, mobile }: { option: HelpOption; mobile: boolean }) {
  return (
    <motion.div
      variants={panel}
      initial="hidden"
      animate="show"
      exit="exit"
      className={mobile ? "flex flex-col" : "flex h-full flex-col justify-between"}
    >
      <div>
        <motion.span
          variants={line}
          className="inline-grid size-11 place-items-center rounded-2xl bg-bosque-50 text-bosque-700"
        >
          <option.icon className="size-5" aria-hidden />
        </motion.span>
        <motion.h3
          variants={line}
          className="mt-5 font-display text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-tinta md:text-[2.4rem]"
        >
          {option.title}
        </motion.h3>
        <motion.p variants={line} className="mt-4 text-[1.0625rem] leading-relaxed text-niebla">
          {option.body}
        </motion.p>
      </div>

      <div className="mt-7 md:mt-0">
        <motion.div variants={line} className="inline-flex flex-col rounded-2xl bg-maiz-100/70 px-4 py-3 ring-1 ring-maiz-400/50">
          <span className="border-b border-dashed border-maiz-400 pb-1 text-[12px] font-medium text-maiz-800">
            {option.fact.label}
          </span>
          <span className="pt-1 font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-bosque-900">
            {option.fact.value}
          </span>
        </motion.div>
        <motion.div variants={line} className="mt-5 flex flex-wrap gap-2.5">
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
            <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StepButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      className="grid size-12 place-items-center rounded-full bg-white text-bosque-800 ring-1 ring-linea transition-colors duration-300 hover:bg-bosque-800 hover:text-white hover:ring-bosque-800"
    >
      {children}
    </motion.button>
  );
}
