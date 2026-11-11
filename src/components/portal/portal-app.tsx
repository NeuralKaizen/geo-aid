"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CasesTab } from "@/components/portal/cases-tab";
import { ClearActivity } from "@/components/portal/clear-activity";
import { DonationsTab } from "@/components/portal/donations-tab";
import { buildPortal, type PortalData } from "@/components/portal/portal-data";
import { ShiftsTab } from "@/components/portal/shifts-tab";
import { SummaryTab } from "@/components/portal/summary-tab";
import { exampleUser, portalTabs, type PortalTabId } from "@/content/portal";
import { useActivity } from "@/lib/activity";
import { useTodayKey } from "@/lib/dates";
import { easeSalida } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

const isTab = (value: string | null): value is PortalTabId => portalTabs.some((tab) => tab.id === value);

/**
 * El panel de Mi portal: riel de pestañas a la izquierda en escritorio y pestañas arriba en móvil. La pestaña
 * inicial puede venir en la URL (?pestana=turnos, desde "Ver en Mi portal") y al cambiarla se actualiza sin navegar.
 */
export function PortalApp() {
  const params = useSearchParams();
  const initial = params.get("pestana");
  const [tab, setTab] = useState<PortalTabId>(isTab(initial) ? initial : "resumen");
  const activity = useActivity();
  const todayKey = useTodayKey();
  const data = useMemo(() => (activity && todayKey ? buildPortal(activity, todayKey) : null), [activity, todayKey]);

  if (!data || !todayKey) return <PortalSkeleton />;

  function choose(next: PortalTabId) {
    setTab(next);
    window.history.replaceState(null, "", next === "resumen" ? "/portal" : `/portal?pestana=${next}`);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-8">
      <Rail tab={tab} onChange={choose} data={data} />

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`pestana-${tab}`} className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.5, ease: easeSalida }}
          >
            {tab === "resumen" && <SummaryTab data={data} />}
            {tab === "donaciones" && <DonationsTab data={data} />}
            {tab === "turnos" && <ShiftsTab data={data} todayKey={todayKey} />}
            {tab === "necesidades" && <CasesTab data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* En móvil, el borrado va al final, después del contenido */}
      <div className="rounded-[24px] bg-white p-4 ring-1 ring-linea lg:hidden">
        <ClearActivity ids={data.sessionIds} tone="light" />
      </div>
    </div>
  );
}

function Rail({ tab, onChange, data }: { tab: PortalTabId; onChange: (tab: PortalTabId) => void; data: PortalData }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // En móvil las pestañas se deslizan de lado: la elegida (también si vino en la URL) queda a la vista
  useEffect(() => {
    const list = listRef.current;
    const active = refs.current[portalTabs.findIndex((item) => item.id === tab)];
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: active.offsetLeft - list.offsetLeft - 20, behavior: "smooth" });
  }, [tab]);
  const counts: Record<PortalTabId, number | undefined> = {
    resumen: undefined,
    donaciones: data.donations.length,
    turnos: data.upcoming.length + data.past.length,
    necesidades: data.cases.length,
  };

  function onKeyDown(event: React.KeyboardEvent) {
    const index = portalTabs.findIndex((item) => item.id === tab);
    const last = portalTabs.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? (index + 1) % portalTabs.length
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? (index - 1 + portalTabs.length) % portalTabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    onChange(portalTabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <nav aria-label="Secciones de Mi portal" className="lg:sticky lg:top-28 lg:self-start lg:rounded-[28px] lg:bg-bosque-900 lg:p-3 lg:text-white">
      <div className="hidden items-center gap-3 border-b border-white/10 px-3 pb-4 pt-2 lg:flex">
        <span className="grid size-11 place-items-center rounded-[14px] bg-maiz-400 font-display text-[20px] font-semibold text-bosque-950">
          {exampleUser.initial}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{exampleUser.name}</span>
          <span className="block text-[12.5px] text-white/55">
            {exampleUser.city} · desde {exampleUser.since}
          </span>
        </span>
      </div>

      <div
        ref={listRef}
        role="tablist"
        aria-orientation={desktop ? "vertical" : "horizontal"}
        aria-label="Mi portal"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {portalTabs.map((item, i) => {
          const active = item.id === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              ref={(element) => {
                refs.current[i] = element;
              }}
              type="button"
              role="tab"
              id={`pestana-${item.id}`}
              aria-selected={active}
              aria-controls={`panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.id)}
              className={`relative isolate flex h-11 shrink-0 items-center gap-2.5 rounded-full px-4 text-[14.5px] font-semibold transition-colors duration-300 lg:h-12 lg:rounded-2xl lg:px-3.5 ${
                active
                  ? "text-white lg:text-bosque-950"
                  : "bg-white text-tinta/75 ring-1 ring-inset ring-linea hover:text-tinta lg:bg-transparent lg:text-white/70 lg:ring-0 lg:hover:bg-white/[0.06] lg:hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="portal-pestana"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-full bg-bosque-800 lg:rounded-2xl lg:bg-white"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Icon className="size-[18px] shrink-0" aria-hidden />
              <span className="whitespace-nowrap lg:flex-1 lg:text-left">{item.label}</span>
              {counts[item.id] !== undefined && (
                <span
                  className={`text-[12.5px] tabular-nums ${active ? "text-white/70 lg:text-niebla" : "text-niebla lg:text-white/45"}`}
                >
                  {counts[item.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 hidden border-t border-white/10 px-2 pb-2 pt-4 lg:block">
        <ClearActivity ids={data.sessionIds} tone="dark" />
      </div>
    </nav>
  );
}

/** Esqueleto con la forma del panel mientras se lee la actividad guardada. */
export function PortalSkeleton() {
  return (
    <div aria-hidden className="grid animate-pulse grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-8">
      <div className="flex gap-2 overflow-hidden lg:h-[23rem] lg:flex-col lg:rounded-[28px] lg:bg-bosque-900/80 lg:p-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-11 w-32 shrink-0 rounded-full bg-white lg:hidden" />
        ))}
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="col-span-2 h-36 rounded-[24px] bg-bosque-900/80 xl:col-span-1" />
          <div className="h-36 rounded-[24px] bg-white" />
          <div className="h-36 rounded-[24px] bg-white" />
          <div className="h-36 rounded-[24px] bg-white" />
        </div>
        <div className="h-24 rounded-[24px] bg-white" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-80 rounded-[28px] bg-white" />
          <div className="h-80 rounded-[28px] bg-white" />
        </div>
      </div>
    </div>
  );
}
