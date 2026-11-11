"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, CircleCheck, Info, LoaderCircle } from "lucide-react";
import { serif } from "@/components/noticias/fonts";
import { Field, FilterChip, TextInput } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { emergencias } from "@/content/noticias";
import { easeSalida } from "@/lib/motion";

type Errors = { follow?: string; email?: string; phone?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (value: string) => value.replace(/\D/g, "");
const abiertas = emergencias.filter((emergencia) => emergencia.estado !== "seguimiento");
/** La confirmación recibe el foco al montarse (función estable: no vuelve a enfocar en cada render). */
const focusOnMount = (node: HTMLElement | null) => node?.focus();

/**
 * Alertas por emergencia: eliges cuáles seguir y por dónde te avisamos. Es un prototipo: valida, simula el envío y
 * confirma, pero no guarda nada, y lo dice antes y después de enviar.
 */
export function Alerts({ selected }: { selected: string }) {
  const [follow, setFollow] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"form" | "sending" | "done">("form");
  const formRef = useRef<HTMLFormElement>(null);

  // Hasta que la persona elige, se propone la emergencia que está mirando
  const following = touched ? follow : abiertas.some((emergencia) => emergencia.id === selected) ? [selected] : [];

  function toggle(id: string) {
    setTouched(true);
    setFollow(following.includes(id) ? following.filter((item) => item !== id) : [...following, id]);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (following.length === 0) next.follow = "Elige al menos una emergencia.";
    if (!EMAIL.test(email.trim())) next.email = "Revisa el correo: debe verse como nombre@correo.com.";
    if (whatsapp && !/^3\d{9}$/.test(digits(phone))) next.phone = "Escribe un celular de 10 dígitos que empiece por 3.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("done");
  }

  const names = abiertas.filter((emergencia) => following.includes(emergencia.id)).map((emergencia) => emergencia.nombre);

  return (
    <section aria-labelledby="alertas" className="mx-auto mt-20 max-w-[1240px] px-5 sm:px-8 lg:mt-28 lg:px-10">
      <div className="grid gap-10 overflow-hidden rounded-[32px] bg-bosque-900 p-6 text-white sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:p-14">
        <div>
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-maiz-400">
            <BellRing className="size-4" aria-hidden />
            Alertas
          </p>
          <h2 id="alertas" className={`${serif} mt-4 text-[clamp(2.1rem,3.6vw,3.1rem)] font-medium leading-[1.03] tracking-[-0.02em]`}>
            Entérate cuando algo cambie
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/75">
            Elige las emergencias que quieres seguir. Te avisamos cuando haya una noticia nueva, con su fuente, o cuando cambie
            lo que hace falta.
          </p>
          <p className="mt-8 flex max-w-md items-start gap-2.5 text-[13px] leading-snug text-white/55">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            GeoAid es un prototipo universitario: no envía alertas ni guarda tus datos.
          </p>
        </div>

        <div className="rounded-[24px] bg-papel p-6 text-tinta sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {status === "done" ? (
              <motion.div
                key="listo"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeSalida }}
                tabIndex={-1}
                ref={focusOnMount}
                className="outline-none"
              >
                <CircleCheck className="size-10 text-bosque-600" aria-hidden />
                <p className={`${serif} mt-4 text-[28px] font-medium leading-tight`}>Listo, así quedarían tus alertas</p>
                <p className="mt-3 text-[15px] leading-relaxed text-niebla">
                  Te avisaríamos a <strong className="text-tinta">{email.trim()}</strong>
                  {whatsapp ? " y por WhatsApp" : ""} sobre: {names.join(", ")}.
                </p>
                <p className="mt-5 rounded-2xl bg-maiz-100/70 px-4 py-3 text-[13px] leading-snug text-maiz-800">
                  Como es un prototipo, no se envió ni se guardó nada.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("form");
                    setEmail("");
                    setPhone("");
                    setWhatsapp(false);
                  }}
                  className={`${button({ variant: "secondary", size: "sm" })} mt-6`}
                >
                  Cambiar mis alertas
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="formulario"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col gap-6"
              >
                <fieldset aria-describedby={errors.follow ? "alertas-error" : undefined}>
                  <legend className="text-[14px] font-semibold">Emergencias que quieres seguir</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {abiertas.map((emergencia) => (
                      <FilterChip key={emergencia.id} pressed={following.includes(emergencia.id)} onClick={() => toggle(emergencia.id)}>
                        {emergencia.nombre}
                        {emergencia.ejemplo && <span className="text-[11px] opacity-70">(ejemplo)</span>}
                      </FilterChip>
                    ))}
                  </div>
                  {errors.follow && (
                    <p id="alertas-error" role="alert" className="mt-2 text-[13px] font-medium text-alerta">
                      {errors.follow}
                    </p>
                  )}
                </fieldset>

                <Field label="Correo" error={errors.email}>
                  {(props) => (
                    <TextInput
                      {...props}
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@correo.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  )}
                </Field>

                <label className="flex cursor-pointer items-center justify-between gap-4 text-[14px] font-semibold">
                  Avisarme también por WhatsApp
                  <input
                    type="checkbox"
                    checked={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className="relative h-7 w-12 shrink-0 rounded-full bg-linea transition-colors duration-300 peer-checked:bg-bosque-800 peer-focus-visible:ring-2 peer-focus-visible:ring-maiz-400 after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5"
                  />
                </label>

                {whatsapp && (
                  <Field label="Celular" hint="10 dígitos, por ejemplo 300 123 4567." error={errors.phone}>
                    {(props) => (
                      <TextInput
                        {...props}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                      />
                    )}
                  </Field>
                )}

                <button type="submit" disabled={status === "sending"} className={button({ variant: "primary" })}>
                  {status === "sending" ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden />
                      Activando…
                    </>
                  ) : (
                    "Activar alertas"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
