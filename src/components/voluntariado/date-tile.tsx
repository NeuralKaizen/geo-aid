import { diaCorto, mesCorto } from "@/components/voluntariado/fechas";

const sizes = {
  sm: { box: "w-12 rounded-xl py-1.5", day: "text-[20px]", label: "text-[9.5px]" },
  md: { box: "w-[3.75rem] rounded-2xl py-2", day: "text-[26px]", label: "text-[10.5px]" },
  lg: { box: "w-[4.5rem] rounded-[20px] py-2.5", day: "text-[32px]", label: "text-[11px]" },
};

const tones = {
  white: { box: "bg-white text-bosque-950", label: "text-bosque-600" },
  outline: { box: "bg-white text-bosque-950 ring-1 ring-inset ring-linea", label: "text-bosque-600" },
  dark: { box: "bg-bosque-900 text-white", label: "text-maiz-400" },
  muted: { box: "bg-papel text-niebla ring-1 ring-inset ring-linea", label: "text-niebla" },
};

/** Ficha de fecha, la misma de la tarjeta "Próximo turno" del hero: día de la semana, número y mes. */
export function DateTile({
  date,
  size = "md",
  tone = "white",
}: {
  date: Date;
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
}) {
  const s = sizes[size];
  const t = tones[tone];
  return (
    <p className={`flex shrink-0 flex-col items-center ${s.box} ${t.box}`}>
      <span className={`${s.label} font-semibold uppercase tracking-[0.12em] ${t.label}`}>{diaCorto(date)}</span>
      <span className={`font-display ${s.day} font-semibold leading-none tracking-[-0.03em] tabular-nums`}>{date.getDate()}</span>
      <span className={`${s.label} font-semibold uppercase tracking-[0.12em] ${t.label}`}>{mesCorto(date)}</span>
    </p>
  );
}
