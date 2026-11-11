import { CookingPot, HeartHandshake, PackageOpen, Route, Truck, type LucideIcon } from "lucide-react";

/*
 * Voluntariado: la agenda de turnos de los próximos 7 días. Todos los turnos, lugares y cupos son de ejemplo.
 * Los turnos no tienen fecha fija: se definen por día de la semana o por días desde hoy, así la agenda siempre
 * empieza hoy y el turno del hero (sábado, Centro de acopio Norte) siempre cae el próximo sábado.
 */

/** Todos los turnos duran lo mismo; "Mi portal" usa este valor para sumar horas. */
export const SHIFT_HOURS = 4;

export type CityId = "bogota" | "cali" | "popayan" | "pasto" | "neiva";

export const cities: { id: CityId; label: string }[] = [
  { id: "bogota", label: "Bogotá" },
  { id: "cali", label: "Cali" },
  { id: "popayan", label: "Popayán" },
  { id: "pasto", label: "Pasto" },
  { id: "neiva", label: "Neiva" },
];

export const cityLabel = Object.fromEntries(cities.map((city) => [city.id, city.label])) as Record<CityId, string>;

export type TaskId = "clasificar" | "cargar" | "rural" | "cocina" | "psicosocial";

export type Task = {
  id: TaskId;
  label: string;
  /** nombre corto para los filtros */
  short: string;
  icon: LucideIcon;
  /** requisitos que se muestran en chips */
  requirements: string[];
  /** lo que dice el mensaje de texto de confirmación sobre qué llevar */
  bring: string;
  /** solo para profesionales (se avisa en el filtro y en la tarjeta) */
  professional?: boolean;
};

export const tasks: Task[] = [
  {
    id: "clasificar",
    label: "Clasificar y empacar donaciones",
    short: "Clasificar y empacar",
    icon: PackageOpen,
    requirements: ["Botas cerradas", "Mayor de 18", "Levantar hasta 15 kg"],
    bring: "Lleva botas cerradas.",
  },
  {
    id: "cargar",
    label: "Cargar camiones",
    short: "Cargar camiones",
    icon: Truck,
    requirements: ["Botas cerradas", "Mayor de 18", "Levantar hasta 25 kg"],
    bring: "Lleva botas cerradas.",
  },
  {
    id: "rural",
    label: "Entregas en zona rural",
    short: "Entregas en zona rural",
    icon: Route,
    requirements: ["Mayor de 18", "Botas cerradas", "Ropa para lluvia"],
    bring: "Lleva botas cerradas y ropa para lluvia.",
  },
  {
    id: "cocina",
    label: "Cocina comunitaria",
    short: "Cocina comunitaria",
    icon: CookingPot,
    requirements: ["Zapatos cerrados", "Cabello recogido", "Mayor de 16"],
    bring: "Lleva zapatos cerrados y el cabello recogido.",
  },
  {
    id: "psicosocial",
    label: "Apoyo psicosocial",
    short: "Apoyo psicosocial",
    icon: HeartHandshake,
    requirements: ["Profesional en psicología o trabajo social", "Tarjeta profesional"],
    bring: "Lleva tu tarjeta profesional.",
    professional: true,
  },
];

export const taskById = Object.fromEntries(tasks.map((task) => [task.id, task])) as Record<TaskId, Task>;

export type ShiftTemplate = {
  id: string;
  /** día de la semana (0 domingo … 6 sábado) o días contados desde hoy (0 hoy, 1 mañana) */
  when: { weekday: number } | { offset: number };
  /** hora de inicio en formato de 24 horas; termina SHIFT_HOURS después */
  start: number;
  task: TaskId;
  place: string;
  city: CityId;
  /** cupos ya tomados por otras personas */
  taken: number;
  total: number;
  /** detalle del lugar o de la ruta */
  note?: string;
};

/*
 * Bogotá tiene 6 turnos en la semana, como dice la tarjeta del hero. Cada plantilla aparece una sola vez en una
 * ventana de 7 días, así que su id junto con la fecha identifica el turno.
 */
export const shiftTemplates: ShiftTemplate[] = [
  // Bogotá
  {
    id: "bog-norte-sab",
    when: { weekday: 6 },
    start: 8,
    task: "clasificar",
    place: "Centro de acopio Norte",
    city: "bogota",
    taken: 18,
    total: 30,
  },
  { id: "bog-norte-mie", when: { weekday: 3 }, start: 14, task: "clasificar", place: "Centro de acopio Norte", city: "bogota", taken: 26, total: 30 },
  { id: "bog-norte-dom", when: { weekday: 0 }, start: 9, task: "clasificar", place: "Centro de acopio Norte", city: "bogota", taken: 30, total: 30 },
  { id: "bog-fontibon-jue", when: { weekday: 4 }, start: 6, task: "cargar", place: "Bodega de carga Fontibón", city: "bogota", taken: 9, total: 12 },
  { id: "bog-fontibon-mar", when: { weekday: 2 }, start: 6, task: "cargar", place: "Bodega de carga Fontibón", city: "bogota", taken: 4, total: 12 },
  { id: "bog-bosa-vie", when: { weekday: 5 }, start: 10, task: "cocina", place: "Olla comunitaria Bosa", city: "bogota", taken: 8, total: 10 },

  // Cali
  { id: "cali-sur-jue", when: { weekday: 4 }, start: 8, task: "clasificar", place: "Centro de acopio Sur", city: "cali", taken: 14, total: 24 },
  { id: "cali-siloe-sab", when: { weekday: 6 }, start: 10, task: "cocina", place: "Cocina comunitaria Siloé", city: "cali", taken: 6, total: 10 },
  { id: "cali-sur-lun", when: { weekday: 1 }, start: 13, task: "cargar", place: "Centro de acopio Sur", city: "cali", taken: 7, total: 12 },

  // Popayán, la ciudad más cerca de las veredas afectadas del Cauca
  { id: "pop-coliseo-hoy", when: { offset: 0 }, start: 13, task: "clasificar", place: "Coliseo municipal", city: "popayan", taken: 21, total: 30 },
  {
    id: "pop-rural-vie",
    when: { weekday: 5 },
    start: 6,
    task: "rural",
    place: "Coliseo municipal",
    city: "popayan",
    taken: 5,
    total: 8,
    note: "Salida en grupo hacia Vereda La Palma, Morales",
  },
  {
    id: "pop-rural-mar",
    when: { weekday: 2 },
    start: 6,
    task: "rural",
    place: "Coliseo municipal",
    city: "popayan",
    taken: 8,
    total: 8,
    note: "Salida en grupo hacia veredas de Cajibío",
  },
  { id: "pop-esmeralda-dom", when: { weekday: 0 }, start: 8, task: "clasificar", place: "Salón comunal Esmeralda", city: "popayan", taken: 11, total: 15 },
  {
    id: "pop-psico-sab",
    when: { weekday: 6 },
    start: 9,
    task: "psicosocial",
    place: "Salón comunal Esmeralda",
    city: "popayan",
    taken: 2,
    total: 6,
    note: "Acompañamiento a familias en refugio temporal",
  },

  // Pasto
  { id: "pasto-cuadras-manana", when: { offset: 1 }, start: 8, task: "clasificar", place: "Bodega Las Cuadras", city: "pasto", taken: 10, total: 20 },
  {
    id: "pasto-psico-dom",
    when: { weekday: 0 },
    start: 14,
    task: "psicosocial",
    place: "Albergue temporal del sur",
    city: "pasto",
    taken: 3,
    total: 6,
    note: "Escucha y primeros auxilios psicológicos",
  },

  // Neiva
  { id: "neiva-acopio-vie", when: { weekday: 5 }, start: 14, task: "cargar", place: "Centro de acopio Neiva", city: "neiva", taken: 3, total: 10 },
  { id: "neiva-comedor-lun", when: { weekday: 1 }, start: 8, task: "cocina", place: "Comedor comunitario Neiva", city: "neiva", taken: 4, total: 8 },
];

/**
 * 8 → "8:00 a. m.", 12 → "12:00 m.", 14 → "2:00 p. m." (como se escribe la hora en Colombia). Con espacios que no
 * se parten, para que "a. m." nunca quede en otra línea.
 */
export function hora(hour: number) {
  if (hour === 12) return "12:00\u00a0m.";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:00\u00a0${hour < 12 ? "a.\u00a0m." : "p.\u00a0m."}`;
}

/** "a las 8:00 a. m.", pero "a la 1:00 p. m." */
export function aLaHora(hour: number) {
  return `${hour === 13 || hour === 1 ? "a la" : "a las"} ${hora(hour)}`;
}

/* Artículo de cada lugar para el mensaje ("en el Centro…", "en la Bodega…"). Los lugares son pocos y conocidos. */
const feminine = ["Bodega", "Olla", "Cocina"];

export function enLugar(place: string) {
  return `en ${feminine.some((word) => place.startsWith(word)) ? "la" : "el"} ${place}`;
}

/** "8:00 a. m. a 12:00 m." */
export function horario(start: number) {
  return `${hora(start)} a ${hora(start + SHIFT_HOURS)}`;
}

/* Textos de la página */

export const volunteerHeader = {
  tag: "Voluntariado",
  title: "Turnos abiertos esta semana",
  body: "Clasificar, cargar, cocinar y entregar en Bogotá, Cali, Popayán, Pasto y Neiva. Tú eliges el día, la ciudad y la tarea.",
  // Coherentes con la tarjeta "Sé voluntario" de "Cómo ayudar"
  chips: ["Turnos de 4 horas", "Sin experiencia", "Te confirmamos por mensaje de texto"],
  cta: { label: "Ver la agenda", href: "#agenda" },
};

/** Aviso antes de enviar y en la confirmación: alguien podría creer que el turno es real. */
export const prototypeNotice = {
  before:
    "GeoAid es un prototipo universitario. Esta inscripción no llega a ningún centro de acopio ni a ninguna organización, y no te va a llegar un mensaje de verdad.",
  after:
    "Recuerda que GeoAid es un prototipo universitario: nadie recibió esta inscripción y no se envió ningún mensaje. Si quieres ayudar ya, busca los canales oficiales de tu alcaldía.",
};

export const safetyTips = [
  "No entres a casas ni edificios dañados, ni a zonas acordonadas.",
  "Sigue siempre las indicaciones de quien coordina el turno.",
  "Si hay una réplica, sal con calma al punto de encuentro.",
  "Toma agua y haz pausas. Si te sientes mal, avisa y descansa.",
];

/** Un turno de mañana, paso a paso, con las horas del turno del sábado en el Centro de acopio Norte. */
export const shiftSteps = [
  {
    time: "7:45 a. m.",
    title: "Llegas y te registras",
    body: "Llega 15 minutos antes con tu documento. En la entrada confirman tu nombre y te dan chaleco y guantes.",
  },
  {
    time: "8:00 a. m.",
    title: "Te explican la tarea",
    body: "Quien coordina el turno te muestra qué hacer, dónde va cada caja y por dónde se sale en caso de réplica.",
  },
  {
    time: "8:15 a. m.",
    title: "Trabajas en equipo",
    body: "En grupos pequeños, con una pausa para agua y descanso. En total son 4 horas.",
  },
  {
    time: "11:45 a. m.",
    title: "Cierre y registro",
    body: "El equipo anota lo que hizo: cajas armadas, kilos cargados o familias atendidas. Ese registro alimenta el seguimiento de las donaciones.",
  },
];

export const bringList = [
  "Documento de identidad",
  "Botas o zapatos cerrados",
  "Una botella de agua",
  "Ropa cómoda que se pueda ensuciar",
  "Gorra y bloqueador si vas a una entrega rural",
];

export const foundationNote = {
  title: "¿Coordinas voluntarios en una fundación?",
  body: "La idea es que publiques aquí tus turnos: el día, la tarea, cuántas personas necesitas y qué deben llevar. GeoAid avisa a quienes viven cerca y te muestra quién confirmó.",
  status: "Esta parte todavía no está en el prototipo.",
};
