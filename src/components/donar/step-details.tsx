"use client";

import { AnimatePresence, motion } from "motion/react";
import { FileText, UserRoundX } from "lucide-react";
import type { Draft, Errors } from "@/components/donar/options";
import { StepHeading } from "@/components/donar/step-heading";
import { ChoiceCard, Field, TextInput } from "@/components/ui/form";
import { easeSalida } from "@/lib/motion";

/** Paso 3: a nombre de quién, a qué correo y si quiere certificado */
export function StepDetails({
  draft,
  errors,
  onChange,
  focusOnMount,
}: {
  draft: Draft;
  errors: Errors;
  onChange: (patch: Partial<Draft>) => void;
  focusOnMount: boolean;
}) {
  return (
    <div>
      <StepHeading
        eyebrow="Paso 3 de 4"
        focusOnMount={focusOnMount}
        description="Usamos tu correo solo para el comprobante y el seguimiento."
      >
        ¿A nombre de quién?
      </StepHeading>

      <div className="mt-7 flex flex-col gap-5">
        {/* Va primero para que, al marcarla, el campo de nombre se cierre debajo sin mover la casilla */}
        <ChoiceCard
          type="checkbox"
          name="anonima"
          value="si"
          checked={draft.anonymous}
          onChange={(checked) => onChange({ anonymous: checked })}
          icon={<UserRoundX className="size-5" aria-hidden />}
          title="Donar de forma anónima"
          description="Tu nombre no aparece en el comprobante ni en ningún listado."
        />

        <AnimatePresence initial={false}>
          {!draft.anonymous && (
            <motion.div
              key="nombre"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeSalida }}
              className="-m-1 overflow-hidden p-1"
            >
              <Field label="Tu nombre" error={errors.name}>
                {(props) => (
                  <TextInput
                    {...props}
                    autoComplete="name"
                    placeholder="Como quieres que aparezca"
                    value={draft.name}
                    onChange={(event) => onChange({ name: event.target.value })}
                  />
                )}
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        <Field
          label="Correo electrónico"
          hint="Ahí llegarían el comprobante y el código de seguimiento. En este prototipo no se envía ningún correo."
          error={errors.email}
        >
          {(props) => (
            <TextInput
              {...props}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={draft.email}
              onChange={(event) => onChange({ email: event.target.value })}
            />
          )}
        </Field>

        <div>
          <ChoiceCard
            type="checkbox"
            name="certificado"
            value="si"
            checked={draft.certificate}
            onChange={(checked) => onChange({ certificate: checked })}
            icon={<FileText className="size-5" aria-hidden />}
            title="Quiero el certificado de donación"
            description="Sirve para la declaración de renta y va a nombre de quien dona. En este prototipo no se emite."
          />
          {errors.certificate && (
            <p role="alert" className="mt-1.5 text-[13px] font-medium leading-snug text-alerta">
              {errors.certificate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
