"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Download, HandHeart, Info } from "lucide-react";
import { BlockTitle, InviteCard, OriginTag } from "@/components/portal/bits";
import type { DonationItem, PortalData } from "@/components/portal/portal-data";
import { StepTimeline } from "@/components/portal/steps";
import { button } from "@/components/ui/styles";
import { fechaSimple } from "@/components/voluntariado/fechas";
import { portalCopy } from "@/content/portal";
import { pesos } from "@/lib/format";
import { easeSalida } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

function status(donation: DonationItem) {
  if (donation.reached === donation.steps.length - 1) return { label: "Entregada", tone: "bg-bosque-50 text-bosque-800" };
  if (donation.reached > 0) return { label: "En camino", tone: "bg-maiz-100 text-maiz-800" };
  return { label: "Recibida", tone: "bg-papel text-tinta/70 ring-1 ring-inset ring-linea" };
}

/**
 * Donaciones: lista a la izquierda y detalle con su seguimiento a la derecha. En móvil el detalle se abre debajo
 * de la donación elegida, para no perder el lugar en la lista.
 */
export function DonationsTab({ data }: { data: PortalData }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [chosen, setChosen] = useState<string | null>(null);
  const selected = data.donations.find((d) => d.key === chosen) ?? data.donations[0];
  const hasSession = data.donations.some((d) => d.session);

  return (
    <div className="flex flex-col gap-6">
      {!hasSession && (
        <InviteCard
          icon={HandHeart}
          title="Tu próxima donación aparece aquí"
          body="Con su código y su seguimiento, desde que se recibe hasta que se entrega."
          actions={[{ label: "Donar", href: "/donar" }]}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section aria-labelledby="donaciones-lista">
          <BlockTitle id="donaciones-lista" aside={`${data.donations.length} en total`}>
            Tus donaciones
          </BlockTitle>
          <ul className="mt-4 flex flex-col gap-2.5">
            {data.donations.map((donation) => {
              const active = donation.key === selected.key;
              const state = status(donation);
              return (
                <li key={donation.key}>
                  <button
                    type="button"
                    aria-expanded={desktop ? undefined : active}
                    aria-current={desktop && active ? "true" : undefined}
                    onClick={() => setChosen(donation.key)}
                    className={`flex w-full items-center gap-4 rounded-[22px] bg-white p-4 text-left ring-inset transition-[box-shadow] duration-300 sm:p-5 ${
                      active ? "ring-2 ring-bosque-600" : "ring-1 ring-linea hover:ring-bosque-200"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="font-display text-[22px] font-semibold tabular-nums tracking-[-0.03em] text-tinta">
                          {pesos(donation.amount)}
                        </span>
                        {donation.frequency === "mensual" && <span className="text-[13px] text-niebla">al mes</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-[14px] text-niebla">{donation.destination}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${state.tone}`}>{state.label}</span>
                        <span className="text-[12.5px] tabular-nums text-niebla">
                          {donation.code} · {fechaSimple(new Date(donation.date))}
                        </span>
                      </span>
                      {donation.session && (
                        <span className="mt-2 block">
                          <OriginTag session />
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      className={`size-5 shrink-0 text-niebla transition-transform duration-500 ease-salida ${
                        active ? "text-bosque-700 max-lg:rotate-90 lg:translate-x-0.5" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                  {!desktop && active && <DonationDetail donation={donation} />}
                </li>
              );
            })}
          </ul>
        </section>

        {desktop && (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait" initial={false}>
              <DonationDetail key={selected.key} donation={selected} />
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function DonationDetail({ donation }: { donation: DonationItem }) {
  const [notice, setNotice] = useState(false);
  const total = donation.steps.length;

  return (
    <motion.article
      aria-label={`Donación ${donation.code}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={{ duration: 0.5, ease: easeSalida }}
      className="mt-2.5 rounded-[28px] bg-white p-5 ring-1 ring-linea sm:p-6 lg:mt-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-semibold tabular-nums text-niebla">#{donation.code}</span>
        <OriginTag session={donation.session} />
      </div>
      <p className="mt-3 font-display text-[clamp(2.25rem,4vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] text-tinta">
        {pesos(donation.amount)}
      </p>
      <p className="mt-1.5 text-[15px] text-niebla">{donation.destination}</p>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-linea py-4 text-[13.5px]">
        <div>
          <dt className="text-niebla">Fecha</dt>
          <dd className="mt-0.5 font-medium text-tinta">{fechaSimple(new Date(donation.date))}</dd>
        </div>
        <div>
          <dt className="text-niebla">Medio</dt>
          <dd className="mt-0.5 font-medium text-tinta">{donation.method}</dd>
        </div>
        <div>
          <dt className="text-niebla">Frecuencia</dt>
          <dd className="mt-0.5 font-medium text-tinta">{donation.frequency === "mensual" ? "Mensual" : "Única"}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-papel">
          <motion.div
            className="h-full origin-left rounded-full bg-bosque-700"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (donation.reached + 1) / total }}
            transition={{ duration: 0.9, delay: 0.15, ease: easeSalida }}
          />
        </div>
        <StepTimeline steps={donation.steps} reached={donation.reached} />
      </div>

      {donation.session && (
        <p className="mt-5 flex gap-2 rounded-2xl bg-papel px-4 py-3 text-[13.5px] leading-snug text-niebla">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {portalCopy.sessionPending}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-linea pt-5">
        <button type="button" onClick={() => setNotice(true)} className={`${button({ variant: "secondary", size: "sm" })} self-start`}>
          <Download className="size-4" aria-hidden />
          Descargar certificado
        </button>
        <div aria-live="polite">
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 rounded-2xl bg-maiz-100 px-4 py-3 text-[13.5px] leading-snug text-maiz-800"
            >
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {portalCopy.certificate}
            </motion.p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
