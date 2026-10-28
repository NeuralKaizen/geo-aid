import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = { title: "Donaciones" };

export default function Page() {
  return <SectionPage slug="donaciones" />;
}
