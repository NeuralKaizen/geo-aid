import { ViewTransition } from "react";
import { HelpFab } from "@/components/help-fab";
import { HowToHelp } from "@/components/help/how-to-help";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { SiteHeader } from "@/components/site-header";
import { directional } from "@/lib/page-transition";

export default function Home() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <main>
        <HeroCarousel />
        <ViewTransition enter={directional} exit={directional} default="none">
          <HowToHelp />
        </ViewTransition>
      </main>
      <HelpFab />
    </>
  );
}
