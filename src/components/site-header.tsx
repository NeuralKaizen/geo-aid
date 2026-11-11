"use client";

import { useCallback, useEffect, useState } from "react";
import { NavLink } from "@/components/transitions/nav-link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { Heart, Menu, Phone, Search, UserRound, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { SearchDialog } from "@/components/search-dialog";
import { dataNote, emergencyLine, navLinks, type NavSlug } from "@/content/site";
import { easeCortina, easeSalida } from "@/lib/motion";

type HeaderProps = {
  /** overlay: transparente sobre el hero, con barra flotante al hacer scroll. solid: barra flotante fija. */
  variant: "overlay" | "solid";
  active?: NavSlug;
};

type NavActions = { onSearch: () => void; onMenu: () => void };

const SCROLL_THRESHOLD = 160;

export function SiteHeader({ variant, active }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > SCROLL_THRESHOLD));

  // Con el menú o el buscador abiertos la página no debe moverse por detrás
  useEffect(() => {
    if (menuOpen || searchOpen) lenis?.stop();
    else lenis?.start();
  }, [lenis, menuOpen, searchOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const actions: NavActions = {
    onSearch: () => setSearchOpen(true),
    onMenu: () => setMenuOpen(true),
  };

  return (
    <>
      {variant === "overlay" && <OverlayNav {...actions} />}
      <FloatingNav visible={variant === "solid" || scrolled} active={active} {...actions} />
      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}

function OverlayNav({ onSearch, onMenu }: NavActions) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 text-white">
      <div className="hidden border-b border-white/15 md:block">
        <div className="mx-auto flex h-10 max-w-[1320px] items-center justify-between gap-6 px-5 text-[13px] text-white/75 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <a href={`tel:${emergencyLine.number}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="size-3.5" aria-hidden />
              {emergencyLine.label}: <strong className="font-semibold text-white">{emergencyLine.number}</strong>
            </a>
            <NavLink href="/necesito-ayuda" className="transition-colors hover:text-white">
              ¿Tu comunidad necesita ayuda? Regístrala
            </NavLink>
          </div>
          <p className="truncate">{dataNote}</p>
        </div>
      </div>

      <div className="mx-auto flex h-[4.5rem] max-w-[1320px] items-center gap-8 px-5 sm:px-8 md:h-20 lg:px-12">
        <Logo />
        <nav aria-label="Principal" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.slug}>
                <NavLink
                  href={link.href}
                 
                  className="group relative block px-3 py-2 text-[15px] font-medium text-white/85 transition-colors hover:text-white"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 bg-maiz-400 transition-transform duration-500 ease-salida group-hover:scale-x-100"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <HeaderActions tone="light" onSearch={onSearch} onMenu={onMenu} />
      </div>
    </div>
  );
}

function FloatingNav({ visible, active, onSearch, onMenu }: NavActions & { visible: boolean; active?: NavSlug }) {
  const [hovered, setHovered] = useState<NavSlug | null>(null);
  const highlighted = hovered ?? active;
  const { scrollYProgress } = useScroll();

  return (
    <motion.header
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: "-140%", opacity: 0 }}
      transition={{ duration: 0.6, ease: easeSalida }}
      inert={!visible}
      className="fixed inset-x-3 top-3 z-40"
    >
      <div className="relative mx-auto flex h-16 max-w-[1240px] items-center gap-6 overflow-hidden rounded-[20px] border border-linea/70 bg-white/85 pl-5 pr-2.5 shadow-[0_18px_44px_-26px_rgba(6,39,36,0.55)] backdrop-blur-xl backdrop-saturate-150">
        {/* Cuánto de la página llevas */}
        <motion.span
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-maiz-400"
        />
        <Logo tone="dark" />
        <nav aria-label="Principal" className="hidden flex-1 justify-center lg:flex" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center">
            {navLinks.map((link) => {
              const isActive = link.slug === active;
              return (
                <li key={link.slug}>
                  <NavLink
                    href={link.href}
                   
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={() => setHovered(link.slug)}
                    onFocus={() => setHovered(link.slug)}
                    onBlur={() => setHovered(null)}
                    className={`relative isolate block rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors duration-300 ${
                      isActive ? "text-bosque-800" : "text-tinta/70 hover:text-tinta"
                    }`}
                  >
                    {highlighted === link.slug && (
                      <motion.span
                        layoutId="nav-highlight"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-bosque-50"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <HeaderActions tone="dark" onSearch={onSearch} onMenu={onMenu} />
      </div>
    </motion.header>
  );
}

function HeaderActions({ tone, onSearch, onMenu }: NavActions & { tone: "light" | "dark" }) {
  const iconButton =
    tone === "light"
      ? "text-white/90 hover:bg-white/12 hover:text-white"
      : "text-tinta/75 hover:bg-bosque-50 hover:text-bosque-800";
  const base = `grid size-11 place-items-center rounded-full transition-colors duration-300 ${iconButton}`;

  return (
    <div className="ml-auto flex items-center gap-1 lg:ml-0">
      <button type="button" onClick={onSearch} aria-label="Buscar (Ctrl K)" className={base}>
        <Search className="size-[19px]" aria-hidden />
      </button>
      <NavLink href="/portal" aria-label="Mi portal" className={base}>
        <UserRound className="size-[19px]" aria-hidden />
      </NavLink>
      <DonateLink tone={tone} className="ml-2 hidden sm:inline-flex" />
      <button type="button" onClick={onMenu} aria-label="Abrir menú" className={`${base} lg:hidden`}>
        <Menu className="size-5" aria-hidden />
      </button>
    </div>
  );
}

export function DonateLink({ tone, className = "" }: { tone: "light" | "dark"; className?: string }) {
  const colors =
    tone === "light"
      ? "bg-white text-bosque-800 hover:bg-bosque-50"
      : "bg-bosque-800 text-white hover:bg-bosque-700";
  return (
    <NavLink
      href="/donar"
     
      className={`group h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${colors} ${className}`}
    >
      <Heart className="size-4 transition-transform duration-500 ease-salida group-hover:scale-125 group-hover:fill-current" aria-hidden />
      Donar
    </NavLink>
  );
}

const menuList: Variants = {
  open: { transition: { staggerChildren: 0.055, delayChildren: 0.22 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const menuItem: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSalida } },
  closed: { opacity: 0, y: 28, transition: { duration: 0.25 } },
};

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active?: NavSlug }) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          initial={{ clipPath: "circle(0% at calc(100% - 44px) 46px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 44px) 46px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 44px) 46px)" }}
          transition={{ duration: 0.75, ease: easeCortina }}
          data-lenis-prevent
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bosque-900 px-6 pb-8 pt-4 text-white lg:hidden"
        >
          <div className="flex h-14 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Cerrar menú"
              className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <motion.ul variants={menuList} initial="closed" animate="open" exit="closed" className="mt-10 flex flex-col">
            {navLinks.map((link) => (
              <motion.li key={link.slug} variants={menuItem} className="border-b border-white/10">
                <NavLink
                  href={link.href}
                  onClick={onClose}
                  aria-current={link.slug === active ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-display text-[2rem] font-medium tracking-[-0.03em] aria-[current=page]:text-maiz-400"
                >
                  {link.label}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6, ease: easeSalida } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="mt-auto flex flex-col gap-4 pt-10"
          >
            <NavLink
              href="/donar"
              onClick={onClose}
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-white text-lg font-semibold text-bosque-800"
            >
              <Heart className="size-5" aria-hidden />
              Donar
            </NavLink>
            <a href={`tel:${emergencyLine.number}`} className="flex items-center justify-center gap-2 text-white/75">
              <Phone className="size-4" aria-hidden />
              {emergencyLine.label}: <strong className="text-white">{emergencyLine.number}</strong>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
