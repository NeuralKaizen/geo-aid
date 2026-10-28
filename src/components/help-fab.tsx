"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { LifeBuoy } from "lucide-react";

/** Acceso permanente para quien necesita ayuda. Aparece al dejar atrás el hero para no tapar la donación rápida. */
export function HelpFab() {
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShown(y > window.innerHeight * 0.7));

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16, transition: { duration: 0.2 } }}
          transition={{ type: "spring", bounce: 0.35, duration: 0.7 }}
          className="fixed bottom-4 right-4 z-30 sm:bottom-5 sm:right-5"
        >
          <Link
            href="/necesito-ayuda"
            transitionTypes={["nav-forward"]}
            className="group flex h-12 items-center gap-2 rounded-full bg-maiz-400 pl-3.5 pr-4 text-[15px] font-semibold text-bosque-950 sm:h-14 sm:gap-2.5 sm:pl-4 sm:pr-5 sm:text-base shadow-[0_18px_40px_-16px_rgba(122,82,11,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <LifeBuoy className="size-5 transition-transform duration-700 ease-salida group-hover:rotate-180" aria-hidden />
            Necesito ayuda
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
