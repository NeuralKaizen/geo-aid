"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useInView, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Confirmation } from "@/components/donar/confirmation";
import { MobileSummary } from "@/components/donar/mobile-summary";
import {
  amountFromParam,
  amountOf,
  destinationFromParams,
  methodLabel,
  resolveDestination,
  validate,
  type Draft,
  type Errors,
} from "@/components/donar/options";
import { PrintedReceipt, ReceiptPaper, type Confirmed } from "@/components/donar/receipt";
import { StepAmount } from "@/components/donar/step-amount";
import { StepDestination } from "@/components/donar/step-destination";
import { StepDetails } from "@/components/donar/step-details";
import { StepPayment } from "@/components/donar/step-payment";
import { Stepper } from "@/components/donar/stepper";
import { button } from "@/components/ui/styles";
import { trackingDemo } from "@/content/site";
import { addActivity, newCode, useActivity } from "@/lib/activity";
import { pesos } from "@/lib/format";
import { easeEntrada, easeSalida } from "@/lib/motion";

const CONFIRMATION = 4;

const continueLabels = ["Continuar con el monto", "Continuar con tus datos", "Continuar al pago"];

/* Cada paso entra desde el lado hacia el que se avanza y sale hacia el contrario */
const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: easeSalida } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -20,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: easeEntrada },
  }),
};

function emptyDraft(destination: string, amount: Pick<Draft, "amount" | "custom">): Draft {
  return {
    destination,
    ...amount,
    frequency: "unica",
    anonymous: false,
    name: "",
    email: "",
    certificate: false,
    method: null,
  };
}

/**
 * El pago completo: cuatro pasos que validan antes de seguir, el recibo que se llena a la derecha y la confirmación.
 * Lee `?zona=`, `?destino=` y `?monto=` para llegar con todo preseleccionado; por eso va dentro de <Suspense>. Si la
 * URL cambia estando aquí (otro destino desde el menú), el formulario empieza de nuevo con lo que trae.
 */
export function Checkout() {
  const params = useSearchParams();
  return <CheckoutFlow key={params.toString()} params={params} />;
}

function CheckoutFlow({ params }: { params: URLSearchParams }) {
  const activity = useActivity();
  const [draft, setDraft] = useState<Draft>(() =>
    emptyDraft(destinationFromParams(params.get("zona"), params.get("destino")), amountFromParam(params.get("monto"))),
  );
  const [amountKnown] = useState(() => Boolean(params.get("monto")));
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [direction, setDirection] = useState(1);
  const [navigated, setNavigated] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const areaInView = useInView(areaRef, { margin: "0px 0px -90px 0px" });

  const amount = amountOf(draft);
  const receipt = { draft, visited: furthest, amountKnown, confirmed };

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
    // Un error se borra en cuanto la persona toca el campo que lo causó
    setErrors((current) => {
      const next = { ...current };
      if ("amount" in patch || "custom" in patch) delete next.amount;
      if ("name" in patch || "anonymous" in patch) delete next.name;
      if ("email" in patch) delete next.email;
      if ("certificate" in patch || "anonymous" in patch) delete next.certificate;
      if ("method" in patch) delete next.method;
      return next;
    });
  }

  /**
   * Lleva la tarjeta del formulario a la vista si quedó arriba, sin saltos si ya se ve. Con scroll nativo y no con
   * Lenis: en pantallas táctiles Lenis no maneja el scroll y calcularía el destino desde una posición vieja. El
   * espacio para la barra flotante lo da scroll-padding-top.
   */
  function revealCard() {
    const card = cardRef.current;
    if (!card || card.getBoundingClientRect().top > 72) return;
    card.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function goTo(next: number) {
    setDirection(next >= step ? 1 : -1);
    setStep(next);
    setFurthest((current) => Math.max(current, next));
    setNavigated(true);
    setErrors({});
    revealCard();
  }

  /** Valida el paso; si falla, deja los errores a la vista y pone el foco en el primer campo con problema */
  function check(current: number) {
    const found = validate(current, draft);
    setErrors(found);
    if (Object.keys(found).length === 0) return true;
    requestAnimationFrame(() => {
      const card = cardRef.current;
      const field = card?.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (field) field.focus();
      else card?.querySelector<HTMLElement>('[role="alert"]')?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return false;
  }

  async function confirm() {
    if (!check(3) || submitting) return;
    setSubmitting(true);
    // No hay pasarela: una espera corta para que el "Confirmando…" se alcance a leer
    await new Promise((resolve) => window.setTimeout(resolve, 1300));

    const taken = new Set([trackingDemo.code, ...(activity ?? []).map((record) => record.code)]);
    let code = newCode("GA");
    while (taken.has(code)) code = newCode("GA");

    const destination = resolveDestination(draft.destination);
    const method = methodLabel(draft.method) ?? "PSE";
    const saved = addActivity({
      kind: "donacion",
      code,
      amount,
      destination: destination.record,
      method,
      frequency: draft.frequency,
    });
    setConfirmed({
      code: saved.code,
      createdAt: saved.createdAt,
      amount,
      destination,
      frequency: draft.frequency,
      method,
      donor: draft.anonymous ? "Anónimo" : draft.name.trim(),
    });
    setSubmitting(false);
    goTo(CONFIRMATION);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 3) void confirm();
    else if (step < 3 && check(step)) goTo(step + 1);
  }

  function restart() {
    // Se conservan el nombre y el correo: es la misma persona
    setDraft((current) => ({ ...emptyDraft(current.destination, amountFromParam(null)), name: current.name, email: current.email }));
    setConfirmed(null);
    setFurthest(0);
    goTo(0);
  }

  return (
    <div ref={areaRef} className="mx-auto mt-10 grid max-w-[1240px] items-start gap-10 px-5 pb-10 sm:px-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-12 lg:px-10 lg:pb-0 xl:gap-16">
      <form
        ref={cardRef}
        onSubmit={onSubmit}
        noValidate
        aria-label="Donar"
        className="min-w-0 overflow-hidden rounded-[28px] bg-white ring-1 ring-linea"
      >
        {step < CONFIRMATION && <Stepper current={step} furthest={furthest} onGo={goTo} />}

        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div key={step} custom={direction} variants={slide} initial="enter" animate="center" exit="exit">
              {step === 0 && (
                <StepDestination draft={draft} onChange={(destination) => update({ destination })} focusOnMount={navigated} />
              )}
              {step === 1 && <StepAmount draft={draft} errors={errors} onChange={update} focusOnMount={navigated} />}
              {step === 2 && <StepDetails draft={draft} errors={errors} onChange={update} focusOnMount={navigated} />}
              {step === 3 && <StepPayment draft={draft} errors={errors} onChange={update} focusOnMount={navigated} />}
              {step === CONFIRMATION && confirmed && (
                <Confirmation confirmed={confirmed} onRestart={restart} receipt={<ReceiptPaper {...receipt} />} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < CONFIRMATION && (
          <div className="flex items-center justify-between gap-3 border-t border-linea bg-papel/50 px-5 py-4 sm:px-8 lg:px-10">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="group -ml-4 inline-flex h-12 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-bosque-800 transition-colors duration-300 hover:bg-bosque-50"
              >
                <ArrowLeft className="size-4 transition-transform duration-500 ease-salida group-hover:-translate-x-0.5" aria-hidden />
                Atrás
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button type="submit" className={button({ size: "md" })}>
                {continueLabels[step]}
                <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-0.5" aria-hidden />
              </button>
            ) : (
              <button type="submit" disabled={submitting} aria-busy={submitting} className={button({ variant: "accent", size: "md" })}>
                {submitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                    Confirmando…
                  </>
                ) : (
                  <>
                    Confirmar donación de {pesos(amount)}
                    {draft.frequency === "mensual" ? " al mes" : ""}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </form>

      <aside aria-label="Resumen de tu aporte" className="hidden lg:sticky lg:top-24 lg:block">
        <PrintedReceipt {...receipt} />
      </aside>

      <MobileSummary {...receipt} visible={areaInView} />
    </div>
  );
}
