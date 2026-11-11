import {
  percent,
  placeOf,
  zoneCoverage,
  zoneDestination,
  zonesByUrgency,
  zoneUnit,
} from "@/components/donaciones/metrics";
import {
  amountPresets,
  minimumAmount,
  paymentMethods,
  suggestedAmount,
  typeDestinations,
  unitCosts,
  zones,
  type NeedType,
  type PaymentMethodId,
  type UnitCost,
  type Zone,
} from "@/content/donaciones";
import { pesos } from "@/lib/format";

/*
 * Modelo del pago: qué eligió la persona en cada paso, cómo se lee cada destino y qué se valida antes de seguir.
 * Los destinos se guardan como texto ("general", "zona:vereda-la-palma", "tipo:agua") para poder venir de la URL.
 */

export type Frequency = "unica" | "mensual";

export type Draft = {
  destination: string;
  /** monto de una de las opciones o "otro" para el monto propio */
  amount: number | "otro";
  /** solo dígitos */
  custom: string;
  frequency: Frequency;
  anonymous: boolean;
  name: string;
  email: string;
  certificate: boolean;
  method: PaymentMethodId | null;
};

export type Errors = Partial<Record<"amount" | "name" | "email" | "certificate" | "method", string>>;

export const steps = [
  { id: "destino", label: "Destino" },
  { id: "monto", label: "Monto" },
  { id: "datos", label: "Tus datos" },
  { id: "pago", label: "Pago" },
] as const;

export const GENERAL = "general";

export type Destination = {
  id: string;
  title: string;
  /** línea corta para el recibo y la barra móvil */
  short: string;
  /** lugar, solo para zonas */
  place?: string;
  /** destino legible que se guarda en la actividad */
  record: string;
  /** con qué se mide lo que cubre el aporte */
  unitType: NeedType;
  unit: UnitCost;
  zone?: Zone;
};

const mostUrgent = zonesByUrgency[0];

export const generalDescription = `Va cada semana a la zona con menos cobertura, casi siempre una vereda. Hoy es ${mostUrgent.name}, en ${placeOf(mostUrgent)}.`;

export function resolveDestination(id: string): Destination {
  if (id.startsWith("zona:")) {
    const zone = zones.find((candidate) => `zona:${candidate.slug}` === id);
    if (zone) {
      return {
        id,
        title: zone.name,
        short: zone.name,
        place: placeOf(zone),
        record: zoneDestination(zone),
        unitType: zone.needs[0].type,
        unit: zoneUnit(zone),
        zone,
      };
    }
  }
  if (id.startsWith("tipo:")) {
    const type = typeDestinations.find((candidate) => `tipo:${candidate.id}` === id);
    if (type) {
      return { id, title: type.label, short: type.label, record: type.label, unitType: type.id, unit: unitCosts[type.id] };
    }
  }
  // El kit de agua y aseo es la unidad de referencia del hero: $45.000 por familia por semana
  return {
    id: GENERAL,
    title: "Donde más se necesite",
    short: "Donde más se necesite",
    record: "Donde más se necesite",
    unitType: "aseo",
    unit: unitCosts.aseo,
  };
}

/** Las tres zonas más urgentes y, si la persona llegó con otra zona elegida, esa también (primero) */
export function zoneChoices(selected: string) {
  const top = zonesByUrgency.slice(0, 3);
  const chosen = zones.find((zone) => `zona:${zone.slug}` === selected);
  return chosen && !top.includes(chosen) ? [chosen, ...top] : top;
}

export function zoneSummary(zone: Zone) {
  return `${placeOf(zone)} · ${percent(zoneCoverage(zone))} % cubierto`;
}

function plain(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Destino a partir de la URL: `?zona=<slug>` desde el tablero, o `?destino=` desde la donación rápida del inicio
 * (con los nombres de esa lista). "Familias en zonas rurales" va a "Donde más se necesite", que hoy son veredas.
 */
export function destinationFromParams(zona: string | null, destino: string | null) {
  if (zona && zones.some((zone) => zone.slug === zona)) return `zona:${zona}`;
  if (!destino) return GENERAL;
  const wanted = plain(destino);
  const zone = zones.find((candidate) => candidate.slug === wanted || plain(candidate.name) === wanted);
  if (zone) return `zona:${zone.slug}`;
  const type = typeDestinations.find((candidate) => candidate.id === wanted || plain(candidate.label) === wanted);
  if (type) return `tipo:${type.id}`;
  return GENERAL;
}

/** Monto a partir de `?monto=` (la donación rápida lo manda con puntos, p. ej. "50.000") */
export function amountFromParam(monto: string | null): Pick<Draft, "amount" | "custom"> {
  const digits = (monto ?? "").replace(/\D/g, "").slice(0, 9);
  const value = Number(digits);
  if (!digits || !value) return { amount: suggestedAmount, custom: "" };
  if (amountPresets.includes(value)) return { amount: value, custom: "" };
  return { amount: "otro", custom: digits };
}

export function amountOf(draft: Draft) {
  return draft.amount === "otro" ? Number(draft.custom) || 0 : draft.amount;
}

export function methodLabel(id: PaymentMethodId | null) {
  return paymentMethods.find((method) => method.id === id)?.label ?? null;
}

export function frequencyLabel(frequency: Frequency) {
  return frequency === "mensual" ? "Cada mes" : "Una vez";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Errores del paso, en el orden en que aparecen los campos. Vacío si se puede seguir. */
export function validate(step: number, draft: Draft): Errors {
  const errors: Errors = {};
  if (step === 1) {
    const amount = amountOf(draft);
    if (draft.amount === "otro" && !draft.custom) errors.amount = "Escribe cuánto quieres donar.";
    else if (amount < minimumAmount) errors.amount = `El monto mínimo es ${pesos(minimumAmount)}.`;
  }
  if (step === 2) {
    if (!draft.anonymous && !draft.name.trim()) errors.name = "Escribe tu nombre o marca la donación anónima.";
    if (!draft.email.trim()) errors.email = "Escribe tu correo para enviarte el comprobante.";
    else if (!emailPattern.test(draft.email.trim())) errors.email = "Revisa el correo: debe tener la forma nombre@correo.com.";
    if (draft.certificate && draft.anonymous)
      errors.certificate = "El certificado va a nombre de quien dona: quita la donación anónima o este certificado.";
  }
  if (step === 3 && !draft.method) errors.method = "Elige cómo quieres pagar.";
  return errors;
}
