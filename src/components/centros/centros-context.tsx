"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { cities, type CityId } from "@/content/centros";

/*
 * La ciudad se elige en la cabecera (sobre la foto) y la usan la lista y el mapa, que viven más abajo. La página es un
 * Server Component, así que comparten el estado por contexto. Cambiar de ciudad también suelta el punto elegido.
 *
 * Desde una noticia se llega con `?ciudad=bogota&punto=garaje-rodriguez`: mientras la persona no elija otra cosa,
 * mandan esos parámetros. La dirección solo existe en el navegador; en el servidor se muestra Popayán.
 */
type CentrosState = {
  city: CityId;
  chooseCity: (city: CityId) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

const CentrosContext = createContext<CentrosState | null>(null);

const noop = () => () => {};

function useInitialParams() {
  const search = useSyncExternalStore(noop, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  const city = cities.find((candidate) => candidate.id === params.get("ciudad"))?.id ?? null;
  return { city, point: city ? params.get("punto") : null };
}

export function CentrosProvider({ children }: { children: ReactNode }) {
  const initial = useInitialParams();
  const [chosenCity, setChosenCity] = useState<CityId | null>(null);
  // undefined: la persona no ha tocado ningún punto todavía
  const [chosenPoint, setChosenPoint] = useState<string | null | undefined>(undefined);

  const city = chosenCity ?? initial.city ?? "popayan";
  const selectedId = chosenPoint !== undefined ? chosenPoint : chosenCity === null ? initial.point : null;

  const chooseCity = useCallback((next: CityId) => {
    setChosenCity(next);
    setChosenPoint(null);
  }, []);

  const value = useMemo(() => ({ city, chooseCity, selectedId, setSelectedId: setChosenPoint }), [city, chooseCity, selectedId]);
  return <CentrosContext.Provider value={value}>{children}</CentrosContext.Provider>;
}

export function useCentros() {
  const state = useContext(CentrosContext);
  if (!state) throw new Error("useCentros va dentro de <CentrosProvider>");
  return state;
}
