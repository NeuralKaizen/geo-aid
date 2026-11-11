import { ArrowUpRight, Info } from "lucide-react";
import { NavLink } from "@/components/transitions/nav-link";
import { ExampleTag } from "@/components/ui/form";
import { exampleUser, portalIntro } from "@/content/portal";

/** Saludo, la nota de que es una vista de ejemplo y los accesos rápidos a lo que más se hace. */
export function PortalHeader() {
  return (
    <header className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8 md:pt-14 lg:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4 sm:gap-6">
          <span
            aria-hidden
            className="grid size-16 shrink-0 place-items-center rounded-[22px] bg-maiz-400 font-display text-[30px] font-semibold text-bosque-950 shadow-[0_18px_40px_-20px_rgba(122,82,11,0.7)] sm:size-20 sm:rounded-[26px] sm:text-[38px]"
          >
            {exampleUser.initial}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-bosque-600">
              Mi portal
              <span className="normal-case tracking-normal">
                <ExampleTag>Usuaria de ejemplo</ExampleTag>
              </span>
            </p>
            <h1 className="mt-2 font-display text-[clamp(2.75rem,6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-tinta">
              Hola, {exampleUser.name}
            </h1>
            <p className="mt-4 flex max-w-xl gap-2 text-[15.5px] leading-relaxed text-niebla">
              <Info className="mt-1 size-4 shrink-0 text-bosque-600" aria-hidden />
              {portalIntro.note}
            </p>
          </div>
        </div>

        <nav aria-label="Accesos rápidos" className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[30rem] lg:shrink-0">
          {portalIntro.actions.map((action, i) => {
            const Icon = action.icon;
            const primary = i === 0;
            return (
              <NavLink
                key={action.href}
                href={action.href}
                className={`group flex min-h-[7.5rem] flex-col justify-between rounded-[22px] p-3.5 transition-[box-shadow,background-color,transform] duration-300 hover:-translate-y-0.5 sm:min-h-[8.5rem] sm:p-4 ${
                  primary ? "bg-bosque-900 text-white hover:bg-bosque-800" : "bg-white text-tinta ring-1 ring-linea hover:ring-bosque-200"
                }`}
              >
                <span className="flex items-start justify-between">
                  <span
                    className={`grid size-10 place-items-center rounded-2xl ${primary ? "bg-maiz-400 text-bosque-950" : "bg-bosque-50 text-bosque-700"}`}
                  >
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <ArrowUpRight
                    className={`size-4 transition-transform duration-500 ease-salida group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                      primary ? "text-white/60" : "text-niebla"
                    }`}
                    aria-hidden
                  />
                </span>
                <span className="text-[14px] font-semibold leading-tight sm:text-[15px]">{action.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
