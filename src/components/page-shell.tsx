import { ViewTransition, type ReactNode } from "react";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { NavSlug, Photo } from "@/content/site";
import { directional, layer } from "@/lib/page-transition";

/*
 * Estructura común de las páginas de sección: barra flotante arriba, la página como una hoja con el borde inferior
 * redondeado y el footer que se revela por debajo (igual que en el inicio). Cada página arma su contenido a su manera.
 */
export function PageShell({
  active,
  children,
  className = "bg-papel pt-[5.25rem]",
}: {
  /** sección del menú que queda marcada */
  active?: NavSlug;
  children: ReactNode;
  /** fondo y relleno superior del <main>; por defecto papel y espacio para la barra flotante */
  className?: string;
}) {
  return (
    <>
      <SiteHeader variant="solid" active={active} />
      <main className={`relative z-10 overflow-clip rounded-b-[36px] pb-24 md:rounded-b-[48px] ${className}`}>{children}</main>
      <SiteFooter />
    </>
  );
}

/**
 * Foto de cabecera que recibe la del hero con un morph (misma `name` que en el carrusel). El contenedor debe tener
 * posición y tamaño: la foto lo llena. El radio va adentro para que el morph lo interpole.
 */
export function MorphPhoto({
  slug,
  photo,
  radius = "rounded-[28px]",
  className = "",
  sizes = "100vw",
}: {
  slug: NavSlug;
  photo: Photo;
  /** clase de radio de la foto, igual a la de su contenedor */
  radius?: string;
  /** clases extra para la imagen (filtros, recorte) */
  className?: string;
  sizes?: string;
}) {
  return (
    <ViewTransition name={`seccion-${slug}`} share="morph" default="none">
      <div className={`absolute inset-0 overflow-hidden ${radius}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          preload
          sizes={sizes}
          className={`object-cover ${className}`}
          style={{ objectPosition: photo.position }}
        />
      </div>
    </ViewTransition>
  );
}

/** Textos y velos encima de la foto compartida: salen rápido y entran cuando la foto aterriza. Un solo hijo. */
export function OverPhoto({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={layer} exit={layer} default="none">
      {children}
    </ViewTransition>
  );
}

/** Contenido de la página que se desliza según la dirección de la navegación desde el hero. Un solo hijo. */
export function PageBody({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      {children}
    </ViewTransition>
  );
}
