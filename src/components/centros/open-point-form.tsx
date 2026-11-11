"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Info, LoaderCircle } from "lucide-react";
import { cities, items, scheduleDays, type ItemId } from "@/content/centros";
import { addActivity, newCode } from "@/lib/activity";
import { Field, Select, TextInput } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { NavLink } from "@/components/transitions/nav-link";
import { easeSalida } from "@/lib/motion";

type Draft = {
  name: string;
  address: string;
  barrio: string;
  city: string;
  otherCity: string;
  accepts: ItemId[];
  days: string;
  from: string;
  to: string;
  phone: string;
};

type Errors = Partial<Record<keyof Draft, string>>;

const empty: Draft = {
  name: "",
  address: "",
  barrio: "",
  city: "",
  otherCity: "",
  accepts: [],
  days: scheduleDays[0],
  from: "08:00",
  to: "17:00",
  phone: "",
};

const OTHER = "otra";

function validate(draft: Draft): Errors {
  const errors: Errors = {};
  if (draft.name.trim().length < 3) errors.name = "Escribe cómo se llama el punto, por ejemplo «Garaje de los Muñoz».";
  if (draft.address.trim().length < 5) errors.address = "Escribe la dirección para que la gente llegue.";
  if (!draft.barrio.trim()) errors.barrio = "Escribe el barrio o la vereda.";
  if (!draft.city) errors.city = "Elige la ciudad o el municipio.";
  if (draft.city === OTHER && !draft.otherCity.trim()) errors.otherCity = "Escribe el municipio.";
  if (draft.accepts.length === 0) errors.accepts = "Marca al menos una cosa que puedas recibir.";
  if (!draft.from || !draft.to || draft.from >= draft.to) errors.to = "La hora de cierre debe ser después de la de apertura.";
  if (!/^3\d{9}$/.test(draft.phone.replace(/\D/g, ""))) errors.phone = "Escribe los 10 números del celular, sin el +57.";
  return errors;
}

/** "08:00" → "8:00 a. m." */
function hora(value: string) {
  const [h, m] = value.split(":").map(Number);
  if (h === 12 && m === 0) return "12:00 m.";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

export function OpenPointForm() {
  const [draft, setDraft] = useState<Draft>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"editando" | "enviando" | "listo">("editando");
  const [code, setCode] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    // El error se va apenas la persona corrige ese campo
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const cityName = draft.city === OTHER ? draft.otherCity.trim() : (cities.find((city) => city.id === draft.city)?.name ?? "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Lleva el foco al primer campo con error, después de que se pinten los mensajes
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus("enviando");
    window.setTimeout(() => {
      const next = newCode("PA");
      addActivity({ kind: "punto", code: next, name: draft.name.trim(), place: `${draft.barrio.trim()}, ${cityName}` });
      setCode(next);
      setStatus("listo");
    }, 1100);
  }

  return (
    <div className="self-start rounded-[28px] bg-white p-5 text-tinta shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "listo" ? (
          <motion.div
            key="listo"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easeSalida } }}
            role="status"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-bosque-800 text-white">
              <Check className="size-6" strokeWidth={2.5} aria-hidden />
            </span>
            <h3 className="mt-5 font-display text-[clamp(1.6rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">
              Registraste {draft.name.trim()}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-niebla">
              {draft.barrio.trim()}, {cityName} · {draft.days.toLowerCase()}, de {hora(draft.from)} a {hora(draft.to)}
            </p>
            <div className="mt-6 rounded-2xl bg-papel px-5 py-4">
              <p className="text-[13px] font-medium text-niebla">Código de registro</p>
              <p className="mt-1 font-display text-[32px] font-semibold tabular-nums tracking-[-0.02em] text-bosque-800">{code}</p>
            </div>
            <PrototypeNotice done />
            <div className="mt-6 flex flex-wrap gap-2.5">
              <NavLink href="/portal" className={button({ variant: "primary" })}>
                Ver en Mi portal
                <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setDraft(empty);
                  setStatus("editando");
                }}
                className={button({ variant: "secondary" })}
              >
                Registrar otro punto
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            onSubmit={submit}
            noValidate
            aria-labelledby="registro-punto-titulo"
          >
            <h3 id="registro-punto-titulo" className="font-display text-[clamp(1.5rem,2.4vw,1.85rem)] font-semibold tracking-[-0.03em]">
              Registra tu punto
            </h3>
            <p className="mt-1 text-[15px] text-niebla">Toma dos minutos. Todos los campos son necesarios.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Nombre del punto" hint="Como lo reconocen en el barrio." error={errors.name}>
                  {(props) => (
                    <TextInput {...props} value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Garaje de los Muñoz" />
                  )}
                </Field>
              </div>
              <Field label="Dirección" error={errors.address}>
                {(props) => (
                  <TextInput
                    {...props}
                    value={draft.address}
                    onChange={(e) => set("address", e.target.value)}
                    autoComplete="street-address"
                    placeholder="Cra. 6 # 2N-24"
                  />
                )}
              </Field>
              <Field label="Barrio o vereda" error={errors.barrio}>
                {(props) => <TextInput {...props} value={draft.barrio} onChange={(e) => set("barrio", e.target.value)} />}
              </Field>
              <div className={draft.city === OTHER ? "" : "sm:col-span-2"}>
                <Field label="Ciudad o municipio" error={errors.city}>
                  {(props) => (
                    <Select {...props} value={draft.city} onChange={(e) => set("city", e.target.value)}>
                      <option value="" disabled>
                        Elige una
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                      <option value={OTHER}>Otro municipio</option>
                    </Select>
                  )}
                </Field>
              </div>
              {draft.city === OTHER && (
                <Field label="¿Cuál municipio?" error={errors.otherCity}>
                  {(props) => <TextInput {...props} value={draft.otherCity} onChange={(e) => set("otherCity", e.target.value)} />}
                </Field>
              )}
            </div>

            <fieldset className="mt-6" aria-describedby={errors.accepts ? "recibe-error" : undefined}>
              <legend className="text-[14px] font-semibold text-tinta">¿Qué puedes recibir?</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {items.map((item) => {
                  const checked = draft.accepts.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-maiz-400 ${
                        checked ? "bg-bosque-800 text-white" : "bg-papel text-tinta/85 ring-1 ring-inset ring-linea hover:ring-bosque-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={(e) =>
                          set("accepts", e.target.checked ? [...draft.accepts, item.id] : draft.accepts.filter((id) => id !== item.id))
                        }
                        aria-invalid={errors.accepts ? true : undefined}
                      />
                      {checked && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                      {item.label}
                    </label>
                  );
                })}
              </div>
              {errors.accepts && (
                <p id="recibe-error" role="alert" className="mt-2 text-[13px] font-medium text-alerta">
                  {errors.accepts}
                </p>
              )}
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <Field label="Días">
                {(props) => (
                  <Select {...props} value={draft.days} onChange={(e) => set("days", e.target.value)}>
                    {scheduleDays.map((days) => (
                      <option key={days}>{days}</option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Abre a las">
                {(props) => <TextInput {...props} type="time" value={draft.from} onChange={(e) => set("from", e.target.value)} />}
              </Field>
              <Field label="Cierra a las" error={errors.to}>
                {(props) => <TextInput {...props} type="time" value={draft.to} onChange={(e) => set("to", e.target.value)} />}
              </Field>
            </div>

            <div className="mt-4 sm:max-w-[calc(50%-0.5rem)]">
              <Field label="Celular del responsable" hint="Solo para confirmar el punto. No se publica." error={errors.phone}>
                {(props) => <PhoneInput {...props} value={draft.phone} onChange={(value) => set("phone", value)} />}
              </Field>
            </div>

            <PrototypeNotice />

            <button
              type="submit"
              disabled={status === "enviando"}
              className={`${button({ variant: "primary", size: "lg" })} mt-5 w-full sm:w-auto`}
            >
              {status === "enviando" ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : (
                <>
                  Registrar mi punto
                  <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhoneInput({
  value,
  onChange,
  ...props
}: { value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <TextInput
      {...props}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      placeholder="300 123 4567"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function PrototypeNotice({ done = false }: { done?: boolean }) {
  return (
    <p className="mt-6 flex gap-3 rounded-2xl bg-maiz-100 px-4 py-3.5 text-[14px] leading-snug text-maiz-800">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">GeoAid es un prototipo universitario.</strong>{" "}
        {done
          ? "Este registro quedó guardado solo en este navegador: no llegó a ninguna junta ni alcaldía y tu punto no aparece en el mapa."
          : "Este registro no llega a ninguna junta ni alcaldía y tu punto no aparecerá en el mapa."}{" "}
        En una emergencia, llama al 123.
      </span>
    </p>
  );
}
