"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { helpOptions, navLinks } from "@/content/site";
import { easeSalida } from "@/lib/motion";

type Entry = { label: string; group: string; href: string };

const entries: Entry[] = [
  ...navLinks.map((link) => ({ label: link.label, group: "Secciones", href: link.href })),
  { label: "Donar", group: "Acciones", href: "/donar" },
  { label: "Registrar una necesidad", group: "Acciones", href: "/necesito-ayuda" },
  { label: "Mi portal", group: "Acciones", href: "/portal" },
  ...helpOptions.map((option) => ({ label: option.title, group: "Cómo ayudar", href: option.primary.href })),
];

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return q ? entries.filter((entry) => normalize(`${entry.label} ${entry.group}`).includes(q)) : entries;
  }, [query]);
  const current = Math.min(selected, results.length - 1);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      returnFocus.current?.focus();
    };
  }, [open]);

  function close() {
    setQuery("");
    setSelected(0);
    onClose();
  }

  function go(entry: Entry) {
    close();
    router.push(entry.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((current - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && results[current]) {
      event.preventDefault();
      go(results[current]);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search"
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Cerrar búsqueda"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-bosque-950/45 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar en GeoAid"
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: easeSalida }}
            className="relative w-full max-w-xl overflow-hidden rounded-[24px] bg-white shadow-[0_40px_90px_-30px_rgba(6,39,36,0.6)] ring-1 ring-linea"
          >
            <div className="flex items-center gap-3 border-b border-linea px-5">
              <Search className="size-5 shrink-0 text-niebla" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                placeholder="Busca una sección o una forma de ayudar"
                aria-label="Buscar"
                aria-controls="search-results"
                aria-activedescendant={results[current] ? `search-${current}` : undefined}
                className="h-16 w-full bg-transparent text-[17px] text-tinta outline-none placeholder:text-niebla/70"
              />
              <kbd className="hidden rounded-md border border-linea px-1.5 py-0.5 text-xs text-niebla sm:block">Esc</kbd>
            </div>

            <ul id="search-results" role="listbox" data-lenis-prevent className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-niebla">
                  No hay resultados para “{query}”. Prueba con donar, voluntariado o centros.
                </li>
              )}
              {results.map((entry, index) => {
                const isSelected = index === current;
                return (
                  <li
                    key={`${entry.group}-${entry.label}`}
                    id={`search-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => setSelected(index)}
                    onClick={() => go(entry)}
                    className="relative isolate flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3"
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="search-highlight"
                        className="absolute inset-0 -z-10 rounded-2xl bg-bosque-50"
                        transition={{ type: "spring", bounce: 0.12, duration: 0.35 }}
                      />
                    )}
                    <span>
                      <span className="block font-medium text-tinta">{entry.label}</span>
                      <span className="text-[13px] text-niebla">{entry.group}</span>
                    </span>
                    {isSelected ? (
                      <CornerDownLeft className="size-4 text-bosque-700" aria-hidden />
                    ) : (
                      <ArrowRight className="size-4 text-niebla/50" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
