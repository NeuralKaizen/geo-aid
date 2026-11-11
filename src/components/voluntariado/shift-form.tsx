"use client";

import { useRef, useState } from "react";
import { ArrowRight, Info, LoaderCircle, ShieldCheck } from "lucide-react";
import { ChoiceCard, Field, TextInput } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { prototypeNotice, safetyTips } from "@/content/voluntariado";

export type ShiftFormValues = { name: string; phone: string; firstTime: boolean };

type Errors = Partial<Record<"name" | "phone" | "firstTime" | "safety", string>>;

/** Celular colombiano: 10 dígitos que empiezan por 3. Se aceptan espacios y guiones al escribirlo. */
const onlyDigits = (value: string) => value.replace(/\D/g, "");

function validate(name: string, phone: string, firstTime: boolean | null, safety: boolean): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Escribe tu nombre para que te reconozcan al llegar.";
  const digits = onlyDigits(phone);
  if (!digits) errors.phone = "Escribe tu celular para enviarte la confirmación.";
  else if (!/^3\d{9}$/.test(digits)) errors.phone = "Debe tener 10 dígitos y empezar por 3, por ejemplo 300 123 4567.";
  if (firstTime === null) errors.firstTime = "Cuéntanos si es tu primera vez.";
  if (!safety) errors.safety = "Para tomar el turno debes aceptar las recomendaciones de seguridad.";
  return errors;
}

const fieldSelectors = {
  name: "input[autocomplete='name']",
  phone: "input[type='tel']",
  firstTime: "input[name='primera-vez']",
  safety: "input[name='seguridad']",
};

/** Datos para tomar el turno. Los errores aparecen después del primer intento y se corrigen en vivo. */
export function ShiftForm({ sending, onSubmit }: { sending: boolean; onSubmit: (values: ShiftFormValues) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [firstTime, setFirstTime] = useState<boolean | null>(null);
  const [safety, setSafety] = useState(false);
  const [tried, setTried] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = tried ? validate(name, phone, firstTime, safety) : {};

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    const found = validate(name, phone, firstTime, safety);
    setTried(true);
    const first = (["name", "phone", "firstTime", "safety"] as const).find((key) => found[key]);
    if (first) {
      // Lleva el foco al primer campo con problema para que se lea su error
      formRef.current?.querySelector<HTMLElement>(fieldSelectors[first])?.focus();
      return;
    }
    onSubmit({ name: name.trim(), phone: onlyDigits(phone), firstTime: firstTime === true });
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Tu nombre" error={errors.name}>
        {(props) => (
          <TextInput
            {...props}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Como quieres que te llamen"
          />
        )}
      </Field>

      <Field label="Celular" hint="10 dígitos, empieza por 3. Ahí te llegaría la confirmación." error={errors.phone}>
        {(props) => (
          <span className="relative block">
            <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-niebla">
              +57
            </span>
            <TextInput
              {...props}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={14}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))}
              placeholder="300 123 4567"
              className="pl-[3.25rem] tabular-nums"
            />
          </span>
        )}
      </Field>

      <fieldset aria-describedby={errors.firstTime ? "primera-vez-error" : undefined}>
        <legend className="mb-1.5 text-[14px] font-semibold text-tinta">¿Es tu primera vez como voluntario?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <ChoiceCard
            name="primera-vez"
            value="si"
            checked={firstTime === true}
            onChange={() => setFirstTime(true)}
            title="Sí, es la primera"
            description="Te ponemos con alguien que ya sabe"
          />
          <ChoiceCard
            name="primera-vez"
            value="no"
            checked={firstTime === false}
            onChange={() => setFirstTime(false)}
            title="Ya he ayudado"
            description="En este u otro centro"
          />
        </div>
        {errors.firstTime && (
          <p id="primera-vez-error" role="alert" className="mt-1.5 text-[13px] font-medium text-alerta">
            {errors.firstTime}
          </p>
        )}
      </fieldset>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-linea">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-tinta">
          <ShieldCheck className="size-4 text-bosque-700" aria-hidden />
          Recomendaciones de seguridad
        </p>
        <ul className="mt-2 space-y-1.5 text-[13.5px] leading-snug text-niebla">
          {safetyTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-bosque-600" />
              {tip}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <ChoiceCard
            type="checkbox"
            name="seguridad"
            value="acepto"
            checked={safety}
            onChange={setSafety}
            title="Las leí y las voy a seguir"
            className="bg-papel"
          />
        </div>
        {errors.safety && (
          <p role="alert" className="mt-1.5 text-[13px] font-medium text-alerta">
            {errors.safety}
          </p>
        )}
      </div>

      <PrototypeNotice text={prototypeNotice.before} />

      <button type="submit" aria-disabled={sending} className={`${button({ variant: "primary", size: "lg" })} w-full`}>
        {sending ? (
          <>
            <LoaderCircle className="size-5 animate-spin" aria-hidden />
            Reservando tu cupo…
          </>
        ) : (
          <>
            Tomar este turno
            <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

/** Aviso de prototipo: amable, antes de enviar y en la confirmación. */
export function PrototypeNotice({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-maiz-100 p-4 text-[13.5px] leading-snug text-maiz-800">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        {text}{" "}
        <strong className="font-semibold">
          Si estás en una emergencia, llama al{" "}
          <a href="tel:123" className="underline underline-offset-2">
            123
          </a>
          .
        </strong>
      </p>
    </div>
  );
}
