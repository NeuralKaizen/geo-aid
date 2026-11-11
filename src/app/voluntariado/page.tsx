import type { Metadata } from "next";
import { PageBody, PageShell } from "@/components/page-shell";
import { Agenda } from "@/components/voluntariado/agenda";
import { ShiftGuide } from "@/components/voluntariado/shift-guide";
import { VolunteerHeader } from "@/components/voluntariado/volunteer-header";

export const metadata: Metadata = {
  title: "Voluntariado",
  description: "Turnos de voluntariado de 4 horas en centros de acopio y puntos de entrega de Bogotá, Cali, Popayán, Pasto y Neiva.",
};

export default function Page() {
  return (
    <PageShell active="voluntariado">
      <VolunteerHeader />
      <PageBody>
        <div>
          <Agenda />
          <ShiftGuide />
        </div>
      </PageBody>
    </PageShell>
  );
}
