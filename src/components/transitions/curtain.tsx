"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { routeLabels } from "@/content/site";
import { easeCortina, easeEntrada, easeSalida } from "@/lib/motion";

/*
 * Telón entre secciones. Es el mismo gesto de la página de inicio, donde cada hoja sube sobre la anterior: una hoja
 * verde sube con el nombre del destino, la ruta cambia por detrás y la hoja sigue de largo hacia arriba para
 * descubrir la página nueva. La hoja mide más que la pantalla para que sus esquinas redondeadas solo se vean en
 * movimiento.
 *
 * Desde el hero no se usa: ahí la foto del tema se transforma en la cabecera de su sección (<ViewTransition>).
 */

type Phase = "idle" | "cover" | "wait" | "reveal";

const CurtainContext = createContext<(href: string) => void>(() => {});

/** Navega con el telón. Si la persona pidió reducir movimiento, navega directo. */
export function useCurtain() {
  return useContext(CurtainContext);
}

const sheet: Variants = {
  idle: { y: "108vh", transition: { duration: 0 } },
  cover: { y: "0vh", transition: { duration: 0.62, ease: easeCortina } },
  wait: { y: "0vh" },
  reveal: { y: "-116vh", transition: { duration: 0.8, ease: easeCortina } },
};

const title: Variants = {
  idle: { y: "110%", opacity: 1, transition: { duration: 0 } },
  cover: { y: "0%", opacity: 1, transition: { duration: 0.75, delay: 0.22, ease: easeSalida } },
  wait: { y: "0%" },
  reveal: { y: "-40%", opacity: 0, transition: { duration: 0.4, ease: easeEntrada } },
};

const mark: Variants = {
  idle: { opacity: 0, transition: { duration: 0 } },
  cover: { opacity: 1, transition: { duration: 0.3, delay: 0.08 } },
  wait: { opacity: 1 },
  reveal: { opacity: 0, transition: { duration: 0.25 } },
};

const stroke: Variants = {
  idle: { pathLength: 0, transition: { duration: 0 } },
  cover: { pathLength: 1, transition: { duration: 0.55, delay: 0.1, ease: [0.65, 0, 0.35, 1] } },
  wait: { pathLength: 1 },
  reveal: { pathLength: 1 },
};

export function CurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const target = useRef({ href: "", from: "" });

  const navigate = useCallback(
    (href: string) => {
      const path = href.split(/[?#]/)[0] || "/";
      // Misma página (un ancla) o movimiento reducido: sin telón
      if (reduceMotion || path === pathname) {
        router.push(href);
        return;
      }
      if (phase !== "idle") return;
      target.current = { href, from: pathname };
      setLabel(routeLabels[path] ?? "GeoAid");
      setPhase("cover");
    },
    [phase, pathname, reduceMotion, router],
  );

  // Cuando la página nueva ya está montada, el telón sigue de largo
  useEffect(() => {
    if (phase !== "wait") return;
    if (pathname !== target.current.from) {
      if (!target.current.href.includes("#")) lenis?.scrollTo(0, { immediate: true, force: true });
      const frame = requestAnimationFrame(() => setPhase("reveal"));
      return () => cancelAnimationFrame(frame);
    }
    // Si la ruta no cambia (error de red, ruta igual), no dejar la pantalla tapada
    const timeout = window.setTimeout(() => setPhase("reveal"), 4000);
    return () => window.clearTimeout(timeout);
  }, [phase, pathname, lenis]);

  return (
    <CurtainContext.Provider value={navigate}>
      {children}
      <div aria-hidden className={`fixed inset-0 z-[150] overflow-hidden ${phase === "idle" ? "pointer-events-none invisible" : ""}`}>
        <motion.div
          variants={sheet}
          initial="idle"
          animate={phase}
          onAnimationComplete={(definition) => {
            if (definition === "cover") {
              router.push(target.current.href);
              setPhase("wait");
            }
            if (definition === "reveal") setPhase("idle");
          }}
          className="absolute inset-x-0 -top-[6vh] flex h-[112vh] flex-col items-center justify-center rounded-[48px] bg-bosque-950 px-6 text-white will-change-transform"
        >
          <motion.svg
            variants={mark}
            viewBox="0 0 32 32"
            className="size-12 sm:size-14"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path variants={stroke} d="M6 14.5 16 6l10 8.5" className="text-white/80" />
            <motion.path variants={stroke} d="M3.5 22h5l2.4-5 3.2 9 3.1-7 2.1 3h9.2" className="text-maiz-400" />
          </motion.svg>
          <span className="mt-6 block overflow-hidden pb-[0.12em]">
            <motion.span
              variants={title}
              className="block text-center font-display text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
            >
              {label}
            </motion.span>
          </span>
        </motion.div>
      </div>
    </CurtainContext.Provider>
  );
}
