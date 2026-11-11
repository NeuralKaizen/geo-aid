import { Newsreader } from "next/font/google";

/*
 * Noticias es la única página con serif en los titulares: le da el tono de una sala de redacción seria. La fuente
 * solo se carga aquí y se aplica con su variable CSS en el <main> de la página, así no pesa en las demás rutas.
 * El eje `opsz` ajusta el trazo al tamaño: fino y elegante en los titulares grandes, más robusto en los pequeños.
 */
export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

/** Clase para los textos en serif de esta página. */
export const serif = "font-(family-name:--font-newsreader)";
