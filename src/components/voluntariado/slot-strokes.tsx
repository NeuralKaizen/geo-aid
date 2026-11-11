"use client";

import { motion, type Variants } from "motion/react";
import { easeSalida } from "@/lib/motion";

/* Los trazos crecen desde su base cuando la tarjeta entra en pantalla, como los cupos del hero */
const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.012, delayChildren: 0.15 } },
};

const stroke: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.55, ease: easeSalida } },
};

/**
 * Un trazo por cupo: los libres en maíz, los tomados apagados y el tuyo en verde. El largo de la fila depende del
 * total (unos 9 px por cupo), así un turno de 6 personas se ve corto al lado de uno de 30.
 */
export function SlotStrokes({
  taken,
  total,
  mine = false,
  tone = "light",
  className = "",
}: {
  taken: number;
  total: number;
  /** la persona tomó uno de los cupos tomados (el último) */
  mine?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const takenTone = tone === "light" ? "bg-bosque-200" : "bg-white/25";
  return (
    <motion.div
      variants={row}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      role="img"
      aria-label={`${taken} de ${total} cupos tomados${mine ? ", uno es tuyo" : ""}`}
      className={`flex h-4 gap-[3px] ${className}`}
      style={{ width: `min(100%, ${total * 9}px)` }}
    >
      {Array.from({ length: total }, (_, i) => {
        const yours = mine && i === taken - 1;
        return (
          <motion.span
            key={i}
            variants={stroke}
            className={`relative flex-1 origin-bottom rounded-[2px] transition-colors duration-700 ${
              yours ? "bg-bosque-700" : i < taken ? takenTone : "bg-maiz-400"
            }`}
          >
            {/* Al tomar el turno, el cupo cambia de color y da un pequeño salto para que se note */}
            {yours && (
              <motion.span
                aria-hidden
                initial={{ scaleY: 1.9, opacity: 1 }}
                animate={{ scaleY: 1, opacity: 0 }}
                transition={{ duration: 0.9, ease: easeSalida }}
                className="absolute inset-0 origin-bottom rounded-[2px] bg-bosque-600"
              />
            )}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
