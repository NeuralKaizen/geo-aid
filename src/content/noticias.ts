import { dataNote, photos, sources, type Action, type Photo } from "@/content/site";

/*
 * Portal de noticias por emergencia. GeoAid puede seguir varias emergencias a la vez y cada una tiene sus cifras,
 * su historia y sus noticias.
 *
 * Lo real: el terremoto del 10 de agosto (todas sus noticias salen de `sources` y `dataNote` en site.ts, o del
 * diagnóstico del proyecto) y el caso de los carrotanques de La Guajira (Blu Radio). Las lluvias del Pacífico y los
 * incendios de la Orinoquía son de ejemplo, para mostrar cómo se ve el portal con varias crisis, y van marcados así
 * en cada tarjeta y en cada noticia.
 */

/* Fuentes */

export type Fuente = {
  medio: string;
  /** fecha completa de la publicación */
  fecha: string;
  titulo: string;
};

/** Toma una cita de `sources` ("Medio (fecha). Título") y la separa en sus partes. */
function cita(prefijo: string): Fuente {
  const texto = sources.find((source) => source.startsWith(prefijo));
  const partes = texto?.match(/^(.+?) \((.+?)\)\. (.+)$/);
  if (!partes) throw new Error(`No encontré la fuente "${prefijo}" en site.ts`);
  return { medio: partes[1], fecha: partes[2], titulo: partes[3] };
}

const fuentes = {
  ungrd: { medio: "UNGRD", fecha: "10 de octubre de 2026", titulo: dataNote },
  urna: cita("Urna de Cristal"),
  cruzRoja: cita("Infobae (14 de agosto"),
  pulzo: cita("Pulzo"),
  vanguardia: cita("Vanguardia"),
  defensoria: cita("Infobae (10 de octubre"),
  bluRadio: cita("Blu Radio"),
} satisfies Record<string, Fuente>;

/** Todas las fuentes reales del portal, para la lista del final */
export const listaFuentes: Fuente[] = [
  fuentes.ungrd,
  fuentes.defensoria,
  fuentes.vanguardia,
  fuentes.urna,
  fuentes.pulzo,
  fuentes.cruzRoja,
  fuentes.bluRadio,
];

/* Temas */

export type Tema = "cifras" | "ayudas" | "registro" | "control" | "alertas" | "recuperacion";

export const temas: Record<Tema, string> = {
  cifras: "Cifras",
  ayudas: "Ayudas",
  registro: "Registro",
  control: "Control",
  alertas: "Alertas",
  recuperacion: "Recuperación",
};

/* Noticias */

export type Noticia = {
  id: string;
  /** AAAA-MM-DD */
  iso: string;
  /** "14 ago 2026" */
  fecha: string;
  tema: Tema;
  titular: string;
  /** qué pasó, en dos o tres líneas */
  resumen: string;
  /** qué significa para quien quiere ayudar o para quien está afectado, en la voz de GeoAid */
  significa: string;
  /** sin fuente: viene del diagnóstico del proyecto o es de ejemplo */
  fuente?: Fuente;
  foto?: Photo;
  enlace?: Action;
};

/* Emergencias */

export type Estado = "activa" | "alerta" | "recuperacion" | "seguimiento";

export const estados: Record<Estado, string> = {
  activa: "Respuesta en curso",
  alerta: "En alerta",
  recuperacion: "En recuperación",
  seguimiento: "En seguimiento",
};

export type Emergencia = {
  id: string;
  nombre: string;
  /** dónde, en pocas palabras */
  lugar: string;
  estado: Estado;
  /** AAAA-MM-DD; con estado activa o alerta, la tarjeta cuenta los días desde aquí */
  inicio: string;
  /** texto fijo para la tarjeta cuando no se cuentan días */
  desde?: string;
  ejemplo: boolean;
  /** la cifra que resume la emergencia en su tarjeta */
  cifraClave: { valor: string; etiqueta: string };
  /** qué está pasando, en lenguaje simple */
  resumen: string;
  cifras: { antes?: string; valor: string; etiqueta: string; fuente: string }[];
  /** dos cortes de una misma cifra, para ver cómo cambió */
  comparacion?: {
    titular: string;
    unidad: string;
    cortes: { fecha: string; valor: number; fuente: string }[];
  };
  ayudar: Action[];
  noticias: Noticia[];
};

export const emergencias: Emergencia[] = [
  {
    id: "terremoto",
    nombre: "Terremoto del 10 de agosto",
    lugar: "500 municipios",
    estado: "activa",
    inicio: "2026-08-10",
    ejemplo: false,
    cifraClave: { valor: "489.862", etiqueta: "personas damnificadas" },
    resumen:
      "El 10 de agosto un terremoto afectó a 500 municipios. Murieron más de 300 personas y hay 489.862 damnificadas. La Procuraduría pidió agilizar las ayudas y la Defensoría, reabrir el registro de damnificados.",
    cifras: [
      { valor: "489.862", etiqueta: "personas damnificadas", fuente: "UNGRD, 10 oct" },
      { valor: "500", etiqueta: "municipios afectados", fuente: "UNGRD, 10 oct" },
      { antes: "Más de", valor: "300", etiqueta: "personas fallecidas", fuente: "Urna de Cristal, 31 ago" },
    ],
    comparacion: {
      titular: "La cifra de damnificados casi se duplicó en seis semanas",
      unidad: "personas",
      cortes: [
        { fecha: "31 de agosto", valor: 260_000, fuente: "Urna de Cristal" },
        { fecha: "10 de octubre", valor: 489_862, fuente: "UNGRD" },
      ],
    },
    ayudar: [
      { label: "Donar", href: "/donar" },
      { label: "Qué recibe cada centro", href: "/centros-de-acopio" },
      { label: "Registrar una necesidad", href: "/necesito-ayuda" },
    ],
    noticias: [
      {
        id: "defensoria",
        iso: "2026-10-10",
        fecha: "10 oct 2026",
        tema: "registro",
        titular: "A dos meses del terremoto, la Defensoría pide reabrir el registro de damnificados",
        resumen: "El Registro Único de Damnificados cerró el 4 de septiembre. Dos meses después del sismo, la Defensoría pidió reabrirlo.",
        significa:
          "Si el registro se reabre, más familias podrían quedar incluidas. Mientras tanto, en GeoAid cualquier familia o comunidad puede contar lo que le falta.",
        fuente: fuentes.defensoria,
        foto: photos.ayudaNecesidad,
        enlace: { label: "Registrar una necesidad", href: "/necesito-ayuda" },
      },
      {
        id: "corte-ungrd",
        iso: "2026-10-10",
        fecha: "10 oct 2026",
        tema: "cifras",
        titular: "La UNGRD reporta 489.862 damnificados en 500 municipios",
        resumen: "Es el corte oficial más reciente de la emergencia, con fecha del 10 de octubre.",
        significa:
          "Es la cifra que usamos en todo GeoAid. Casi medio millón de personas en 500 municipios: la ayuda tiene que llegar a muchos lugares a la vez, y por eso importa saber qué le falta a cada zona.",
        fuente: fuentes.ungrd,
        enlace: { label: "Ver qué le falta a cada zona", href: "/donaciones" },
      },
      {
        id: "procuraduria",
        iso: "2026-10-05",
        fecha: "5 oct 2026",
        tema: "control",
        titular: "La Procuraduría pide a la UNGRD agilizar las ayudas para los damnificados",
        resumen: "El organismo de control le pidió a la entidad encargada de la emergencia acelerar la entrega de ayudas.",
        significa:
          "Los organismos de control están pendientes de que la ayuda llegue a tiempo. Cuando cada entrega queda registrada, es más fácil saber qué llegó y qué falta.",
        fuente: fuentes.vanguardia,
        enlace: { label: "Así se sigue cada donación", href: "/donaciones" },
      },
      {
        id: "cierre-registro",
        iso: "2026-09-04",
        fecha: "4 sep 2026",
        tema: "registro",
        titular: "Cierra el Registro Único de Damnificados y familias rurales quedan por fuera",
        resumen: "El registro oficial cerró el 4 de septiembre. Muchas familias de zonas rurales no alcanzaron a inscribirse.",
        significa:
          "Si tu familia o tu vereda no alcanzó a registrarse, en GeoAid puedes contar qué les falta para que se vea y la ayuda pueda llegar.",
        enlace: { label: "Registrar una necesidad", href: "/necesito-ayuda" },
      },
      {
        id: "balance-agosto",
        iso: "2026-08-31",
        fecha: "31 ago 2026",
        tema: "cifras",
        titular: "El terremoto deja más de 300 muertos y 260.000 damnificados",
        resumen: "Es el balance publicado a finales de agosto, tres semanas después del sismo.",
        significa:
          "Es el punto de partida para ver cómo cambió la cifra: seis semanas después, el corte oficial ya contaba 489.862 personas damnificadas.",
        fuente: fuentes.urna,
      },
      {
        id: "bogota-cierra",
        iso: "2026-08-17",
        fecha: "17 ago 2026",
        tema: "ayudas",
        titular: "Bogotá cierra sus centros de acopio: no daban abasto",
        resumen: "La ciudad finalizó la recolección de donaciones. Sus centros cerraron el 16 y el 17 de agosto porque estaban saturados.",
        significa:
          "Un centro lleno no puede recibir ni clasificar más. Por eso GeoAid muestra la capacidad de cada centro: así sabes si todavía recibe antes de salir de tu casa.",
        fuente: fuentes.pulzo,
        foto: photos.centros,
        enlace: { label: "Ver la capacidad de cada centro", href: "/centros-de-acopio" },
      },
      {
        id: "cruz-roja",
        iso: "2026-08-14",
        fecha: "14 ago 2026",
        tema: "ayudas",
        titular: "La Cruz Roja aclara qué donaciones sirven y cuáles no",
        resumen: "La Cruz Roja no recibe ropa usada, medicamentos ni comida perecedera.",
        significa:
          "Una donación que no sirve ocupa espacio y manos que hacen falta para lo urgente. Antes de llevar algo, mira qué recibe cada centro hoy.",
        fuente: fuentes.cruzRoja,
        foto: photos.ayudaInsumos,
        enlace: { label: "Ver qué recibe cada centro", href: "/centros-de-acopio" },
      },
      {
        id: "sismo",
        iso: "2026-08-10",
        fecha: "10 ago 2026",
        tema: "cifras",
        titular: "Un terremoto sacude a Colombia",
        resumen: "El sismo del 10 de agosto afectó a cientos de municipios del país.",
        significa:
          "Aquí empieza la historia de esta emergencia. Desde este día, cada noticia de este portal lleva su fuente.",
        fuente: fuentes.urna,
      },
    ],
  },
  {
    id: "lluvias-pacifico",
    nombre: "Lluvias en el Pacífico",
    lugar: "Chocó y Nariño",
    estado: "alerta",
    inicio: "2026-10-28",
    ejemplo: true,
    cifraClave: { valor: "3.400", etiqueta: "familias afectadas" },
    resumen:
      "Las lluvias de las últimas dos semanas crecieron varios ríos y dejaron veredas incomunicadas. Hay albergues temporales abiertos y hacen falta agua potable y kits de aseo.",
    cifras: [
      { valor: "3.400", etiqueta: "familias afectadas", fuente: "Ejemplo" },
      { valor: "12", etiqueta: "veredas incomunicadas", fuente: "Ejemplo" },
      { valor: "4", etiqueta: "albergues abiertos", fuente: "Ejemplo" },
    ],
    ayudar: [
      { label: "Donar", href: "/donar" },
      { label: "Registrar una necesidad", href: "/necesito-ayuda" },
    ],
    noticias: [
      {
        id: "albergues",
        iso: "2026-11-09",
        fecha: "9 nov 2026",
        tema: "ayudas",
        titular: "Abren cuatro albergues temporales en la costa de Nariño",
        resumen: "Los albergues reciben a las familias que tuvieron que salir de sus casas por la creciente de los ríos.",
        significa: "Lo que más piden los albergues son agua potable, colchonetas y kits de aseo. El dinero se convierte en esas compras cerca de la zona.",
        enlace: { label: "Donar", href: "/donar" },
      },
      {
        id: "veredas-incomunicadas",
        iso: "2026-11-05",
        fecha: "5 nov 2026",
        tema: "alertas",
        titular: "Doce veredas quedan incomunicadas por la creciente de los ríos",
        resumen: "Los caminos y los pasos en lancha están cerrados mientras baja el nivel del agua.",
        significa: "Si vives en una de estas veredas y te falta algo, regístralo: así se sabe a dónde llevar la ayuda cuando se abran los pasos.",
        enlace: { label: "Registrar una necesidad", href: "/necesito-ayuda" },
      },
      {
        id: "si-el-agua-sube",
        iso: "2026-10-30",
        fecha: "30 oct 2026",
        tema: "alertas",
        titular: "Qué hacer si el agua sube: rutas de evacuación por vereda",
        resumen: "Una guía corta para salir a tiempo: qué llevar, a dónde ir y cómo avisar que estás bien.",
        significa: "Ten a mano tus documentos en una bolsa plástica, agua y una linterna. En una emergencia, llama al 123.",
      },
      {
        id: "inicio-lluvias",
        iso: "2026-10-28",
        fecha: "28 oct 2026",
        tema: "alertas",
        titular: "Empieza la temporada de lluvias con alertas en el Pacífico",
        resumen: "Los ríos del Chocó y de Nariño comienzan a crecer con las primeras lluvias fuertes de la temporada.",
        significa: "Aquí empieza el seguimiento de esta emergencia en GeoAid.",
      },
    ],
  },
  {
    id: "incendios-orinoquia",
    nombre: "Incendios en la Orinoquía",
    lugar: "Meta y Vichada",
    estado: "recuperacion",
    inicio: "2026-09-12",
    desde: "Controlados el 2 oct",
    ejemplo: true,
    cifraClave: { valor: "8.200", etiqueta: "hectáreas quemadas" },
    resumen:
      "Los incendios forestales quedaron controlados el 2 de octubre. Ahora la tarea es volver a sembrar y acompañar a las familias que tuvieron que salir de sus fincas.",
    cifras: [
      { valor: "8.200", etiqueta: "hectáreas quemadas", fuente: "Ejemplo" },
      { valor: "36", etiqueta: "familias reubicadas", fuente: "Ejemplo" },
      { valor: "1.200", etiqueta: "hectáreas por reforestar", fuente: "Ejemplo" },
    ],
    ayudar: [
      { label: "Ser voluntario", href: "/voluntariado" },
      { label: "Donar", href: "/donar" },
    ],
    noticias: [
      {
        id: "reforestacion",
        iso: "2026-10-20",
        fecha: "20 oct 2026",
        tema: "recuperacion",
        titular: "Empieza la reforestación de 1.200 hectáreas con viveros comunitarios",
        resumen: "Las comunidades siembran especies nativas en las zonas que más se quemaron.",
        significa: "La recuperación también necesita manos: hay jornadas de siembra los fines de semana.",
        enlace: { label: "Ver turnos de voluntariado", href: "/voluntariado" },
      },
      {
        id: "ultimo-foco",
        iso: "2026-10-02",
        fecha: "2 oct 2026",
        tema: "alertas",
        titular: "Controlan el último foco de los incendios",
        resumen: "Después de tres semanas, ya no quedan incendios activos en la región.",
        significa: "La emergencia pasa a la etapa de recuperación: menos urgencia, pero la ayuda sigue haciendo falta.",
      },
      {
        id: "familias-reubicadas",
        iso: "2026-09-18",
        fecha: "18 sep 2026",
        tema: "ayudas",
        titular: "36 familias son reubicadas mientras pasan los incendios",
        resumen: "Las familias de las fincas más cercanas al fuego se quedan con parientes y en un albergue del municipio.",
        significa: "Las familias reubicadas necesitan sobre todo alimentos y kits de aseo mientras vuelven a sus fincas.",
        enlace: { label: "Donar", href: "/donar" },
      },
    ],
  },
  {
    id: "agua-la-guajira",
    nombre: "Agua en La Guajira",
    lugar: "La Guajira",
    estado: "seguimiento",
    inicio: "2024-03-12",
    desde: "Desde mar 2024",
    ejemplo: false,
    cifraClave: { valor: "2024", etiqueta: "conclusiones de la Contraloría" },
    resumen:
      "En marzo de 2024 la Contraloría presentó sus conclusiones sobre el caso de los carrotanques para La Guajira. Lo seguimos porque muestra por qué cada entrega de ayuda tiene que poder rastrearse.",
    cifras: [],
    ayudar: [{ label: "Así se sigue cada donación", href: "/donaciones" }],
    noticias: [
      {
        id: "carrotanques",
        iso: "2024-03-12",
        fecha: "12 mar 2024",
        tema: "control",
        titular: "La Contraloría presenta sus conclusiones sobre el caso de los carrotanques para La Guajira",
        resumen: "El organismo de control dio a conocer lo que encontró en el caso de los carrotanques destinados al departamento.",
        significa:
          "Si una ayuda no se puede seguir, nadie puede comprobar qué llegó ni a quién. Por eso en GeoAid cada donación tiene un código y un recorrido que cualquiera puede consultar.",
        fuente: fuentes.bluRadio,
        enlace: { label: "Así se sigue cada donación", href: "/donaciones" },
      },
    ],
  },
];

export function buscarEmergencia(id: string | null | undefined) {
  return emergencias.find((emergencia) => emergencia.id === id) ?? emergencias[0];
}
