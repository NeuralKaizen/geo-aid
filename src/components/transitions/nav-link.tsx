"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurtain } from "@/components/transitions/curtain";

type NavLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Enlace entre secciones: cubre la pantalla con el telón y navega. Si el destino es la misma página (un ancla),
 * deja que Next.js lo maneje sin telón. Con Ctrl/Cmd o clic medio el navegador abre otra pestaña como siempre,
 * porque onNavigate solo corre en navegaciones dentro de la app.
 */
export function NavLink({ href, onNavigate, ...props }: NavLinkProps) {
  const navigate = useCurtain();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      {...props}
      onNavigate={(event) => {
        onNavigate?.(event);
        const path = href.split(/[?#]/)[0] || "/";
        if (path === pathname) return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
