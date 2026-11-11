"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { LeadStory, NewsCard } from "@/components/noticias/news-card";
import { serif } from "@/components/noticias/fonts";
import { FilterChip } from "@/components/ui/form";
import { eyebrow } from "@/components/ui/styles";
import { temas, type Emergencia, type Noticia, type Tema } from "@/content/noticias";

/**
 * Las noticias de la emergencia, de la más reciente a la más antigua. La primera va a lo ancho; las demás en grilla.
 * Los filtros por tema solo muestran los temas que tiene esta emergencia.
 */
export function NewsFeed({ emergencia, onOpen }: { emergencia: Emergencia; onOpen: (noticia: Noticia) => void }) {
  const [tema, setTema] = useState<Tema | null>(null);
  const presentes = (Object.keys(temas) as Tema[]).filter((id) => emergencia.noticias.some((noticia) => noticia.tema === id));
  const visibles = tema ? emergencia.noticias.filter((noticia) => noticia.tema === tema) : emergencia.noticias;
  const [lead, ...rest] = visibles;

  return (
    <section aria-labelledby="ultimas-noticias" className="mx-auto mt-20 max-w-[1240px] px-5 sm:px-8 lg:mt-28 lg:px-10">
      <div className="flex flex-col gap-5 border-t-2 border-tinta pt-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={eyebrow}>Últimas noticias</p>
          <h2
            id="ultimas-noticias"
            className={`${serif} mt-2 text-[clamp(2rem,3.4vw,2.85rem)] font-medium leading-[1.04] tracking-[-0.02em] text-tinta`}
          >
            {emergencia.noticias.length === 1 ? "Una noticia en el archivo" : `${emergencia.noticias.length} noticias, con su fuente`}
          </h2>
        </div>
        {presentes.length > 1 && (
          <div role="group" aria-label="Filtrar por tema" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <FilterChip pressed={tema === null} onClick={() => setTema(null)} count={emergencia.noticias.length}>
              Todas
            </FilterChip>
            {presentes.map((id) => (
              <FilterChip
                key={id}
                pressed={tema === id}
                onClick={() => setTema(tema === id ? null : id)}
                count={emergencia.noticias.filter((noticia) => noticia.tema === id).length}
              >
                {temas[id]}
              </FilterChip>
            ))}
          </div>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {tema ? `${visibles.length} noticias de ${temas[tema]}` : `${visibles.length} noticias`}
      </p>

      <LayoutGroup>
        <div className="mt-8 flex flex-col gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {lead && <LeadStory key={lead.id} noticia={lead} ejemplo={emergencia.ejemplo} onOpen={() => onOpen(lead)} />}
          </AnimatePresence>
          {rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {rest.map((noticia) => (
                  <NewsCard key={noticia.id} noticia={noticia} ejemplo={emergencia.ejemplo} onOpen={() => onOpen(noticia)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </LayoutGroup>
    </section>
  );
}
