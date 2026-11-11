"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import { amountOf, resolveDestination } from "@/components/donar/options";
import { ReceiptPaper, type ReceiptProps } from "@/components/donar/receipt";
import { pesos } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

/**
 * En móvil el recibo no cabe al lado: queda como una barra fija abajo con el monto y el destino, y se abre como una
 * hoja con el recibo completo. Solo aparece mientras el formulario está en pantalla.
 */
export function MobileSummary({ visible, ...receipt }: ReceiptProps & { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const destination = resolveDestination(receipt.draft.destination);
  const amount = amountOf(receipt.draft);
  const shown = visible && !receipt.confirmed;

  // Escape cierra la hoja, como cualquier panel que se abre encima
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key="resumen-movil"
          initial={{ y: "130%" }}
          animate={{ y: 0 }}
          exit={{ y: "130%" }}
          transition={{ duration: 0.5, ease: easeSalida }}
          className="fixed inset-x-3 bottom-3 z-30 lg:hidden"
        >
          <AnimatePresence>
            {open && (
              <motion.div
                id={sheetId}
                key="hoja"
                data-lenis-prevent
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.45, ease: easeSalida }}
                className="mb-2 max-h-[min(70svh,34rem)] overflow-y-auto overscroll-contain rounded-[24px] bg-papel p-3 shadow-[0_24px_60px_-20px_rgba(6,39,36,0.55)] ring-1 ring-linea"
              >
                <ReceiptPaper {...receipt} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 rounded-[22px] bg-bosque-950 py-2.5 pl-4 pr-2.5 text-white shadow-[0_18px_40px_-16px_rgba(6,39,36,0.7)]">
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] text-white/60">Tu aporte</p>
              <p className="truncate text-[15px] font-semibold">
                <span className="tabular-nums">{amount ? pesos(amount) : "$0"}</span>
                {receipt.draft.frequency === "mensual" && <span className="font-normal text-white/70"> al mes</span>}
                <span className="font-normal text-white/70"> · {destination.short}</span>
              </p>
            </div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={sheetId}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-4 text-[13.5px] font-semibold ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15"
            >
              {open ? "Cerrar" : "Ver resumen"}
              <ChevronUp className={`size-4 transition-transform duration-500 ease-salida ${open ? "rotate-180" : ""}`} aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
