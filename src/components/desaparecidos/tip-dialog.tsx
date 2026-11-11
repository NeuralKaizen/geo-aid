"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { TipForm } from "@/components/desaparecidos/tip-form";
import type { Reporte } from "@/content/desaparecidos";
import { easeSalida } from "@/lib/motion";

/*
 * "¿Sabes algo?" en un <dialog> nativo abierto con showModal(): el resto de la página queda inerte, Escape lo cierra
 * y el navegador devuelve el foco al botón que lo abrió (además lo hacemos a mano por si acaso). El cierre espera a
 * que termine la animación de salida antes de llamar a close().
 */
export function TipDialog({
  report,
  onClose,
  returnFocus,
}: {
  report: Reporte | null;
  onClose: () => void;
  /** botón que abrió el diálogo, para devolverle el foco */
  returnFocus: HTMLElement | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const lenis = useLenis();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !report) return;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    // Sin scroll detrás del diálogo: Lenis en escritorio y el overflow para el táctil
    lenis?.stop();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = previous;
    };
  }, [report, lenis]);

  function finishClose() {
    dialogRef.current?.close();
    returnFocus?.focus();
  }

  // Foco atrapado: Tab y Shift+Tab dan la vuelta dentro del diálogo
  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const focusables = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null || element.matches("input.sr-only"));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-tinta backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={finishClose}>
        {report && (
          <motion.div
            key="capa"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.22, delay: 0.05 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6"
          >
            <div aria-hidden onClick={onClose} className="absolute inset-0 bg-bosque-950/55 backdrop-blur-[3px]" />
            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.55, ease: easeSalida }}
              className="relative max-h-[92dvh] w-full max-w-[36rem] overflow-y-auto overscroll-contain rounded-t-[28px] bg-white shadow-[0_40px_90px_-30px_rgba(6,39,36,0.6)] sm:rounded-[28px]"
            >
              <TipForm
                report={report}
                titleId={titleId}
                onClose={onClose}
                onLeave={() => {
                  // Al salir hacia otra sección se cierra ya (sin animación) para que no quede encima del telón
                  dialogRef.current?.close();
                  onClose();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
