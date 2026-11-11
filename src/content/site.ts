import {
  ClipboardPen,
  HandCoins,
  HandHeart,
  Newspaper,
  Package,
  SearchCheck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type Photo = {
  src: string;
  alt: string;
  credit: string;
  /** object-position para el recorte */
  position?: string;
};

export type Action = { label: string; href: string };

/* Navegación principal */

export const navLinks = [
  { slug: "noticias", label: "Noticias", href: "/noticias" },
  { slug: "donaciones", label: "Donaciones", href: "/donaciones" },
  { slug: "voluntariado", label: "Voluntariado", href: "/voluntariado" },
  { slug: "centros-de-acopio", label: "Centros de acopio", href: "/centros-de-acopio" },
  { slug: "desaparecidos", label: "Desaparecidos", href: "/desaparecidos" },
] as const;

export type NavSlug = (typeof navLinks)[number]["slug"];

export const emergencyLine = { label: "Emergencias", number: "123" };

export const dataNote = "Cifras oficiales de la UNGRD con corte al 10 de octubre de 2026";

/* Fotos (ver IMAGE_CREDITS.md) */

export const photos = {
  noticias: {
    src: "/images/noticias.jpg",
    alt: "Edificio colapsado sobre una calle después de un terremoto",
    credit: "Foto: Agencia de Noticias ANDES, Portoviejo 2016. CC BY-SA 2.0",
    position: "35% 50%",
  },
  donaciones: {
    src: "/images/donaciones.jpg",
    alt: "Voluntario carga una caja de donaciones marcada a mano",
    credit: "Foto: Cpl. Lydia Gordon, U.S. Marine Corps. Dominio público",
    position: "60% 40%",
  },
  voluntariado: {
    src: "/images/voluntariado.jpg",
    alt: "Voluntaria sonriente levanta una caja de ayuda humanitaria",
    credit: "Foto: Cpl. Lydia Gordon, U.S. Marine Corps. Dominio público",
    position: "72% 40%",
  },
  centros: {
    src: "/images/centros.jpg",
    alt: "Bodega con cajas de donaciones clasificadas por tipo",
    credit: "Foto: A1C James Salellas, U.S. Air Force. Dominio público",
    position: "50% 55%",
  },
  desaparecidos: {
    src: "/images/desaparecidos.jpg",
    alt: "Rescatista con su perro de búsqueda recorre una casa derrumbada",
    credit: "Foto: DFID, Nepal 2015. CC BY 2.0",
    position: "62% 45%",
  },
  ayudaDinero: {
    src: "/images/ayuda-dinero.jpg",
    alt: "Voluntario carga una caja hacia un contenedor de ayuda",
    credit: "Cpl. Lydia Gordon, USMC. Dominio público",
    position: "75% 50%",
  },
  ayudaInsumos: {
    src: "/images/ayuda-insumos.jpg",
    alt: "Personas clasifican donaciones bajo una carpa después de un terremoto",
    credit: "Agencia de Noticias ANDES. CC BY-SA 2.0",
    position: "45% 55%",
  },
  ayudaVoluntario: {
    src: "/images/ayuda-voluntario.jpg",
    alt: "Voluntarios organizan cajas de donaciones en una bodega",
    credit: "Cpl. Lydia Gordon, USMC. Dominio público",
    position: "50% 50%",
  },
  ayudaBuscar: {
    src: "/images/ayuda-buscar.jpg",
    alt: "Rescatista sonríe junto a su perro de búsqueda",
    credit: "DFID. CC BY 2.0",
    position: "40% 40%",
  },
  ayudaNecesidad: {
    src: "/images/ayuda-necesidad.jpg",
    alt: "Comunidad reunida frente a una sede de la Cruz Roja Colombiana en Turbo",
    credit: "OCHA Colombia. CC BY-SA 2.0",
    position: "50% 55%",
  },
} satisfies Record<string, Photo>;

/* Hero */

export type HeroSlide = {
  slug: NavSlug;
  tab: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  body: string;
  primary: Action;
  secondary: Action;
  photo: Photo;
  panel: HeroPanel;
};

/*
 * Tarjeta que acompaña a cada tema del hero. Todas comparten la misma estructura (etiqueta, contenido, enlace y una
 * nota sobre el origen de los datos), pero cada tema muestra su información con una pieza distinta.
 */
export type PointStatus = "abierto" | "casi-lleno" | "lleno";

type PanelBase = {
  label: string;
  context: string;
  link: Action;
  /** origen de los datos, va debajo de la tarjeta */
  caption: string;
};

export type HeroPanel = PanelBase &
  (
    | { kind: "noticias"; items: { source: string; date: string; title: string }[] }
    | {
        kind: "necesidad";
        zone: string;
        place: string;
        need: string;
        delivered: number;
        goal: number;
        /** qué cuenta la barra, p. ej. "kits entregados" */
        unit: string;
        impact: { amount: string; text: string };
        more: string;
      }
    | {
        kind: "turno";
        day: { weekday: string; date: string; month: string };
        task: string;
        place: string;
        hours: string;
        detail: string;
        taken: number;
        total: number;
        more: string;
      }
    | {
        kind: "puntos";
        open: number;
        neighbors: number;
        points: { type: "casa" | "comunal" | "oficial"; name: string; detail: string; status: PointStatus }[];
        register: Action;
      }
    | {
        kind: "reencuentros";
        text: string;
        week: { day: string; count: number }[];
        stats: { value: string; label: string }[];
      }
  );

const exampleCaption = "Datos de ejemplo para mostrar cómo funcionará.";

export const heroSlides: HeroSlide[] = [
  {
    slug: "noticias",
    tab: "Noticias",
    tag: "Reporte UNGRD, 10 de octubre",
    icon: Newspaper,
    title: "489.862 personas damnificadas en 500 municipios",
    body: "Seguimos el terremoto del 10 de agosto con cifras oficiales, zona por zona, para que sepas dónde hace falta ayuda hoy.",
    primary: { label: "Ver noticias", href: "/noticias" },
    secondary: { label: "Cómo ayudar", href: "#como-ayudar" },
    photo: photos.noticias,
    panel: {
      kind: "noticias",
      label: "En las noticias",
      context: "Agosto a octubre",
      // Titulares de las fuentes del planteamiento del problema (ver `sources`), del más reciente al más antiguo
      items: [
        { source: "Infobae", date: "10 oct", title: "La Defensoría pidió reabrir el registro de damnificados" },
        { source: "Vanguardia", date: "5 oct", title: "La Procuraduría pide a la UNGRD agilizar las ayudas" },
        { source: "Urna de Cristal", date: "31 ago", title: "Más de 300 muertos y 260.000 damnificados" },
      ],
      link: { label: "Todas las noticias", href: "/noticias" },
      caption: "Titulares de las fuentes que citamos al final de la página.",
    },
  },
  {
    slug: "donaciones",
    tab: "Donaciones",
    tag: "Donaciones",
    icon: HandHeart,
    title: "Dona lo que de verdad se necesita",
    body: "Cada zona publica lo que le falta. Tú eliges a dónde va tu aporte y ves el día en que llega.",
    primary: { label: "Donar ahora", href: "/donar" },
    secondary: { label: "Necesidades por zona", href: "/donaciones" },
    photo: photos.donaciones,
    panel: {
      kind: "necesidad",
      label: "Necesidad abierta",
      context: "Hoy, 9:40 a. m.",
      zone: "Vereda La Palma",
      place: "Morales, Cauca",
      need: "86 familias siguen en refugio temporal y les faltan 120 kits de agua y aseo.",
      delivered: 220,
      goal: 340,
      unit: "kits entregados",
      impact: { amount: "$45.000", text: "alcanzan para el kit de una familia por una semana" },
      more: "1 de 14 zonas",
      link: { label: "Aportar a esta zona", href: "/donar" },
      caption: exampleCaption,
    },
  },
  {
    slug: "voluntariado",
    tab: "Voluntariado",
    tag: "Voluntariado",
    icon: Users,
    title: "Hacen falta manos para clasificar, cargar y entregar",
    body: "Inscríbete una vez y te avisamos cuando haya un turno cerca de ti, en un centro de acopio o en un punto de entrega.",
    primary: { label: "Quiero ser voluntario", href: "/voluntariado" },
    secondary: { label: "Ver turnos abiertos", href: "/voluntariado" },
    photo: photos.voluntariado,
    panel: {
      kind: "turno",
      label: "Próximo turno",
      context: "Bogotá",
      day: { weekday: "Sáb", date: "14", month: "Nov" },
      task: "Clasificar y empacar donaciones",
      place: "Centro de acopio Norte",
      hours: "8:00 a. m. a 12:00 m.",
      detail: "No necesitas experiencia: al llegar te explican todo.",
      taken: 18,
      total: 30,
      more: "6 turnos esta semana",
      link: { label: "Tomar este turno", href: "/voluntariado" },
      caption: exampleCaption,
    },
  },
  {
    slug: "centros-de-acopio",
    tab: "Centros de acopio",
    tag: "Centros de acopio",
    icon: Warehouse,
    title: "Antes de llevar donaciones, mira qué recibe cada centro",
    body: "En agosto, Bogotá cerró sus centros de acopio porque no daba abasto. Aquí ves la capacidad de cada uno y lo que pide hoy.",
    primary: { label: "Buscar un centro", href: "/centros-de-acopio" },
    secondary: { label: "Qué no donar", href: "#como-ayudar" },
    photo: photos.centros,
    panel: {
      kind: "puntos",
      label: "Puntos de acopio",
      context: "Popayán",
      open: 38,
      neighbors: 21,
      points: [
        { type: "casa", name: "Garaje de los Muñoz", detail: "Bolívar · agua y pañales", status: "abierto" },
        { type: "comunal", name: "Salón comunal Esmeralda", detail: "Alimentos no perecederos", status: "casi-lleno" },
        { type: "oficial", name: "Coliseo municipal", detail: "Punto oficial de la alcaldía", status: "lleno" },
      ],
      register: { label: "¿Abriste uno? Regístralo", href: "/centros-de-acopio" },
      link: { label: "Ver el mapa", href: "/centros-de-acopio" },
      caption: exampleCaption,
    },
  },
  {
    slug: "desaparecidos",
    tab: "Desaparecidos",
    tag: "Personas desaparecidas",
    icon: SearchCheck,
    title: "Ayúdanos a reencontrar familias",
    body: "Consulta o publica reportes de personas desaparecidas. Cada reporte se verifica con las autoridades antes de publicarse.",
    primary: { label: "Consultar reportes", href: "/desaparecidos" },
    secondary: { label: "Reportar a una persona", href: "/desaparecidos" },
    photo: photos.desaparecidos,
    panel: {
      kind: "reencuentros",
      label: "Reencuentros",
      context: "Últimos 7 días",
      text: "familias volvieron a encontrarse",
      week: [
        { day: "J", count: 4 },
        { day: "V", count: 7 },
        { day: "S", count: 5 },
        { day: "D", count: 8 },
        { day: "L", count: 6 },
        { day: "M", count: 4 },
        { day: "Hoy", count: 3 },
      ],
      stats: [
        { value: "412", label: "reportes activos" },
        { value: "1.208", label: "reencuentros desde agosto" },
      ],
      link: { label: "Cómo verificamos cada reporte", href: "/desaparecidos" },
      caption: exampleCaption,
    },
  },
];

/* Donación rápida */

export const donationDestinations = [
  "Donde más se necesite",
  "Familias en zonas rurales",
  "Kits de alimentos",
  "Agua potable",
  "Refugio temporal",
];

/* Cómo ayudar */

export type HelpOption = {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  fact: { label: string; value: string };
  primary: Action;
  secondary: Action;
  photo: Photo;
};

export const helpOptions: HelpOption[] = [
  {
    id: "dinero",
    icon: HandCoins,
    title: "Dona dinero",
    body: "Es la ayuda que más rápido se mueve. Se convierte en mercados comprados cerca de la zona afectada, sin pagar transporte desde otras ciudades.",
    fact: { label: "Donación sugerida", value: "$85.000" },
    primary: { label: "Donar ahora", href: "/donar" },
    secondary: { label: "A dónde va", href: "/donaciones" },
    photo: photos.ayudaDinero,
  },
  {
    id: "insumos",
    icon: Package,
    title: "Dona insumos",
    body: "Lleva solo lo que el centro de acopio pide hoy. La Cruz Roja no recibe ropa usada, medicamentos ni comida perecedera.",
    fact: { label: "Lo que más piden hoy", value: "Agua y aseo" },
    primary: { label: "Buscar un centro", href: "/centros-de-acopio" },
    secondary: { label: "Qué no donar", href: "/centros-de-acopio" },
    photo: photos.ayudaInsumos,
  },
  {
    id: "voluntario",
    icon: Users,
    title: "Sé voluntario",
    body: "Clasifica, empaca y transporta donaciones. Eliges el turno y el lugar, y te confirmamos por mensaje de texto.",
    fact: { label: "Duración de un turno", value: "4 horas" },
    primary: { label: "Inscribirme", href: "/voluntariado" },
    secondary: { label: "Ver turnos", href: "/voluntariado" },
    photo: photos.ayudaVoluntario,
  },
  {
    id: "buscar",
    icon: SearchCheck,
    title: "Ayuda a buscar",
    body: "Revisa los reportes de personas desaparecidas en tu municipio y avisa si sabes algo. Un dato a tiempo puede reunir a una familia.",
    fact: { label: "Línea de emergencias", value: "123" },
    primary: { label: "Consultar reportes", href: "/desaparecidos" },
    secondary: { label: "Reportar", href: "/desaparecidos" },
    photo: photos.ayudaBuscar,
  },
  {
    id: "necesidad",
    icon: ClipboardPen,
    title: "Registra una necesidad",
    body: "Si tu vereda o tu comunidad quedó por fuera del registro, cuéntanos qué le falta. Lo verificamos y lo publicamos para que la ayuda llegue.",
    fact: { label: "El registro oficial cerró el", value: "4 de sep." },
    primary: { label: "Registrar necesidad", href: "/necesito-ayuda" },
    secondary: { label: "Cómo funciona", href: "/necesito-ayuda" },
    photo: photos.ayudaNecesidad,
  },
];

export const helpSteps = [
  {
    title: "Mira qué necesita cada zona",
    body: "Las comunidades publican lo que les falta y las autoridades lo verifican.",
  },
  {
    title: "Dona o inscríbete",
    body: "Eliges el destino de tu aporte o un turno de voluntariado cerca de ti.",
  },
  {
    title: "Sigue tu ayuda",
    body: "Ves cuándo sale, por dónde va y a qué municipio llegó.",
  },
];

/* Sigue tu ayuda: seguimiento de ejemplo */

export const trackingDemo = {
  code: "GA-24817",
  amount: "$50.000",
  destination: "Kits de alimentos",
  stops: ["Tu donación", "Centro de acopio", "Ruta rural", "Punto de entrega"],
  steps: [
    { title: "Donación recibida", detail: "Pago confirmado", time: "18 ago, 9:12" },
    { title: "Comprada y empacada", detail: "Centro de acopio regional, por 6 voluntarios", time: "18 ago, 15:40" },
    { title: "En camino", detail: "Camión 3 de 5, ruta rural", time: "19 ago, 6:05" },
    { title: "Entregada", detail: "Punto de entrega rural, 12 familias", time: "19 ago, 13:20" },
  ],
};

/* Para quién es */

export const audiences = [
  {
    id: "gobierno",
    title: "Gobierno y entidades",
    body: "Ve qué zonas ya recibieron ayuda y cuáles no, y reparte sin duplicar entregas.",
  },
  {
    id: "organizaciones",
    title: "Fundaciones y Cruz Roja",
    body: "Publica qué recibes y qué no, y convoca voluntarios por turnos.",
  },
  {
    id: "ciudadania",
    title: "Ciudadanía",
    body: "Sabe qué donar, dónde llevarlo y a dónde llegó lo que diste.",
  },
  {
    id: "comunidades",
    title: "Comunidades afectadas",
    body: "Registra lo que falta en tu vereda, aunque no aparezcas en el registro oficial.",
  },
] as const;

/* Fuentes del problema, tal como las entregó el equipo */

export const sources = [
  "Infobae (10 de octubre de 2026). Dos meses del terremoto en Colombia, Defensoría pidió reabrir el registro de damnificados",
  "Urna de Cristal (31 de agosto de 2026). El terremoto del 10 de agosto deja más de 300 muertos y 260.000 damnificados en Colombia",
  "Vanguardia (5 de octubre de 2026). Procuraduría pide a la UNGRD agilizar ayudas para damnificados por el terremoto",
  "Pulzo (17 de agosto de 2026). Bogotá finaliza recolección de donaciones por terremoto",
  "Infobae (14 de agosto de 2026). Cruz Roja aclaró qué donaciones necesitan las víctimas del terremoto y qué no",
  "Blu Radio (12 de marzo de 2024). Conclusiones de la Contraloría por caso carrotanques para La Guajira",
];

/* Páginas de sección (en construcción) */

export type SectionPage = {
  title: string;
  description: string;
  photo?: Photo;
  /** nombre del <ViewTransition> compartido con el hero */
  morph?: NavSlug;
};

export const sectionPages = {
  noticias: {
    title: "Noticias",
    description: "Cifras oficiales y novedades del terremoto, zona por zona.",
    photo: photos.noticias,
    morph: "noticias",
  },
  donaciones: {
    title: "Donaciones",
    description: "Las necesidades de cada zona y el recorrido de cada donación hasta su entrega.",
    photo: photos.donaciones,
    morph: "donaciones",
  },
  voluntariado: {
    title: "Voluntariado",
    description: "Turnos abiertos en centros de acopio y puntos de entrega cerca de ti.",
    photo: photos.voluntariado,
    morph: "voluntariado",
  },
  "centros-de-acopio": {
    title: "Centros de acopio",
    description: "Dónde queda cada centro, qué recibe hoy y cuánta capacidad le queda.",
    photo: photos.centros,
    morph: "centros-de-acopio",
  },
  desaparecidos: {
    title: "Desaparecidos",
    description: "Reportes verificados de personas desaparecidas y cómo avisar si sabes algo.",
    photo: photos.desaparecidos,
    morph: "desaparecidos",
  },
  donar: {
    title: "Donar",
    description: "Elige el destino de tu aporte y recibe el registro de su entrega.",
    photo: photos.ayudaDinero,
  },
  "necesito-ayuda": {
    title: "Necesito ayuda",
    description: "Registra lo que necesita tu familia o tu comunidad para que la ayuda llegue.",
    photo: photos.ayudaNecesidad,
  },
  portal: {
    title: "Mi portal",
    description: "Tus donaciones, tus turnos de voluntariado y tus reportes en un solo lugar.",
  },
} satisfies Record<string, SectionPage>;

export type SectionKey = keyof typeof sectionPages;
