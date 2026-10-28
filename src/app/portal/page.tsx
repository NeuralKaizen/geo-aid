import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";

export const metadata: Metadata = { title: "Mi portal" };

export default function Page() {
  return <SectionPage slug="portal" />;
}
