"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmInline } from "@/components/portal/bits";
import { portalCopy } from "@/content/portal";
import { removeActivity } from "@/lib/activity";

/** Borra todo lo de la sesión, con confirmación. La historia de ejemplo no se toca. */
export function ClearActivity({ ids, tone }: { ids: string[]; tone: "light" | "dark" }) {
  const [asking, setAsking] = useState(false);
  const [cleared, setCleared] = useState(false);
  const dark = tone === "dark";

  function clear() {
    ids.forEach(removeActivity);
    setAsking(false);
    setCleared(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className={`text-[12.5px] leading-snug ${dark ? "text-white/55" : "text-niebla"}`}>{portalCopy.storage}</p>
      {asking ? (
        <ConfirmInline
          tone={tone}
          question={`${portalCopy.clear.confirm} ${ids.length === 1 ? "Es 1 registro." : `Son ${ids.length} registros.`}`}
          confirmLabel="Sí, borrar"
          cancelLabel="No, dejarlo"
          onConfirm={clear}
          onCancel={() => setAsking(false)}
        />
      ) : (
        <button
          type="button"
          disabled={ids.length === 0}
          onClick={() => {
            setCleared(false);
            setAsking(true);
          }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-3.5 py-2.5 text-left text-[13.5px] font-semibold leading-snug transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            dark ? "text-white/85 ring-1 ring-inset ring-white/20 hover:bg-white/10" : "text-alerta ring-1 ring-inset ring-alerta/30 hover:bg-alerta/[0.06]"
          }`}
        >
          <Trash2 className="size-4 shrink-0" aria-hidden />
          {portalCopy.clear.label}
        </button>
      )}
      <p aria-live="polite" className={`text-[12.5px] ${dark ? "text-brote-300" : "text-bosque-700"} empty:hidden`}>
        {cleared ? "Listo: se borró tu actividad de este navegador." : ids.length === 0 && !asking ? "Todavía no hay nada de esta sesión." : ""}
      </p>
    </div>
  );
}
