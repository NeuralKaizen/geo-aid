import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { navLinks, sectionPages, type NavSlug, type Photo, type SectionKey } from "@/content/site";
import { directional, layer } from "@/lib/page-transition";

/** Página de sección mientras se construye. Su foto recibe la del hero con un morph compartido. */
export function SectionPage({ slug }: { slug: SectionKey }) {
  const page = sectionPages[slug];
  const active = navLinks.find((link) => link.slug === slug)?.slug;

  return (
    <>
      <SiteHeader variant="solid" active={active} />
      <main className="relative z-10 rounded-b-[36px] bg-papel px-3 pb-24 pt-[5.25rem] md:rounded-b-[48px]">
        <section className="relative isolate min-h-[min(68svh,600px)] overflow-hidden rounded-[28px] bg-bosque-900">
          {"photo" in page && <Banner photo={page.photo} morph={"morph" in page ? page.morph : undefined} />}
          <ViewTransition enter={layer} exit={layer} default="none">
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bosque-950/90 via-bosque-950/30 to-transparent">
              <div className="mx-auto w-full max-w-[1240px] px-6 pb-12 lg:px-10 lg:pb-16">
                <h1 className="font-display text-[clamp(2.75rem,6.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
                  {page.title}
                </h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">{page.description}</p>
              </div>
            </div>
          </ViewTransition>
        </section>

        <ViewTransition enter={directional} exit={directional} default="none">
          <div className="mx-auto mt-12 flex max-w-[1240px] flex-col gap-6 px-3 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <p className="max-w-lg leading-relaxed text-niebla">
              <strong className="font-semibold text-tinta">Esta sección está en construcción.</strong> Mientras tanto, desde el
              inicio puedes ver las formas de ayudar.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/"
                transitionTypes={["nav-back"]}
                className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-bosque-800 ring-1 ring-linea transition-colors duration-300 hover:bg-white hover:ring-bosque-200"
              >
                <ArrowLeft className="size-4 transition-transform duration-500 ease-salida group-hover:-translate-x-1" aria-hidden />
                Volver al inicio
              </Link>
              <Link
                href="/#como-ayudar"
                transitionTypes={["nav-back"]}
                className="inline-flex h-12 items-center rounded-full bg-bosque-800 px-6 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-bosque-700"
              >
                Ver cómo ayudar
              </Link>
            </div>
          </div>
        </ViewTransition>
      </main>
      <SiteFooter />
    </>
  );
}

function Banner({ photo, morph }: { photo: Photo; morph?: NavSlug }) {
  const image = (
    <div className="absolute inset-0 overflow-hidden rounded-[28px]">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: photo.position }}
      />
    </div>
  );

  if (!morph) return image;
  return (
    <ViewTransition name={`seccion-${morph}`} share="morph" default="none">
      {image}
    </ViewTransition>
  );
}
