"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cities, pointTypes, statusLabels, type CityId, type CollectionPoint } from "@/content/centros";
import { statusStyles } from "@/components/centros/point-card";

/*
 * Mapa de los puntos con MapLibre y el estilo libre de OpenFreeMap (no pide clave). Este archivo solo se carga en el
 * navegador (ver map-panel.tsx), porque MapLibre necesita WebGL y la ventana.
 *
 * Los marcadores son botones HTML propios: MapLibre los posiciona y React dibuja lo de adentro con portales, así el
 * resaltado, la etiqueta y los colores de estado salen de los mismos componentes y clases que la lista.
 */

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

const locale = {
  "CooperativeGesturesHandler.WindowsHelpText": "Usa Ctrl + rueda para acercar o alejar el mapa",
  "CooperativeGesturesHandler.MacHelpText": "Usa ⌘ + rueda para acercar o alejar el mapa",
  "CooperativeGesturesHandler.MobileHelpText": "Usa dos dedos para mover el mapa",
  "NavigationControl.ZoomIn": "Acercar",
  "NavigationControl.ZoomOut": "Alejar",
  "AttributionControl.ToggleAttribution": "Ver créditos del mapa",
  "Map.Title": "Mapa de puntos de acopio",
  "Marker.Title": "Punto de acopio",
};

type Pin = { point: CollectionPoint; city: CityId; element: HTMLButtonElement; marker: maplibregl.Marker };
export type MapStatus = "cargando" | "listo" | "error";

function cityBounds(cityId: CityId) {
  const points = cities.find((city) => city.id === cityId)?.points ?? [];
  const [first, ...rest] = points.map((point) => point.coords);
  return rest.reduce((bounds, coords) => bounds.extend(coords), new maplibregl.LngLatBounds(first, first));
}

export default function CentrosMap({
  cityId,
  visibleIds,
  selectedId,
  hoveredId,
  bottomInset = 0,
  onSelect,
  onStatus,
}: {
  cityId: CityId;
  visibleIds: string[];
  selectedId: string | null;
  hoveredId: string | null;
  /** espacio tapado abajo por la ficha corta en el celular, para centrar el punto en lo que sí se ve */
  bottomInset?: number;
  onSelect: (id: string) => void;
  onStatus: (status: MapStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [ready, setReady] = useState(false);
  // Los manejadores del mapa viven fuera de React: leen siempre la versión más reciente por referencia
  const callbacks = useRef({ onSelect, onStatus });
  const shownCity = useRef(cityId);

  useEffect(() => {
    callbacks.current = { onSelect, onStatus };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let loaded = false;
    // Al desmontar, MapLibre cancela sus descargas y avisa el corte como error: ese aviso ya no cuenta
    let disposed = false;
    let map: maplibregl.Map;
    const fail = () => !disposed && callbacks.current.onStatus("error");

    try {
      map = new maplibregl.Map({
        container,
        style: STYLE_URL,
        bounds: cityBounds(shownCity.current),
        fitBoundsOptions: { padding: 72, maxZoom: 14.5 },
        // La rueda sola mueve la página; con Ctrl/⌘ (o dos dedos en el celular) se mueve el mapa
        cooperativeGestures: true,
        attributionControl: { compact: false },
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        maxZoom: 17.5,
        minZoom: 9,
        locale,
      });
    } catch {
      // Sin WebGL el constructor falla: se avisa en el siguiente cuadro, fuera del efecto
      const frame = requestAnimationFrame(fail);
      return () => cancelAnimationFrame(frame);
    }

    mapRef.current = map;
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Si en 20 segundos no terminó de cargar (mala señal, estilo caído), mejor decirlo que dejar el gris
    const timeout = window.setTimeout(() => !loaded && fail(), 20_000);

    map.on("load", () => {
      if (disposed) return;
      loaded = true;
      window.clearTimeout(timeout);
      setPins(createPins());
      setReady(true);
      callbacks.current.onStatus("listo");
    });

    map.on("error", (event) => {
      if (loaded) return;
      // Un mosaico o un ícono que no llega no daña el mapa; el estilo sí
      const error = event.error as { url?: string; name?: string } | undefined;
      if (error?.name === "AbortError") return;
      if ("sourceId" in event || "tile" in event || /\/(sprites|fonts)\//.test(error?.url ?? "")) return;
      window.clearTimeout(timeout);
      fail();
    });

    map.getCanvas().addEventListener("webglcontextlost", fail);

    function createPins(): Pin[] {
      return cities.flatMap((city) =>
        city.points.map((point) => {
          const element = document.createElement("button");
          element.type = "button";
          element.className = "block cursor-pointer rounded-full";
          element.setAttribute("aria-label", `${point.name}. ${statusLabels[point.status]}`);
          element.addEventListener("click", (event) => {
            event.stopPropagation();
            callbacks.current.onSelect(point.id);
          });
          const marker = new maplibregl.Marker({ element }).setLngLat(point.coords);
          return { point, city: city.id, element, marker };
        }),
      );
    }

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      map.remove();
      mapRef.current = null;
    };
    // Se crea una sola vez: "Reintentar" vuelve a montar el componente con otra key
  }, []);

  // Solo los puntos de la ciudad que pasan los filtros quedan en el mapa
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const visible = new Set(visibleIds);
    for (const pin of pins) {
      const show = pin.city === cityId && visible.has(pin.point.id);
      if (show && !pin.element.isConnected) pin.marker.addTo(map);
      if (!show && pin.element.isConnected) pin.marker.remove();
    }
  }, [pins, ready, cityId, visibleIds]);

  // Cambiar de ciudad mueve el mapa hasta encuadrar todos sus puntos
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || shownCity.current === cityId) return;
    shownCity.current = cityId;
    map.fitBounds(cityBounds(cityId), { padding: 72, maxZoom: 14.5, duration: 1600 });
  }, [cityId, ready]);

  // Elegir un punto (en la lista o en el mapa) lo centra
  useEffect(() => {
    const map = mapRef.current;
    const pin = pins.find((entry) => entry.point.id === selectedId);
    if (!map || !ready || !pin) return;
    map.flyTo({
      center: pin.point.coords,
      zoom: Math.max(map.getZoom(), 14.5),
      padding: { top: 40, bottom: 40 + bottomInset, left: 40, right: 40 },
      duration: 1100,
    });
  }, [selectedId, pins, ready, bottomInset]);

  // El elegido y el que está bajo el puntero quedan por encima de los demás
  useEffect(() => {
    for (const pin of pins) {
      const id = pin.point.id;
      pin.element.style.setProperty("z-index", id === selectedId ? "3" : id === hoveredId ? "2" : "");
      pin.element.setAttribute("aria-pressed", String(id === selectedId));
    }
  }, [pins, selectedId, hoveredId]);

  return (
    <>
      {/* MapLibre pone position: relative en su contenedor; por eso el que ocupa todo el panel es el de afuera */}
      <div className="absolute inset-0">
        <div ref={containerRef} className="size-full" />
      </div>
      {pins.map((pin) =>
        createPortal(
          <MarkerPin point={pin.point} selected={pin.point.id === selectedId} hovered={pin.point.id === hoveredId} />,
          pin.element,
          pin.point.id,
        ),
      )}
    </>
  );
}

function MarkerPin({ point, selected, hovered }: { point: CollectionPoint; selected: boolean; hovered: boolean }) {
  const Icon = pointTypes[point.type].icon;
  const full = point.status === "lleno";

  return (
    <span className="relative block">
      <span
        className={`grid size-10 place-items-center rounded-full ring-[2.5px] ring-white shadow-[0_8px_18px_-8px_rgba(6,39,36,0.7)] transition-[transform,background-color,color] duration-300 ease-salida ${
          selected
            ? "scale-[1.18] bg-bosque-800 text-white"
            : hovered
              ? "scale-110 bg-white text-bosque-800"
              : `bg-white ${full ? "text-niebla" : "text-bosque-800"}`
        }`}
      >
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <span
        aria-hidden
        className={`absolute -right-0.5 -top-0.5 size-3.5 rounded-full ring-2 ring-white ${statusStyles[point.status].dot}`}
      />
      {(selected || hovered) && (
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-bosque-950 px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(6,39,36,0.8)]">
          {point.name}
        </span>
      )}
    </span>
  );
}
