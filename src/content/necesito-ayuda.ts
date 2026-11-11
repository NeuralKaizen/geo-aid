import {
  Droplets,
  HeartPulse,
  MessageSquareText,
  Shirt,
  SoapDispenserDroplet,
  Soup,
  Tent,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";

/*
 * Textos y opciones del asistente "Necesito ayuda". Lo que pasa después de enviar es el funcionamiento propuesto:
 * GeoAid es un prototipo y la solicitud no llega a ninguna entidad, y así se dice en la página.
 */

export type NeedId = "agua" | "comida" | "refugio" | "salud" | "aseo" | "ropa" | "buscar" | "otra";

export const needs: { id: NeedId; label: string; icon: LucideIcon }[] = [
  { id: "agua", label: "Agua", icon: Droplets },
  { id: "comida", label: "Comida", icon: Soup },
  { id: "refugio", label: "Refugio o techo", icon: Tent },
  { id: "salud", label: "Salud o medicinas", icon: HeartPulse },
  { id: "aseo", label: "Aseo", icon: SoapDispenserDroplet },
  { id: "ropa", label: "Ropa y cobijas", icon: Shirt },
  { id: "buscar", label: "Encontrar a alguien", icon: UserRoundSearch },
  { id: "otra", label: "Otra cosa", icon: MessageSquareText },
];

export const needLabel = Object.fromEntries(needs.map((need) => [need.id, need.label])) as Record<NeedId, string>;

export type GroupId = "adultos" | "ninos" | "mayores";

export const groups: { id: GroupId; label: string; hint: string; one: string; many: string }[] = [
  { id: "adultos", label: "Adultos", hint: "De 18 a 59 años", one: "adulto", many: "adultos" },
  { id: "ninos", label: "Niños y niñas", hint: "Menores de 18 años", one: "niño o niña", many: "niños y niñas" },
  { id: "mayores", label: "Adultos mayores", hint: "De 60 años o más", one: "adulto mayor", many: "adultos mayores" },
];

export type ConditionId = "discapacidad" | "embarazo" | "cronica";

export const conditions: { id: ConditionId; label: string; hint: string }[] = [
  { id: "discapacidad", label: "Persona con discapacidad", hint: "Necesita apoyo para moverse, ver, oír o comunicarse" },
  { id: "embarazo", label: "Embarazo", hint: "Una mujer embarazada o que acaba de dar a luz" },
  { id: "cronica", label: "Enfermedad crónica", hint: "Diabetes, hipertensión u otra que necesita tratamiento" },
];

export const departments = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bogotá D. C.",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
];

/** Pasos con número (el inicio y la confirmación no cuentan) */
export const stepNames = ["Qué necesitan", "Dónde están", "Cuántas personas", "Contacto", "Revisión"];

/* Lo que pasaría después de enviar: es la propuesta de funcionamiento, no un compromiso de nadie */
export const afterSending = [
  {
    title: "Verificación en 48 horas",
    body: "Un líder comunal o la alcaldía confirma la necesidad con una llamada o una visita.",
  },
  {
    title: "Publicación de la necesidad",
    body: "Aparece en GeoAid para que donantes y organizaciones vean qué falta y dónde.",
  },
  {
    title: "Aviso por mensaje",
    body: "Te escribimos cuando la ayuda salga hacia tu vereda o tu barrio, con el día de llegada.",
  },
];
