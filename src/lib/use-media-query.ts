import { useSyncExternalStore } from "react";

/** En el servidor siempre es false: el diseño móvil es el punto de partida y el de escritorio se activa al hidratar. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
