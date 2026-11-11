"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { LoaderCircle, MapPinOff, RotateCw } from "lucide-react";
import type { CityId } from "@/content/centros";
import { statusLabels } from "@/content/centros";
import type { MapStatus } from "@/components/centros/centros-map";
import { statusStyles } from "@/components/centros/point-card";
import { button } from "@/components/ui/styles";

/* MapLibre pesa y necesita WebGL: se baja solo en el navegador y solo cuando el mapa se va a ver */
const CentrosMap = dynamic(() => import("@/components/centros/centros-map"), { ssr: false });

export function MapPanel({
  cityId,
  visibleIds,
  selectedId,
  hoveredId,
  bottomInset,
  onSelect,
  children,
}: {
  cityId: CityId;
  visibleIds: string[];
  selectedId: string | null;
  hoveredId: string | null;
  bottomInset?: number;
  onSelect: (id: string) => void;
  /** lo que va encima del mapa, como la ficha corta en el celular */
  children?: ReactNode;
}) {
  const [status, setStatus] = useState<MapStatus>("cargando");
  const [attempt, setAttempt] = useState(0);

  return (
    <div className="relative h-full overflow-hidden rounded-[28px] bg-[#eef0ec] ring-1 ring-linea [&_.maplibregl-ctrl-attrib]:text-[11px] [&_.maplibregl-ctrl-attrib]:rounded-full [&_.maplibregl-ctrl-attrib]:bg-white/85 [&_.maplibregl-ctrl-attrib]:px-2.5 [&_.maplibregl-ctrl-bottom-right]:mr-3 [&_.maplibregl-ctrl-bottom-right]:mb-1.5 [&_.maplibregl-ctrl-group]:overflow-hidden [&_.maplibregl-ctrl-group]:rounded-2xl! [&_.maplibregl-ctrl-group]:shadow-[0_8px_20px_-10px_rgba(6,39,36,0.45)]! [&_.maplibregl-ctrl-group_button]:size-10!">
      {status !== "error" && (
        <CentrosMap
          key={attempt}
          cityId={cityId}
          visibleIds={visibleIds}
          selectedId={selectedId}
          hoveredId={hoveredId}
          bottomInset={bottomInset}
          onSelect={onSelect}
          onStatus={setStatus}
        />
      )}

      {status === "cargando" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[14px] font-medium text-niebla shadow-sm">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Cargando el mapa…
          </p>
        </div>
      )}

      {status === "error" ? (
        <div role="alert" className="absolute inset-0 grid place-items-center p-6">
          <div className="max-w-sm text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-niebla ring-1 ring-linea">
              <MapPinOff className="size-5" aria-hidden />
            </span>
            <p className="mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] text-tinta">No pudimos cargar el mapa</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-niebla">
              Puede ser la conexión o que este navegador no muestra mapas. La lista de puntos sigue funcionando, con la dirección y
              el enlace para llegar.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("cargando");
                setAttempt((value) => value + 1);
              }}
              className={`${button({ variant: "secondary", size: "sm" })} mt-5`}
            >
              <RotateCw className="size-4" aria-hidden />
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <Legend />
      )}

      {status === "listo" && children}
    </div>
  );
}

function Legend() {
  return (
    <ul
      aria-label="Estados de los puntos"
      className="absolute left-3 top-3 flex gap-3 rounded-full bg-white/92 px-3.5 py-2 text-[12.5px] font-medium text-tinta/80 shadow-[0_8px_20px_-12px_rgba(6,39,36,0.5)] ring-1 ring-linea/70 backdrop-blur"
    >
      {(["abierto", "casi-lleno", "lleno"] as const).map((status) => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-2.5 rounded-full ${statusStyles[status].dot}`} />
          {statusLabels[status]}
        </li>
      ))}
    </ul>
  );
}
