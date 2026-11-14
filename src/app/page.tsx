import { ViewTransition } from "react";
import { Audiences } from "@/components/audiences";
import { HelpFab } from "@/components/help-fab";
import { HowToHelp } from "@/components/help/how-to-help";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { UrgentNeeds } from "@/components/home/urgent-needs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackingSection } from "@/components/tracking/tracking-section";
import { directional } from "@/lib/page-transition";

/*
 * La página se arma como hojas que suben una sobre otra: el hero queda fijo y "Cómo ayudar" lo cubre; cada sección
 * siguiente monta su borde redondeado sobre la anterior; al final, el <main> se levanta y descubre el footer.
 */
export default function Home() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <main className="relative z-10 overflow-clip rounded-b-[36px] bg-papel md:rounded-b-[48px]">
        <div className="relative">
          <HeroCarousel />
          <ViewTransition enter={directional} exit={directional} default="none">
            <HowToHelp />
          </ViewTransition>
        </div>
        <ViewTransition enter={directional} exit={directional} default="none">
          <div>
            <UrgentNeeds />
            <TrackingSection />
            <Audiences />
          </div>
        </ViewTransition>
      </main>
      <SiteFooter />
      <HelpFab />
    </>
  );
}
