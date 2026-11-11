import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import { Intro } from "@/components/intro";
import { Providers } from "@/components/providers";
import "lenis/dist/lenis.css";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GeoAid | Ayuda coordinada tras el terremoto",
    template: "%s | GeoAid",
  },
  description:
    "Qué necesita cada zona afectada, qué ayudas se están recogiendo y a dónde están llegando, en un solo lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} ${figtree.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Intro />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
