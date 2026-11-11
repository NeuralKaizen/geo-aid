"use client";

import { ArrowRight, MapPinned } from "lucide-react";
import { needIcons } from "@/components/donaciones/need-icons";
import { UrgencyBadge } from "@/components/donaciones/urgency-badge";
import { urgencyOf, zoneCoverage } from "@/components/donaciones/metrics";
import { GENERAL, generalDescription, zoneChoices, zoneSummary, type Draft } from "@/components/donar/options";
import { GroupLabel, StepHeading } from "@/components/donar/step-heading";
import { NavLink } from "@/components/transitions/nav-link";
import { ChoiceCard } from "@/components/ui/form";
import { typeDestinations, zones } from "@/content/donaciones";

/** Paso 1: a dónde va el aporte. Todas las opciones son un solo grupo de radio, separado en tres bloques. */
export function StepDestination({
  draft,
  onChange,
  focusOnMount,
}: {
  draft: Draft;
  onChange: (destination: string) => void;
  focusOnMount: boolean;
}) {
  const name = "destino";
  const pick = (id: string) => (checked: boolean) => checked && onChange(id);

  return (
    <div>
      <StepHeading
        eyebrow="Paso 1 de 4"
        focusOnMount={focusOnMount}
        description="Puedes dejar que lo asignemos a la zona que más lo necesita, o elegir tú una zona o un tipo de ayuda."
      >
        ¿A dónde quieres que vaya tu aporte?
      </StepHeading>

      <fieldset className="mt-7">
        <legend className="sr-only">Destino de tu aporte</legend>

        <ChoiceCard
          name={name}
          value={GENERAL}
          checked={draft.destination === GENERAL}
          onChange={pick(GENERAL)}
          icon={<MapPinned className="size-5" aria-hidden />}
          title="Donde más se necesite"
          description={generalDescription}
          aside={
            <span className="hidden shrink-0 rounded-full bg-maiz-100 px-2.5 py-1 text-[11.5px] font-semibold text-maiz-800 sm:inline">
              Recomendado
            </span>
          }
        />

        <div className="mt-7">
          <GroupLabel>Las zonas más urgentes hoy</GroupLabel>
          {/* Con un número impar de zonas, la última ocupa todo el ancho para no dejar un hueco */}
          <div className="grid gap-2.5 sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
            {zoneChoices(draft.destination).map((zone) => {
              const id = `zona:${zone.slug}`;
              return (
                <ChoiceCard
                  key={zone.slug}
                  name={name}
                  value={id}
                  checked={draft.destination === id}
                  onChange={pick(id)}
                  title={zone.name}
                  description={zoneSummary(zone)}
                  aside={<UrgencyBadge level={urgencyOf(zoneCoverage(zone))} compact />}
                />
              );
            })}
          </div>
          <NavLink
            href="/donaciones"
            className="group mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-bosque-700"
          >
            Ver las {zones.length} zonas en el tablero
            <ArrowRight className="size-3.5 transition-transform duration-500 ease-salida group-hover:translate-x-0.5" aria-hidden />
          </NavLink>
        </div>

        <div className="mt-7">
          <GroupLabel>Por tipo de ayuda</GroupLabel>
          <div className="grid gap-2.5">
            {typeDestinations.map((type) => {
              const id = `tipo:${type.id}`;
              const Icon = needIcons[type.id];
              return (
                <ChoiceCard
                  key={type.id}
                  name={name}
                  value={id}
                  checked={draft.destination === id}
                  onChange={pick(id)}
                  icon={<Icon className="size-5" aria-hidden />}
                  title={type.label}
                  description={type.description}
                />
              );
            })}
          </div>
        </div>
      </fieldset>
    </div>
  );
}
