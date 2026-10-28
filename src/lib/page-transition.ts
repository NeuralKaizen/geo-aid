/**
 * Clases de <ViewTransition> según la dirección de la navegación.
 *
 * El orden de capas importa: el navegador apila primero los grupos de la página vieja (incluida la foto compartida)
 * y después los que solo existen en la nueva. Por eso los textos van en su propia capa (`capa`), que queda encima
 * de la foto en vuelo, y nunca se envuelve una página entera, porque su fondo taparía el morph.
 */
export const directional = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

/** Texto y velos sobre una foto compartida: salen rápido y entran cuando la foto aterriza. */
export const layer = {
  "nav-forward": "capa",
  "nav-back": "capa",
  default: "none",
};
