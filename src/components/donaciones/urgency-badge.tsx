import { urgencyStyles, type Urgency } from "@/components/donaciones/metrics";

/** Píldora con el nivel de urgencia. El color nunca va solo: siempre lleva la palabra. */
export function UrgencyBadge({ level, compact = false }: { level: Urgency; compact?: boolean }) {
  const style = urgencyStyles[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${style.badge}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${style.dot}`} />
      {compact ? style.label : `Urgencia ${style.label.toLowerCase()}`}
    </span>
  );
}
