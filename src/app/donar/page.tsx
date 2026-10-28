import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = { title: "Donar" };

export default function Page() {
  return <SectionPage slug="donar" />;
}
