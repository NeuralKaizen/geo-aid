"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { easeSalida } from "@/lib/motion";

/**
 * Cifra que cuenta hasta su valor cuando entra en pantalla y vuelve a contar si cambia (por ejemplo, al borrar la
 * actividad de la sesión). El lector de pantalla recibe el valor final, no cada número intermedio.
 */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (n) => format(Math.round(n)));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.4, ease: easeSalida });
    return () => controls.stop();
  }, [inView, reduce, value, count]);

  return (
    <>
      <motion.span ref={ref} aria-hidden className="tabular-nums">
        {text}
      </motion.span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
