/*
 * Clases compartidas para que botones, campos y etiquetas se vean igual en todas las páginas.
 * Son strings y no componentes para poder usarlas en <button>, <Link>, <a> o <label> sin envolver nada.
 */

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "light" | "outlineLight";
type ButtonSize = "md" | "lg" | "sm";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-bosque-800 text-white hover:bg-bosque-700",
  accent: "bg-maiz-400 text-bosque-950 hover:brightness-105",
  secondary: "bg-white text-bosque-800 ring-1 ring-inset ring-linea hover:ring-bosque-200",
  ghost: "text-bosque-800 hover:bg-bosque-50",
  light: "bg-white text-bosque-900 hover:bg-maiz-400",
  outlineLight: "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 hover:ring-white/70",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[14px] gap-1.5",
  md: "h-12 px-6 text-[15px] gap-2",
  lg: "h-14 px-7 text-base gap-2.5",
};

export function button({ variant = "primary", size = "md" }: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return `group inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-[background-color,box-shadow,color,filter,transform] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${sizes[size]}`;
}

/** Caja de un campo de texto: el anillo cambia al enfocar y en error. */
export const fieldBox =
  "w-full rounded-2xl bg-white px-4 text-[15px] text-tinta ring-1 ring-inset ring-linea outline-none transition-shadow duration-300 placeholder:text-niebla/70 hover:ring-bosque-200 focus:ring-2 focus:ring-bosque-600 aria-[invalid=true]:ring-alerta";

/** Tarjeta blanca sobre el fondo papel. */
export const card = "rounded-[28px] bg-white ring-1 ring-linea";

/** Etiqueta pequeña en mayúsculas sobre los títulos de sección. */
export const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.14em] text-bosque-600";

/** Título de sección dentro de una página. */
export const sectionTitle =
  "font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-tinta text-balance";
