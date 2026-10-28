import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = { title: "Centros de acopio" };

export default function Page() {
  return <SectionPage slug="centros-de-acopio" />;
}
