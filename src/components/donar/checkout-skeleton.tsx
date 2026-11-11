/**
 * Lo que se ve mientras el navegador lee la URL (el destino y el monto pueden venir en ella). Tiene la misma forma del
 * formulario y del recibo para que nada salte cuando aparecen.
 */
export function CheckoutSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto mt-10 grid max-w-[1240px] items-start gap-10 px-5 pb-10 sm:px-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-12 lg:px-10 lg:pb-0 xl:gap-16"
    >
      <div className="overflow-hidden rounded-[28px] bg-white ring-1 ring-linea">
        <div className="border-b border-linea px-5 py-5 sm:px-8 lg:px-10">
          <div className="h-1 rounded-full bg-papel" />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-7 w-24 max-w-full animate-pulse rounded-full bg-papel" />
            ))}
          </div>
        </div>
        <div className="space-y-4 px-5 py-9 sm:px-8 lg:px-10">
          <div className="h-3 w-20 animate-pulse rounded-full bg-papel" />
          <div className="h-8 w-3/4 animate-pulse rounded-xl bg-papel" />
          <div className="h-20 animate-pulse rounded-2xl bg-papel" />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="h-20 animate-pulse rounded-2xl bg-papel" />
            <div className="h-20 animate-pulse rounded-2xl bg-papel" />
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="h-3.5 rounded-full bg-bosque-900" />
        <div className="mx-2.5 -mt-[7px] h-[30rem] animate-pulse bg-white/70" />
      </div>
    </div>
  );
}
