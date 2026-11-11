"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowRight, Check, Copy, PencilLine } from "lucide-react";
import { afterSending, conditions } from "@/content/necesito-ayuda";
import { ExampleTag } from "@/components/ui/form";
import { NavLink } from "@/components/transitions/nav-link";
import { easeSalida } from "@/lib/motion";
import { PrototypeNote } from "@/components/necesito-ayuda/controls";
import {
  formatCell,
  needsLabels,
  peopleDetail,
  placeLabel,
  totalPeople,
  type Draft,
  type StepId,
} from "@/components/necesito-ayuda/draft";

export function ReviewStep({ draft, onEdit }: { draft: Draft; onEdit: (step: StepId) => void }) {
  const total = totalPeople(draft);
  const special = conditions.filter((condition) => draft.conditions.includes(condition.id)).map((condition) => condition.label);

  const blocks: { step: StepId; label: string; value: string; details: string[] }[] = [
    {
      step: "inicio",
      label: "Para quién",
      value: draft.forCommunity ? "Para mi comunidad o vereda" : "Para mí o mi familia",
      details: [],
    },
    { step: "necesidades", label: "Qué necesitan", value: needsLabels(draft).join(", "), details: [] },
    {
      step: "lugar",
      label: "Dónde están",
      value: placeLabel(draft),
      details: [draft.reference.trim() && `Referencia: ${draft.reference.trim()}`, draft.location ? "Ubicación agregada" : ""].filter(Boolean),
    },
    {
      step: "personas",
      label: "Cuántas personas",
      value: total === 1 ? "1 persona" : `${total} personas`,
      details: [peopleDetail(draft), special.length ? `Atención especial: ${special.join(", ").toLowerCase()}` : ""].filter(Boolean),
    },
    {
      step: "contacto",
      label: "Contacto",
      value: draft.name.trim(),
      details: draft.noPhone
        ? ["No tiene celular", `Contacto: ${draft.contactName.trim()}, ${formatCell(draft.contactPhone)}`]
        : [formatCell(draft.phone)],
    },
  ];

  return (
    <>
      <dl className="overflow-hidden rounded-[26px] bg-white text-tinta">
        {blocks.map((block) => (
          <div key={block.step} className="flex items-start justify-between gap-4 border-b border-linea px-5 py-4 last:border-b-0 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-niebla">{block.label}</dt>
              <dd className="mt-1 text-[18px] font-semibold leading-snug break-words">{block.value}</dd>
              {block.details.map((detail) => (
                <dd key={detail} className="mt-0.5 text-[15.5px] leading-snug text-niebla break-words">
                  {detail}
                </dd>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onEdit(block.step)}
              aria-label={`Editar ${block.label.toLowerCase()}`}
              className="-mr-2 inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full px-4 text-[16px] font-semibold text-bosque-700 transition-colors hover:bg-bosque-50"
            >
              <PencilLine className="size-4" aria-hidden />
              Editar
            </button>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <PrototypeNote>
          <strong className="font-semibold text-white">Antes de enviar:</strong> GeoAid es un prototipo universitario. Esta
          solicitud no llega a ninguna entidad y no genera una entrega real. Si estás en peligro o alguien está herido, llama al{" "}
          <a href="tel:123" className="font-semibold text-maiz-400 underline underline-offset-4">
            123
          </a>
          .
        </PrototypeNote>
      </div>
    </>
  );
}

const timeline: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } };
const entry: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSalida } },
};

export function DoneStep({ draft, code, onRestart }: { draft: Draft; code: string; onRestart: () => void }) {
  const [copied, setCopied] = useState(false);
  const total = totalPeople(draft);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Sin permiso para el portapapeles: se selecciona el número para copiarlo a mano
      const node = document.getElementById("radicado");
      if (node) window.getSelection()?.selectAllChildren(node);
    }
  }

  return (
    <>
      <div className="rounded-[26px] bg-white p-5 text-tinta sm:p-7">
        <p className="text-[15px] font-semibold text-niebla">Número de solicitud</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
          <p id="radicado" className="font-display text-[clamp(2.75rem,10vw,4.25rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums text-bosque-800">
            {code}
          </p>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-bosque-50 px-6 text-[17px] font-semibold text-bosque-800 transition-colors hover:bg-bosque-100"
          >
            {copied ? <Check className="size-5" strokeWidth={2.5} aria-hidden /> : <Copy className="size-5" aria-hidden />}
            <span aria-live="polite">{copied ? "Copiado" : "Copiar número"}</span>
          </button>
        </div>
        <p className="mt-5 border-t border-linea pt-4 text-[16px] leading-relaxed text-niebla">
          {needsLabels(draft).join(", ")} · {placeLabel(draft)} · {total === 1 ? "1 persona" : `${total} personas`}
        </p>
      </div>

      <div className="mt-4">
        <PrototypeNote>
          <strong className="font-semibold text-white">Esta solicitud quedó guardada solo en este navegador.</strong> GeoAid es un
          prototipo universitario: no llegó a ninguna entidad y nadie va a enviar una entrega por ella. Si estás en peligro o
          alguien está herido, llama al{" "}
          <a href="tel:123" className="font-semibold text-maiz-400 underline underline-offset-4">
            123
          </a>
          .
        </PrototypeNote>
      </div>

      <section aria-labelledby="que-pasa-titulo" className="mt-10">
        <h2 id="que-pasa-titulo" className="flex flex-wrap items-center gap-3 font-display text-[clamp(1.5rem,3.4vw,2rem)] font-semibold tracking-[-0.03em] text-white">
          Qué pasaría ahora
          <ExampleTag tone="dark">Así funcionaría</ExampleTag>
        </h2>
        <motion.ol variants={timeline} initial="hidden" animate="show" className="relative mt-6 grid gap-5">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-white/15" />
          {afterSending.map((item, i) => (
            <motion.li key={item.title} variants={entry} className="relative flex gap-4">
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-bosque-800 font-display text-[17px] font-semibold text-maiz-400 ring-4 ring-bosque-950">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="text-[18px] font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-[16px] leading-relaxed text-white/70">{item.body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      <div className="mt-10 flex flex-col gap-3 pb-12 sm:flex-row">
        <NavLink
          href="/portal"
          className="group inline-flex h-16 items-center justify-center gap-2.5 rounded-full bg-maiz-400 px-8 text-[18px] font-semibold text-bosque-950 transition-[filter] duration-300 hover:brightness-105"
        >
          Ver en Mi portal
          <ArrowRight className="size-5 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
        </NavLink>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-16 items-center justify-center rounded-full px-8 text-[17px] font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors duration-300 hover:bg-white/10"
        >
          Hacer otra solicitud
        </button>
      </div>
    </>
  );
}
