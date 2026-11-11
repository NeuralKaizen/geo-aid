import { Church, House, Landmark, Users, type LucideIcon } from "lucide-react";
import { sources, type PointStatus } from "@/content/site";

/*
 * Centros y puntos de acopio por ciudad. Todo es de ejemplo salvo la guía de la Cruz Roja y el cierre de los centros
 * de Bogotá, que vienen de las fuentes del proyecto. Las coordenadas caen en barrios reales del casco urbano de cada
 * ciudad, pero las direcciones y los puntos son inventados.
 */

export type CityId = "popayan" | "bogota" | "cali" | "pasto" | "neiva";
export type PointType = "oficial" | "comunal" | "parroquia" | "casa";

/** Lo que algún punto recibe */
export type ItemId = "agua" | "alimentos" | "panales" | "aseo" | "ropa-nueva" | "linternas" | "cobijas";
/** Lo que ningún punto recibe, según la guía de la Cruz Roja */
export type RejectedId = "ropa-usada" | "medicamentos" | "perecederos";
export type WantId = ItemId | RejectedId;

export const items: { id: ItemId; label: string }[] = [
  { id: "agua", label: "Agua" },
  { id: "alimentos", label: "Alimentos no perecederos" },
  { id: "panales", label: "Pañales" },
  { id: "aseo", label: "Kits de aseo" },
  { id: "ropa-nueva", label: "Ropa nueva" },
  { id: "linternas", label: "Linternas y pilas" },
  { id: "cobijas", label: "Cobijas" },
];

/* El porqué va en voz de GeoAid: la fuente solo dice qué no se recibe y que conviene donar dinero */
export const rejectedItems: { id: RejectedId; label: string; reason: string }[] = [
  {
    id: "ropa-usada",
    label: "Ropa usada",
    reason: "Hay que lavarla y clasificarla prenda por prenda, y eso quita manos y espacio que hoy hacen falta.",
  },
  {
    id: "medicamentos",
    label: "Medicamentos",
    reason: "Solo el personal de salud puede recibirlos, revisar su vencimiento y entregarlos con seguridad.",
  },
  {
    id: "perecederos",
    label: "Comida perecedera",
    reason: "Se daña en el camino: muchas zonas afectadas quedan a días de viaje por carretera.",
  },
];

export const itemLabel = Object.fromEntries(
  [...items, ...rejectedItems].map((item) => [item.id, item.label]),
) as Record<WantId, string>;

export const isRejected = (id: WantId): id is RejectedId => rejectedItems.some((item) => item.id === id);

/** `label` va en la tarjeta; `short`, en el filtro */
export const pointTypes: Record<PointType, { label: string; short: string; icon: LucideIcon }> = {
  oficial: { label: "Punto oficial", short: "Oficial", icon: Landmark },
  comunal: { label: "Salón comunal", short: "Salón comunal", icon: Users },
  parroquia: { label: "Parroquia", short: "Parroquia", icon: Church },
  casa: { label: "Casa o garaje de un vecino", short: "Casa o garaje de vecino", icon: House },
};

export type CollectionPoint = {
  id: string;
  name: string;
  type: PointType;
  barrio: string;
  address: string;
  /** [longitud, latitud], el orden que usa MapLibre */
  coords: [number, number];
  /** horario de hoy */
  hours: string;
  status: PointStatus;
  /** parte de la capacidad ya ocupada, de 0 a 1 */
  load: number;
  accepts: ItemId[];
  /** solo puntos comunitarios: una junta de acción comunal ya lo visitó (de ejemplo) */
  verified?: boolean;
};

export type City = {
  id: CityId;
  name: string;
  department: string;
  /** puntos registrados en la ciudad, de los que mostramos una muestra */
  total: number;
  /** cuántos de ellos abrieron vecinos en casas, garajes y salones */
  neighbors: number;
  /** contexto real de la ciudad, con su fuente */
  note?: { text: string; source: string };
  points: CollectionPoint[];
};

const pulzo = sources.find((source) => source.startsWith("Pulzo")) ?? "";

export const cities: City[] = [
  {
    id: "popayan",
    name: "Popayán",
    department: "Cauca",
    total: 38,
    neighbors: 21,
    points: [
      {
        id: "garaje-munoz",
        name: "Garaje de los Muñoz",
        type: "casa",
        barrio: "Bolívar",
        address: "Cra. 6 # 2N-24",
        coords: [-76.6047, 2.4472],
        hours: "7:00 a. m. a 6:00 p. m.",
        status: "abierto",
        load: 0.34,
        accepts: ["agua", "panales"],
        verified: true,
      },
      {
        id: "salon-esmeralda",
        name: "Salón comunal Esmeralda",
        type: "comunal",
        barrio: "La Esmeralda",
        address: "Cl. 5 # 32-18",
        coords: [-76.6175, 2.4365],
        hours: "9:00 a. m. a 5:00 p. m.",
        status: "casi-lleno",
        load: 0.86,
        accepts: ["alimentos", "aseo", "cobijas"],
        verified: true,
      },
      {
        id: "coliseo-municipal",
        name: "Coliseo municipal",
        type: "oficial",
        barrio: "Ciudad Jardín",
        address: "Cl. 15N # 9-40",
        coords: [-76.5938, 2.4553],
        hours: "8:00 a. m. a 4:00 p. m.",
        status: "lleno",
        load: 1,
        accepts: ["agua", "alimentos", "aseo", "cobijas"],
      },
      {
        id: "parroquia-pubenza",
        name: "Salón parroquial de Pubenza",
        type: "parroquia",
        barrio: "Pubenza",
        address: "Cra. 10 # 18-05",
        coords: [-76.606, 2.4318],
        hours: "8:00 a. m. a 12:00 m.",
        status: "abierto",
        load: 0.5,
        accepts: ["ropa-nueva", "cobijas", "aseo", "panales"],
      },
      {
        id: "casa-ordonez",
        name: "Casa de la familia Ordóñez",
        type: "casa",
        barrio: "Valencia",
        address: "Cl. 3 # 2E-41",
        coords: [-76.596, 2.441],
        hours: "2:00 p. m. a 7:00 p. m.",
        status: "abierto",
        load: 0.2,
        accepts: ["agua", "alimentos", "linternas"],
      },
      {
        id: "salon-pandiguando",
        name: "Salón comunal Pandiguando",
        type: "comunal",
        barrio: "Pandiguando",
        address: "Cra. 17 # 8N-12",
        coords: [-76.6115, 2.45],
        hours: "8:00 a. m. a 6:00 p. m.",
        status: "abierto",
        load: 0.58,
        accepts: ["agua", "aseo", "panales", "linternas"],
        verified: true,
      },
      {
        id: "polideportivo-bello-horizonte",
        name: "Polideportivo Bello Horizonte",
        type: "oficial",
        barrio: "Bello Horizonte",
        address: "Cl. 33N # 6-20",
        coords: [-76.598, 2.464],
        hours: "7:00 a. m. a 5:00 p. m.",
        status: "casi-lleno",
        load: 0.78,
        accepts: ["agua", "alimentos", "cobijas"],
      },
      {
        id: "garaje-hernando",
        name: "Garaje de don Hernando",
        type: "casa",
        barrio: "La Ximena",
        address: "Cra. 26 # 11-37",
        coords: [-76.6155, 2.43],
        hours: "3:00 p. m. a 8:00 p. m.",
        status: "abierto",
        load: 0.4,
        accepts: ["alimentos", "ropa-nueva", "linternas"],
        verified: true,
      },
    ],
  },
  {
    id: "bogota",
    name: "Bogotá",
    department: "Bogotá D. C.",
    total: 46,
    neighbors: 17,
    note: {
      text: "Bogotá cerró sus centros de acopio el 16 y 17 de agosto porque no daban abasto. Antes de salir, mira cuánto espacio le queda a cada punto.",
      source: pulzo,
    },
    points: [
      {
        id: "acopio-norte",
        name: "Centro de acopio Norte",
        type: "oficial",
        barrio: "Toberín",
        address: "Cl. 166 # 20-45",
        coords: [-74.0445, 4.746],
        hours: "8:00 a. m. a 4:00 p. m.",
        status: "casi-lleno",
        load: 0.82,
        accepts: ["agua", "alimentos", "aseo", "panales"],
      },
      {
        id: "salon-galerias",
        name: "Salón comunal Galerías",
        type: "comunal",
        barrio: "Galerías",
        address: "Cra. 24 # 52-30",
        coords: [-74.0745, 4.6428],
        hours: "9:00 a. m. a 6:00 p. m.",
        status: "abierto",
        load: 0.48,
        accepts: ["alimentos", "cobijas", "ropa-nueva"],
        verified: true,
      },
      {
        id: "parroquia-chapinero",
        name: "Salón parroquial de Chapinero",
        type: "parroquia",
        barrio: "Chapinero Central",
        address: "Cl. 59 # 9-21",
        coords: [-74.064, 4.6455],
        hours: "8:00 a. m. a 1:00 p. m.",
        status: "abierto",
        load: 0.55,
        accepts: ["ropa-nueva", "cobijas", "aseo"],
      },
      {
        id: "garaje-rodriguez",
        name: "Garaje de los Rodríguez",
        type: "casa",
        barrio: "Kennedy Central",
        address: "Cra. 78 # 38A-12 Sur",
        coords: [-74.1505, 4.63],
        hours: "4:00 p. m. a 8:00 p. m.",
        status: "abierto",
        load: 0.3,
        accepts: ["agua", "panales", "linternas"],
        verified: true,
      },
      {
        id: "casa-marlene",
        name: "Casa de doña Marlene",
        type: "casa",
        barrio: "Suba Centro",
        address: "Cl. 145 # 91-20",
        coords: [-74.0845, 4.742],
        hours: "10:00 a. m. a 5:00 p. m.",
        status: "casi-lleno",
        load: 0.8,
        accepts: ["alimentos", "aseo"],
      },
      {
        id: "salon-bosa",
        name: "Salón comunal Bosa Centro",
        type: "comunal",
        barrio: "Bosa Centro",
        address: "Cra. 80 # 61-15 Sur",
        coords: [-74.189, 4.619],
        hours: "8:00 a. m. a 5:00 p. m.",
        status: "abierto",
        load: 0.42,
        accepts: ["agua", "alimentos", "cobijas", "linternas"],
        verified: true,
      },
      {
        id: "punto-fontibon",
        name: "Punto oficial Fontibón",
        type: "oficial",
        barrio: "Fontibón Centro",
        address: "Cra. 100 # 17-40",
        coords: [-74.144, 4.6735],
        hours: "8:00 a. m. a 3:00 p. m.",
        status: "lleno",
        load: 1,
        accepts: ["agua", "alimentos", "aseo"],
      },
      {
        id: "garaje-pena",
        name: "Garaje de la familia Peña",
        type: "casa",
        barrio: "La Soledad",
        address: "Cl. 40 # 21-18",
        coords: [-74.074, 4.633],
        hours: "5:00 p. m. a 9:00 p. m.",
        status: "abierto",
        load: 0.25,
        accepts: ["panales", "aseo", "linternas"],
        verified: true,
      },
    ],
  },
  {
    id: "cali",
    name: "Cali",
    department: "Valle del Cauca",
    total: 27,
    neighbors: 12,
    points: [
      {
        id: "punto-san-fernando",
        name: "Punto oficial San Fernando",
        type: "oficial",
        barrio: "San Fernando",
        address: "Cl. 5 # 36-20",
        coords: [-76.5435, 3.434],
        hours: "8:00 a. m. a 4:00 p. m.",
        status: "casi-lleno",
        load: 0.84,
        accepts: ["agua", "alimentos", "aseo"],
      },
      {
        id: "salon-ingenio",
        name: "Salón comunal El Ingenio",
        type: "comunal",
        barrio: "El Ingenio",
        address: "Cra. 83 # 15-40",
        coords: [-76.53, 3.3885],
        hours: "9:00 a. m. a 6:00 p. m.",
        status: "abierto",
        load: 0.4,
        accepts: ["alimentos", "panales", "cobijas"],
        verified: true,
      },
      {
        id: "parroquia-san-antonio",
        name: "Salón parroquial de San Antonio",
        type: "parroquia",
        barrio: "San Antonio",
        address: "Cra. 10 # 2-15",
        coords: [-76.5388, 3.4475],
        hours: "8:00 a. m. a 12:00 m.",
        status: "abierto",
        load: 0.5,
        accepts: ["ropa-nueva", "cobijas", "aseo"],
      },
      {
        id: "garaje-valencia",
        name: "Garaje de los Valencia",
        type: "casa",
        barrio: "Alameda",
        address: "Cl. 8 # 24-33",
        coords: [-76.533, 3.4385],
        hours: "3:00 p. m. a 8:00 p. m.",
        status: "abierto",
        load: 0.3,
        accepts: ["agua", "panales", "linternas"],
        verified: true,
      },
      {
        id: "salon-siloe",
        name: "Salón comunal Siloé",
        type: "comunal",
        barrio: "Siloé",
        address: "Cra. 52 # 6-18 Oeste",
        coords: [-76.5605, 3.4255],
        hours: "9:00 a. m. a 4:00 p. m.",
        status: "lleno",
        load: 1,
        accepts: ["agua", "alimentos"],
      },
      {
        id: "casa-renteria",
        name: "Casa de la familia Rentería",
        type: "casa",
        barrio: "Floralia",
        address: "Cl. 76 # 2B-10",
        coords: [-76.4925, 3.4875],
        hours: "2:00 p. m. a 7:00 p. m.",
        status: "abierto",
        load: 0.35,
        accepts: ["aseo", "alimentos", "linternas"],
      },
    ],
  },
  {
    id: "pasto",
    name: "Pasto",
    department: "Nariño",
    total: 16,
    neighbors: 7,
    points: [
      {
        id: "punto-centro-pasto",
        name: "Punto oficial del Centro",
        type: "oficial",
        barrio: "Centro",
        address: "Cl. 19 # 25-60",
        coords: [-77.281, 1.214],
        hours: "8:00 a. m. a 5:00 p. m.",
        status: "abierto",
        load: 0.58,
        accepts: ["agua", "alimentos", "cobijas", "aseo"],
      },
      {
        id: "salon-tamasagra",
        name: "Salón comunal Tamasagra",
        type: "comunal",
        barrio: "Tamasagra",
        address: "Cra. 42 # 16-08",
        coords: [-77.2945, 1.2048],
        hours: "9:00 a. m. a 5:00 p. m.",
        status: "casi-lleno",
        load: 0.8,
        accepts: ["alimentos", "cobijas", "ropa-nueva"],
        verified: true,
      },
      {
        id: "parroquia-pandiaco",
        name: "Salón parroquial de Pandiaco",
        type: "parroquia",
        barrio: "Pandiaco",
        address: "Cl. 18 # 50-22",
        coords: [-77.2838, 1.2283],
        hours: "8:00 a. m. a 12:00 m.",
        status: "abierto",
        load: 0.45,
        accepts: ["aseo", "panales", "ropa-nueva"],
      },
      {
        id: "garaje-benavides",
        name: "Garaje de los Benavides",
        type: "casa",
        barrio: "Lorenzo de Aldana",
        address: "Cra. 4 # 21-35",
        coords: [-77.2705, 1.1988],
        hours: "3:00 p. m. a 7:00 p. m.",
        status: "abierto",
        load: 0.3,
        accepts: ["agua", "linternas", "panales"],
        verified: true,
      },
    ],
  },
  {
    id: "neiva",
    name: "Neiva",
    department: "Huila",
    total: 14,
    neighbors: 6,
    points: [
      {
        id: "punto-quirinal",
        name: "Punto oficial Quirinal",
        type: "oficial",
        barrio: "Quirinal",
        address: "Cl. 13 # 6-30",
        coords: [-75.2848, 2.9375],
        hours: "7:00 a. m. a 3:00 p. m.",
        status: "casi-lleno",
        load: 0.85,
        accepts: ["agua", "alimentos", "aseo"],
      },
      {
        id: "salon-las-granjas",
        name: "Salón comunal Las Granjas",
        type: "comunal",
        barrio: "Las Granjas",
        address: "Cra. 16 # 18-44",
        coords: [-75.2742, 2.944],
        hours: "8:00 a. m. a 5:00 p. m.",
        status: "abierto",
        load: 0.5,
        accepts: ["alimentos", "cobijas", "panales"],
        verified: true,
      },
      {
        id: "parroquia-altico",
        name: "Salón parroquial del Altico",
        type: "parroquia",
        barrio: "Altico",
        address: "Cl. 6 # 1-15",
        coords: [-75.2862, 2.9218],
        hours: "8:00 a. m. a 12:00 m.",
        status: "abierto",
        load: 0.38,
        accepts: ["ropa-nueva", "aseo", "linternas"],
      },
      {
        id: "casa-cuellar",
        name: "Casa de la familia Cuéllar",
        type: "casa",
        barrio: "Cándido Leguízamo",
        address: "Cra. 8 # 52-17",
        coords: [-75.288, 2.953],
        hours: "4:00 p. m. a 8:00 p. m.",
        status: "lleno",
        load: 1,
        accepts: ["agua", "panales"],
      },
    ],
  },
];

export const statusLabels: Record<PointStatus, string> = {
  abierto: "Abierto",
  "casi-lleno": "Casi lleno",
  lleno: "Lleno",
};

/* Orden de la lista: primero lo que todavía recibe */
export const statusOrder: Record<PointStatus, number> = { abierto: 0, "casi-lleno": 1, lleno: 2 };

/** Guía real de la Cruz Roja (ver `sources`) */
export const redCrossGuide = {
  text: "La Cruz Roja aclaró que no se reciben ropa usada, medicamentos ni comida perecedera, y que la forma más útil de ayudar es donar dinero.",
  source: sources.find((source) => source.includes("Cruz Roja")) ?? "",
  sourceShort: "Infobae, 14 de agosto",
};

/* Abre un punto en tu casa */

export const openPointRequirements = [
  {
    title: "Un espacio techado y seco",
    body: "Un garaje, una sala o un salón donde las cajas no se mojen y no estorben el paso.",
  },
  {
    title: "Un horario fijo",
    body: "Aunque sean dos horas al día. Quien va a donar necesita saber cuándo encuentra la puerta abierta.",
  },
  {
    title: "Una persona responsable",
    body: "Alguien que reciba, anote lo que llega y avise cuando el punto se esté llenando.",
  },
];

/* Cómo se verificaría un punto nuevo: es el funcionamiento propuesto, no un acuerdo real con nadie */
export const verificationSteps = [
  "Registras el punto con su horario y lo que puedes recibir.",
  "Un líder de la junta de acción comunal o de la alcaldía lo visita y confirma los datos.",
  "Aparece en el mapa con la insignia de verificado y actualizas cada día qué recibes.",
];

export const scheduleDays = ["Todos los días", "Lunes a viernes", "Lunes a sábado", "Solo fines de semana"];
