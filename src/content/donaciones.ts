/*
 * Datos de Donaciones y Donar. Todo lo de este archivo es de ejemplo: zonas, cifras, entregas y costos sirven para
 * mostrar cómo funcionará el tablero. Lo único que se mantiene fijo es lo que ya muestra el hero: Vereda La Palma,
 * en Morales (Cauca), con 86 familias, 220 de 340 kits de agua y aseo y $45.000 por kit.
 */

export type NeedType = "agua" | "alimentos" | "aseo" | "refugio" | "salud";

export const needTypes: { id: NeedType; label: string }[] = [
  { id: "agua", label: "Agua" },
  { id: "alimentos", label: "Alimentos" },
  { id: "aseo", label: "Aseo" },
  { id: "refugio", label: "Refugio" },
  { id: "salud", label: "Salud" },
];

export type ZoneNeed = {
  type: NeedType;
  /** lo que se pide, p. ej. "Kits de agua y aseo" */
  item: string;
  /** cómo se cuenta, en plural, p. ej. "kits" */
  unit: string;
  delivered: number;
  goal: number;
  /** para qué sirve y cómo se calculó la meta */
  detail: string;
};

export type Delivery = {
  /** fecha corta, p. ej. "9 nov" */
  date: string;
  what: string;
  /** cómo llegó */
  via: string;
};

export type Zone = {
  slug: string;
  name: string;
  municipality: string;
  department: string;
  families: number;
  /** cuándo la comunidad actualizó lo que le falta */
  updated: string;
  /** quién confirmó la necesidad en terreno */
  verifiedBy: string;
  /** la primera es la necesidad principal: con ella se calcula qué alcanza a cubrir una donación a la zona */
  needs: ZoneNeed[];
  /** las tres más recientes, de la más nueva a la más vieja */
  deliveries: Delivery[];
};

export const zones: Zone[] = [
  {
    slug: "vereda-la-palma",
    name: "Vereda La Palma",
    municipality: "Morales",
    department: "Cauca",
    families: 86,
    updated: "Hoy, 9:40 a. m.",
    verifiedBy: "Junta de acción comunal",
    needs: [
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 220,
        goal: 340,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 80,
        goal: 430,
        detail: "El tanque de la vereda se agrietó. Mientras lo reparan, cada familia necesita cinco bidones por semana.",
      },
      {
        type: "refugio",
        item: "Colchonetas y cobijas",
        unit: "juegos",
        delivered: 40,
        goal: 172,
        detail: "Dos juegos por familia para quienes duermen en la escuela y en el salón comunal.",
      },
    ],
    deliveries: [
      { date: "9 nov", what: "40 kits de agua y aseo", via: "Ruta rural desde Popayán" },
      { date: "6 nov", what: "60 bidones de agua potable", via: "Carrotanque hasta la escuela" },
      { date: "2 nov", what: "40 juegos de colchoneta y cobija", via: "Camión desde Morales" },
    ],
  },
  {
    slug: "vereda-el-carmen",
    name: "Vereda El Carmen",
    municipality: "Cajibío",
    department: "Cauca",
    families: 54,
    updated: "Hoy, 8:15 a. m.",
    verifiedBy: "Visita de voluntarios",
    needs: [
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 40,
        goal: 216,
        detail: "Cuatro mercados por familia para el próximo mes. Los derrumbes taparon el camino a los cultivos de café.",
      },
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 150,
        goal: 270,
        detail: "Cinco bidones por familia mientras se limpia la bocatoma del acueducto veredal.",
      },
    ],
    deliveries: [
      { date: "8 nov", what: "20 mercados familiares", via: "Mulas desde la vía principal" },
      { date: "5 nov", what: "90 bidones de agua potable", via: "Camión hasta el puente" },
      { date: "1 nov", what: "20 mercados familiares", via: "Mulas desde la vía principal" },
    ],
  },
  {
    slug: "corregimiento-siberia",
    name: "Corregimiento Siberia",
    municipality: "Caldono",
    department: "Cauca",
    families: 128,
    updated: "Ayer, 6:30 p. m.",
    verifiedBy: "Junta de acción comunal",
    needs: [
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 105,
        goal: 256,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
      {
        type: "refugio",
        item: "Carpas familiares",
        unit: "carpas",
        delivered: 38,
        goal: 128,
        detail: "Una carpa por familia cuya casa quedó inhabitable. Hoy varias familias comparten una misma carpa.",
      },
      {
        type: "salud",
        item: "Botiquines familiares",
        unit: "botiquines",
        delivered: 60,
        goal: 128,
        detail: "Gasas, antisépticos, suero oral y termómetro. Sin medicamentos: esos los entrega el puesto de salud.",
      },
    ],
    deliveries: [
      { date: "10 nov", what: "18 carpas familiares", via: "Camión desde Santander de Quilichao" },
      { date: "7 nov", what: "60 botiquines familiares", via: "Ruta rural desde Popayán" },
      { date: "3 nov", what: "105 kits de agua y aseo", via: "Camión desde Santander de Quilichao" },
    ],
  },
  {
    slug: "vereda-la-esperanza",
    name: "Vereda La Esperanza",
    municipality: "Timbío",
    department: "Cauca",
    families: 47,
    updated: "Hoy, 7:50 a. m.",
    verifiedBy: "Líderes de la vereda",
    needs: [
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 90,
        goal: 235,
        detail: "Cinco bidones por familia. La vereda quedó por fuera del registro oficial y la ayuda tardó en llegar.",
      },
      {
        type: "refugio",
        item: "Tejas de zinc",
        unit: "tejas",
        delivered: 330,
        goal: 564,
        detail: "Doce tejas por casa para volver a cubrir los techos antes de la temporada de lluvias.",
      },
    ],
    deliveries: [
      { date: "9 nov", what: "120 tejas de zinc", via: "Camión desde Timbío" },
      { date: "4 nov", what: "50 bidones de agua potable", via: "Camioneta de la junta" },
      { date: "30 oct", what: "210 tejas de zinc", via: "Camión desde Popayán" },
    ],
  },
  {
    slug: "vereda-el-rosal",
    name: "Vereda El Rosal",
    municipality: "Buesaco",
    department: "Nariño",
    families: 72,
    updated: "Hoy, 10:05 a. m.",
    verifiedBy: "Visita de voluntarios",
    needs: [
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 150,
        goal: 288,
        detail: "Cuatro mercados por familia para el próximo mes.",
      },
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 84,
        goal: 144,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
      {
        type: "salud",
        item: "Botiquines familiares",
        unit: "botiquines",
        delivered: 41,
        goal: 72,
        detail: "Uno por familia, con gasas, antisépticos y suero oral.",
      },
    ],
    deliveries: [
      { date: "10 nov", what: "60 mercados familiares", via: "Camión desde Pasto" },
      { date: "6 nov", what: "41 botiquines familiares", via: "Camión desde Pasto" },
      { date: "2 nov", what: "84 kits de agua y aseo", via: "Chiva desde Buesaco" },
    ],
  },
  {
    slug: "corregimiento-la-laguna",
    name: "Corregimiento La Laguna",
    municipality: "Pasto",
    department: "Nariño",
    families: 140,
    updated: "Ayer, 4:20 p. m.",
    verifiedBy: "Junta de acción comunal",
    needs: [
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 420,
        goal: 700,
        detail: "Cinco bidones por familia por semana.",
      },
      {
        type: "refugio",
        item: "Carpas familiares",
        unit: "carpas",
        delivered: 70,
        goal: 140,
        detail: "Una carpa por familia mientras revisan cuáles casas se pueden volver a habitar.",
      },
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 360,
        goal: 560,
        detail: "Cuatro mercados por familia para el próximo mes.",
      },
    ],
    deliveries: [
      { date: "9 nov", what: "200 bidones de agua potable", via: "Carrotanque desde Pasto" },
      { date: "7 nov", what: "35 carpas familiares", via: "Camión desde Pasto" },
      { date: "4 nov", what: "180 mercados familiares", via: "Camión desde Pasto" },
    ],
  },
  {
    slug: "barrio-bello-horizonte",
    name: "Barrio Bello Horizonte",
    municipality: "Popayán",
    department: "Cauca",
    families: 210,
    updated: "Hoy, 6:45 a. m.",
    verifiedBy: "Líderes del barrio",
    needs: [
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 260,
        goal: 420,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
      {
        type: "refugio",
        item: "Colchonetas y cobijas",
        unit: "juegos",
        delivered: 270,
        goal: 420,
        detail: "Dos juegos por familia en el albergue.",
      },
    ],
    deliveries: [
      { date: "10 nov", what: "90 kits de agua y aseo", via: "Voluntarios desde el centro de acopio" },
      { date: "8 nov", what: "120 juegos de colchoneta y cobija", via: "Camión de la ciudad" },
      { date: "5 nov", what: "170 kits de agua y aseo", via: "Voluntarios desde el centro de acopio" },
    ],
  },
  {
    slug: "corregimiento-tenerife",
    name: "Corregimiento Tenerife",
    municipality: "El Cerrito",
    department: "Valle del Cauca",
    families: 63,
    updated: "Ayer, 11:10 a. m.",
    verifiedBy: "Visita de voluntarios",
    needs: [
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 168,
        goal: 252,
        detail: "Cuatro mercados por familia para el próximo mes.",
      },
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 200,
        goal: 315,
        detail: "Cinco bidones por familia mientras se repara la conducción del acueducto.",
      },
      {
        type: "salud",
        item: "Botiquines familiares",
        unit: "botiquines",
        delivered: 43,
        goal: 63,
        detail: "Uno por familia, con gasas, antisépticos y suero oral.",
      },
    ],
    deliveries: [
      { date: "8 nov", what: "84 mercados familiares", via: "Camión desde Palmira" },
      { date: "6 nov", what: "120 bidones de agua potable", via: "Carrotanque desde El Cerrito" },
      { date: "2 nov", what: "43 botiquines familiares", via: "Camión desde Cali" },
    ],
  },
  {
    slug: "vereda-las-mercedes",
    name: "Vereda Las Mercedes",
    municipality: "La Plata",
    department: "Huila",
    families: 58,
    updated: "Hoy, 9:05 a. m.",
    verifiedBy: "Junta de acción comunal",
    needs: [
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 86,
        goal: 116,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
      {
        type: "refugio",
        item: "Tejas de zinc",
        unit: "tejas",
        delivered: 480,
        goal: 696,
        detail: "Doce tejas por casa para cerrar los techos que se abrieron.",
      },
    ],
    deliveries: [
      { date: "9 nov", what: "180 tejas de zinc", via: "Camión desde La Plata" },
      { date: "5 nov", what: "86 kits de agua y aseo", via: "Chiva desde La Plata" },
      { date: "31 oct", what: "300 tejas de zinc", via: "Camión desde Neiva" },
    ],
  },
  {
    slug: "vereda-el-diamante",
    name: "Vereda El Diamante",
    municipality: "Rioblanco",
    department: "Tolima",
    families: 39,
    updated: "Ayer, 2:40 p. m.",
    verifiedBy: "Líderes de la vereda",
    needs: [
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 120,
        goal: 156,
        detail: "Cuatro mercados por familia para el próximo mes.",
      },
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 140,
        goal: 195,
        detail: "Cinco bidones por familia por semana.",
      },
    ],
    deliveries: [
      { date: "7 nov", what: "40 mercados familiares", via: "Mulas desde la carretera" },
      { date: "3 nov", what: "140 bidones de agua potable", via: "Camioneta desde Rioblanco" },
      { date: "29 oct", what: "80 mercados familiares", via: "Mulas desde la carretera" },
    ],
  },
  {
    slug: "corregimiento-la-buitrera",
    name: "Corregimiento La Buitrera",
    municipality: "Palmira",
    department: "Valle del Cauca",
    families: 95,
    updated: "Hoy, 8:30 a. m.",
    verifiedBy: "Visita de voluntarios",
    needs: [
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 145,
        goal: 190,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
      {
        type: "salud",
        item: "Botiquines familiares",
        unit: "botiquines",
        delivered: 72,
        goal: 95,
        detail: "Uno por familia, con gasas, antisépticos y suero oral.",
      },
    ],
    deliveries: [
      { date: "10 nov", what: "45 kits de agua y aseo", via: "Camión desde Palmira" },
      { date: "6 nov", what: "72 botiquines familiares", via: "Camión desde Cali" },
      { date: "1 nov", what: "100 kits de agua y aseo", via: "Camión desde Palmira" },
    ],
  },
  {
    slug: "vereda-san-isidro",
    name: "Vereda San Isidro",
    municipality: "Piendamó",
    department: "Cauca",
    families: 44,
    updated: "Ayer, 9:00 a. m.",
    verifiedBy: "Junta de acción comunal",
    needs: [
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 140,
        goal: 176,
        detail: "Cuatro mercados por familia para el próximo mes.",
      },
      {
        type: "refugio",
        item: "Colchonetas y cobijas",
        unit: "juegos",
        delivered: 70,
        goal: 88,
        detail: "Dos juegos por familia.",
      },
    ],
    deliveries: [
      { date: "8 nov", what: "60 mercados familiares", via: "Camión desde Piendamó" },
      { date: "4 nov", what: "70 juegos de colchoneta y cobija", via: "Camión desde Popayán" },
      { date: "30 oct", what: "80 mercados familiares", via: "Camión desde Piendamó" },
    ],
  },
  {
    slug: "barrio-san-antonio",
    name: "Barrio San Antonio",
    municipality: "Pitalito",
    department: "Huila",
    families: 120,
    updated: "Hoy, 7:20 a. m.",
    verifiedBy: "Líderes del barrio",
    needs: [
      {
        type: "agua",
        item: "Agua potable",
        unit: "bidones de 20 L",
        delivered: 490,
        goal: 600,
        detail: "Cinco bidones por familia mientras vuelve el servicio en el barrio.",
      },
      {
        type: "aseo",
        item: "Kits de agua y aseo",
        unit: "kits",
        delivered: 200,
        goal: 240,
        detail: "Cada kit trae agua para tomar, jabón, crema dental y toallas higiénicas para una familia por una semana.",
      },
    ],
    deliveries: [
      { date: "10 nov", what: "250 bidones de agua potable", via: "Carrotanque de la ciudad" },
      { date: "7 nov", what: "200 kits de agua y aseo", via: "Voluntarios desde el centro de acopio" },
      { date: "3 nov", what: "240 bidones de agua potable", via: "Carrotanque de la ciudad" },
    ],
  },
  {
    slug: "corregimiento-genoy",
    name: "Corregimiento Genoy",
    municipality: "Pasto",
    department: "Nariño",
    families: 66,
    updated: "Ayer, 5:15 p. m.",
    verifiedBy: "Visita de voluntarios",
    needs: [
      {
        type: "salud",
        item: "Botiquines familiares",
        unit: "botiquines",
        delivered: 56,
        goal: 66,
        detail: "Uno por familia, con gasas, antisépticos y suero oral.",
      },
      {
        type: "alimentos",
        item: "Mercados familiares",
        unit: "mercados",
        delivered: 225,
        goal: 264,
        detail: "Cuatro mercados por familia para el próximo mes.",
      },
    ],
    deliveries: [
      { date: "9 nov", what: "75 mercados familiares", via: "Camión desde Pasto" },
      { date: "5 nov", what: "56 botiquines familiares", via: "Camión desde Pasto" },
      { date: "1 nov", what: "150 mercados familiares", via: "Camión desde Pasto" },
    ],
  },
];

/** Departamentos del tablero, en el orden en que aparecen las zonas */
export const departments = [...new Set(zones.map((zone) => zone.department))];

/** Donaciones de la semana que muestra la cabecera (ejemplo) */
export const weeklyDonations = 3218;

/* Costos unitarios: lo que cuesta cada cosa comprada cerca de la zona (ejemplo) */

export type UnitCost = {
  cost: number;
  /** género de la unidad, para decir "un kit" o "una semana" */
  gender: "m" | "f";
  singular: string;
  plural: string;
  /** para quién y por cuánto tiempo alcanza */
  scope: string;
};

export const unitCosts: Record<NeedType, UnitCost> = {
  aseo: { cost: 45000, gender: "m", singular: "kit de agua y aseo", plural: "kits de agua y aseo", scope: "para una familia por una semana" },
  agua: { cost: 28000, gender: "f", singular: "semana de agua potable", plural: "semanas de agua potable", scope: "para una familia" },
  alimentos: { cost: 17000, gender: "m", singular: "día de comida", plural: "días de comida", scope: "para una familia" },
  refugio: { cost: 42000, gender: "m", singular: "juego de colchoneta y cobija", plural: "juegos de colchoneta y cobija", scope: "para dormir abrigado en el albergue" },
  salud: { cost: 38000, gender: "m", singular: "botiquín familiar", plural: "botiquines familiares", scope: "con gasas, antisépticos y suero oral" },
};

/* A dónde va cada peso (ejemplo) */

export const allocation = [
  {
    id: "compras",
    label: "Alimentos y agua comprados cerca de la zona",
    share: 68,
    detail: "En tiendas y plazas de mercado del municipio o de la ciudad más cercana.",
  },
  {
    id: "transporte",
    label: "Transporte a zonas rurales",
    share: 14,
    detail: "Camiones, chivas y mulas para el último tramo, donde no entra un camión grande.",
  },
  {
    id: "kits",
    label: "Kits de aseo y refugio",
    share: 12,
    detail: "Jabón, toallas higiénicas, colchonetas, cobijas y carpas.",
  },
  {
    id: "operacion",
    label: "Operación y verificación",
    share: 6,
    detail: "Visitas para confirmar cada necesidad y cada entrega.",
  },
] as const;

/* Donar */

export const suggestedAmount = 85000;
export const amountPresets = [20000, 50000, 85000, 150000];
export const minimumAmount = 10000;

/** Destinos por tipo de ayuda. El nombre coincide con los de la donación rápida del inicio. */
export const typeDestinations = [
  {
    id: "agua",
    label: "Agua potable",
    description: "Bidones y carrotanques para las veredas sin acueducto.",
  },
  {
    id: "alimentos",
    label: "Kits de alimentos",
    description: "Mercados comprados en la plaza del municipio más cercano.",
  },
  {
    id: "refugio",
    label: "Refugio temporal",
    description: "Carpas, colchonetas, cobijas y tejas para volver a techar.",
  },
] as const satisfies { id: NeedType; label: string; description: string }[];

export const paymentMethods = [
  { id: "pse", label: "PSE", description: "Débito desde tu cuenta de ahorros o corriente" },
  { id: "nequi", label: "Nequi", description: "Desde la app, con tu número de celular" },
  { id: "daviplata", label: "Daviplata", description: "Desde la app, con tu número de celular" },
  { id: "tarjeta", label: "Tarjeta", description: "Crédito o débito" },
] as const;

export type PaymentMethodId = (typeof paymentMethods)[number]["id"];
