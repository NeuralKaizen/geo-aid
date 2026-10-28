import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = { title: "Desaparecidos" };

export default function Page() {
  return <SectionPage slug="desaparecidos" />;
}
