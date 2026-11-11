"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { NavLink } from "@/components/transitions/nav-link";
import { button } from "@/components/ui/styles";
import { photos } from "@/content/site";
import { easeSalida } from "@/lib/motion";

// Lo que no se recibe viene de la aclaración de la Cruz Roja (Infobae, 14 de agosto), igual que en "Cómo ayudar"
const yes = ["Agua", "Kits de aseo", "Alimentos no perecederos"];
const no = ["Ropa usada", "Medicamentos", "Comida perecedera"];

/** Remate: también se pueden donar cosas, pero solo lo que un centro pide hoy */
export function SuppliesCta() {
  const photo = photos.ayudaInsumos;

  return (
    <section aria-labelledby="insumos-titulo" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeSalida }}
        className="grid overflow-hidden rounded-[32px] bg-bosque-900 text-white md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <div className="relative min-h-[16rem] md:min-h-full">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          <p className="absolute bottom-3 left-4 right-4 text-[11px] text-white/75 [text-shadow:0_1px_8px_rgba(6,39,36,0.9)]">
            Foto: {photo.credit}
          </p>
        </div>

        <div className="p-7 sm:p-10 lg:p-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-maiz-400">Donar insumos</p>
          <h2
            id="insumos-titulo"
            className="mt-3 font-display text-[clamp(2rem,3.4vw,2.9rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance"
          >
            ¿Prefieres donar cosas? Lleva solo lo que un centro pide hoy
          </h2>
          <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-white/70">
            Cada centro de acopio publica qué recibe y cuánto espacio le queda. Así lo que llevas sí llega a alguien.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[12.5px] font-medium text-white/55">Lo que más se pide</p>
              <ul className="mt-2 space-y-1.5">
                {yes.map((thing) => (
                  <li key={thing} className="flex items-center gap-2 text-[14.5px]">
                    <Check className="size-4 text-brote-300" aria-hidden />
                    {thing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12.5px] font-medium text-white/55">La Cruz Roja no recibe</p>
              <ul className="mt-2 space-y-1.5">
                {no.map((thing) => (
                  <li key={thing} className="flex items-center gap-2 text-[14.5px] text-white/75">
                    <X className="size-4 text-white/45" aria-hidden />
                    {thing}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <NavLink href="/centros-de-acopio" className={`mt-9 ${button({ variant: "light", size: "lg" })}`}>
            Buscar un centro de acopio
            <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
          </NavLink>
        </div>
      </motion.div>
    </section>
  );
}
