"use client";

import { AnimatePresence, motion } from "motion/react";
import { conditions, groups } from "@/content/necesito-ayuda";
import { TextInput } from "@/components/ui/form";
import { easeSalida } from "@/lib/motion";
import { big, CheckCard, Counter, FieldError, LargeField } from "@/components/necesito-ayuda/controls";
import { totalPeople, type StepProps } from "@/components/necesito-ayuda/draft";

export function PeopleStep({ draft, errors, onChange }: StepProps) {
  const total = totalPeople(draft);
  const max = draft.forCommunity ? 9999 : 60;

  return (
    <>
      <div className="grid gap-3">
        {groups.map((group) => (
          <Counter
            key={group.id}
            label={group.label}
            hint={group.hint}
            value={draft.people[group.id]}
            max={max}
            onChange={(value) => onChange({ people: { ...draft.people, [group.id]: value } })}
          />
        ))}
      </div>
      <p aria-live="polite" className="mt-4 text-[17px] text-white/75">
        En total: <strong className="font-semibold text-white">{total === 1 ? "1 persona" : `${total} personas`}</strong>
      </p>
      {errors.people && (
        <div className="mt-3">
          <FieldError>{errors.people}</FieldError>
        </div>
      )}

      <fieldset className="mt-9">
        <legend className="text-[19px] font-semibold text-white">¿Alguien necesita atención especial?</legend>
        <p className="mt-1 text-[15.5px] text-white/65">Marca lo que aplique. Así la ayuda llega con lo que hace falta.</p>
        <div className="mt-4 grid gap-3">
          {conditions.map((condition) => (
            <CheckCard
              key={condition.id}
              label={condition.label}
              hint={condition.hint}
              checked={draft.conditions.includes(condition.id)}
              onChange={(checked) =>
                onChange({
                  conditions: checked ? [...draft.conditions, condition.id] : draft.conditions.filter((id) => id !== condition.id),
                })
              }
            />
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function ContactStep({ draft, errors, onChange }: StepProps) {
  return (
    <div className="grid max-w-xl gap-6">
      <LargeField label="Tu nombre" error={errors.name}>
        {(props) => (
          <TextInput {...props} value={draft.name} onChange={(event) => onChange({ name: event.target.value })} autoComplete="name" className={big} />
        )}
      </LargeField>

      <CheckCard
        label="No tengo celular"
        hint="Te contactamos a través de un vecino o un líder comunal."
        checked={draft.noPhone}
        onChange={(noPhone) => onChange({ noPhone })}
      />

      <AnimatePresence mode="wait" initial={false}>
        {draft.noPhone ? (
          <motion.div
            key="vecino"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: easeSalida } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="grid gap-6"
          >
            <LargeField label="Nombre de un vecino o líder comunal" error={errors.contactName}>
              {(props) => (
                <TextInput {...props} value={draft.contactName} onChange={(event) => onChange({ contactName: event.target.value })} className={big} />
              )}
            </LargeField>
            <LargeField label="Celular de esa persona" error={errors.contactPhone}>
              {(props) => (
                <TextInput
                  {...props}
                  type="tel"
                  inputMode="numeric"
                  placeholder="300 123 4567"
                  value={draft.contactPhone}
                  onChange={(event) => onChange({ contactPhone: event.target.value })}
                  className={big}
                />
              )}
            </LargeField>
          </motion.div>
        ) : (
          <motion.div
            key="propio"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: easeSalida } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <LargeField label="Tu celular" hint="Diez números, sin el +57." error={errors.phone}>
              {(props) => (
                <TextInput
                  {...props}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="300 123 4567"
                  value={draft.phone}
                  onChange={(event) => onChange({ phone: event.target.value })}
                  className={big}
                />
              )}
            </LargeField>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[15.5px] leading-relaxed text-white/65">
        Solo usamos estos datos para confirmar la solicitud y avisarte. En este prototipo se quedan guardados en este navegador y
        no se envían a nadie.
      </p>
    </div>
  );
}
