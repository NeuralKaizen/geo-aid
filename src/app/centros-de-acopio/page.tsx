import type { Metadata } from "next";
import { MorphPhoto, OverPhoto, PageBody, PageShell } from "@/components/page-shell";
import { CentrosProvider } from "@/components/centros/centros-context";
import { CentrosExplorer } from "@/components/centros/centros-explorer";
import { CityPicker } from "@/components/centros/city-picker";
import { OpenPoint } from "@/components/centros/open-point";
import { photos } from "@/content/site";

export const metadata: Metadata = { title: "Centros de acopio" };

/*
 * Centros de acopio: una herramienta antes que una portada. La cabecera es más baja que en las demás secciones para
 * que el buscador y el mapa aparezcan pronto; la ciudad se elige ahí mismo, sobre la foto.
 */
export default function Page() {
  return (
    <PageShell active="centros-de-acopio">
      <CentrosProvider>
        <div className="px-3">
          <section
            aria-labelledby="centros-titulo"
            className="relative isolate h-[24rem] overflow-hidden rounded-[28px] bg-bosque-900 sm:h-[21rem] lg:h-[20rem]"
          >
            <MorphPhoto slug="centros-de-acopio" photo={photos.centros} />
            <OverPhoto>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bosque-950/90 via-bosque-950/45 to-bosque-950/15">
                <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-5 pb-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-9">
                  <div className="text-white">
                    <h1
                      id="centros-titulo"
                      className="font-display text-[clamp(2.6rem,5.6vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.045em]"
                    >
                      Centros de acopio
                    </h1>
                    <p className="mt-3 max-w-lg text-[1.0625rem] leading-relaxed text-white/80">
                      Antes de salir de casa, mira qué recibe cada punto hoy y cuánto espacio le queda.
                    </p>
                  </div>
                  <CityPicker />
                </div>
              </div>
            </OverPhoto>
          </section>
        </div>

        <PageBody>
          <div>
            <CentrosExplorer />
            <OpenPoint />
          </div>
        </PageBody>
      </CentrosProvider>
    </PageShell>
  );
}
