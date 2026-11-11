"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, SearchX } from "lucide-react";
import { TrackingTicket, type TicketStep } from "@/components/donaciones/tracking-ticket";
import { ExampleTag, Field, TextInput } from "@/components/ui/form";
import { button, eyebrow, sectionTitle } from "@/components/ui/styles";
import { trackingDemo } from "@/content/site";
import { useActivity, type DonationRecord } from "@/lib/activity";
import { fechaCorta, fechaHora, pesos } from "@/lib/format";
import { addDays } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";

/** Acepta "ga24817", "GA 24817" o "#GA-24817" y devuelve "GA-24817"; `null` si no tiene la forma de un código */
function normalize(input: string) {
  const match = input.trim().toUpperCase().replace(/\s+/g, "").match(/^#?(?:GA)?-?(\d{5})$/);
  return match ? `GA-${match[1]}` : null;
}

const formatError = "Escríbelo como aparece en tu comprobante: GA- y cinco números, por ejemplo GA-24817.";

/** Lee `?codigo=` de la URL. Va dentro de <Suspense> porque la URL solo se conoce en el navegador. */
export function TrackingFromParams() {
  const code = useSearchParams().get("codigo");
  return <TrackingLookup key={code ?? ""} initialCode={code} />;
}

/**
 * Sigue tu donación. GA-24817 es el ejemplo con su recorrido completo; las donaciones hechas en este navegador
 * aparecen como recibidas, con su fecha real, y el resto de pasos pendientes. El resultado se anuncia con aria-live.
 */
export function TrackingLookup({ initialCode }: { initialCode: string | null }) {
  const activity = useActivity();
  const donations = (activity ?? []).filter((record): record is DonationRecord => record.kind === "donacion");
  const initial = initialCode ? normalize(initialCode) : null;

  const [input, setInput] = useState(initial ?? initialCode ?? "");
  const [code, setCode] = useState<string | null>(initial);
  const [error, setError] = useState<string | undefined>(initialCode && !initial ? formatError : undefined);

  function search(value: string) {
    const normalized = normalize(value);
    if (!value.trim()) {
      setError("Escribe el código de tu donación.");
      return;
    }
    if (!normalized) {
      setError(formatError);
      return;
    }
    setError(undefined);
    setInput(normalized);
    setCode(normalized);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search(input);
  }

  const record = code ? donations.find((donation) => donation.code === code) : undefined;
  const state: "idle" | "demo" | "loading" | "session" | "unknown" = !code
    ? "idle"
    : code === trackingDemo.code
      ? "demo"
      : record
        ? "session"
        : activity === null
          ? "loading"
          : "unknown";

  return (
    <div className="grid overflow-hidden rounded-[32px] bg-white ring-1 ring-linea lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="p-6 sm:p-10 lg:p-12">
        <p className={eyebrow}>Seguimiento</p>
        <h2 id="seguimiento-titulo" className={`mt-3 ${sectionTitle}`}>
          Sigue tu donación
        </h2>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-niebla">
          Escribe el código de tu comprobante y mira en qué va: recibida, comprada, en camino o entregada.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8">
          <Field label="Código de seguimiento" hint="Está en tu comprobante y empieza por GA-" error={error}>
            {(props) => (
              <div className="flex gap-2">
                <TextInput
                  {...props}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="GA-00000"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="min-w-0 flex-1 font-medium uppercase tracking-[0.04em] tabular-nums"
                />
                <button type="submit" className={button({ size: "md" })}>
                  <Search className="size-4" aria-hidden />
                  Buscar
                </button>
              </div>
            )}
          </Field>
        </form>

        <div className="mt-8 border-t border-linea pt-6">
          <p className="text-[13px] font-medium text-niebla">¿No tienes un código a mano?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => search(trackingDemo.code)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-papel px-4 text-[13.5px] font-medium text-tinta ring-1 ring-inset ring-linea transition-colors hover:ring-bosque-200"
            >
              Ver el ejemplo <span className="font-semibold tabular-nums">{trackingDemo.code}</span>
            </button>
            {donations.slice(0, 3).map((donation) => (
              <button
                key={donation.id}
                type="button"
                onClick={() => search(donation.code)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-bosque-50 px-4 text-[13.5px] font-medium text-bosque-800 ring-1 ring-inset ring-bosque-200 transition-colors hover:bg-bosque-100"
              >
                Tu donación <span className="font-semibold tabular-nums">{donation.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex items-center bg-bosque-900 p-4 sm:p-8 lg:min-h-[34rem] lg:p-10">
        <div aria-live="polite" className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${state}-${code ?? ""}`}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, ease: easeSalida }}
              className="mx-auto w-full max-w-[34rem]"
            >
              <Result state={state} code={code} record={record} onDemo={() => search(trackingDemo.code)} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Result({
  state,
  code,
  record,
  onDemo,
}: {
  state: "idle" | "demo" | "loading" | "session" | "unknown";
  code: string | null;
  record?: DonationRecord;
  onDemo: () => void;
}) {
  switch (state) {
    case "idle":
      return (
        <div className="rounded-[24px] border border-dashed border-white/25 p-6 text-white sm:p-8">
          <p className="font-display text-[22px] font-semibold tracking-[-0.02em]">Aquí verás por dónde va</p>
          <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-white/65">
            Cada donación pasa por cuatro paradas. Al buscar tu código ves cuáles ya cumplió y cuándo.
          </p>
          <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {trackingDemo.stops.map((stop, i) => (
              <li key={stop} className="rounded-2xl bg-white/[0.06] px-3 py-3 ring-1 ring-inset ring-white/10">
                <span className="text-[12px] font-semibold text-maiz-400 tabular-nums">{i + 1}</span>
                <span className="mt-1 block text-[13px] leading-snug text-white/80">{stop}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "demo": {
      const steps: TicketStep[] = trackingDemo.steps.map((step) => ({ ...step, done: true }));
      return (
        <TrackingTicket
          tag={<ExampleTag>Ejemplo de seguimiento</ExampleTag>}
          code={trackingDemo.code}
          amount={trackingDemo.amount}
          destination={trackingDemo.destination}
          stops={trackingDemo.stops}
          steps={steps}
          note="Así se ve una donación que ya llegó: cada parada con su hora y el punto donde se entregó."
        />
      );
    }

    case "session": {
      if (!record) return null;
      const created = new Date(record.createdAt);
      const steps: TicketStep[] = [
        { title: "Donación recibida", detail: `Por ${record.method}`, time: fechaHora(record.createdAt), done: true },
        {
          title: "Comprada y empacada",
          detail: `Cerca de la zona, antes del ${fechaCorta(addDays(created, 2))}`,
          time: "Pendiente",
          done: false,
        },
        { title: "En camino", detail: "Aquí verás la ruta cuando salga", time: "Pendiente", done: false },
        { title: "Entregada", detail: "Con el día, el punto y las familias", time: "Pendiente", done: false },
      ];
      return (
        <TrackingTicket
          tag={
            <span className="rounded-full bg-bosque-50 px-3 py-1 text-[12px] font-semibold text-bosque-800">
              Hecha en este navegador
            </span>
          }
          code={record.code}
          amount={`${pesos(record.amount)}${record.frequency === "mensual" ? " al mes" : ""}`}
          destination={record.destination}
          stops={trackingDemo.stops}
          steps={steps}
          note="Es una donación de prueba: GeoAid es un prototipo universitario, no se cobró nada y no llegará a ninguna zona."
        />
      );
    }

    case "loading":
      return <div className="h-[26rem] animate-pulse rounded-[24px] bg-white/10" />;

    case "unknown":
      return (
        <div className="rounded-[24px] bg-white p-6 text-tinta sm:p-8">
          <span className="grid size-11 place-items-center rounded-2xl bg-papel text-bosque-700">
            <SearchX className="size-5" aria-hidden />
          </span>
          <p className="mt-4 font-display text-[22px] font-semibold tracking-[-0.02em]">
            No encontramos el código <span className="tabular-nums">{code}</span>
          </p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-niebla">
            Revisa que esté igual que en tu comprobante. En este prototipo, las donaciones solo quedan guardadas en el
            navegador donde las hiciste.
          </p>
          <button type="button" onClick={onDemo} className={`mt-5 ${button({ variant: "secondary", size: "sm" })}`}>
            Ver el ejemplo {trackingDemo.code}
          </button>
        </div>
      );
  }
}
