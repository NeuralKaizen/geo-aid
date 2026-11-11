"use client";

import { fuente } from "@/content/noticias";

/*
 * Llamada a una nota al pie: el medio y su número, como en un diario. Lleva a la lista de fuentes (Lenis hace el
 * scroll suave) y la nota de destino se ilumina un momento para que el ojo la encuentre. El área táctil se agranda
 * con un pseudoelemento hasta 44 px sin cambiar cómo se ve.
 */
export function SourceRef({ id, tone = "light", compact = false }: { id: string; tone?: "light" | "dark"; compact?: boolean }) {
  const source = fuente(id);
  const colors =
    tone === "light"
      ? "text-tinta ring-tinta/15 hover:bg-white hover:ring-tinta/30"
      : "text-white ring-white/25 hover:bg-white/10 hover:ring-white/45";
  const number = tone === "light" ? "bg-tinta text-white" : "bg-white text-bosque-950";

  return (
    <a
      href={`#fuente-${source.id}`}
      onClick={() => highlight(source.id)}
      aria-label={`Nota ${source.numero}: ${source.medio}, ${source.fecha}`}
      className={`relative inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full text-[12px] font-semibold ring-1 ring-inset transition-[background-color,box-shadow] duration-300 after:absolute after:-inset-2 after:content-[''] ${
        compact ? "px-1" : "pl-2.5 pr-1"
      } ${colors}`}
    >
      {!compact && source.medio}
      <span className={`grid size-5 place-items-center rounded-full text-[10.5px] tabular-nums ${number}`}>{source.numero}</span>
    </a>
  );
}

function highlight(id: string) {
  const note = document.getElementById(`fuente-${id}`);
  note?.animate([{ backgroundColor: "rgba(242, 181, 68, 0.3)" }, { backgroundColor: "rgba(242, 181, 68, 0)" }], {
    duration: 2400,
    delay: 600,
    easing: "ease-out",
  });
}
