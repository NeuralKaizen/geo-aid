import type { Metadata } from "next";
import { newsreader } from "@/components/noticias/fonts";
import { NewsHeader } from "@/components/noticias/news-header";
import { NewsPortal } from "@/components/noticias/news-portal";
import { SourcesList } from "@/components/noticias/sources-list";
import { PageBody, PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Lo que está pasando en cada emergencia: qué pasó, sus cifras, sus últimas noticias con fuente y cómo ayudar.",
};

export default function Page() {
  return (
    // La variable de Newsreader solo vive en esta página
    <PageShell active="noticias" className={`bg-papel pt-[5.25rem] ${newsreader.variable}`}>
      <NewsHeader />
      <PageBody>
        <div>
          <NewsPortal />
          <SourcesList />
        </div>
      </PageBody>
    </PageShell>
  );
}
