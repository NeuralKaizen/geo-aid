"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CityId } from "@/content/centros";

/*
 * La ciudad se elige en la cabecera (sobre la foto) y la usan la lista y el mapa, que viven más abajo. La página es un
 * Server Component, así que comparten el estado por contexto. Cambiar de ciudad también suelta el punto elegido.
 */
type CentrosState = {
  city: CityId;
  chooseCity: (city: CityId) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

const CentrosContext = createContext<CentrosState | null>(null);

export function CentrosProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<CityId>("popayan");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const chooseCity = useCallback((next: CityId) => {
    setCity(next);
    setSelectedId(null);
  }, []);

  const value = useMemo(() => ({ city, chooseCity, selectedId, setSelectedId }), [city, chooseCity, selectedId]);
  return <CentrosContext.Provider value={value}>{children}</CentrosContext.Provider>;
}

export function useCentros() {
  const state = useContext(CentrosContext);
  if (!state) throw new Error("useCentros va dentro de <CentrosProvider>");
  return state;
}
