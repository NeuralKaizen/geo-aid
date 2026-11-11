"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { Heart, Phone } from "lucide-react";
import { emergencyLine, navLinks, sources } from "@/content/site";

/**
 * Footer que se revela por debajo de la página: queda pegado al fondo de la ventana y el <main> (z-10, esquinas
 * redondeadas) se levanta para descubrirlo. Solo en pantallas donde cabe completo.
 */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  // Se mide solo cuando algo cambia de tamaño: leer scrollHeight en cada cuadro de scroll fuerza layout de toda la página
  const metrics = useRef({ end: 0, height: 0 });
  const { scrollY } = useScroll();

  useEffect(() => {
    const footer = ref.current;
    if (!footer) return;
    const measure = () => {
      metrics.current = {
        end: document.documentElement.scrollHeight - window.innerHeight,
        height: footer.offsetHeight,
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // 0 cuando el footer empieza a asomar, 1 al final de la página
  const reveal = useTransform(scrollY, (y) => {
    const { end, height } = metrics.current;
    if (!height) return 1;
    return Math.min(1, Math.max(0, 1 - (end - y) / height));
  });
  const wordY = useTransform(reveal, [0, 1], ["45%", "0%"]);
  const contentY = useTransform(reveal, [0, 1], [80, 0]);

  return (
    <footer
      ref={ref}
      className="relative z-0 overflow-hidden bg-bosque-950 text-white [@media(min-width:768px)_and_(min-height:820px)]:sticky [@media(min-width:768px)_and_(min-height:820px)]:bottom-0"
    >
      <motion.div style={{ y: contentY }} className="mx-auto max-w-[1320px] px-5 pt-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-3xl font-display text-[clamp(2.4rem,5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance">
            Que la ayuda llegue a donde hace falta.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/donar"
              transitionTypes={["nav-forward"]}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-maiz-400 px-6 text-[15px] font-semibold text-bosque-950 transition-[filter] hover:brightness-105"
            >
              <Heart className="size-4 fill-current" aria-hidden />
              Donar
            </Link>
            <Link
              href="/voluntariado"
              transitionTypes={["nav-forward"]}
              className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/10"
            >
              Ser voluntario
            </Link>
            <Link
              href="/necesito-ayuda"
              transitionTypes={["nav-forward"]}
              className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/10"
            >
              Necesito ayuda
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2.2fr]">
          <nav aria-label="Secciones">
            <p className="text-[13px] font-semibold text-white/45">Secciones</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.slug}>
                  <Link href={link.href} transitionTypes={["nav-forward"]} className="text-white/80 transition-colors hover:text-maiz-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[13px] font-semibold text-white/45">Ayuda</p>
            <ul className="mt-4 space-y-2.5 text-white/80">
              <li>
                <Link href="/necesito-ayuda" transitionTypes={["nav-forward"]} className="transition-colors hover:text-maiz-400">
                  Registrar una necesidad
                </Link>
              </li>
              <li>
                <Link href="/portal" transitionTypes={["nav-forward"]} className="transition-colors hover:text-maiz-400">
                  Mi portal
                </Link>
              </li>
              <li>
                <a href={`tel:${emergencyLine.number}`} className="flex items-center gap-2 transition-colors hover:text-maiz-400">
                  <Phone className="size-4" aria-hidden />
                  {emergencyLine.label}: <strong className="text-white">{emergencyLine.number}</strong>
                </a>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-[13px] font-semibold text-white/45">Fuentes</p>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 text-[13px] leading-snug text-white/55 md:grid-cols-2">
              {sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-[12px] text-white/35">
          Prototipo. Las fotos son de Wikimedia Commons con licencias libres y los datos de ejemplo están marcados como tal.
        </p>
      </motion.div>

      <div aria-hidden className="mt-4 overflow-hidden">
        <motion.p
          style={{ y: wordY }}
          className="select-none text-center font-display text-[15vw] font-semibold leading-[0.78] tracking-[-0.07em] text-bosque-800"
        >
          GeoAid
        </motion.p>
      </div>
    </footer>
  );
}
