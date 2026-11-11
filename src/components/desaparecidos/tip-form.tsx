"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Info, LoaderCircle, Phone, X } from "lucide-react";
import { NavLink } from "@/components/transitions/nav-link";
import { ChoiceCard, Field, TextArea, TextInput } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import type { Reporte } from "@/content/desaparecidos";
import { emergencyLine } from "@/content/site";
import { addActivity, newCode } from "@/lib/activity";
import { toKey, useTodayKey } from "@/lib/dates";

/*
 * Contenido del diálogo "¿Sabes algo?": qué sabes, cuándo y dónde, y el contacto (opcional, con opción anónima).
 * Al enviar guarda la pista en "Mi portal" de este navegador y muestra el código. Avisa antes y después que es un
 * prototipo y recuerda la línea 123.
 */

type Contact = "contacto" | "anonimo";
type Errors = Partial<Record<"what" | "when" | "where" | "phone", string>>;
const digits = (value: string) => value.replace(/\D/g, "");

export function TipForm({
  report,
  titleId,
  onClose,
  onLeave,
}: {
  report: Reporte;
  titleId: string;
  onClose: () => void;
  /** cierra sin animación, antes de navegar a otra sección */
  onLeave: () => void;
}) {
  const today = useTodayKey();
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [contact, setContact] = useState<Contact>("contacto");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"form" | "sending" | "done">("form");
  const [code, setCode] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  function validate(): Errors {
    const next: Errors = {};
    if (what.trim().length < 10) next.what = "Cuéntanos un poco más: qué viste o qué sabes, en una frase o más.";
    if (!when) next.when = "Elige el día en que la viste o supiste de ella.";
    else if (when > toKey(new Date())) next.when = "La fecha no puede ser posterior a hoy.";
    if (where.trim().length < 3) next.where = "Escribe el lugar y el municipio, aunque sea aproximado.";
    if (contact === "contacto" && !/^3\d{9}$/.test(digits(phone)))
      next.phone = "Escribe un celular de 10 dígitos, por ejemplo 300 123 4567, o elige enviarla sin tus datos.";
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const saved = addActivity({ kind: "pista", code: newCode("PI"), personName: report.nombre });
    setCode(saved.code);
    setStatus("done");
  }

  const header = (
    <div className="flex items-start justify-between gap-4">
      <p className="pt-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-niebla">
        {status === "done" ? "Pista guardada" : "Dejar una pista"}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-niebla transition-colors hover:bg-papel hover:text-tinta"
      >
        <X className="size-5" aria-hidden />
      </button>
    </div>
  );

  if (status === "done") {
    return (
      <div className="p-6 sm:p-8">
        {header}
        <CircleCheck className="mt-4 size-9 text-bosque-700" aria-hidden />
        <h2 id={titleId} ref={doneRef} tabIndex={-1} className="mt-4 font-display text-[1.75rem] font-medium leading-tight tracking-[-0.03em] outline-none">
          Gracias por contarnos lo que sabes
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-niebla" role="status">
          Tu pista sobre {report.nombre} quedó guardada en este navegador con el código{" "}
          <strong className="font-semibold text-tinta tabular-nums">{code}</strong>.
        </p>
        <PrototypeNotice name={report.nombre} after />
        <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <NavLink href="/portal" onNavigate={onLeave} className={button({ variant: "secondary" })}>
            Ver en Mi portal
          </NavLink>
          <button type="button" onClick={onClose} className={button({ variant: "primary" })}>
            Volver a los reportes
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="p-6 sm:p-8">
      {header}
      <h2 id={titleId} className="mt-2 font-display text-[1.75rem] font-medium leading-tight tracking-[-0.03em] text-balance">
        ¿Sabes algo de {report.nombre}?
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-niebla">
        {report.edad} años, de {report.municipio}. Cualquier detalle sirve, aunque te parezca pequeño.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="¿Qué sabes?" error={errors.what} hint="Por ejemplo: la vi en el albergue del coliseo, llevaba una chaqueta azul.">
          {(props) => (
            <TextArea {...props} data-autofocus name="pista" rows={3} value={what} onChange={(event) => setWhat(event.target.value)} />
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
          <Field label="¿Cuándo?" error={errors.when}>
            {(props) => (
              <TextInput
                {...props}
                type="date"
                name="cuando"
                max={today ?? undefined}
                value={when}
                onChange={(event) => setWhen(event.target.value)}
              />
            )}
          </Field>
          <Field label="¿Dónde?" error={errors.where}>
            {(props) => (
              <TextInput
                {...props}
                name="donde"
                placeholder="Lugar y municipio"
                value={where}
                onChange={(event) => setWhere(event.target.value)}
              />
            )}
          </Field>
        </div>

        <fieldset>
          <legend className="text-[14px] font-semibold text-tinta">Tu contacto</legend>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
            <ChoiceCard
              name="contacto"
              value="contacto"
              checked={contact === "contacto"}
              onChange={() => setContact("contacto")}
              title="Dejar mi celular"
              description="Por si hace falta preguntarte algo"
            />
            <ChoiceCard
              name="contacto"
              value="anonimo"
              checked={contact === "anonimo"}
              onChange={() => setContact("anonimo")}
              title="Enviarla sin mis datos"
              description="La pista llega igual"
            />
          </div>
        </fieldset>

        {contact === "contacto" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tu nombre" optional>
              {(props) => (
                <TextInput {...props} name="nombre" autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} />
              )}
            </Field>
            <Field label="Celular" error={errors.phone}>
              {(props) => (
                <TextInput
                  {...props}
                  type="tel"
                  name="celular"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="300 123 4567"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              )}
            </Field>
          </div>
        )}
      </div>

      <PrototypeNotice name={report.nombre} />

      <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className={button({ variant: "ghost" })}>
          Cancelar
        </button>
        <button type="submit" disabled={status === "sending"} className={button({ variant: "primary" })}>
          {status === "sending" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            "Enviar pista"
          )}
        </button>
      </div>
    </form>
  );
}

/** Aviso de prototipo y de la línea 123, antes de enviar y en la confirmación. */
function PrototypeNotice({ name, after = false }: { name: string; after?: boolean }) {
  return (
    <div className="mt-6 rounded-2xl bg-papel p-4 text-[13.5px] leading-snug text-niebla ring-1 ring-inset ring-linea">
      <p className="flex gap-2.5">
        <Info className="mt-px size-4 shrink-0 text-bosque-700" aria-hidden />
        <span>
          {after
            ? `Recuerda: GeoAid es un prototipo universitario. Tu pista no llegó a ninguna entidad ni a la familia de ${name.replace(/\.$/, "")}.`
            : "GeoAid es un prototipo universitario: tu pista se guarda solo en este navegador y no llega a ninguna entidad ni a la familia."}
        </span>
      </p>
      <a
        href={`tel:${emergencyLine.number}`}
        className="mt-3 flex min-h-11 items-center gap-2.5 rounded-xl bg-white px-3 font-semibold text-tinta ring-1 ring-inset ring-linea transition-colors hover:ring-bosque-200"
      >
        <Phone className="size-4 text-alerta" aria-hidden />
        En una emergencia, llama al {emergencyLine.number}
      </a>
    </div>
  );
}
