"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { capitalize, reach } from "@/components/donaciones/metrics";
import {
  amountOf,
  frequencyLabel,
  methodLabel,
  resolveDestination,
  type Destination,
  type Draft,
  type Frequency,
} from "@/components/donar/options";
import { minimumAmount } from "@/content/donaciones";
import { fromKey, useTodayKey } from "@/lib/dates";
import { fechaHora, fechaLarga, pesos } from "@/lib/format";
import { easeEntrada, easeSalida } from "@/lib/motion";

/** Lo que quedó registrado al confirmar. El recibo lo muestra tal cual, aunque después se empiece otra donación. */
export type Confirmed = {
  code: string;
  createdAt: string;
  amount: number;
  destination: Destination;
  frequency: Frequency;
  method: string;
  donor: string;
};

export type ReceiptProps = {
  draft: Draft;
  /** paso más lejano al que llegó la persona: las filas se llenan a medida que los recorre */
  visited: number;
  /** si el monto ya venía elegido desde la URL */
  amountKnown: boolean;
  confirmed: Confirmed | null;
};

/*
 * Borde inferior dentado del papel: una máscara que deja el rectángulo completo menos una franja de dientes abajo.
 * Va en estilo en línea porque Tailwind no lee bien gradientes cónicos con tantos espacios.
 */
const TOOTH = 9;
const zigzag = {
  mask: `linear-gradient(#000 0 0) top / 100% calc(100% - ${TOOTH}px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / ${TOOTH * 2}px ${TOOTH}px repeat-x`,
  WebkitMask: `linear-gradient(#000 0 0) top / 100% calc(100% - ${TOOTH}px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / ${TOOTH * 2}px ${TOOTH}px repeat-x`,
};

/**
 * El recibo de papel. Mientras se elige es un resumen que se llena en vivo; al confirmar se vuelve el comprobante,
 * con el código y la hora real.
 */
export function ReceiptPaper({ draft, visited, amountKnown, confirmed }: ReceiptProps) {
  const today = useTodayKey();
  const destination = confirmed?.destination ?? resolveDestination(draft.destination);
  const amount = confirmed?.amount ?? amountOf(draft);
  const frequency = confirmed?.frequency ?? draft.frequency;
  const showAmount = Boolean(confirmed) || amountKnown || visited >= 1;
  const validAmount = showAmount && amount >= minimumAmount;
  const donor = confirmed?.donor ?? (visited >= 2 ? (draft.anonymous ? "Anónimo" : draft.name.trim() || null) : null);
  const method = confirmed?.method ?? methodLabel(draft.method);

  return (
    <div className="drop-shadow-[0_22px_32px_rgba(6,39,36,0.16)]">
      <div style={zigzag} className="bg-white px-6 pb-9 pt-7 text-tinta">
        <div className="flex items-start justify-between gap-3">
          <p className="flex items-center gap-2">
            <svg
              viewBox="0 0 32 32"
              className="size-6 text-bosque-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 14.5 16 6l10 8.5" />
              <path d="M3.5 22h5l2.4-5 3.2 9 3.1-7 2.1 3h9.2" className="text-maiz-400" />
            </svg>
            <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">GeoAid</span>
          </p>
          <span className="pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-niebla">
            {confirmed ? "Comprobante" : "Resumen"}
          </span>
        </div>
        <p className="mt-1.5 min-h-[18px] text-[12.5px] text-niebla">
          {confirmed ? fechaHora(confirmed.createdAt) : today ? capitalize(fechaLarga(fromKey(today))) : null}
        </p>

        {confirmed && (
          <div className="mt-5 rounded-2xl bg-bosque-50 px-4 py-3.5">
            <p className="flex items-center justify-between text-[12px] text-bosque-700">
              <span className="font-medium">Código de seguimiento</span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span aria-hidden className="size-1.5 rounded-full bg-bosque-600" />
                Recibida
              </span>
            </p>
            <p className="mt-1 font-display text-[28px] font-semibold leading-tight tracking-[0.01em] text-bosque-900 tabular-nums">{confirmed.code}</p>
          </div>
        )}

        <Divider />

        <dl className="space-y-0.5">
          <Row label="Destino" value={destination.short} sub={destination.place} />
          <Row label="Monto" value={showAmount ? pesos(amount) : null} />
          <Row label="Alcanza para" value={validAmount ? capitalize(reach(amount, destination.unit)) : null} />
          <Row label="Frecuencia" value={confirmed || visited >= 1 ? frequencyLabel(frequency) : null} />
          <Row label="A nombre de" value={donor} />
          <Row label="Método" value={method} />
        </dl>

        <Divider />

        <p className="flex items-baseline justify-between gap-4">
          <span className="text-[14px] font-semibold">Total</span>
          <span className="text-right font-display text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            {showAmount ? pesos(amount) : <span className="font-sans text-[13.5px] font-normal tracking-normal text-niebla/60">Por elegir</span>}
            {frequency === "mensual" && showAmount && (
              <span className="ml-1 font-sans text-[13px] font-medium tracking-normal text-niebla">al mes</span>
            )}
          </span>
        </p>

        <Divider />

        <p className="text-[12px] leading-relaxed text-niebla">
          {confirmed
            ? "Prototipo universitario: no se cobró nada y esta donación no llega a ninguna zona."
            : "Se llena mientras eliges. Prototipo universitario: no se cobra nada."}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return <hr aria-hidden className="my-4 border-0 border-t border-dashed border-linea" />;
}

/** Una línea del recibo: etiqueta, puntos guía y el valor, que entra con un pequeño salto cuando cambia */
function Row({ label, value, sub }: { label: string; value: ReactNode | null; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2 py-1 text-[13.5px]">
      <dt className="flex min-w-0 flex-1 items-baseline gap-2 text-niebla after:mb-[3px] after:min-w-4 after:flex-1 after:border-b after:border-dotted after:border-linea after:content-['']">
        <span className="shrink-0">{label}</span>
      </dt>
      <dd className="max-w-[62%] text-right">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={String(value ?? "")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: easeSalida }}
            className="block"
          >
            {value ? (
              <>
                <span className="block font-medium leading-snug text-tinta tabular-nums">{value}</span>
                {sub && <span className="block text-[12px] text-niebla">{sub}</span>}
              </>
            ) : (
              <span className="text-niebla/60">Por elegir</span>
            )}
          </motion.span>
        </AnimatePresence>
      </dd>
    </div>
  );
}

/**
 * El recibo colgando de la ranura de una impresora. Al cargar sale impreso; al confirmar, el borrador vuelve a entrar
 * y sale el comprobante. Solo se mueve con transform, así que no cuesta.
 */
export function PrintedReceipt(props: ReceiptProps) {
  const key = props.confirmed ? `comprobante-${props.confirmed.code}` : "borrador";

  return (
    <div>
      <div aria-hidden className="relative z-10 h-3.5 rounded-full bg-bosque-900 p-[4px]">
        <div className="h-full rounded-full bg-bosque-950" />
      </div>
      {/* Solo se recorta el borde de arriba (la ranura): a los lados y abajo la sombra del papel queda libre */}
      <div className="-mt-[7px] px-2.5 [clip-path:inset(0_-4rem_-6rem_-4rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ y: "-104%" }}
            animate={{ y: 0, transition: { duration: 1.15, delay: 0.2, ease: easeSalida } }}
            exit={{ y: "-104%", transition: { duration: 0.5, ease: easeEntrada } }}
          >
            <ReceiptPaper {...props} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
