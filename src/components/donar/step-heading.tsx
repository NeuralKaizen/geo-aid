"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Título de cada paso. Cuando la persona avanza o vuelve, el foco pasa al título nuevo para que el lector de pantalla
 * anuncie dónde está; en la primera carga no se mueve el foco.
 */
export function StepHeading({
  eyebrow,
  children,
  focusOnMount,
  description,
}: {
  eyebrow: string;
  children: ReactNode;
  focusOnMount: boolean;
  description?: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-bosque-600">{eyebrow}</p>
      <h2
        ref={ref}
        tabIndex={-1}
        className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-tinta outline-none text-balance"
      >
        {children}
      </h2>
      {description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-niebla">{description}</p>}
    </div>
  );
}

/** Subtítulo de un grupo de opciones dentro de un paso */
export function GroupLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="mb-3 text-[13px] font-semibold text-tinta">
      {children}
    </p>
  );
}
