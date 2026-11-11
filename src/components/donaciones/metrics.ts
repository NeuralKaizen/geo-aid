import { unitCosts, zones, type UnitCost, type Zone, type ZoneNeed } from "@/content/donaciones";
import { numero } from "@/lib/format";

/*
 * Cálculos que comparten el tablero y el pago. La cobertura de una zona es el promedio de lo que ya llegó de cada
 * necesidad (cada una cuenta igual, porque se miden en unidades distintas: kits, bidones, carpas).
 */

export type Urgency = "critica" | "alta" | "media";

export function needCoverage(need: ZoneNeed) {
  return Math.min(1, need.delivered / need.goal);
}

export function zoneCoverage(zone: Zone) {
  return zone.needs.reduce((sum, need) => sum + needCoverage(need), 0) / zone.needs.length;
}

/** Crítica por debajo del 40 % cubierto, alta por debajo del 70 %, media desde ahí */
export function urgencyOf(coverage: number): Urgency {
  if (coverage < 0.4) return "critica";
  if (coverage < 0.7) return "alta";
  return "media";
}

export function percent(share: number) {
  return Math.round(share * 100);
}

/** Etiqueta y colores de cada nivel. La barra usa `fill`; la etiqueta, `badge` y `dot`. */
export const urgencyStyles: Record<Urgency, { label: string; badge: string; dot: string; fill: string; text: string }> = {
  critica: { label: "Crítica", badge: "bg-alerta/10 text-alerta", dot: "bg-alerta", fill: "bg-alerta", text: "text-alerta" },
  alta: { label: "Alta", badge: "bg-maiz-100 text-maiz-800", dot: "bg-maiz-400", fill: "bg-maiz-400", text: "text-maiz-800" },
  media: { label: "Media", badge: "bg-bosque-50 text-bosque-700", dot: "bg-bosque-600", fill: "bg-bosque-600", text: "text-bosque-700" },
};

/** Zonas de la menos cubierta a la más cubierta */
export const zonesByUrgency = [...zones].sort((a, b) => zoneCoverage(a) - zoneCoverage(b));

/** Promedio de cobertura de todas las zonas: "de lo pedido ya llegó" */
export const overallCoverage = zones.reduce((sum, zone) => sum + zoneCoverage(zone), 0) / zones.length;

export function placeOf(zone: Zone) {
  return `${zone.municipality}, ${zone.department}`;
}

/** Destino legible para el registro de la donación, p. ej. "Vereda La Palma, Morales (Cauca)" */
export function zoneDestination(zone: Zone) {
  return `${zone.name}, ${zone.municipality} (${zone.department})`;
}

/** La unidad con la que se mide lo que alcanza una donación a la zona: la de su necesidad principal */
export function zoneUnit(zone: Zone): UnitCost {
  return unitCosts[zone.needs[0].type];
}

/* Qué alcanza a cubrir un monto */

const words = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];

function count(n: number, gender: UnitCost["gender"]) {
  if (n === 1) return gender === "f" ? "una" : "un";
  return n <= 10 ? words[n] : numero(n);
}

/**
 * "casi dos kits de agua y aseo", "el 44 % de un kit de agua y aseo", "más de tres semanas de agua potable".
 * Redondea hacia lo que de verdad cubre: nunca dice "dos" si no alcanza para dos.
 */
export function reach(amount: number, unit: UnitCost) {
  const ratio = amount / unit.cost;
  if (ratio < 0.9) return `el ${percent(ratio)} % de ${count(1, unit.gender)} ${unit.singular}`;
  const whole = Math.floor(ratio);
  const rest = ratio - whole;
  const [n, prefix] = rest >= 0.75 ? [whole + 1, "casi "] : rest < 0.2 ? [whole, ""] : [whole, "más de "];
  return `${prefix}${count(n, unit.gender)} ${n === 1 ? unit.singular : unit.plural}`;
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
