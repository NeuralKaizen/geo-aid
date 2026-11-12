"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Alerts } from "@/components/noticias/alerts";
import { CrisisOverview } from "@/components/noticias/crisis-overview";
import { CrisisSwitcher } from "@/components/noticias/crisis-switcher";
import { NewsDrawer } from "@/components/noticias/news-drawer";
import { NewsFeed } from "@/components/noticias/news-feed";
import { buscarEmergencia, type Noticia } from "@/content/noticias";
import { easeEntrada, easeSalida } from "@/lib/motion";

const noop = () => () => {};

/** Lee `?emergencia=` y `?noticia=` de la dirección. En el servidor no hay dirección: se muestra el terremoto. */
function useInitialParams() {
  const search = useSyncExternalStore(noop, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  return { emergencia: params.get("emergencia"), noticia: params.get("noticia") };
}

/** Deja la emergencia y la noticia abiertas en la dirección, para poder compartir el enlace. No navega. */
function writeParams(emergencia: string, noticia?: string) {
  const params = new URLSearchParams({ emergencia });
  if (noticia) params.set("noticia", noticia);
  window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}`);
}

/**
 * El portal: las emergencias arriba y, debajo, la elegida con qué está pasando, sus noticias, su línea de días y las
 * alertas. Lo que elige la persona manda; mientras no elija nada, mandan los parámetros con los que llegó.
 */
export function NewsPortal() {
  const initial = useInitialParams();
  const [chosen, setChosen] = useState<string | null>(null);
  // undefined: la persona no ha abierto ni cerrado nada todavía
  const [openId, setOpenId] = useState<string | null | undefined>(undefined);

  const emergencia = buscarEmergencia(chosen ?? initial.emergencia);
  const currentOpen = openId === undefined ? initial.noticia : openId;
  const noticia = emergencia.noticias.find((item) => item.id === currentOpen) ?? null;

  function select(id: string) {
    if (id === emergencia.id) return;
    setChosen(id);
    setOpenId(null);
    writeParams(id);
  }

  function open(item: Noticia) {
    setOpenId(item.id);
    writeParams(emergencia.id, item.id);
  }

  function close() {
    setOpenId(null);
    writeParams(emergencia.id);
  }

  return (
    <>
      <CrisisSwitcher selected={emergencia.id} onSelect={select} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={emergencia.id}
          id="emergencia-panel"
          role="tabpanel"
          aria-labelledby={`emergencia-${emergencia.id}`}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: easeSalida } }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.22, ease: easeEntrada } }}
        >
          <CrisisOverview emergencia={emergencia} />
          <NewsFeed emergencia={emergencia} onOpen={open} />
        </motion.div>
      </AnimatePresence>

      <Alerts selected={emergencia.id} />

      <NewsDrawer emergencia={emergencia} noticia={noticia} onClose={close} onNavigate={open} />
    </>
  );
}
