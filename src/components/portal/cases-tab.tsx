"use client";

import { motion } from "motion/react";
import { ClipboardPen, Info } from "lucide-react";
import { BlockTitle, InviteCard, kindIcons, OriginTag } from "@/components/portal/bits";
import type { PortalData } from "@/components/portal/portal-data";
import { StepBar } from "@/components/portal/steps";
import { caseKinds, portalCopy } from "@/content/portal";
import { easeSalida } from "@/lib/motion";

/** Necesidades, reportes de personas desaparecidas, pistas y puntos de acopio, cada uno con sus pasos de estado. */
export function CasesTab({ data }: { data: PortalData }) {
  const hasSession = data.cases.some((item) => item.session);

  return (
    <div className="flex flex-col gap-6">
      {!hasSession && (
        <InviteCard
          icon={ClipboardPen}
          title="¿Sabes de una comunidad que necesita ayuda?"
          body="Registra lo que le falta, reporta a una persona desaparecida o abre un punto de acopio. Aquí ves en qué va."
          actions={[
            { label: "Registrar una necesidad", href: "/necesito-ayuda" },
            { label: "Reportar a una persona", href: "/desaparecidos" },
            { label: "Registrar un punto", href: "/centros-de-acopio" },
          ]}
        />
      )}

      <section aria-labelledby="casos-titulo">
        <BlockTitle id="casos-titulo" aside={`${data.cases.length} ${data.cases.length === 1 ? "registro" : "registros"}`}>
          Lo que registraste
        </BlockTitle>
        <ul className="mt-4 flex flex-col gap-3">
          {data.cases.map((item, i) => {
            const Icon = kindIcons[item.kind];
            return (
              <motion.li
                key={item.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: easeSalida }}
                className={`rounded-[24px] bg-white p-5 sm:p-6 ${item.session ? "ring-2 ring-bosque-600" : "ring-1 ring-linea"}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-bosque-50 text-bosque-700">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-niebla">
                      <span className="font-semibold uppercase tracking-[0.1em] text-bosque-600">{caseKinds[item.kind].label}</span>
                      <span className="tabular-nums">#{item.code}</span>
                    </p>
                    <h4 className="mt-1 font-display text-[19px] font-semibold leading-snug tracking-[-0.02em] text-tinta">{item.title}</h4>
                    <p className="mt-0.5 text-[14px] leading-snug text-niebla">{item.detail}</p>
                  </div>
                  <span className="hidden shrink-0 sm:block">
                    <OriginTag session={item.session} />
                  </span>
                </div>
                <span className="mt-3 block sm:hidden">
                  <OriginTag session={item.session} />
                </span>

                <div className="mt-5 rounded-2xl bg-papel px-3 pb-3 pt-4 sm:px-4">
                  <StepBar steps={item.steps} reached={item.reached} />
                </div>
                {item.session && (
                  <p className="mt-3 flex gap-2 text-[13px] leading-snug text-niebla">
                    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    {portalCopy.sessionPending}
                  </p>
                )}
              </motion.li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
