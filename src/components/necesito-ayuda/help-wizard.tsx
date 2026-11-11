"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { stepNames } from "@/content/necesito-ayuda";
import { addActivity, newCode } from "@/lib/activity";
import { easeEntrada, easeSalida } from "@/lib/motion";
import {
  FORM_ID,
  emptyDraft,
  firstInvalidStep,
  needsLabels,
  placeLabel,
  stepOrder,
  totalPeople,
  validate,
  type Draft,
  type Errors,
  type StepId,
} from "@/components/necesito-ayuda/draft";
import { IntroStep } from "@/components/necesito-ayuda/intro-step";

/*
 * Asistente de una pregunta por pantalla. La primera pantalla viene en el HTML y pesa poco; el resto de los pasos se
 * baja aparte (y se adelanta en cuanto el navegador queda libre) para que con mala señal la página abra rápido.
 */
const loadLaterSteps = () => import("@/components/necesito-ayuda/later-steps");
const LaterStep = dynamic(() => loadLaterSteps().then((module) => module.LaterStep), {
  loading: () => <StepSkeleton />,
});

const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: easeSalida } },
  exit: (direction: number) => ({ opacity: 0, x: direction * -18, transition: { duration: 0.18, ease: easeEntrada } }),
};

function copyFor(step: StepId, draft: Draft): { title: string; lead: string } {
  const community = draft.forCommunity === true;
  switch (step) {
    case "inicio":
      return { title: "¿Para quién es la ayuda?", lead: "Elige una opción para empezar. Puedes volver atrás sin perder lo que ya respondiste." };
    case "necesidades":
      return {
        title: "¿Qué necesitan?",
        lead: community ? "Marca todo lo que le falta hoy a tu comunidad." : "Marca todo lo que les falta hoy a ti y a tu familia.",
      };
    case "lugar":
      return { title: "¿Dónde están?", lead: "Con el municipio y la vereda o el barrio basta. Si estás ahí ahora, puedes agregar tu ubicación." };
    case "personas":
      return {
        title: "¿Cuántas personas?",
        lead: community
          ? "Cuenta a las personas de la comunidad que necesitan ayuda. Un número aproximado sirve."
          : "Cuéntate a ti y a las personas que viven contigo.",
      };
    case "contacto":
      return { title: "¿Cómo te contactamos?", lead: "Para confirmar la solicitud y avisarte cuando salga la ayuda." };
    case "revision":
      return { title: "Revisa tu solicitud", lead: "Si algo no está bien, toca Editar en ese bloque." };
    case "listo":
      return { title: "Tu solicitud quedó registrada", lead: "Guarda este número: con él la encuentras en Mi portal." };
  }
}

export function HelpWizard() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [step, setStep] = useState<StepId>("inicio");
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  // Al editar desde la revisión, "Continuar" vuelve directo a la revisión
  const [editing, setEditing] = useState(false);
  // El foco solo se mueve después de que la persona avanza; en la primera carga se queda donde está
  const [navigated, setNavigated] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const lenis = useLenis();
  const topRef = useRef<HTMLDivElement>(null);

  const index = stepOrder.indexOf(step);
  const numbered = index >= 1 && index <= stepNames.length ? index : null;
  const copy = copyFor(step, draft);

  // Enter continúa también cuando el foco está en el título de la pregunta (adonde llega al cambiar de paso) o en el
  // fondo. Los campos ya lo hacen solos dentro del formulario; botones, enlaces y listas conservan su Enter.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.defaultPrevented || event.isComposing) return;
      const target = event.target as HTMLElement;
      if (target.closest("a, button, input, select, textarea, [contenteditable]")) return;
      const form = document.getElementById(FORM_ID);
      if (!(form instanceof HTMLFormElement)) return;
      event.preventDefault();
      form.requestSubmit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Adelanta la descarga de los demás pasos cuando el navegador queda libre
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void loadLaterSteps());
    return () => cancel(handle);
  }, []);

  function goTo(next: StepId) {
    setDirection(stepOrder.indexOf(next) >= index ? 1 : -1);
    setErrors({});
    setStep(next);
    setNavigated(true);
    // Si la persona bajó, la nueva pregunta empieza arriba
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) {
      if (lenis) lenis.scrollTo(top, { offset: -150, duration: 0.6 });
      else top.scrollIntoView({ block: "start" });
    }
  }

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
    // El aviso de error se va cuando la persona corrige ese dato
    setErrors((current) => {
      const keys = Object.keys(patch) as (keyof Draft)[];
      if (!keys.some((key) => current[key])) return current;
      const next = { ...current };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  }

  function next() {
    const found = validate(step, draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`#${FORM_ID} [aria-invalid="true"]`)?.focus());
      return;
    }
    if (editing) {
      setEditing(false);
      goTo("revision");
      return;
    }
    goTo(stepOrder[index + 1]);
  }

  function back() {
    goTo(stepOrder[index - 1]);
  }

  function edit(target: StepId) {
    setEditing(true);
    goTo(target);
  }

  function send() {
    // Red de seguridad: si algo quedó incompleto (por ejemplo, al editar), se vuelve a ese paso
    const pending = firstInvalidStep(draft);
    if (pending) {
      edit(pending);
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      const radicado = newCode("NA");
      addActivity({
        kind: "necesidad",
        code: radicado,
        needs: needsLabels(draft),
        place: placeLabel(draft),
        people: totalPeople(draft),
        forCommunity: draft.forCommunity === true,
      });
      setCode(radicado);
      setSending(false);
      goTo("listo");
    }, 1200);
  }

  function restart() {
    setDraft(emptyDraft);
    setCode("");
    setEditing(false);
    goTo("inicio");
  }

  return (
    <div ref={topRef} className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-[780px] flex-col px-5 pt-8 sm:px-8 sm:pt-12">
      {step !== "listo" && <Progress current={numbered} />}

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div key={step} custom={direction} variants={slide} initial="enter" animate="center" exit="exit" className="flex-1">
          <StepTitle focus={navigated}>{copy.title}</StepTitle>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-white/70 sm:text-[18px]">{copy.lead}</p>

          <div className="mt-8">
            {step === "inicio" ? (
              <IntroStep
                chosen={draft.forCommunity}
                onChoose={(forCommunity) => {
                  update({ forCommunity });
                  if (editing) {
                    setEditing(false);
                    goTo("revision");
                  } else goTo("necesidades");
                }}
              />
            ) : (
              <LaterStep step={step} draft={draft} errors={errors} code={code} onChange={update} onNext={next} onEdit={edit} onSend={send} onRestart={restart} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {numbered && (
        <StepNav
          step={step}
          editing={editing}
          sending={sending}
          onBack={back}
        />
      )}
    </div>
  );
}

function StepTitle({ focus, children }: { focus: boolean; children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focus) ref.current?.focus({ preventScroll: true });
  }, [focus]);

  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className="font-display text-[clamp(2.25rem,6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white outline-none text-balance"
    >
      {children}
    </h1>
  );
}

/** Progreso visible y anunciado: "Paso 2 de 5" */
function Progress({ current }: { current: number | null }) {
  const total = stepNames.length;
  return (
    <div className="mb-8 min-h-[3.25rem]">
      <p aria-live="polite" className="sr-only">
        {current ? `Paso ${current} de ${total}: ${stepNames[current - 1]}` : ""}
      </p>
      {!current && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px]">
          <span className="font-semibold text-maiz-400">Necesito ayuda</span>
          <span className="text-white/60">Cinco preguntas, unos tres minutos</span>
        </p>
      )}
      {current && (
        <div aria-hidden>
          <p className="flex items-baseline justify-between gap-3 text-[15px]">
            <span className="font-semibold text-white">
              Paso {current} de {total}
            </span>
            <span className="text-white/60">{stepNames[current - 1]}</span>
          </p>
          <div className="mt-3 flex gap-1.5">
            {stepNames.map((name, i) => (
              <span key={name} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                <motion.span
                  className="block h-full origin-left rounded-full bg-maiz-400"
                  initial={false}
                  animate={{ scaleX: i < current ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: easeSalida }}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Atrás y Continuar, siempre al alcance del pulgar en el celular */
function StepNav({ step, editing, sending, onBack }: { step: StepId; editing: boolean; sending: boolean; onBack: () => void }) {
  const review = step === "revision";
  const label = review ? "Enviar solicitud" : editing ? "Guardar y volver a la revisión" : "Continuar";

  return (
    <div className="sticky bottom-0 z-10 -mx-5 mt-10 bg-gradient-to-t from-bosque-950 from-70% to-bosque-950/0 px-5 pb-5 pt-6 sm:-mx-8 sm:px-8 sm:pb-8">
      <div className="flex items-center gap-3">
        {!editing && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-16 shrink-0 items-center gap-2 rounded-full px-5 text-[17px] font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors duration-300 hover:bg-white/10 hover:ring-white/60 sm:px-7"
          >
            <ArrowLeft className="size-5" aria-hidden />
            Atrás
          </button>
        )}
        <button
          type="submit"
          form={FORM_ID}
          disabled={sending}
          className="group inline-flex h-16 flex-1 items-center justify-center gap-2.5 rounded-full bg-maiz-400 px-7 text-[18px] font-semibold text-bosque-950 transition-[filter,transform] duration-300 hover:brightness-105 active:scale-[0.98] disabled:opacity-70 sm:ml-auto sm:flex-none sm:px-10"
        >
          {sending ? (
            <>
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              {label}
              <ArrowRight className="size-5 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StepSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="h-32 animate-pulse rounded-[22px] bg-white/[0.07]" />
      ))}
    </div>
  );
}
