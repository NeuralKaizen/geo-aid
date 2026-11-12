"use client";

import {
  ArrowRight,
  DoorOpen,
  HandCoins,
  HandHelping,
  House,
  LayoutGrid,
  MapPin,
  Phone,
  Route,
  Search,
  type LucideIcon,
} from "lucide-react";
import { needIcons } from "@/components/donaciones/need-icons";
import { serif } from "@/components/noticias/fonts";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { cities, type ItemId } from "@/content/centros";
import { zones, type NeedType } from "@/content/donaciones";
import type { Ayuda, IconoAyuda } from "@/content/noticias";
import { liveTaken, shiftsOn, takenByMe, useCurrentHour, weekFrom } from "@/components/voluntariado/schedule";
import { cityLabel, hora, taskById } from "@/content/voluntariado";
import { useActivity } from "@/lib/activity";
import { useTodayKey } from "@/lib/dates";
import { numero } from "@/lib/format";

/*
 * Las formas de ayudar que acompañan a cada noticia. Cada una lleva a la página donde se ayuda con lo elegido: la zona
 * en Donar, el turno en Voluntariado o el punto en Centros de acopio. Los datos se leen de esas páginas, así las cifras
 * coinciden; si una noticia nombra una zona, un turno o un punto que no existe, la página no se construye.
 */

type Clase = "dona" | "tiempo" | "lleva" | "otro";

type Vista = {
  clase: Clase;
  Icon: LucideIcon;
  titulo: string;
  detalle: string;
  accion: string;
  href: string;
  /** qué parte de la meta ya está cubierta: mercados entregados, cupos tomados */
  avance?: { hecho: number; meta: number };
};

const tonos: Record<Clase, string> = {
  dona: "bg-maiz-100 text-maiz-800",
  tiempo: "bg-brote-300/35 text-bosque-700",
  lleva: "bg-bosque-100 text-bosque-700",
  otro: "bg-white text-bosque-700 ring-1 ring-inset ring-maiz-100",
};

const iconos: Record<IconoAyuda, LucideIcon> = {
  registrar: House,
  seguir: Route,
  tablero: LayoutGrid,
  buscar: Search,
  abrir: DoorOpen,
  voluntariado: HandHelping,
  llamar: Phone,
};

/** Qué se dona, en una palabra, para que el título quepa en una línea: "Mercados para Vereda El Carmen" */
const queSeDona: Record<NeedType, string> = {
  agua: "Agua",
  alimentos: "Mercados",
  aseo: "Kits de aseo",
  refugio: "Refugio",
  salud: "Botiquines",
};

/** Lo que recibe un punto, en palabras cortas para caber en una línea */
const recibe: Record<ItemId, string> = {
  agua: "agua",
  alimentos: "alimentos",
  panales: "pañales",
  aseo: "aseo",
  "ropa-nueva": "ropa nueva",
  linternas: "linternas",
  cobijas: "cobijas",
};

function lista(palabras: string[]) {
  return palabras.length < 2 ? palabras.join("") : `${palabras.slice(0, -1).join(", ")} y ${palabras.at(-1)}`;
}

function falta(que: string): never {
  throw new Error(`Una noticia nombra ${que}, que no existe en el contenido`);
}

/** Lo que hace falta saber de hoy para elegir turno: la fecha, la hora y los turnos que la persona ya tomó. */
type Hoy = { key: string | null; hour: number | null; mine: ReturnType<typeof takenByMe> };

/**
 * El próximo turno de la tarea (y la ciudad) que todavía se puede tomar: en los 7 días de la agenda, con cupo y sin
 * haber empezado. Así la noticia nunca ofrece un turno lleno o que ya pasó.
 */
function proximoTurno(ayuda: Extract<Ayuda, { tipo: "turno" }>, hoy: Hoy) {
  if (!hoy.key) return null;
  for (const day of weekFrom(hoy.key)) {
    for (const shift of shiftsOn(day)) {
      if (shift.task !== ayuda.tarea || (ayuda.ciudad && shift.city !== ayuda.ciudad)) continue;
      const mine = hoy.mine.has(shift.shiftId);
      const started = day.offset === 0 && (hoy.hour === null || hoy.hour >= shift.start);
      if (started || mine || liveTaken(shift, mine) >= shift.total) continue;
      return { shift, day };
    }
  }
  return null;
}

function vista(ayuda: Ayuda, hoy: Hoy): Vista {
  switch (ayuda.tipo) {
    case "zona": {
      const zone = zones.find((candidate) => candidate.slug === ayuda.zona) ?? falta(`la zona "${ayuda.zona}"`);
      const need = zone.needs[0];
      return {
        clase: "dona",
        Icon: needIcons[need.type],
        titulo: `${queSeDona[need.type]} para ${zone.name}`,
        detalle: `${zone.municipality}, ${zone.department} · faltan ${numero(need.goal - need.delivered)} de ${numero(need.goal)}`,
        accion: "Donar",
        href: `/donar?zona=${zone.slug}`,
        avance: { hecho: need.delivered, meta: need.goal },
      };
    }
    case "turno": {
      const task = taskById[ayuda.tarea];
      const proximo = proximoTurno(ayuda, hoy);
      // Sin la fecha de hoy (en el servidor) o sin turnos libres esta semana, lleva a la agenda
      if (!proximo) {
        return {
          clase: "tiempo",
          Icon: task.icon,
          titulo: task.label,
          detalle: `${ayuda.ciudad ? `${cityLabel[ayuda.ciudad]} · ` : ""}Mira los turnos de esta semana`,
          accion: "Ver turnos",
          href: "/voluntariado#agenda",
        };
      }
      const { shift, day } = proximo;
      const libres = shift.total - shift.taken;
      const cuando = day.offset === 0 ? "hoy" : day.offset === 1 ? "mañana" : day.long.split(" ")[0].toLowerCase();
      return {
        clase: "tiempo",
        Icon: task.icon,
        titulo: task.label,
        detalle: `${cityLabel[shift.city]}, ${cuando} ${hora(shift.start)} · ${libres === 1 ? "queda 1 cupo" : `quedan ${libres} cupos`}`,
        accion: "Tomar turno",
        href: `/voluntariado?turno=${shift.id}#agenda`,
        avance: { hecho: shift.taken, meta: shift.total },
      };
    }
    case "punto": {
      const city = cities.find((candidate) => candidate.id === ayuda.ciudad) ?? falta(`la ciudad "${ayuda.ciudad}"`);
      const point = city.points.find((candidate) => candidate.id === ayuda.punto) ?? falta(`el punto "${ayuda.punto}"`);
      return {
        clase: "lleva",
        Icon: MapPin,
        titulo: point.name,
        detalle: `${point.barrio}, ${city.name} · ${lista(point.accepts.map((item) => recibe[item]))}`,
        accion: "Ver punto",
        href: `/centros-de-acopio?ciudad=${city.id}&punto=${point.id}#resultados`,
      };
    }
    case "donar":
      return {
        clase: "dona",
        Icon: ayuda.destino ? needIcons[ayuda.destino] : HandCoins,
        titulo: ayuda.titulo,
        detalle: ayuda.detalle,
        accion: "Donar",
        href: ayuda.destino ? `/donar?destino=${ayuda.destino}` : "/donar",
      };
    case "enlace":
      return {
        clase: ayuda.icono === "voluntariado" ? "tiempo" : "otro",
        Icon: iconos[ayuda.icono],
        titulo: ayuda.titulo,
        detalle: ayuda.detalle,
        accion: ayuda.accion,
        href: ayuda.href,
      };
  }
}

function Fila({ item, onNavigate }: { item: Vista; onNavigate?: () => void }) {
  const { Icon } = item;
  const className =
    "group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3.5 px-4 py-3 transition-colors duration-300 hover:bg-white focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-maiz-400 sm:px-5";
  const contenido = (
    <>
      <span aria-hidden className={`grid size-9 place-items-center rounded-xl ${tonos[item.clase]}`}>
        <Icon className="size-[17px]" />
      </span>
      <span className="min-w-0">
        <span className={`${serif} block text-[16.5px] font-medium leading-[1.2] text-tinta`}>{item.titulo}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-niebla text-pretty">{item.detalle}</span>
        {item.avance && (
          <span aria-hidden className="mt-2 block h-1 overflow-hidden rounded-full bg-maiz-100">
            <span
              className="block h-full rounded-full bg-bosque-700"
              style={{ width: `${Math.round((item.avance.hecho / item.avance.meta) * 100)}%` }}
            />
          </span>
        )}
      </span>
      <span className="inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-bosque-800">
        {item.accion}
        <ArrowRight className="size-3.5 transition-transform duration-500 ease-salida group-hover:translate-x-0.5" aria-hidden />
      </span>
    </>
  );

  // El 123 no es una página: se llama directo, sin telón
  if (!item.href.startsWith("/")) {
    return (
      <a href={item.href} className={className}>
        {contenido}
      </a>
    );
  }
  return (
    <NavLink href={item.href} onClick={onNavigate} className={className}>
      {contenido}
    </NavLink>
  );
}

/** El bloque "Cómo puedes ayudar": una fila por forma de ayudar, cada una con su acción. */
export function HelpPanel({
  ayudas,
  onNavigate,
  className = "",
}: {
  ayudas: Ayuda[];
  /** se llama antes de navegar (el panel de la noticia completa se cierra) */
  onNavigate?: () => void;
  className?: string;
}) {
  const activity = useActivity();
  const hoy: Hoy = { key: useTodayKey(), hour: useCurrentHour(), mine: takenByMe(activity) };
  const vistas = ayudas.map((ayuda) => vista(ayuda, hoy));

  return (
    <section aria-label="Cómo puedes ayudar" className={`overflow-hidden rounded-[22px] bg-maiz-50 ring-1 ring-maiz-100 ${className}`}>
      <div className="flex items-center justify-between gap-3 px-4 pb-2.5 pt-3.5 sm:px-5">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-maiz-800">Cómo puedes ayudar</h4>
        <ExampleTag />
      </div>
      <ul className="divide-y divide-maiz-100 border-t border-maiz-100">
        {vistas.map((item) => (
          <li key={item.href + item.titulo}>
            <Fila item={item} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </section>
  );
}
