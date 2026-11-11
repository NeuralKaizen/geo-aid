import { CalendarCheck, ClipboardPen, HandHeart, LayoutDashboard, type LucideIcon } from "lucide-react";
import { trackingDemo } from "@/content/site";
import type { ActivityKind } from "@/lib/activity";

/*
 * Mi portal: la historia de ayuda de Laura, una usuaria de ejemplo, más lo que la persona haga en esta sesión
 * (guardado en este navegador con @/lib/activity). Todo lo de este archivo es de ejemplo.
 */

export const exampleUser = {
  name: "Laura",
  initial: "L",
  city: "Bogotá",
  since: "agosto de 2026",
};

export const portalIntro = {
  note: "Esta es una vista de ejemplo con la historia de Laura. Lo que hagas en esta sesión en las otras páginas aparece aquí, guardado solo en este navegador.",
  actions: [
    { label: "Donar", href: "/donar", icon: HandHeart },
    { label: "Tomar un turno", href: "/voluntariado#agenda", icon: CalendarCheck },
    { label: "Registrar una necesidad", href: "/necesito-ayuda", icon: ClipboardPen },
  ] satisfies { label: string; href: string; icon: LucideIcon }[],
};

export type PortalTabId = "resumen" | "donaciones" | "turnos" | "necesidades";

export const portalTabs: { id: PortalTabId; label: string; icon: LucideIcon }[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "donaciones", label: "Donaciones", icon: HandHeart },
  { id: "turnos", label: "Turnos", icon: CalendarCheck },
  { id: "necesidades", label: "Necesidades y reportes", icon: ClipboardPen },
];

export type PortalStep = { title: string; detail?: string; time?: string };

export type ExampleDonation = {
  code: string;
  amount: number;
  destination: string;
  method: string;
  frequency: "unica" | "mensual";
  /** fecha del pago (ISO) */
  date: string;
  steps: PortalStep[];
  /** índice del último paso alcanzado */
  reached: number;
  /** a dónde llegó, o hacia dónde va si todavía no llega */
  municipio: string;
  /** qué se entregó, para "A dónde llegó tu ayuda" */
  delivered: string;
};

/** Pasos de una donación. Las de esta sesión solo alcanzan el primero: en el prototipo no avanzan. */
export const donationSteps = ["Donación recibida", "Comprada y empacada", "En camino", "Entregada"];

export const exampleDonations: ExampleDonation[] = [
  {
    code: "GA-40968",
    amount: 45000,
    destination: "Familias en zonas rurales",
    method: "PSE",
    frequency: "mensual",
    date: "2026-11-03T08:20:00-05:00",
    steps: [
      { title: "Donación recibida", detail: "Pago confirmado", time: "3 nov, 8:20" },
      { title: "Comprada y empacada", detail: "Mercados comprados en Piendamó", time: "5 nov, 14:10" },
      { title: "En camino", detail: "Ruta rural, camión 2 de 3", time: "9 nov, 6:30" },
      { title: "Entregada" },
    ],
    reached: 2,
    municipio: "Piendamó, Cauca",
    delivered: "Mercados para familias rurales",
  },
  {
    code: "GA-31502",
    amount: 85000,
    destination: "Vereda La Palma, Morales (Cauca)",
    method: "Nequi",
    frequency: "unica",
    date: "2026-09-02T10:05:00-05:00",
    steps: [
      { title: "Donación recibida", detail: "Pago confirmado", time: "2 sep, 10:05" },
      { title: "Comprada y empacada", detail: "Kits de agua y aseo, por 4 voluntarios", time: "3 sep, 11:30" },
      { title: "En camino", detail: "Ruta a Morales", time: "4 sep, 6:10" },
      { title: "Entregada", detail: "Vereda La Palma, 2 familias", time: "4 sep, 15:45" },
    ],
    reached: 3,
    municipio: "Morales, Cauca",
    delivered: "Kits de agua y aseo para 2 familias",
  },
  {
    // El mismo seguimiento de ejemplo que se dibuja en la página de inicio
    code: trackingDemo.code,
    amount: 50000,
    destination: trackingDemo.destination,
    method: "PSE",
    frequency: "unica",
    date: "2026-08-18T09:12:00-05:00",
    steps: trackingDemo.steps,
    reached: trackingDemo.steps.length - 1,
    municipio: "Cajibío, Cauca",
    delivered: "Kits de alimentos para 12 familias",
  },
];

export type ExampleShift = {
  code: string;
  task: string;
  place: string;
  city: string;
  /** hora de inicio (24 h); todos duran 4 horas */
  start: number;
} & (
  | { /** turno pasado, fecha fija */ date: string }
  | { /** turno próximo, días desde hoy */ inDays: number; bookedAt: string }
);

export const exampleShifts: ExampleShift[] = [
  {
    code: "VT-20981",
    task: "Cargar camiones",
    place: "Bodega de carga Fontibón",
    city: "Bogotá",
    start: 6,
    inDays: 12,
    bookedAt: "2026-11-06T19:40:00-05:00",
  },
  { code: "VT-16540", task: "Cocina comunitaria", place: "Olla comunitaria Bosa", city: "Bogotá", start: 10, date: "2026-10-18" },
  { code: "VT-13377", task: "Cargar camiones", place: "Bodega de carga Fontibón", city: "Bogotá", start: 6, date: "2026-09-06" },
  {
    code: "VT-11024",
    task: "Clasificar y empacar donaciones",
    place: "Centro de acopio Norte",
    city: "Bogotá",
    start: 8,
    date: "2026-08-23",
  },
];

/** Necesidades, reportes, pistas y puntos: sus pasos de estado, con el género de cada palabra. */
export const caseKinds: Record<Exclude<ActivityKind, "donacion" | "turno">, { label: string; steps: string[] }> = {
  necesidad: { label: "Necesidad", steps: ["Recibida", "En verificación", "Publicada", "Atendida"] },
  reporte: { label: "Reporte de persona desaparecida", steps: ["Recibido", "En verificación", "Publicado", "Atendido"] },
  pista: { label: "Pista sobre una persona", steps: ["Recibida", "En verificación", "Publicada", "Atendida"] },
  punto: { label: "Punto de acopio", steps: ["Recibido", "En verificación", "Publicado", "Atendido"] },
};

export const exampleNeed = {
  code: "NE-20417",
  needs: ["Agua potable", "Kits de aseo", "Tejas"],
  place: "Vereda El Carmen, Cajibío (Cauca)",
  people: 40,
  forCommunity: true,
  date: "2026-08-21T19:30:00-05:00",
  steps: [
    { title: "Recibida", detail: "Registrada para la vereda de su familia", time: "21 ago, 7:30 p. m." },
    { title: "En verificación", detail: "Llamada con la junta de acción comunal", time: "22 ago, 10:15 a. m." },
    { title: "Publicada", detail: "Visible para quienes donan", time: "24 ago, 9:00 a. m." },
    { title: "Atendida" },
  ],
  reached: 2,
};

export const portalCopy = {
  sessionBadge: "Hecho por ti en esta sesión",
  sessionPending: "En el prototipo no avanza más: no llegó a ninguna entidad.",
  certificate:
    "Esto es un prototipo: no se genera ningún archivo. En la versión real descargarías un certificado de donación con el valor, la fecha y el código.",
  clear: {
    label: "Borrar mi actividad de este navegador",
    confirm: "Se borra lo que hiciste en esta sesión. La historia de ejemplo de Laura se queda.",
  },
  storage: "Lo que haces se guarda solo en este navegador. No sale de aquí.",
};
