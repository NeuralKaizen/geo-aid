"use client";

import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, Clock, House, Landmark, MapPin, Users, type LucideIcon } from "lucide-react";
import type { Action, HeroPanel as Panel, NavSlug, PointStatus } from "@/content/site";
import { easeEntrada, easeSalida } from "@/lib/motion";

/*
 * El vidrio se queda quieto y solo cambia lo de adentro: lo viejo sale rápido, de una vez, y lo nuevo entra por partes
 * mientras el titular todavía se está armando. Cada tema muestra su dato con una pieza distinta (línea de tiempo,
 * barra, cupos, directorio, semana), pero todas comparten la etiqueta de arriba y el enlace de abajo.
 */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
  exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easeSalida } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.22, ease: easeEntrada } },
};

/* Barras y cupos crecen desde su base cuando ya se ve la pieza que los contiene */
const grow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02, delayChildren: 0.25 } },
};

const growUp: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.6, ease: easeSalida } },
};

const fill: Variants = {
  hidden: { scaleX: 0 },
  show: (share: number) => ({ scaleX: share, transition: { duration: 1.3, delay: 0.35, ease: easeSalida } }),
};

const draw: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1, delay: 0.2, ease: easeSalida } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const pointIcons = { casa: House, comunal: Users, oficial: Landmark } satisfies Record<string, LucideIcon>;
const pointTypes = { casa: "Casa de un vecino", comunal: "Salón comunal", oficial: "Punto oficial" };

const statuses: Record<PointStatus, { label: string; tone: string; dot: string }> = {
  abierto: { label: "Abierto", tone: "text-brote-300", dot: "bg-brote-300" },
  "casi-lleno": { label: "Casi lleno", tone: "text-maiz-400", dot: "bg-maiz-400" },
  lleno: { label: "Lleno", tone: "text-white/50", dot: "bg-white/40" },
};

const numero = new Intl.NumberFormat("es-CO");

export function HeroPanel({
  slug,
  icon: Icon,
  panel,
  onHoverChange,
}: {
  slug: NavSlug;
  icon: LucideIcon;
  panel: Panel;
  onHoverChange: (hovering: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1, ease: easeSalida }}
      onHoverStart={() => onHoverChange(true)}
      onHoverEnd={() => onHoverChange(false)}
      className="relative"
    >
      <aside
        aria-label={panel.label}
        className="flex h-[23rem] flex-col overflow-hidden rounded-[28px] bg-bosque-950/45 p-6 text-white ring-1 ring-white/15 backdrop-blur-[18px] backdrop-saturate-[1.2]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={slug} variants={group} initial="hidden" animate="show" exit="exit" className="flex flex-1 flex-col">
            <motion.p
              variants={item}
              className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60"
            >
              <span className="flex items-center gap-2">
                <Icon className="size-3.5 text-maiz-400" aria-hidden />
                {panel.label}
              </span>
              <span className="font-medium normal-case tracking-normal">{panel.context}</span>
            </motion.p>

            <div className="mt-5">
              <PanelBody panel={panel} />
            </div>

            <motion.div variants={item} className="mt-auto flex items-center justify-between gap-4 border-t border-white/12 pt-4">
              <PanelLink action={panel.link} />
              <PanelAside panel={panel} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </aside>

      {/* Origen de los datos, fuera del vidrio y sin empujar el diseño */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="absolute inset-x-6 top-full mt-3 text-[11.5px] text-white/65 [text-shadow:0_1px_8px_rgba(6,39,36,0.9)]"
        >
          {panel.caption}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

function PanelBody({ panel }: { panel: Panel }) {
  switch (panel.kind) {
    case "noticias":
      return (
        <ol className="relative">
          <motion.span
            aria-hidden
            variants={draw}
            className="absolute bottom-6 left-[5px] top-2 w-px origin-top bg-gradient-to-b from-maiz-400/70 via-white/25 to-white/10"
          />
          {panel.items.map((news, i) => (
            <motion.li key={news.title} variants={item} className="relative grid grid-cols-[11px_minmax(0,1fr)] gap-x-3.5 pb-4 last:pb-0">
              <span aria-hidden className="flex justify-center pt-[5px]">
                {i === 0 ? (
                  <span className="size-[11px] rounded-full bg-maiz-400 ring-4 ring-maiz-400/20" />
                ) : (
                  <span className="mt-0.5 size-[7px] rounded-full bg-white/45" />
                )}
              </span>
              <div>
                <p className="text-[11.5px] text-white/55">
                  <span className="font-semibold text-white/85">{news.source}</span> · {news.date}
                </p>
                {i === 0 ? (
                  <p className="mt-1 font-display text-[18px] font-semibold leading-[1.22] tracking-[-0.015em] text-balance">
                    {news.title}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[14px] leading-snug text-white/75">{news.title}</p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      );

    case "necesidad": {
      const share = panel.delivered / panel.goal;
      return (
        <>
          <motion.h3 variants={item} className="font-display text-[24px] font-semibold leading-tight tracking-[-0.025em]">
            {panel.zone}
          </motion.h3>
          <motion.p variants={item} className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/60">
            <MapPin className="size-3.5" aria-hidden />
            {panel.place}
          </motion.p>
          <motion.p variants={item} className="mt-3 text-[14.5px] leading-snug text-white/85">
            {panel.need}
          </motion.p>
          <motion.div variants={item} className="mt-4">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={panel.goal}
              aria-valuenow={panel.delivered}
              aria-valuetext={`${panel.delivered} de ${panel.goal} ${panel.unit}`}
              className="h-1 overflow-hidden rounded-full bg-white/15"
            >
              <motion.span variants={fill} custom={share} className="block h-full origin-left rounded-full bg-maiz-400" />
            </div>
            <p className="mt-2 flex justify-between text-[12px] text-white/60">
              <span>
                {numero.format(panel.delivered)} de {numero.format(panel.goal)} {panel.unit}
              </span>
              <span className="font-semibold tabular-nums text-white/85">{Math.round(share * 100)} %</span>
            </p>
          </motion.div>
          <motion.p
            variants={item}
            className="mt-4 flex items-center gap-3 rounded-2xl bg-white/[0.07] px-3.5 py-3 ring-1 ring-inset ring-white/10"
          >
            <span className="font-display text-[17px] font-semibold tabular-nums tracking-[-0.02em] text-maiz-400">
              {panel.impact.amount}
            </span>
            <span className="text-[12.5px] leading-snug text-white/70">{panel.impact.text}</span>
          </motion.p>
        </>
      );
    }

    case "turno": {
      const free = panel.total - panel.taken;
      return (
        <>
          <motion.div variants={item} className="flex gap-4">
            <p className="flex w-[3.75rem] shrink-0 flex-col items-center rounded-2xl bg-white py-2 text-bosque-950">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-bosque-600">{panel.day.weekday}</span>
              <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.03em]">{panel.day.date}</span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-bosque-600">{panel.day.month}</span>
            </p>
            <div className="min-w-0">
              <h3 className="font-display text-[18px] font-semibold leading-[1.2] tracking-[-0.015em]">{panel.task}</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-white/65">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {panel.place}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/65">
                <Clock className="size-3.5 shrink-0" aria-hidden />
                {panel.hours}
              </p>
            </div>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-[13.5px] leading-snug text-white/75">
            {panel.detail}
          </motion.p>
          <motion.div variants={item} className="mt-5">
            <p className="flex items-baseline justify-between text-[13px]">
              <span className="font-semibold">Quedan {free} cupos</span>
              <span className="text-white/55">de {panel.total}</span>
            </p>
            {/* Un trazo por cupo: los libres en maíz, los tomados apagados */}
            <motion.div
              variants={grow}
              role="img"
              aria-label={`${panel.taken} de ${panel.total} cupos tomados`}
              className="mt-2 flex h-4 gap-[3px]"
            >
              {Array.from({ length: panel.total }, (_, i) => (
                <motion.span
                  key={i}
                  variants={growUp}
                  className={`flex-1 origin-bottom rounded-[2px] ${i < panel.taken ? "bg-white/25" : "bg-maiz-400"}`}
                />
              ))}
            </motion.div>
          </motion.div>
        </>
      );
    }

    case "puntos":
      return (
        <>
          <motion.p variants={item} className="text-[14px] leading-snug text-white/80">
            Hoy reciben donaciones <strong className="font-semibold text-white">{panel.open} puntos</strong>.{" "}
            <strong className="font-semibold text-white">{panel.neighbors}</strong> los abrieron vecinos en sus garajes, casas y
            salones comunales.
          </motion.p>
          <ul className="mt-2 divide-y divide-white/10">
            {panel.points.map((point) => {
              const PointIcon = pointIcons[point.type];
              const status = statuses[point.status];
              return (
                <motion.li key={point.name} variants={item} className="flex items-center gap-3 py-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-white/10 ring-1 ring-inset ring-white/10">
                    <PointIcon className="size-4 text-white/85" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">
                      <span className="sr-only">{pointTypes[point.type]}: </span>
                      {point.name}
                    </span>
                    <span className="block truncate text-[12px] text-white/55">{point.detail}</span>
                  </span>
                  <span className={`flex shrink-0 items-center gap-1.5 text-[11.5px] font-medium ${status.tone}`}>
                    <span aria-hidden className={`size-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </>
      );

    case "reencuentros": {
      const total = panel.week.reduce((sum, day) => sum + day.count, 0);
      const peak = Math.max(...panel.week.map((day) => day.count));
      const last = panel.week.length - 1;
      return (
        <>
          <motion.p variants={item} className="flex items-end gap-3">
            <span className="font-display text-[60px] font-semibold leading-[0.82] tracking-[-0.05em] tabular-nums">{total}</span>
            <span className="max-w-[10rem] pb-0.5 text-[14.5px] leading-snug text-white/80">{panel.text}</span>
          </motion.p>
          <motion.ul variants={grow} aria-label="Reencuentros por día" className="mt-5 flex h-[5.25rem] gap-2">
            {panel.week.map((day, i) => (
              <li key={day.day} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="flex w-full flex-1 items-end justify-center">
                  <motion.span
                    variants={growUp}
                    style={{ height: `${(day.count / peak) * 100}%` }}
                    className={`w-3.5 origin-bottom rounded-full ${i === last ? "bg-maiz-400" : "bg-white/30"}`}
                  />
                </span>
                <span className={`text-[10.5px] ${i === last ? "font-semibold text-white" : "text-white/50"}`}>
                  {day.day}
                  <span className="sr-only">: {day.count}</span>
                </span>
              </li>
            ))}
          </motion.ul>
          <motion.div variants={item} className="mt-4 grid grid-cols-2 gap-3">
            {panel.stats.map((stat) => (
              <p key={stat.label}>
                <span className="block font-display text-[17px] font-semibold tabular-nums tracking-[-0.02em]">{stat.value}</span>
                <span className="text-[11.5px] text-white/55">{stat.label}</span>
              </p>
            ))}
          </motion.div>
        </>
      );
    }
  }
}

function PanelAside({ panel }: { panel: Panel }) {
  switch (panel.kind) {
    case "necesidad":
    case "turno":
      return <span className="text-[12px] text-white/55">{panel.more}</span>;
    case "puntos":
      return (
        <Link
          href={panel.register.href}
          transitionTypes={["nav-forward"]}
          className="text-[12px] text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-maiz-400"
        >
          {panel.register.label}
        </Link>
      );
    default:
      return null;
  }
}

function PanelLink({ action }: { action: Action }) {
  return (
    <Link href={action.href} transitionTypes={["nav-forward"]} className="group inline-flex items-center gap-2 text-[14px] font-semibold">
      <span className="relative">
        {action.label}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-maiz-400 transition-transform duration-500 ease-salida group-hover:scale-x-100"
        />
      </span>
      <ArrowRight className="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
