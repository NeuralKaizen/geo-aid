import { EyeOff, ImageOff, MapPinOff, PhoneOff, UserRound, HeartHandshake, type LucideIcon } from "lucide-react";

/*
 * Personas desaparecidas. Todos los reportes y cifras de esta página son de ejemplo: los nombres son ficticios, solo
 * llevan la inicial del apellido y no hay fotos de nadie. Las cifras coinciden con la tarjeta del hero.
 */

export type Estado = "buscando" | "reencontrada";

export type Reporte = {
  id: string;
  /** nombre ficticio con la inicial del apellido */
  nombre: string;
  /** solo para concordar el estado: "Reencontrada" o "Reencontrado" */
  genero: "f" | "m";
  edad: number;
  municipio: string;
  departamento: string;
  vistoEl: string;
  vistoEn: string;
  reportadoEl: string;
  estado: Estado;
  /** fecha del reencuentro, si ya ocurrió */
  reencuentro?: string;
};

export const reportes: Reporte[] = [
  {
    id: "r-01",
    nombre: "María Fernanda R.",
    genero: "f",
    edad: 34,
    municipio: "Morales",
    departamento: "Cauca",
    vistoEl: "10 de agosto",
    vistoEn: "Vereda La Palma, camino a la escuela",
    reportadoEl: "11 de agosto",
    estado: "buscando",
  },
  {
    id: "r-02",
    nombre: "José Antonio M.",
    genero: "m",
    edad: 67,
    municipio: "Popayán",
    departamento: "Cauca",
    vistoEl: "10 de agosto",
    vistoEn: "Barrio Bolívar, cerca de la galería",
    reportadoEl: "11 de agosto",
    estado: "reencontrada",
    reencuentro: "21 de agosto",
  },
  {
    id: "r-03",
    nombre: "Luz Dary C.",
    genero: "f",
    edad: 52,
    municipio: "Piendamó",
    departamento: "Cauca",
    vistoEl: "11 de agosto",
    vistoEn: "Albergue del coliseo municipal",
    reportadoEl: "12 de agosto",
    estado: "buscando",
  },
  {
    id: "r-04",
    nombre: "Andrés Felipe G.",
    genero: "m",
    edad: 23,
    municipio: "Santander de Quilichao",
    departamento: "Cauca",
    vistoEl: "10 de agosto",
    vistoEn: "Terminal de transporte",
    reportadoEl: "12 de agosto",
    estado: "buscando",
  },
  {
    id: "r-05",
    nombre: "Rosa Elena P.",
    genero: "f",
    edad: 71,
    municipio: "Silvia",
    departamento: "Cauca",
    vistoEl: "12 de agosto",
    vistoEn: "Plaza de mercado",
    reportadoEl: "13 de agosto",
    estado: "reencontrada",
    reencuentro: "15 de agosto",
  },
  {
    id: "r-06",
    nombre: "Samuel D.",
    genero: "m",
    edad: 12,
    municipio: "Popayán",
    departamento: "Cauca",
    vistoEl: "10 de agosto",
    vistoEn: "Colegio del barrio La Esmeralda",
    reportadoEl: "10 de agosto",
    estado: "reencontrada",
    reencuentro: "11 de agosto",
  },
  {
    id: "r-07",
    nombre: "Carmen Alicia V.",
    genero: "f",
    edad: 45,
    municipio: "Jamundí",
    departamento: "Valle del Cauca",
    vistoEl: "10 de agosto",
    vistoEn: "Parque principal",
    reportadoEl: "14 de agosto",
    estado: "buscando",
  },
  {
    id: "r-08",
    nombre: "Jhon Jairo L.",
    genero: "m",
    edad: 39,
    municipio: "Cali",
    departamento: "Valle del Cauca",
    vistoEl: "13 de agosto",
    vistoEn: "Albergue temporal de la unidad deportiva",
    reportadoEl: "14 de agosto",
    estado: "reencontrada",
    reencuentro: "30 de agosto",
  },
  {
    id: "r-09",
    nombre: "Ana Lucía T.",
    genero: "f",
    edad: 28,
    municipio: "Pasto",
    departamento: "Nariño",
    vistoEl: "10 de agosto",
    vistoEn: "Centro, cerca de la plaza principal",
    reportadoEl: "16 de agosto",
    estado: "buscando",
  },
  {
    id: "r-10",
    nombre: "Wilson Eduardo B.",
    genero: "m",
    edad: 58,
    municipio: "La Plata",
    departamento: "Huila",
    vistoEl: "10 de agosto",
    vistoEn: "Vereda San Andrés, camino a la finca",
    reportadoEl: "18 de agosto",
    estado: "buscando",
  },
  {
    id: "r-11",
    nombre: "Yesenia Patricia Q.",
    genero: "f",
    edad: 19,
    municipio: "Neiva",
    departamento: "Huila",
    vistoEl: "14 de agosto",
    vistoEn: "Punto de entrega de ayudas del barrio",
    reportadoEl: "15 de agosto",
    estado: "reencontrada",
    reencuentro: "2 de septiembre",
  },
  {
    id: "r-12",
    nombre: "Héctor Fabio S.",
    genero: "m",
    edad: 81,
    municipio: "Timbío",
    departamento: "Cauca",
    vistoEl: "10 de agosto",
    vistoEn: "Su casa, en la vereda Las Huacas",
    reportadoEl: "12 de agosto",
    estado: "buscando",
  },
];

/** Iguales a la tarjeta "Reencuentros" del hero */
export const cifras = [
  { valor: "37", etiqueta: "reencuentros esta semana" },
  { valor: "412", etiqueta: "reportes activos" },
  { valor: "1.208", etiqueta: "reencuentros desde agosto" },
];

/* Cómo verificamos cada reporte */

export const pasos = [
  {
    titulo: "Recibimos el reporte",
    texto: "Le asignamos un código y revisamos que tenga lo necesario para buscar: nombre, edad y dónde se vio por última vez.",
  },
  {
    titulo: "Verificamos con las autoridades",
    texto: "Confirmamos el caso con las autoridades y los equipos de búsqueda antes de publicar una sola palabra.",
  },
  {
    titulo: "Publicamos sin datos sensibles",
    texto: "Solo mostramos el nombre con la inicial del apellido, la edad, el municipio y dónde se vio a la persona.",
  },
  {
    titulo: "Te avisamos",
    texto: "Si alguien deja una pista o la persona aparece, te escribimos por mensaje de texto al celular que dejaste.",
  },
];

export const principios: { icon: LucideIcon; titulo: string; texto: string }[] = [
  { icon: MapPinOff, titulo: "Sin direcciones", texto: "Solo el municipio y un lugar público de referencia." },
  { icon: PhoneOff, titulo: "Sin teléfonos", texto: "Tu contacto lo ve únicamente quien verifica el reporte." },
  { icon: ImageOff, titulo: "Sin fotos de menores", texto: "Los reportes de niñas, niños y adolescentes nunca llevan foto." },
  { icon: UserRound, titulo: "Solo la inicial del apellido", texto: "Se reconoce a la persona sin exponer a su familia." },
  { icon: EyeOff, titulo: "Pistas anónimas", texto: "Puedes contar lo que sabes sin dejar tus datos." },
  { icon: HeartHandshake, titulo: "Cierre con cuidado", texto: "Cuando hay un reencuentro, el reporte deja de pedir pistas." },
];

/* Formulario de reporte */

export const departamentos = [
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

export const relaciones = [
  "Familiar",
  "Pareja",
  "Amiga o amigo",
  "Vecina o vecino",
  "Compañera o compañero de trabajo",
  "Otra relación",
];
