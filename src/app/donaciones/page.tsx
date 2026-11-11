import { Suspense } from "react";
import type { Metadata } from "next";
import { Allocation } from "@/components/donaciones/allocation";
import { BoardHero } from "@/components/donaciones/board-hero";
import { NeedsBoard } from "@/components/donaciones/needs-board";
import { SuppliesCta } from "@/components/donaciones/supplies-cta";
import { TrackingFromParams, TrackingLookup } from "@/components/donaciones/tracking-lookup";
import { MorphPhoto, OverPhoto, PageBody, PageShell } from "@/components/page-shell";
import { photos } from "@/content/site";

export const metadata: Metadata = {
  title: "Donaciones",
  description: "Qué le falta a cada zona, cuánto ya llegó, a dónde va cada peso y en qué va tu donación.",
};

/*
 * Donaciones es un tablero: la foto del hero se vuelve la cabecera con tres cifras en vidrio y, debajo, las zonas con
 * lo que les falta, el reparto de cada peso, el seguimiento por código y, al final, cómo donar insumos.
 */
export default function Page() {
  return (
    <PageShell active="donaciones">
      <div className="px-3">
        <section aria-labelledby="donaciones-titulo" className="relative isolate rounded-[28px] bg-bosque-900">
          <MorphPhoto slug="donaciones" photo={photos.donaciones} radius="rounded-[28px]" />
          <OverPhoto>
            <div className="relative">
              <BoardHero />
            </div>
          </OverPhoto>
        </section>
      </div>

      <PageBody>
        <div>
          <NeedsBoard />
          <Allocation />
          <section aria-labelledby="seguimiento-titulo" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32">
            {/* El ancla queda fuera del Suspense para que /donaciones?codigo=…#seguimiento aterrice en la tarjeta */}
            <div id="seguimiento">
              <Suspense fallback={<TrackingLookup initialCode={null} />}>
                <TrackingFromParams />
              </Suspense>
            </div>
          </section>
          <SuppliesCta />
        </div>
      </PageBody>
    </PageShell>
  );
}
