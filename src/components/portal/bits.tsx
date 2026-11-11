"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardPen,
  HandHeart,
  Lightbulb,
  SearchCheck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { portalCopy } from "@/content/portal";
import type { ActivityKind } from "@/lib/activity";
import { easeSalida } from "@/lib/motion";

export const kindIcons: Record<ActivityKind, LucideIcon> = {
  donacion: HandHeart,
  turno: CalendarCheck,
  necesidad: ClipboardPen,
  reporte: SearchCheck,
  pista: Lightbulb,
  punto: Warehouse,
};

/** Marca de lo que hizo la persona en esta sesión. */
export function SessionBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bosque-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-bosque-800 ring-1 ring-inset ring-bosque-100">
      <span aria-hidden className="size-1.5 rounded-full bg-maiz-400" />
      {portalCopy.sessionBadge}
    </span>
  );
}

/** Lo de la sesión lleva su marca; lo demás es de la historia de ejemplo. */
export function OriginTag({ session }: { session: boolean }) {
  return session ? <SessionBadge /> : <ExampleTag />;
}

/** Estado vacío que invita a hacer algo: aparece mientras no haya nada de la sesión en esa pestaña. */
export function InviteCard({
  icon: Icon,
  title,
  body,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  actions: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-dashed border-bosque-200 bg-white/50 p-5 sm:flex-row sm:items-center sm:p-6">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-maiz-100 text-maiz-800">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[18px] font-semibold tracking-[-0.02em] text-tinta">{title}</p>
        <p className="mt-0.5 text-[14.5px] leading-snug text-niebla">{body}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, i) => (
          <NavLink key={action.href} href={action.href} className={button({ variant: i === 0 ? "primary" : "secondary", size: "sm" })}>
            {action.label}
            {i === 0 && (
              <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

/**
 * Confirmación en línea para acciones que borran algo. El foco va a "No" (la opción segura) para que Enter no
 * borre por accidente.
 */
export function ConfirmInline({
  question,
  confirmLabel,
  cancelLabel = "No, dejarlo así",
  tone = "light",
  onConfirm,
  onCancel,
}: {
  question: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "light" | "dark";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const safe = useRef<HTMLButtonElement>(null);
  useEffect(() => safe.current?.focus(), []);

  return (
    <motion.div
      role="alertdialog"
      aria-label={typeof question === "string" ? question : confirmLabel}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeSalida }}
      className={`rounded-2xl p-4 ${tone === "light" ? "bg-alerta/[0.06] ring-1 ring-inset ring-alerta/20" : "bg-white/[0.08] ring-1 ring-inset ring-white/15"}`}
    >
      <p className={`text-[14px] leading-snug ${tone === "light" ? "text-tinta" : "text-white/85"}`}>{question}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-10 items-center rounded-full bg-alerta px-4 text-[14px] font-semibold text-white transition-[filter] hover:brightness-110"
        >
          {confirmLabel}
        </button>
        <button
          ref={safe}
          type="button"
          onClick={onCancel}
          className={button({ variant: tone === "light" ? "secondary" : "outlineLight", size: "sm" })}
        >
          {cancelLabel}
        </button>
      </div>
    </motion.div>
  );
}

/** Título de un bloque dentro de una pestaña. */
export function BlockTitle({ children, aside, id }: { children: ReactNode; aside?: ReactNode; id?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 id={id} className="font-display text-[22px] font-semibold tracking-[-0.025em] text-tinta">
        {children}
      </h3>
      {aside && <p className="text-[14px] text-niebla">{aside}</p>}
    </div>
  );
}
