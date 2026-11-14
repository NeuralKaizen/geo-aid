"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MotionValue } from "motion/react";

/*
 * El territorio del home: imagen satelital (Sentinel-2 sin nubes, de EOX) sobre el relieve real (Terrain Tiles de AWS),
 * ambos libres y sin clave. Solo se carga en el navegador porque MapLibre necesita WebGL.
 *
 * El mapa no se toca con el puntero. Con `flight` la cámara sigue el scroll cuadro a cuadro; sin él, vuela a la zona
 * activa cuando cambia.
 */

export type Place = { id: string; name: string; note: string; coords: [number, number]; bearing: number };
export type TerritoryStatus = "cargando" | "listo" | "error";
/** `arrive`: 0 a 1 mientras la hoja sube. `t`: 0 en la primera zona, 1 en la segunda… */
export type Flight = { arrive: MotionValue<number>; t: MotionValue<number> };

type Camera = { center: [number, number]; zoom: number; pitch: number; bearing: number };

const overview: Camera = { center: [-76.585, 2.7], zoom: 9.6, pitch: 30, bearing: 0 };
const towns: { name: string; coords: [number, number] }[] = [{ name: "Popayán", coords: [-76.606, 2.444] }];

const style: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    sat: {
      type: "raster",
      tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"],
      tileSize: 256,
      maxzoom: 14,
      attribution: "Sentinel-2 cloudless 2020 por EOX (datos Copernicus modificados)",
    },
    relieve: {
      type: "raster-dem",
      tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 12,
      attribution: "Relieve: Mapzen, AWS Terrain Tiles",
    },
    sombras: {
      type: "raster-dem",
      tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 12,
    },
  },
  layers: [
    { id: "fondo", type: "background", paint: { "background-color": "#062724" } },
    { id: "sat", type: "raster", source: "sat", paint: { "raster-saturation": -0.1, "raster-contrast": 0.12, "raster-fade-duration": 200 } },
    {
      id: "sombras",
      type: "hillshade",
      source: "sombras",
      paint: { "hillshade-exaggeration": 0.4, "hillshade-shadow-color": "#062724", "hillshade-highlight-color": "#f2e9c9" },
    },
  ],
  terrain: { source: "relieve", exaggeration: 1.6 },
  sky: {
    "sky-color": "#0a3833",
    "horizon-color": "#dcebe8",
    "fog-color": "#bfd8d3",
    "sky-horizon-blend": 0.6,
    "horizon-fog-blend": 0.7,
    "fog-ground-blend": 0.35,
  },
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => (value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2);
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

function zoneCamera(place: Place): Camera {
  return { center: place.coords, zoom: 12.2, pitch: 64, bearing: place.bearing };
}

/** Entre dos encuadres la cámara se aleja un poco a mitad de camino, como un vuelo */
function between(from: Camera, to: Camera, amount: number, lift: number): Camera {
  return {
    center: [mix(from.center[0], to.center[0], amount), mix(from.center[1], to.center[1], amount)],
    zoom: mix(from.zoom, to.zoom, amount) - lift * Math.sin(Math.PI * amount),
    pitch: mix(from.pitch, to.pitch, amount),
    bearing: mix(from.bearing, to.bearing, amount),
  };
}

function cameraAt(places: Place[], arrive: number, t: number): Camera {
  if (t <= 0) return between(overview, zoneCamera(places[0]), ease(clamp((arrive - 0.2) / 0.8)), 0);
  const index = Math.min(Math.floor(t), places.length - 2);
  // Cada tramo empieza quieto en su zona y después vuela a la siguiente
  const amount = ease(clamp((t - index - 0.22) / 0.78));
  return between(zoneCamera(places[index]), zoneCamera(places[index + 1]), amount, 0.85);
}

export default function TerritoryMap({
  places,
  active,
  flight,
  leftInset = 0,
  onStatus,
}: {
  places: Place[];
  active: number;
  flight?: Flight;
  /** parte del ancho que tapa el panel, para encuadrar la zona en lo que sí se ve */
  leftInset?: number;
  onStatus: (status: TerritoryStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [pins, setPins] = useState<{ id: string; element: HTMLDivElement }[]>([]);
  const [ready, setReady] = useState(false);
  const latest = useRef({ places, flight, leftInset, onStatus });

  useEffect(() => {
    latest.current = { places, flight, leftInset, onStatus };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let loaded = false;
    let map: maplibregl.Map;
    const fail = () => !disposed && latest.current.onStatus("error");
    const start = latest.current;

    try {
      map = new maplibregl.Map({
        container,
        style,
        ...(start.flight
          ? cameraAt(start.places, start.flight.arrive.get(), start.flight.t.get())
          : zoneCamera(start.places[0])),
        interactive: false,
        maxPitch: 75,
        // Los créditos de la imagen y el relieve van escritos en la hoja
        attributionControl: false,
        fadeDuration: 0,
      });
    } catch {
      const frame = requestAnimationFrame(fail);
      return () => cancelAnimationFrame(frame);
    }

    mapRef.current = map;
    const timeout = window.setTimeout(() => !loaded && fail(), 20_000);

    map.on("load", () => {
      if (disposed) return;
      loaded = true;
      window.clearTimeout(timeout);
      const made = [...start.places, ...towns.map((town) => ({ ...town, id: `pueblo-${town.name}` }))].map((place) => {
        const element = document.createElement("div");
        new maplibregl.Marker({ element, anchor: "bottom" }).setLngLat(place.coords).addTo(map);
        return { id: place.id, element };
      });
      setPins(made);
      setReady(true);
      latest.current.onStatus("listo");
    });

    map.on("error", (event) => {
      // Un mosaico que no llega no daña el mapa; solo se avisa si nunca alcanzó a cargar
      if (loaded || "sourceId" in event || "tile" in event) return;
      if ((event.error as { name?: string } | undefined)?.name === "AbortError") return;
      window.clearTimeout(timeout);
      fail();
    });
    map.getCanvas().addEventListener("webglcontextlost", fail);

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Con vuelo: la cámara se recalcula cada vez que cambia el scroll
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !flight) return;
    const apply = () => {
      const padding = { left: map.getContainer().clientWidth * latest.current.leftInset, top: 72, right: 0, bottom: 0 };
      map.jumpTo({ ...cameraAt(latest.current.places, flight.arrive.get(), flight.t.get()), padding });
    };
    apply();
    const stops = [flight.arrive.on("change", apply), flight.t.on("change", apply)];
    return () => stops.forEach((stop) => stop());
  }, [ready, flight]);

  // Sin vuelo: va a la zona elegida
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || flight) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.flyTo({ ...zoneCamera(places[active]), duration: reduce ? 0 : 2200, essential: true });
  }, [ready, flight, active, places]);

  return (
    <>
      {/* MapLibre pone position: relative en su contenedor; por eso el que ocupa todo es el de afuera */}
      <div className="absolute inset-0">
        <div ref={containerRef} className="size-full" />
      </div>
      {pins.map((pin) => {
        const index = places.findIndex((place) => place.id === pin.id);
        const town = towns.find((entry) => `pueblo-${entry.name}` === pin.id);
        return createPortal(
          index >= 0 ? <ZonePin place={places[index]} index={index} active={index === active} /> : <TownLabel name={town?.name ?? ""} />,
          pin.element,
          pin.id,
        );
      })}
    </>
  );
}

function ZonePin({ place, index, active }: { place: Place; index: number; active: boolean }) {
  return (
    <span className="flex flex-col items-center">
      <span
        className={`mb-2 whitespace-nowrap rounded-2xl px-3.5 py-2 text-center shadow-[0_14px_30px_-12px_rgba(0,0,0,0.8)] transition-[opacity,transform,background-color,color] duration-700 ease-salida ${
          active ? "bg-maiz-400 text-bosque-950" : "scale-90 bg-bosque-950/70 text-white/85 backdrop-blur-sm"
        }`}
      >
        <span className="block font-display text-[15px] font-semibold leading-tight tracking-[-0.02em]">
          <span className="mr-1.5 tabular-nums opacity-60">0{index + 1}</span>
          {place.name}
        </span>
        {active && <span className="block text-[12.5px] font-medium">{place.note}</span>}
      </span>
      <span className="relative grid size-5 place-items-center">
        {active && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-maiz-400/70 motion-reduce:hidden" />}
        <span
          className={`relative rounded-full ring-[3px] ring-white transition-[width,height,background-color] duration-500 ${
            active ? "size-4 bg-maiz-400" : "size-3 bg-bosque-800"
          }`}
        />
      </span>
    </span>
  );
}

function TownLabel({ name }: { name: string }) {
  return (
    <span className="flex flex-col items-center text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em]">{name}</span>
      <span className="mt-1 size-1.5 rounded-full bg-white/80" />
    </span>
  );
}
