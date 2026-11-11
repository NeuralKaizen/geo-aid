import { Suspense } from "react";
import type { Metadata } from "next";
import { PageBody, PageShell } from "@/components/page-shell";
import { PortalApp, PortalSkeleton } from "@/components/portal/portal-app";
import { PortalHeader } from "@/components/portal/portal-header";

export const metadata: Metadata = {
  title: "Mi portal",
  description: "Tus donaciones, tus turnos de voluntariado y tus reportes en un solo lugar.",
};

export default function Page() {
  return (
    <PageShell>
      <PageBody>
        <div>
          <PortalHeader />
          <div className="mx-auto mt-10 max-w-[1240px] px-5 sm:px-8 md:mt-14 lg:px-10">
            {/* El panel lee la pestaña de la URL (useSearchParams), así que va en Suspense con el esqueleto */}
            <Suspense fallback={<PortalSkeleton />}>
              <PortalApp />
            </Suspense>
          </div>
        </div>
      </PageBody>
    </PageShell>
  );
}
