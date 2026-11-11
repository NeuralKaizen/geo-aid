import { Suspense } from "react";
import type { Metadata } from "next";
import { Checkout } from "@/components/donar/checkout";
import { CheckoutSkeleton } from "@/components/donar/checkout-skeleton";
import { DonarHeader } from "@/components/donar/donar-header";
import { PageBody, PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Donar",
  description: "Elige a dónde va tu aporte, cuánto dar y cómo pagar, y sigue tu donación hasta el día en que llega.",
};

/*
 * Donar es un pago tranquilo, sin foto ni distracciones: el formulario por pasos a la izquierda y un recibo de papel a
 * la derecha que se llena en vivo y, al confirmar, se imprime como comprobante.
 */
export default function Page() {
  return (
    <PageShell>
      <PageBody>
        <div>
          <DonarHeader />
          <Suspense fallback={<CheckoutSkeleton />}>
            <Checkout />
          </Suspense>
        </div>
      </PageBody>
    </PageShell>
  );
}
