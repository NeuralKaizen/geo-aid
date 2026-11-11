import { groups, needLabel, type ConditionId, type GroupId, type NeedId } from "@/content/necesito-ayuda";

/*
 * Todo lo que la persona responde vive en un solo objeto en el asistente. Ir atrás o editar desde la revisión solo
 * cambia de pantalla: las respuestas no se borran hasta que se envía o se empieza otra solicitud.
 */

/** id del <form> de la pantalla actual: el botón "Continuar" vive afuera y lo envía con form={FORM_ID} */
export const FORM_ID = "paso-actual";

export type StepId = "inicio" | "necesidades" | "lugar" | "personas" | "contacto" | "revision" | "listo";

export const stepOrder: StepId[] = ["inicio", "necesidades", "lugar", "personas", "contacto", "revision", "listo"];

export type Location = { lat: number; lng: number; accuracy: number };

export type Draft = {
  forCommunity: boolean | null;
  needs: NeedId[];
  otherNeed: string;
  department: string;
  municipality: string;
  area: string;
  reference: string;
  location: Location | null;
  people: Record<GroupId, number>;
  conditions: ConditionId[];
  name: string;
  phone: string;
  noPhone: boolean;
  contactName: string;
  contactPhone: string;
};

export type Errors = Partial<Record<keyof Draft, string>>;

/** Lo que recibe cada pantalla del asistente */
export type StepProps = { draft: Draft; errors: Errors; onChange: (patch: Partial<Draft>) => void };

export const emptyDraft: Draft = {
  forCommunity: null,
  needs: [],
  otherNeed: "",
  department: "",
  municipality: "",
  area: "",
  reference: "",
  location: null,
  people: { adultos: 1, ninos: 0, mayores: 0 },
  conditions: [],
  name: "",
  phone: "",
  noPhone: false,
  contactName: "",
  contactPhone: "",
};

const isCell = (value: string) => /^3\d{9}$/.test(value.replace(/\D/g, ""));
const cellError = "Escribe los 10 números del celular, sin el +57.";

export function validate(step: StepId, draft: Draft): Errors {
  const errors: Errors = {};
  if (step === "necesidades") {
    if (draft.needs.length === 0) errors.needs = "Marca al menos una cosa.";
    if (draft.needs.includes("otra") && !draft.otherNeed.trim()) errors.otherNeed = "Cuéntanos qué otra cosa necesitan.";
  }
  if (step === "lugar") {
    if (!draft.department) errors.department = "Elige el departamento.";
    if (!draft.municipality.trim()) errors.municipality = "Escribe el municipio.";
    if (!draft.area.trim()) errors.area = "Escribe la vereda o el barrio. Si no sabes el nombre, describe el lugar.";
  }
  if (step === "personas" && totalPeople(draft) < 1) errors.people = "Cuenta al menos a una persona.";
  if (step === "contacto") {
    if (draft.name.trim().length < 2) errors.name = "Escribe tu nombre.";
    if (!draft.noPhone && !isCell(draft.phone)) errors.phone = cellError;
    if (draft.noPhone && draft.contactName.trim().length < 2) errors.contactName = "Escribe el nombre de esa persona.";
    if (draft.noPhone && !isCell(draft.contactPhone)) errors.contactPhone = cellError;
  }
  return errors;
}

/** Primer paso con algo pendiente, para revisar todo antes de enviar */
export function firstInvalidStep(draft: Draft): StepId | null {
  return (["necesidades", "lugar", "personas", "contacto"] as const).find((step) => Object.keys(validate(step, draft)).length > 0) ?? null;
}

export function totalPeople(draft: Draft) {
  return draft.people.adultos + draft.people.ninos + draft.people.mayores;
}

/** "Vereda La Palma, Morales (Cauca)" */
export function placeLabel(draft: Draft) {
  return `${draft.area.trim()}, ${draft.municipality.trim()} (${draft.department})`;
}

/** "Agua", "Comida"… y lo que escribió en "Otra cosa" */
export function needsLabels(draft: Draft) {
  return draft.needs.map((id) => (id === "otra" && draft.otherNeed.trim() ? `Otra: ${draft.otherNeed.trim()}` : needLabel[id]));
}

/** "2 adultos, 1 niño o niña" */
export function peopleDetail(draft: Draft) {
  return groups
    .filter((group) => draft.people[group.id] > 0)
    .map((group) => `${draft.people[group.id]} ${draft.people[group.id] === 1 ? group.one : group.many}`)
    .join(", ");
}

/** "300 123 4567" */
export function formatCell(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : value;
}
