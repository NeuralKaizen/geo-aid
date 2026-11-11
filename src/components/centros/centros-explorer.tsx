"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { List, Map as MapIcon, SearchX } from "lucide-react";
import {
  cities,
  isRejected,
  items,
  rejectedItems,
  statusOrder,
  type CollectionPoint,
  type ItemId,
  type PointType,
  type RejectedId,
  type WantId,
} from "@/content/centros";
import { useCentros } from "@/components/centros/centros-context";
import { CityNote, Filters, RejectedNotice } from "@/components/centros/filters";
import { MapPanel } from "@/components/centros/map-panel";
import { PointCard, PointPeek } from "@/components/centros/point-card";
import { ExampleTag } from "@/components/ui/form";
import { button } from "@/components/ui/styles";
import { easeSalida } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

/*
 * Buscador de puntos: filtros arriba, lista a la izquierda y mapa fijo a la derecha (en el celular, Lista o Mapa).
 * "Lo que quieres llevar" deja solo los puntos que hoy reciben todo lo elegido; lo que ningún punto recibe no filtra,
 * muestra el aviso de la Cruz Roja.
 */
export function CentrosExplorer() {
  const { city: cityId, selectedId, setSelectedId } = useCentros();
  const city = cities.find((option) => option.id === cityId) ?? cities[0];
  const desktop = useMediaQuery("(min-width: 1024px)");
  const lenis = useLenis();

  const [wanted, setWanted] = useState<WantId[]>([]);
  const [types, setTypes] = useState<PointType[]>([]);
  const [view, setView] = useState<"lista" | "mapa">("lista");
  // En el celular el mapa no se baja hasta que alguien lo pide; después se queda montado
  const [mapRequested, setMapRequested] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const accepted = useMemo(() => wanted.filter((id): id is ItemId => !isRejected(id)), [wanted]);
  const rejected = useMemo(() => wanted.filter(isRejected), [wanted]);

  const matchesType = useCallback((point: CollectionPoint) => types.length === 0 || types.includes(point.type), [types]);
  const receivesAll = useCallback(
    (point: CollectionPoint, wantedItems: ItemId[]) =>
      wantedItems.length === 0 || (point.status !== "lleno" && wantedItems.every((item) => point.accepts.includes(item))),
    [],
  );

  const visible = useMemo(
    () =>
      city.points
        .filter((point) => matchesType(point) && receivesAll(point, accepted))
        .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]),
    [city, matchesType, receivesAll, accepted],
  );
  const visibleIds = useMemo(() => visible.map((point) => point.id), [visible]);
  const activeId = selectedId && visibleIds.includes(selectedId) ? selectedId : null;
  const activePoint = visible.find((point) => point.id === activeId);

  // Cuántos puntos quedarían con cada chip, para que nadie elija a ciegas
  const itemCounts = useMemo(() => {
    const counts = {} as Record<WantId, number>;
    for (const item of items) {
      counts[item.id] = city.points.filter((point) => matchesType(point) && receivesAll(point, [item.id])).length;
    }
    for (const item of rejectedItems) counts[item.id] = 0;
    return counts;
  }, [city, matchesType, receivesAll]);

  const typeCounts = useMemo(() => {
    const counts = {} as Record<PointType, number>;
    for (const type of ["oficial", "comunal", "parroquia", "casa"] as const) {
      counts[type] = city.points.filter((point) => point.type === type && receivesAll(point, accepted)).length;
    }
    return counts;
  }, [city, receivesAll, accepted]);

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]);

  /** Lleva la tarjeta a la vista si no se ve completa (al tocar un marcador en escritorio). */
  function revealCard(id: string) {
    const card = document.getElementById(`punto-${id}`);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.top >= 96 && rect.bottom <= window.innerHeight - 16) return;
    if (lenis) lenis.scrollTo(card, { offset: -112, duration: 1.1 });
    else card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectFromMap(id: string) {
    setSelectedId(id);
    if (desktop) revealCard(id);
  }

  function showOnMap(id: string) {
    setSelectedId(id);
    if (desktop) return;
    setMapRequested(true);
    setView("mapa");
    const top = document.getElementById("resultados");
    if (!top) return;
    if (lenis) lenis.scrollTo(top, { offset: -96 });
    else top.scrollIntoView({ block: "start" });
  }

  function showCard(id: string) {
    setView("lista");
    // Espera a que la lista vuelva a estar en pantalla antes de buscar la tarjeta
    requestAnimationFrame(() => revealCard(id));
  }

  const filtersActive = accepted.length > 0 || types.length > 0;
  const mapMounted = desktop || mapRequested;

  return (
    <section
      aria-labelledby="llevar-titulo"
      className="mx-auto grid max-w-[1240px] gap-6 px-5 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-8 lg:px-10 lg:pt-8"
    >
      <div className="min-w-0">
        <Filters
          wanted={wanted}
          types={types}
          itemCounts={itemCounts}
          typeCounts={typeCounts}
          onToggleWant={(id) => setWanted((list) => toggle(list, id))}
          onToggleType={(type) => setTypes((list) => toggle(list, type))}
          onClear={() => {
            setWanted([]);
            setTypes([]);
          }}
          notice={
            rejected.length > 0 && (
              <RejectedNotice
                key="aviso"
                chosen={rejected}
                onRemove={(id: RejectedId) => setWanted((list) => list.filter((entry) => entry !== id))}
              />
            )
          }
        />
        <AnimatePresence initial={false} mode="wait">
          {city.note && <CityNote key={city.id} note={city.note} />}
        </AnimatePresence>

        <div id="resultados" className="mt-8 flex scroll-mt-24 flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em] text-tinta">
              Puntos en {city.name}
              <ExampleTag />
            </h2>
            <p className="mt-1 text-[15px] text-niebla">
              {city.total} puntos, {city.neighbors} abiertos por vecinos
            </p>
          </div>
          <p aria-live="polite" className="text-[15px] font-semibold tabular-nums text-tinta max-lg:order-last max-lg:w-full">
            Mostrando {visible.length} de {city.total}
          </p>
          <ViewToggle
            view={view}
            onChange={(next) => {
              setView(next);
              if (next === "mapa") setMapRequested(true);
            }}
          />
        </div>

        <div className={`mt-5 ${view === "mapa" ? "max-lg:hidden" : ""}`}>
          {visible.length === 0 ? (
            <EmptyState
              onClear={() => {
                setWanted((list) => list.filter(isRejected));
                setTypes([]);
              }}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((point, index) => (
                  <motion.li
                    key={point.id}
                    layout="position"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: Math.min(index, 4) * 0.05, ease: easeSalida } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                    transition={{ layout: { duration: 0.5, ease: easeSalida } }}
                  >
                    <PointCard
                      point={point}
                      wanted={accepted}
                      selected={point.id === activeId}
                      onSelect={() => setSelectedId(point.id)}
                      onShowOnMap={() => showOnMap(point.id)}
                      onHover={(hovering) => setHoveredId(hovering ? point.id : null)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
          {filtersActive && visible.length > 0 && (
            <p className="mt-4 text-[13px] text-niebla">Los puntos llenos no aparecen cuando eliges qué llevar: hoy no reciben nada.</p>
          )}
        </div>
      </div>

      {/* El mapa queda fijo a la derecha mientras la lista se desplaza; en el celular es la vista "Mapa" */}
      <div className={view === "lista" ? "max-lg:hidden" : ""}>
        <div
          role="region"
          aria-label={`Mapa de los puntos en ${city.name}`}
          className="h-[min(72svh,620px)] lg:sticky lg:top-[5.75rem] lg:h-[calc(100svh-6.75rem)]"
        >
          {mapMounted && (
            <MapPanel
              cityId={city.id}
              visibleIds={visibleIds}
              selectedId={activeId}
              hoveredId={hoveredId}
              bottomInset={!desktop && activePoint ? 200 : 0}
              onSelect={selectFromMap}
            >
              {!desktop && (
                <AnimatePresence>
                  {activePoint && (
                    <motion.div
                      key={activePoint.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSalida } }}
                      exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
                      className="absolute inset-x-3 bottom-9"
                    >
                      <PointPeek point={activePoint} onShowCard={() => showCard(activePoint.id)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </MapPanel>
          )}
        </div>
      </div>
    </section>
  );
}

/** Conmutador Lista/Mapa del celular */
function ViewToggle({ view, onChange }: { view: "lista" | "mapa"; onChange: (view: "lista" | "mapa") => void }) {
  const options = [
    { id: "lista", label: "Lista", icon: List },
    { id: "mapa", label: "Mapa", icon: MapIcon },
  ] as const;

  return (
    <div role="group" aria-label="Ver los puntos como" className="flex rounded-full bg-white p-1 ring-1 ring-linea lg:hidden">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={view === option.id}
          onClick={() => onChange(option.id)}
          className={`relative isolate flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${
            view === option.id ? "text-white" : "text-tinta/75"
          }`}
        >
          {view === option.id && (
            <motion.span
              layoutId="vista-centros"
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-bosque-800"
              transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
            />
          )}
          <option.icon className="size-4" aria-hidden />
          {option.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-[28px] bg-white px-6 py-10 text-center ring-1 ring-linea">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-papel text-niebla">
        <SearchX className="size-5" aria-hidden />
      </span>
      <p className="mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] text-tinta">
        Ningún punto recibe todo eso junto hoy
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-niebla">
        Prueba con menos cosas a la vez o con otro tipo de punto. También puedes repartir lo que llevas en dos puntos.
      </p>
      <button type="button" onClick={onClear} className={`${button({ variant: "secondary", size: "sm" })} mt-5`}>
        Quitar filtros
      </button>
    </div>
  );
}
