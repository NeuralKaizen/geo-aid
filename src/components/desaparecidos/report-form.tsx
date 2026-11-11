"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, CircleCheck, Info, LoaderCircle, Phone } from "lucide-react";
import {
  ContactStep,
  PersonStep,
  PlaceStep,
  emptyReport,
  stepNames,
  validateStep,
  type ReportData,
  type ReportErrors,
} from "@/components/desaparecidos/report-steps";
import { NavLink } from "@/components/transitions/nav-link";
import { button } from "@/components/ui/styles";
import { emergencyLine } from "@/content/site";
import { addActivity, newCode } from "@/lib/activity";
import { toKey } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";

const stepTitles = ["La persona que buscas", "Dónde y cuándo la vieron", "Tus datos"];
const LAST = stepNames.length - 1;

type Done = { code: string; name: string; phone: string };

/**
 * Reportar a una persona en tres pasos, con progreso, atrás y siguiente. Cada paso se valida antes de avanzar y el
 * foco va al título del paso nuevo (o al primer campo con error). Al final se guarda en "Mi portal" de este navegador.
 */
export function ReportForm() {
  const [data, setData] = useState<ReportData>(emptyReport);
  const [errors, setErrors] = useState<ReportErrors>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const lenis = useLenis();

  /*
   * Tras cambiar de paso o terminar, el foco va al título nuevo (no en la primera carga). Se hace en el ref del
   * título porque el paso nuevo se monta cuando termina la salida del anterior, no en el mismo render.
   */
  const focusHeading = useCallback((node: HTMLHeadingElement | null) => {
    if (node && moved.current) node.focus({ preventScroll: true });
  }, []);

  // Y si la tarjeta quedó arriba de la pantalla (pasos largos en el celular), se trae de vuelta
  useEffect(() => {
    if (!moved.current) return;
    const card = cardRef.current;
    if (card && card.getBoundingClientRect().top < 72) {
      if (lenis) lenis.scrollTo(card, { offset: -104 });
      else card.scrollIntoView({ block: "start" });
    }
  }, [step, done, lenis]);

  function set<K extends keyof ReportData>(field: K, value: ReportData[K]) {
    setData((current) => ({ ...current, [field]: value }));
    // El error de un campo se borra en cuanto la persona lo corrige
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function go(next: number) {
    moved.current = true;
    setDirection(next > step ? 1 : -1);
    setErrors({});
    setStep(next);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    const next = validateStep(step, data, toKey(new Date()));
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      requestAnimationFrame(() => {
        const form = formRef.current;
        const target =
          form?.querySelector<HTMLElement>('[aria-invalid="true"]') ?? form?.querySelector<HTMLElement>('input[name="consentimiento"]');
        target?.focus();
      });
      return;
    }
    if (step < LAST) {
      go(step + 1);
      return;
    }
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const name = data.nombre.trim();
    const saved = addActivity({
      kind: "reporte",
      code: newCode("DS"),
      personName: name,
      place: `${data.municipio.trim()}, ${data.departamento}`,
    });
    moved.current = true;
    setSending(false);
    setDone({ code: saved.code, name, phone: data.celular.trim() });
  }

  function restart() {
    moved.current = true;
    setData(emptyReport);
    setErrors({});
    setDirection(-1);
    setStep(0);
    setDone(null);
  }

  return (
    <section id="reportar" aria-labelledby="reportar-titulo" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pt-28 sm:px-8 lg:px-10 lg:pt-36">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-niebla">Reportar</p>
          <h2
            id="reportar-titulo"
            className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-tinta text-balance"
          >
            Reportar a una persona
          </h2>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-niebla">
            Te tomará unos tres minutos. Entre más detalles nos des, más fácil será reconocerla.
          </p>
          <div className="mt-8 max-w-md rounded-[20px] bg-white p-5 ring-1 ring-linea">
            <p className="flex gap-2.5 text-[14px] leading-relaxed text-niebla">
              <Info className="mt-0.5 size-4 shrink-0 text-bosque-700" aria-hidden />
              <span>
                <strong className="font-semibold text-tinta">Antes de empezar:</strong> GeoAid es un prototipo
                universitario. Este reporte no llega a ninguna entidad ni inicia una búsqueda.
              </span>
            </p>
            <EmergencyLink />
          </div>
        </div>

        <div ref={cardRef} className="rounded-[28px] bg-white p-6 ring-1 ring-linea sm:p-10">
          {done ? (
            <Confirmation done={done} headingRef={focusHeading} onRestart={restart} />
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby="reportar-titulo">
              <Progress step={step} />

              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.fieldset
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -12, transition: { duration: 0.16 } }}
                  transition={{ duration: 0.45, ease: easeSalida }}
                  className="mt-8"
                >
                  <legend className="sr-only">
                    Paso {step + 1} de {stepNames.length}: {stepTitles[step]}
                  </legend>
                  <p className="text-[13px] text-niebla" aria-hidden>
                    Paso {step + 1} de {stepNames.length}
                  </p>
                  <h3
                    ref={focusHeading}
                    tabIndex={-1}
                    className="mb-6 mt-1 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-tinta outline-none"
                  >
                    {stepTitles[step]}
                  </h3>
                  {step === 0 && <PersonStep data={data} errors={errors} set={set} />}
                  {step === 1 && <PlaceStep data={data} errors={errors} set={set} />}
                  {step === 2 && (
                    <>
                      <ContactStep data={data} errors={errors} set={set} />
                      <div className="mt-6 rounded-2xl bg-papel p-4 text-[13.5px] leading-snug text-niebla ring-1 ring-inset ring-linea">
                        <p className="flex gap-2.5">
                          <Info className="mt-px size-4 shrink-0 text-bosque-700" aria-hidden />
                          Al enviarlo, el reporte se guarda solo en este navegador: GeoAid es un prototipo universitario y
                          no lo recibe ninguna entidad.
                        </p>
                        <EmergencyLink compact />
                      </div>
                    </>
                  )}
                </motion.fieldset>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-linea pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => go(step - 1)} className={button({ variant: "ghost" })}>
                    <ArrowLeft className="size-4 transition-transform duration-500 ease-salida group-hover:-translate-x-1" aria-hidden />
                    Atrás
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" disabled={sending} className={button({ variant: "primary" })}>
                  {sending ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden />
                      Enviando…
                    </>
                  ) : step < LAST ? (
                    <>
                      Siguiente
                      <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
                    </>
                  ) : (
                    "Enviar reporte"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <ol aria-label="Pasos del reporte" className="grid grid-cols-3 gap-2.5">
      {stepNames.map((name, i) => (
        <li key={name} aria-current={i === step ? "step" : undefined} className="min-w-0">
          <span aria-hidden className="block h-1 overflow-hidden rounded-full bg-linea">
            <motion.span
              className="block h-full origin-left rounded-full bg-bosque-800"
              initial={false}
              animate={{ scaleX: i <= step ? 1 : 0 }}
              transition={{ duration: 0.6, ease: easeSalida }}
            />
          </span>
          <span className={`mt-2.5 block text-[13px] leading-snug ${i === step ? "font-semibold text-tinta" : "text-niebla"}`}>
            <span className="tabular-nums">{i + 1}.</span> {name}
            {i < step && <span className="sr-only"> (completo)</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function EmergencyLink({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={`tel:${emergencyLine.number}`}
      className={`flex min-h-11 items-center gap-2.5 rounded-xl font-semibold text-tinta ring-1 ring-inset ring-linea transition-colors hover:ring-bosque-200 ${
        compact ? "mt-3 bg-white px-3 text-[13.5px]" : "mt-4 bg-papel px-3.5 text-[14.5px]"
      }`}
    >
      <Phone className="size-4 text-alerta" aria-hidden />
      En una emergencia, llama al {emergencyLine.number}
    </a>
  );
}

function Confirmation({
  done,
  headingRef,
  onRestart,
}: {
  done: Done;
  headingRef: React.RefCallback<HTMLHeadingElement>;
  onRestart: () => void;
}) {
  const nextSteps = [
    "Verificaríamos el reporte con las autoridades antes de publicarlo.",
    "Lo publicaríamos sin tus datos: solo el nombre con la inicial del apellido, la edad y el municipio.",
    `Te avisaríamos al ${done.phone} si alguien deja una pista o hay un reencuentro.`,
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeSalida }}>
      <CircleCheck className="size-10 text-bosque-700" aria-hidden />
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-niebla">Reporte guardado</p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-[clamp(1.75rem,2.6vw,2.2rem)] font-medium leading-tight tracking-[-0.03em] text-tinta outline-none text-balance"
      >
        Guardamos el reporte de {done.name}
      </h3>
      <p role="status" className="mt-3 text-[15.5px] leading-relaxed text-niebla">
        Su código es <strong className="font-semibold text-tinta tabular-nums">{done.code}</strong>. Lo encuentras en Mi
        portal, en este navegador.
      </p>

      <div className="mt-6 rounded-2xl bg-papel p-4 text-[14px] leading-snug text-niebla ring-1 ring-inset ring-linea">
        <p className="flex gap-2.5">
          <Info className="mt-px size-4 shrink-0 text-bosque-700" aria-hidden />
          <span>
            <strong className="font-semibold text-tinta">Recuerda:</strong> GeoAid es un prototipo universitario. Este
            reporte no llegó a ninguna entidad. Para que las autoridades busquen a {done.name}, haz también el reporte
            llamando al {emergencyLine.number}.
          </span>
        </p>
        <EmergencyLink compact />
      </div>

      <h4 className="mt-8 text-[15px] font-semibold text-tinta">Lo que pasaría después</h4>
      <ol className="mt-3 space-y-3">
        {nextSteps.map((text, i) => (
          <li key={text} className="flex gap-3 text-[15px] leading-snug text-niebla">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-bosque-50 text-[12px] font-semibold text-bosque-800 tabular-nums">
              {i + 1}
            </span>
            <span className="pt-0.5">{text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-2.5 border-t border-linea pt-6 sm:flex-row">
        <NavLink href="/portal" className={button({ variant: "primary" })}>
          Ver en Mi portal
          <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
        </NavLink>
        <button type="button" onClick={onRestart} className={button({ variant: "secondary" })}>
          Hacer otro reporte
        </button>
      </div>
    </motion.div>
  );
}
