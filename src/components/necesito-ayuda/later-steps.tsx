"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle, LocateFixed, MapPinCheck } from "lucide-react";
import { departments, needs, type NeedId } from "@/content/necesito-ayuda";
import { Select, TextInput } from "@/components/ui/form";
import { fieldBox } from "@/components/ui/styles";
import { NavLink } from "@/components/transitions/nav-link";
import { easeSalida } from "@/lib/motion";
import { big, FieldError, LargeField } from "@/components/necesito-ayuda/controls";
import { ContactStep, PeopleStep } from "@/components/necesito-ayuda/people-contact";
import { DoneStep, ReviewStep } from "@/components/necesito-ayuda/review-done";
import { FORM_ID, type StepId, type StepProps } from "@/components/necesito-ayuda/draft";

/*
 * Pasos 1 a 5 y la confirmación. Este módulo se baja aparte de la primera pantalla (ver help-wizard.tsx).
 */

const reveal = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSalida } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export function LaterStep({
  step,
  draft,
  errors,
  code,
  onChange,
  onNext,
  onEdit,
  onSend,
  onRestart,
}: StepProps & {
  step: StepId;
  code: string;
  onNext: () => void;
  onEdit: (step: StepId) => void;
  onSend: () => void;
  onRestart: () => void;
}) {
  const props = { draft, errors, onChange };
  switch (step) {
    case "necesidades":
      return (
        <StepForm onSubmit={onNext}>
          <NeedsStep {...props} />
        </StepForm>
      );
    case "lugar":
      return (
        <StepForm onSubmit={onNext}>
          <PlaceStep {...props} />
        </StepForm>
      );
    case "personas":
      return (
        <StepForm onSubmit={onNext}>
          <PeopleStep {...props} />
        </StepForm>
      );
    case "contacto":
      return (
        <StepForm onSubmit={onNext}>
          <ContactStep {...props} />
        </StepForm>
      );
    case "revision":
      return (
        <StepForm onSubmit={onSend}>
          <ReviewStep draft={draft} onEdit={onEdit} />
        </StepForm>
      );
    case "listo":
      return <DoneStep draft={draft} code={code} onRestart={onRestart} />;
    default:
      return null;
  }
}

/** Cada pantalla es un formulario: Enter continúa, también con el foco en una casilla */
function StepForm({ onSubmit, children }: { onSubmit: () => void; children: ReactNode }) {
  return (
    <form
      id={FORM_ID}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      onKeyDown={(event) => {
        const target = event.target;
        if (event.key === "Enter" && target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
      }}
    >
      {children}
    </form>
  );
}

function NeedsStep({ draft, errors, onChange }: StepProps) {
  const toggle = (id: NeedId) =>
    onChange({ needs: draft.needs.includes(id) ? draft.needs.filter((need) => need !== id) : [...draft.needs, id] });

  return (
    <>
      <fieldset aria-describedby={errors.needs ? "necesidades-error" : undefined}>
        <legend className="sr-only">Lo que necesitan</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {needs.map((need) => {
            const checked = draft.needs.includes(need.id);
            return (
              <label
                key={need.id}
                className={`relative flex min-h-[8.25rem] cursor-pointer flex-col justify-between gap-4 rounded-[22px] p-4 transition-[background-color,transform] duration-300 active:scale-[0.98] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-maiz-400 sm:min-h-[9rem] ${
                  checked ? "bg-maiz-400 text-bosque-950" : "bg-white text-tinta hover:bg-bosque-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggle(need.id)}
                  aria-invalid={errors.needs ? true : undefined}
                />
                <span className="flex items-start justify-between">
                  <span
                    className={`grid size-11 place-items-center rounded-2xl transition-colors duration-300 ${
                      checked ? "bg-bosque-950 text-maiz-400" : "bg-bosque-50 text-bosque-800"
                    }`}
                  >
                    <need.icon className="size-[22px]" aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className={`grid size-7 place-items-center rounded-full transition-colors duration-300 ${
                      checked ? "bg-bosque-950 text-maiz-400" : "ring-2 ring-inset ring-linea"
                    }`}
                  >
                    {checked && <Check className="size-4" strokeWidth={3} />}
                  </span>
                </span>
                <span className="text-[17px] font-semibold leading-tight sm:text-[18px]">{need.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {errors.needs && (
        <div className="mt-4">
          <FieldError id="necesidades-error">{errors.needs}</FieldError>
        </div>
      )}

      <AnimatePresence initial={false}>
        {draft.needs.includes("buscar") && (
          <motion.div key="buscar" {...reveal} className="mt-6 rounded-[22px] bg-white/[0.07] p-5 ring-1 ring-inset ring-white/12">
            <p className="text-[17px] font-semibold text-white">Para buscar a alguien hay un reporte aparte</p>
            <p className="mt-1 text-[16px] leading-relaxed text-white/70">
              Ahí se verifica y se publica solo con el nombre, la inicial del apellido y el municipio, para que otras personas avisen si saben algo. Se abre en otra pestaña y lo
              que llevas aquí no se pierde.
            </p>
            <NavLink
              href="/desaparecidos#reportar"
              target="_blank"
              className="mt-4 inline-flex h-14 items-center gap-2 rounded-full bg-white px-6 text-[17px] font-semibold text-bosque-900 transition-colors duration-300 hover:bg-maiz-400"
            >
              Reportar a una persona desaparecida
              <ArrowUpRight className="size-5" aria-hidden />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </NavLink>
          </motion.div>
        )}
        {draft.needs.includes("otra") && (
          <motion.div key="otra" {...reveal} className="mt-6">
            <LargeField label="¿Qué otra cosa necesitan?" error={errors.otherNeed}>
              {(props) => (
                <textarea
                  {...props}
                  rows={3}
                  value={draft.otherNeed}
                  onChange={(event) => onChange({ otherNeed: event.target.value })}
                  placeholder="Por ejemplo: una carpa para la escuela, leche para bebé"
                  className={`${fieldBox} resize-none py-3.5 text-[17px]! leading-relaxed`}
                />
              )}
            </LargeField>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PlaceStep({ draft, errors, onChange }: StepProps) {
  return (
    <div className="grid max-w-xl gap-6">
      <LargeField label="Departamento" error={errors.department}>
        {(props) => (
          <Select {...props} value={draft.department} onChange={(event) => onChange({ department: event.target.value })} className={big}>
            <option value="" disabled>
              Elige el departamento
            </option>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </Select>
        )}
      </LargeField>
      <LargeField label="Municipio" error={errors.municipality}>
        {(props) => (
          <TextInput
            {...props}
            value={draft.municipality}
            onChange={(event) => onChange({ municipality: event.target.value })}
            autoComplete="address-level2"
            className={big}
          />
        )}
      </LargeField>
      <LargeField label="Vereda o barrio" hint="Si no sabes el nombre, describe el lugar." error={errors.area}>
        {(props) => (
          <TextInput {...props} value={draft.area} onChange={(event) => onChange({ area: event.target.value })} className={big} />
        )}
      </LargeField>
      <LargeField label="Un punto de referencia" hint="Por ejemplo: al lado de la escuela, frente a la tienda." optional>
        {(props) => (
          <TextInput {...props} value={draft.reference} onChange={(event) => onChange({ reference: event.target.value })} className={big} />
        )}
      </LargeField>
      <LocationButton draft={draft} onChange={onChange} />
    </div>
  );
}

type LocateStatus = "quieto" | "buscando" | "negado" | "error" | "sin-soporte";

const locateMessages: Partial<Record<LocateStatus, string>> = {
  negado:
    "No diste permiso para usar tu ubicación, y está bien. Con el municipio y la vereda o el barrio podemos ubicarte. Si cambias de idea, actívalo en los ajustes del navegador.",
  error: "No pudimos encontrar tu ubicación, quizá por la señal. Con el municipio y la vereda o el barrio basta.",
  "sin-soporte": "Este navegador no comparte la ubicación. Con el municipio y la vereda o el barrio basta.",
};

/** "Usar mi ubicación": opcional, y si la persona no da permiso no pasa nada */
function LocationButton({ draft, onChange }: Omit<StepProps, "errors">) {
  const [status, setStatus] = useState<LocateStatus>("quieto");

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("sin-soporte");
      return;
    }
    setStatus("buscando");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        onChange({ location: { lat: latitude, lng: longitude, accuracy } });
        setStatus("quieto");
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? "negado" : "error"),
      // Sin alta precisión: responde más rápido y gasta menos batería, y para ubicar una vereda alcanza
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 },
    );
  }

  return (
    <div aria-live="polite">
      {draft.location ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-white/[0.07] p-4 ring-1 ring-inset ring-brote-300/40">
          <p className="flex items-center gap-3">
            <MapPinCheck className="size-6 shrink-0 text-brote-300" aria-hidden />
            <span>
              <span className="block text-[17px] font-semibold text-white">Ubicación agregada</span>
              <span className="block text-[14.5px] text-white/65">Con una precisión de unos {Math.max(5, Math.round(draft.location.accuracy))} metros</span>
            </span>
          </p>
          <button
            type="button"
            onClick={() => onChange({ location: null })}
            className="inline-flex h-12 items-center rounded-full px-5 text-[16px] font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10"
          >
            Quitar
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={locate}
            disabled={status === "buscando"}
            className="inline-flex h-14 items-center gap-2.5 rounded-full px-6 text-[17px] font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors duration-300 hover:bg-white/10 hover:ring-white/70 disabled:opacity-70"
          >
            {status === "buscando" ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
            ) : (
              <LocateFixed className="size-5" aria-hidden />
            )}
            {status === "buscando" ? "Buscando tu ubicación…" : "Usar mi ubicación"}
          </button>
          {locateMessages[status] ? (
            <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/75">{locateMessages[status]}</p>
          ) : (
            <p className="mt-3 text-[15px] text-white/55">Es opcional. Solo se usa para esta solicitud.</p>
          )}
        </>
      )}
    </div>
  );
}
