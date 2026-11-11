import type { Metadata } from "next";
import { ContextNote } from "@/components/noticias/context-note";
import { Figures } from "@/components/noticias/figures";
import { newsreader } from "@/components/noticias/fonts";
import { Masthead } from "@/components/noticias/masthead";
import { SourcesList } from "@/components/noticias/sources-list";
import { Subscribe } from "@/components/noticias/subscribe";
import { Timeline } from "@/components/noticias/timeline";
import { PageBody, PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Bitácora del terremoto del 10 de agosto: cifras oficiales, una cronología con fuentes y lo que significa cada hito para quien quiere ayudar.",
};

export default function Page() {
  return (
    // La variable de Newsreader solo vive en esta página
    <PageShell active="noticias" className={`bg-papel pt-[5.25rem] ${newsreader.variable}`}>
      <Masthead />
      <PageBody>
        <div>
          <Figures />
          <Timeline />
          <div className="mx-auto grid max-w-[1240px] gap-5 px-5 pt-24 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:px-10 lg:pt-32">
            <ContextNote />
            <Subscribe />
          </div>
          <SourcesList />
        </div>
      </PageBody>
    </PageShell>
  );
}
