"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, Info, LoaderCircle, Mail } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { SourceRef } from "@/components/noticias/source-ref";
import { Field, TextInput } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { hitos } from "@/content/noticias";
import { easeSalida } from "@/lib/motion";

type Status = "form" | "sending" | "done";
type Errors = { email?: string; phone?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (value: string) => value.replace(/\D/g, "");
/** La confirmación entra cuando termina la salida del formulario: el foco se le da al montarse. */
const focusOnMount = (node: HTMLElement | null) => {
  node?.focus();
};

/**
 * Suscripción a la bitácora. Es un prototipo: valida, simula el envío y confirma, pero no guarda nada (ni siquiera en
 * este navegador) y lo dice antes y después de enviar.
 */
export function Subscribe() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("form");
  const formRef = useRef<HTMLFormElement>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (!EMAIL.test(email.trim())) next.email = "Revisa el correo: debe verse como nombre@correo.com.";
    if (whatsapp && !/^3\d{9}$/.test(digits(phone))) next.phone = "Escribe un celular de 10 dígitos, por ejemplo 300 123 4567.";
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (next.email || next.phone) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setStatus("done");
  }

  function reset() {
    setEmail("");
    setPhone("");
    setWhatsapp(false);
    setErrors({});
    setStatus("form");
  }

  return (
    <motion.section
      aria-labelledby="suscripcion-titulo"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: 0.1, ease: easeSalida }}
      className="flex flex-col rounded-[28px] bg-white p-6 ring-1 ring-linea sm:p-10"
    >
      <p className="border-b border-tinta/10 pb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-bosque-600">
        Suscripción
      </p>
      <h2
        id="suscripcion-titulo"
        className={`${serif} mt-8 text-[clamp(2rem,3.2vw,2.85rem)] font-normal leading-[1.04] tracking-[-0.02em] text-tinta`}
      >
        Recibe la bitácora
      </h2>

      <AnimatePresence mode="wait" initial={false}>
        {status !== "done" ? (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            className="mt-4 flex flex-1 flex-col"
          >
            <p className="text-[15.5px] leading-relaxed text-niebla">
              Te escribimos cuando haya un hito nuevo, con su fuente. Nada más.
            </p>
            <Preview />

            <div className="mt-6 flex flex-col gap-4">
              <Field label="Correo" error={errors.email}>
                {(props) => (
                  <TextInput
                    {...props}
                    type="email"
                    name="correo"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                )}
              </Field>

              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-2xl px-1 text-[15px] font-medium text-tinta">
                Avisarme también por WhatsApp
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.checked)}
                  className="peer sr-only"
                />
                {/* Interruptor: el input real queda accesible, esto solo lo dibuja */}
                <span
                  aria-hidden
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-maiz-400 ${
                    whatsapp ? "bg-bosque-800" : "bg-linea"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-salida ${
                      whatsapp ? "translate-x-5" : ""
                    }`}
                  />
                </span>
              </label>

              <AnimatePresence initial={false}>
                {whatsapp && (
                  <motion.div
                    key="celular"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: easeSalida }}
                    className="-m-1 overflow-hidden p-1"
                  >
                    <Field label="Celular con WhatsApp" error={errors.phone}>
                      {(props) => (
                        <TextInput
                          {...props}
                          type="tel"
                          name="celular"
                          autoComplete="tel-national"
                          inputMode="numeric"
                          placeholder="300 123 4567"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                        />
                      )}
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Aviso y botón al fondo de la tarjeta, alineados con la de contexto cuando quedan lado a lado */}
            <div className="mt-auto pt-6">
              <p className="flex gap-2.5 rounded-2xl bg-papel px-4 py-3 text-[13px] leading-snug text-niebla">
                <Info className="mt-px size-4 shrink-0 text-bosque-700" aria-hidden />
                GeoAid es un prototipo universitario: no enviamos correos ni mensajes, y lo que escribas no sale de este
                navegador.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className={`${button({ variant: "primary", size: "lg" })} mt-5 w-full`}
              >
                {status === "sending" ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                    Enviando…
                  </>
                ) : (
                  "Suscribirme a la bitácora"
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeSalida }}
            className="mt-6 flex flex-1 flex-col"
          >
            <div className="flex items-start gap-3">
              <CircleCheck className="mt-0.5 size-6 shrink-0 text-bosque-700" aria-hidden />
              <div>
                <h3 ref={focusOnMount} tabIndex={-1} className="text-[17px] font-semibold text-tinta outline-none">
                  Quedaste en la lista
                </h3>
                <p className="mt-1 text-[15px] leading-relaxed text-niebla">
                  Así se vería tu suscripción con <strong className="font-semibold text-tinta">{email.trim()}</strong>
                  {whatsapp && (
                    <>
                      {" "}
                      y el WhatsApp <strong className="font-semibold text-tinta">{phone.trim()}</strong>
                    </>
                  )}
                  .
                </p>
              </div>
            </div>
            <p className="mt-6 flex gap-2.5 rounded-2xl bg-maiz-100 px-4 py-3 text-[13.5px] leading-snug text-maiz-800">
              <Info className="mt-px size-4 shrink-0" aria-hidden />
              Fue una simulación. GeoAid es un prototipo universitario: no te llegarán correos ni mensajes, y tus datos no
              se guardaron en ningún lado.
            </p>
            <button type="button" onClick={reset} className={`${button({ variant: "secondary" })} mt-6 self-start`}>
              Usar otro correo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/** Cómo se ve un aviso: el hito más reciente de la cronología, con su fuente. */
function Preview() {
  const latest = hitos[hitos.length - 1];
  return (
    <figure className="mt-6 rounded-2xl bg-papel p-4 ring-1 ring-inset ring-linea">
      <figcaption className="flex items-center justify-between gap-3 text-[12px] text-niebla">
        <span className="flex items-center gap-1.5 font-semibold text-tinta">
          <Mail className="size-3.5 text-bosque-700" aria-hidden />
          Así llega un aviso
        </span>
        <time dateTime={latest.iso}>
          {latest.fecha.dia} {latest.fecha.mes} {latest.fecha.anio}
        </time>
      </figcaption>
      <p className={`${serif} mt-2.5 text-[19px] leading-[1.25] text-tinta text-balance`}>{latest.titular}</p>
      {latest.fuente && (
        <p className="mt-3">
          <SourceRef id={latest.fuente} />
        </p>
      )}
    </figure>
  );
}
