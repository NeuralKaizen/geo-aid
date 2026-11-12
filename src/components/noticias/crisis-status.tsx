import { estados, type Estado } from "@/content/noticias";

/* El color dice qué tan urgente es: rojo mientras hay respuesta en curso, maíz en alerta, verde en recuperación. */
const tones: Record<Estado, { dot: string; text: string; ring: string }> = {
  activa: { dot: "bg-alerta", text: "text-alerta", ring: "ring-alerta/20" },
  alerta: { dot: "bg-maiz-400", text: "text-maiz-800", ring: "ring-maiz-400/25" },
  recuperacion: { dot: "bg-bosque-600", text: "text-bosque-600", ring: "ring-bosque-600/20" },
  seguimiento: { dot: "bg-niebla", text: "text-niebla", ring: "ring-niebla/20" },
};

export function StatusPill({ estado }: { estado: Estado }) {
  const tone = tones[estado];
  return (
    <span className={`inline-flex items-center gap-2 text-[12px] font-semibold ${tone.text}`}>
      <span aria-hidden className={`size-2 rounded-full ring-4 ${tone.dot} ${tone.ring}`} />
      {estados[estado]}
    </span>
  );
}
