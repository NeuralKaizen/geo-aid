"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Copy, Info, RotateCcw, UserRound } from "lucide-react";
import type { Confirmed } from "@/components/donar/receipt";
import { StepHeading } from "@/components/donar/step-heading";
import { NavLink } from "@/components/transitions/nav-link";
import { button } from "@/components/ui/styles";
import { emergencyLine } from "@/content/site";
import { addDays } from "@/lib/dates";
import { fechaCorta, fechaHora } from "@/lib/format";
import { easeSalida } from "@/lib/motion";

/** Paso 5: la donación quedó registrada. Código, próximos pasos con fechas reales y a dónde ir después. */
export function Confirmation({
  confirmed,
  onRestart,
  receipt,
}: {
  confirmed: Confirmed;
  onRestart: () => void;
  /** el comprobante en móvil, donde no hay columna para el recibo */
  receipt: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const resetCopied = useRef<number | undefined>(undefined);
  const created = new Date(confirmed.createdAt);
  const firstName = confirmed.donor === "Anónimo" ? null : confirmed.donor.split(" ")[0];

  useEffect(() => () => window.clearTimeout(resetCopied.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(confirmed.code);
      setCopied(true);
      window.clearTimeout(resetCopied.current);
      resetCopied.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Sin permiso para el portapapeles: el código sigue a la vista para copiarlo a mano
    }
  }

  const next = [
    { title: "Recibida", detail: `Ahora, ${fechaHora(confirmed.createdAt)}`, done: true },
    { title: "Comprada cerca de la zona", detail: `En las próximas 48 horas, antes del ${fechaCorta(addDays(created, 2))}`, done: false },
    { title: "En camino", detail: "Verás la ruta en tu seguimiento", done: false },
    { title: "Entregada", detail: "Con el día, el punto y las familias que la recibieron", done: false },
  ];

  return (
    <div>
      <AnimatedCheck />
      <div className="mt-6">
        <StepHeading eyebrow="Donación registrada" focusOnMount>
          {firstName ? `Gracias, ${firstName}. Tu aporte quedó registrado` : "Gracias. Tu aporte quedó registrado"}
        </StepHeading>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-papel p-4 ring-1 ring-inset ring-linea sm:p-5">
        <div className="min-w-[11rem] flex-1">
          <p className="text-[12.5px] font-medium text-niebla">Tu código de seguimiento</p>
          <p className="mt-0.5 whitespace-nowrap font-display text-[30px] font-semibold leading-tight tracking-[0.01em] text-bosque-900 tabular-nums">{confirmed.code}</p>
        </div>
        <button type="button" onClick={copy} className={button({ variant: "secondary", size: "md" })}>
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copiado" : "Copiar código"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Código copiado" : ""}
        </span>
      </div>

      <h3 className="mt-8 text-[13px] font-semibold text-tinta">Lo que sigue</h3>
      <ol className="mt-3 space-y-1">
        {next.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: easeSalida }}
            className="flex items-center gap-3 rounded-2xl px-2 py-2"
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold tabular-nums ${
                step.done ? "bg-bosque-700 text-white" : "text-niebla ring-1 ring-inset ring-linea"
              }`}
            >
              {step.done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
            </span>
            <span className="min-w-0">
              <span className={`block text-[15px] font-semibold ${step.done ? "text-tinta" : "text-tinta/75"}`}>{step.title}</span>
              <span className="block text-[13px] leading-snug text-niebla">{step.detail}</span>
            </span>
          </motion.li>
        ))}
      </ol>

      <div role="note" className="mt-6 flex gap-3 rounded-2xl bg-maiz-100 px-4 py-3.5 text-[14px] leading-relaxed text-maiz-800">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          Recuerda que GeoAid es un prototipo universitario: no se cobró nada, esta donación no llegará a ninguna zona y la
          información no salió de tu navegador. En una emergencia, llama al{" "}
          <a href={`tel:${emergencyLine.number}`} className="font-semibold underline underline-offset-2">
            {emergencyLine.number}
          </a>
          .
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <NavLink href={`/donaciones?codigo=${confirmed.code}#seguimiento`} className={button({ size: "md" })}>
          Seguir mi donación
          <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-0.5" aria-hidden />
        </NavLink>
        <NavLink href="/portal" className={button({ variant: "secondary", size: "md" })}>
          <UserRound className="size-4" aria-hidden />
          Ver en Mi portal
        </NavLink>
        <button type="button" onClick={onRestart} className={button({ variant: "ghost", size: "md" })}>
          <RotateCcw className="size-4" aria-hidden />
          Hacer otra donación
        </button>
      </div>

      <div className="mt-8 rounded-[24px] bg-papel p-3 ring-1 ring-inset ring-linea lg:hidden">{receipt}</div>
    </div>
  );
}

/** El círculo se traza y la marca de verificación se dibuja encima */
function AnimatedCheck() {
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="grid size-16 place-items-center rounded-full bg-bosque-50"
    >
      <svg viewBox="0 0 56 56" className="size-16 text-bosque-700" fill="none" stroke="currentColor" aria-hidden>
        <motion.circle
          cx="28"
          cy="28"
          r="26"
          strokeWidth={2.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: easeSalida }}
          style={{ rotate: -90, transformOrigin: "50% 50%" }}
        />
        <motion.path
          d="M18 29.5 25 36.5 39 21"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.55, ease: easeSalida }}
        />
      </svg>
    </motion.span>
  );
}
