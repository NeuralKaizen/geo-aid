import type { Metadata } from "next";
import { PageBody, PageShell } from "@/components/page-shell";
import { EmergencyBar } from "@/components/necesito-ayuda/emergency-bar";
import { HelpWizard } from "@/components/necesito-ayuda/help-wizard";

export const metadata: Metadata = { title: "Necesito ayuda" };

/*
 * Necesito ayuda: la página más tranquila del sitio. Lienzo oscuro, una pregunta por pantalla, letra grande y la
 * línea de emergencias siempre a la vista. Sin foto de cabecera: lo primero que se ve es la pregunta.
 */
export default function Page() {
  return (
    <PageShell className="bg-bosque-950 text-white pt-[5.25rem]">
      <EmergencyBar />
      <PageBody>
        <div>
          <HelpWizard />
        </div>
      </PageBody>
    </PageShell>
  );
}
