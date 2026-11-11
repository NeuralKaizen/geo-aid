"use client";

import { motion } from "motion/react";
import { ArrowUpRight, BadgeCheck, Check, Clock, MapPin, Navigation } from "lucide-react";
import type { PointStatus } from "@/content/site";
import { itemLabel, pointTypes, statusLabels, type CollectionPoint, type ItemId } from "@/content/centros";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { easeSalida } from "@/lib/motion";

/*
 * Colores de estado, los mismos en la tarjeta y en el mapa: abierto en verde, casi lleno en maíz y lleno en gris.
 * El verde de la paleta (brote-300) es para fondos oscuros; sobre blanco va un verde más profundo con buen contraste.
 */
export const statusStyles: Record<PointStatus, { dot: string; pill: string; bar: string; note: string }> = {
  abierto: {
    dot: "bg-[#2f9a5d]",
    pill: "bg-[#e3f3e9] text-[#1d6a40]",
    bar: "bg-[#2f9a5d]",
    note: "Tiene espacio para recibir hoy.",
  },
  "casi-lleno": {
    dot: "bg-maiz-400",
    pill: "bg-maiz-100 text-maiz-800",
    bar: "bg-maiz-400",
    note: "Le queda poco espacio: lleva solo lo que pide.",
  },
  lleno: {
    dot: "bg-[#9aa6a3]",
    pill: "bg-[#eceeed] text-niebla",
    bar: "bg-[#9aa6a3]",
    note: "Hoy no recibe. Vuelve a abrir cuando despache lo que tiene.",
  },
};

/** Ruta en Google Maps hasta las coordenadas del punto */
export function directionsUrl(point: CollectionPoint) {
  const [lng, lat] = point.coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function StatusPill({ status }: { status: PointStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${statusStyles[status].pill}`}>
      <span aria-hidden className={`size-2 rounded-full ${statusStyles[status].dot}`} />
      {statusLabels[status]}
    </span>
  );
}

export function PointCard({
  point,
  wanted,
  selected,
  onSelect,
  onShowOnMap,
  onHover,
}: {
  point: CollectionPoint;
  /** lo que la persona quiere llevar: esos chips se resaltan */
  wanted: ItemId[];
  selected: boolean;
  /** clic en cualquier parte de la tarjeta: la resalta y centra el mapa */
  onSelect: () => void;
  /** botón "Ver en el mapa": en el celular además cambia a la vista de mapa */
  onShowOnMap: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const type = pointTypes[point.type];
  const TypeIcon = type.icon;
  const percent = Math.round(point.load * 100);
  // Lo que coincide con el filtro va primero para que se lea de un vistazo
  const accepts = [...point.accepts].sort((a, b) => Number(wanted.includes(b)) - Number(wanted.includes(a)));

  return (
    <article
      id={`punto-${point.id}`}
      aria-labelledby={`punto-${point.id}-nombre`}
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={`scroll-mt-28 rounded-[28px] bg-white p-5 transition-[box-shadow] duration-300 sm:p-6 ${
        selected
          ? "shadow-[0_24px_50px_-28px_rgba(6,39,36,0.45)] ring-2 ring-bosque-700"
          : "ring-1 ring-linea hover:ring-bosque-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[13px] font-medium text-niebla">
          <span className="grid size-8 place-items-center rounded-xl bg-bosque-50 text-bosque-700">
            <TypeIcon className="size-4" aria-hidden />
          </span>
          {type.label}
        </p>
        <ExampleTag />
      </div>

      <h3
        id={`punto-${point.id}-nombre`}
        className="mt-3.5 font-display text-[21px] font-semibold leading-tight tracking-[-0.025em] text-tinta sm:text-[23px]"
      >
        {point.name}
      </h3>
      <div className="mt-2 space-y-1 text-[14px] text-niebla">
        <p className="flex items-start gap-2">
          <MapPin className="mt-[3px] size-3.5 shrink-0" aria-hidden />
          <span>
            <span className="font-medium text-tinta/85">{point.barrio}</span> · {point.address}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          <span>
            <span className="font-medium text-tinta/85">Hoy</span> de {point.hours}
          </span>
        </p>
      </div>
      {point.verified && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-bosque-50 px-2.5 py-1 text-[12.5px] font-semibold text-bosque-700">
          <BadgeCheck className="size-3.5" aria-hidden />
          Verificado por la JAC
        </p>
      )}

      <div className="mt-4 rounded-2xl bg-papel px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <StatusPill status={point.status} />
          <span className="text-[13px] tabular-nums text-niebla">{percent} % de su espacio ocupado</span>
        </div>
        <div
          role="progressbar"
          aria-label={`Capacidad de ${point.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${percent} % ocupado, ${statusLabels[point.status].toLowerCase()}`}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-linea"
        >
          <motion.span
            className={`block h-full origin-left rounded-full ${statusStyles[point.status].bar}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: point.load }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.15, ease: easeSalida }}
          />
        </div>
        <p className="mt-2 text-[13px] leading-snug text-niebla">{statusStyles[point.status].note}</p>
      </div>

      <div className="mt-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-niebla">
          {point.status === "lleno" ? "Recibe cuando tenga espacio" : "Recibe hoy"}
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {accepts.map((item) => {
            const match = wanted.includes(item);
            return (
              <li
                key={item}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-medium transition-colors duration-300 ${
                  match ? "bg-bosque-800 text-white" : "bg-bosque-50 text-bosque-800"
                }`}
              >
                {match && <Check className="size-3.5" aria-hidden />}
                {itemLabel[item]}
                {match && <span className="sr-only">(coincide con lo que quieres llevar)</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(event) => {
            // La tarjeta entera también elige el punto: aquí basta con un solo aviso
            event.stopPropagation();
            onShowOnMap();
          }}
          aria-pressed={selected}
          className={button({ variant: "secondary", size: "sm" })}
        >
          <Navigation className="size-4" aria-hidden />
          Ver en el mapa
        </button>
        <a
          href={directionsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className={button({ variant: "primary", size: "sm" })}
        >
          Cómo llegar
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only">(abre Google Maps en otra pestaña)</span>
        </a>
      </div>
    </article>
  );
}

/** Ficha corta que aparece sobre el mapa en el celular al tocar un punto. */
export function PointPeek({ point, onShowCard }: { point: CollectionPoint; onShowCard: () => void }) {
  const TypeIcon = pointTypes[point.type].icon;
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-[0_24px_50px_-20px_rgba(6,39,36,0.55)] ring-1 ring-linea">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bosque-50 text-bosque-700">
          <TypeIcon className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[17px] font-semibold leading-tight tracking-[-0.02em] text-tinta">{point.name}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-niebla">
            <StatusPill status={point.status} />
            {point.barrio}
          </p>
          <p className="mt-1 text-[13px] text-niebla">Hoy de {point.hours}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onShowCard} className={`${button({ variant: "secondary", size: "sm" })} flex-1`}>
          Ver qué recibe
        </button>
        <a
          href={directionsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${button({ variant: "primary", size: "sm" })} flex-1`}
        >
          Cómo llegar
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only">(abre Google Maps en otra pestaña)</span>
        </a>
      </div>
    </div>
  );
}
