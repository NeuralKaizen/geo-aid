import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = { title: "Noticias" };

export default function Page() {
  return <SectionPage slug="noticias" />;
}
