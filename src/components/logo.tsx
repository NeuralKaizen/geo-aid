import Link from "next/link";

/** Techo de una casa sobre una onda sísmica que se aplana: la ayuda que llega después del sismo. */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "light" ? "text-white" : "text-bosque-800";
  return (
    <Link
      href="/"
      transitionTypes={["nav-back"]}
      aria-label="GeoAid, ir al inicio"
      className={`group flex items-center gap-2 ${color}`}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-8 transition-transform duration-500 ease-salida group-hover:-rotate-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 14.5 16 6l10 8.5" />
        <path d="M3.5 22h5l2.4-5 3.2 9 3.1-7 2.1 3h9.2" className="text-maiz-400" stroke="currentColor" />
      </svg>
      <span className="font-display text-[1.45rem] font-semibold tracking-[-0.03em]">GeoAid</span>
    </Link>
  );
}
