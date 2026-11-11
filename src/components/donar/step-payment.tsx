"use client";

import { CreditCard, Info, Landmark, Smartphone, type LucideIcon } from "lucide-react";
import type { Draft, Errors } from "@/components/donar/options";
import { StepHeading } from "@/components/donar/step-heading";
import { ChoiceCard } from "@/components/ui/form";
import { emergencyLine } from "@/content/site";
import { paymentMethods, type PaymentMethodId } from "@/content/donaciones";

const icons: Record<PaymentMethodId, LucideIcon> = {
  pse: Landmark,
  nequi: Smartphone,
  daviplata: Smartphone,
  tarjeta: CreditCard,
};

/** Paso 4: el método, sin un solo campo de pago. El aviso de prototipo va antes de las opciones para que se lea. */
export function StepPayment({
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
      <StepHeading eyebrow="Paso 4 de 4" focusOnMount={focusOnMount}>
        ¿Cómo quieres pagar?
      </StepHeading>

      <div role="note" className="mt-5 flex gap-3 rounded-2xl bg-maiz-100 px-4 py-3.5 text-[14px] leading-relaxed text-maiz-800">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          <strong className="font-semibold">En este prototipo no se procesa ningún pago.</strong> No te pedimos datos de tu
          cuenta ni de tu tarjeta, y al confirmar no se cobra nada. GeoAid es un proyecto universitario y la información no
          llega a ninguna entidad. En una emergencia, llama al{" "}
          <a href={`tel:${emergencyLine.number}`} className="font-semibold underline underline-offset-2">
            {emergencyLine.number}
          </a>
          .
        </p>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-[13px] font-semibold text-tinta">Método de pago</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {paymentMethods.map((method) => {
            const Icon = icons[method.id];
            return (
              <ChoiceCard
                key={method.id}
                name="metodo"
                value={method.id}
                checked={draft.method === method.id}
                onChange={(checked) => checked && onChange({ method: method.id })}
                icon={<Icon className="size-5" aria-hidden />}
                title={method.label}
                description={method.description}
              />
            );
          })}
        </div>
        {errors.method && (
          <p role="alert" className="mt-2 text-[13px] font-medium leading-snug text-alerta">
            {errors.method}
          </p>
        )}
      </fieldset>

      <p className="mt-5 text-[13px] leading-relaxed text-niebla">
        Al confirmar, la donación de prueba queda guardada solo en este navegador para que veas cómo funciona el
        seguimiento y la encuentres en Mi portal.
      </p>
    </div>
  );
}
