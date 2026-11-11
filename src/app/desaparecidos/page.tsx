import type { Metadata } from "next";
import { Header } from "@/components/desaparecidos/header";
import { Intro } from "@/components/desaparecidos/intro";
import { ReportForm } from "@/components/desaparecidos/report-form";
import { Reports } from "@/components/desaparecidos/reports";
import { Verification } from "@/components/desaparecidos/verification";
import { PageBody, PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Desaparecidos",
  description:
    "Consulta reportes verificados de personas desaparecidas tras el terremoto, deja una pista o reporta a alguien que estás buscando.",
};

export default function Page() {
  return (
    <PageShell active="desaparecidos">
      <Header />
      <PageBody>
        <div>
          <Intro />
          <Reports />
          <Verification />
          <ReportForm />
        </div>
      </PageBody>
    </PageShell>
  );
}
