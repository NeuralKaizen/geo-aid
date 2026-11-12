# Home como recorrido: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada hoja del home presente una parte real de GeoAid y termine en una acción, agregando tres hojas nuevas y dando acción a dos existentes.

**Architecture:** El home sigue siendo una pila de hojas en `src/app/page.tsx`. Cada hoja nueva es un componente propio en `src/components/home/` que lee de `src/content/` y enlaza con `NavLink`. Se construye una hoja por tarea y el usuario la revisa en el navegador antes de empezar la siguiente.

**Tech Stack:** Next.js 16.4 (App Router), React 19, Tailwind 4, Motion 14, lucide-react. Sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-11-12-home-recorrido-design.md`

## Global Constraints

- Antes de escribir código, leer la guía que corresponda en `node_modules/next/dist/docs/` (`AGENTS.md`).
- No se tocan `HeroCarousel` ni `HowToHelp`.
- Todo dato sale de `src/content/`; no se inventan cifras ni textos de noticias.
- Solo se animan `transform` y `opacity`, con las curvas de `src/lib/motion.ts`; las entradas ocurren una vez (`viewport={{ once: true }}`) y respetan `prefers-reduced-motion`.
- Nada de animaciones abstractas o decorativas: solo se mueve contenido real.
- Cada hoja: `relative z-10 -mt-10 rounded-t-[36px]`, y nunca el mismo fondo que su vecina. Fondos: Cómo ayudar `bg-papel` → Falta hoy `bg-white` → Seguimiento `bg-bosque-900` → Si te pasó a ti `bg-maiz-50` → Lo último `bg-white` → Para quién es `bg-papel`.
- Las hojas nuevas no fijan el scroll y caben en más o menos una pantalla de 1280×720. Bajo 1024 px, una columna.
- Enlaces entre secciones con `NavLink` (`@/components/transitions/nav-link`), no con el morph del hero.
- Textos en español, cortos y directos. Datos de ejemplo llevan `ExampleTag` (`@/components/ui/form`).
- Servidor de prueba en el puerto 3211 (el 3210 es de otro proceso del usuario; no matarlo). Rendimiento y revisión final sobre `npm run build` + `npx next start -p 3211`.
- Trabajar en la rama `home-recorrido`. Se hace commit de una hoja solo después de que el usuario la apruebe.

## Review Focus

1. Código de seguimiento mal escrito o vacío en el home ("abc", "ga 24817", ""): muestra el mismo mensaje que Donaciones o lo normaliza; nunca navega con un código inválido. → Tarea 2.
2. `/necesito-ayuda?necesidad=` con un valor que no existe (o `buscar`): el asistente abre vacío, sin error. → Tarea 3.
3. Pantalla de 1280×720 en la hoja fija de seguimiento: el campo nuevo se ve completo, sin recortarse ni tapar el título. → Tarea 2.
4. Ancho de 360 px: ninguna hoja nueva produce scroll horizontal y los botones no se parten en dos líneas feas. → Tareas 1, 3, 4, 5.
5. `prefers-reduced-motion`: barras y cifras aparecen en su valor final; nada queda invisible esperando una animación. → Tareas 1, 3, 4.

## Cómo se verifica cada tarea

El repo no tiene pruebas automáticas. Cada tarea cierra con:

```bash
npm run lint && npm run build
npx next start -p 3211
```

y la revisión en el navegador que indica la tarea. Después se le muestra la hoja al usuario (captura de escritorio y la URL local) y **se espera su aprobación**. Si pide cambios, se hacen dentro de la misma tarea.

## Archivos

- Crear: `src/components/home/urgent-needs.tsx`, `src/components/home/for-affected.tsx`, `src/components/home/latest-news.tsx`
- Crear: `src/lib/tracking-code.ts`
- Modificar: `src/app/page.tsx`, `src/components/tracking/tracking-section.tsx`, `src/components/donaciones/tracking-lookup.tsx`, `src/components/noticias/help-options.tsx`, `src/components/necesito-ayuda/help-wizard.tsx`, `src/app/necesito-ayuda/page.tsx`, `src/components/audiences.tsx`, `src/content/site.ts`

---

### Task 0: Rama

- [ ] `git switch -c home-recorrido`
- [ ] `git add docs/superpowers && git commit -m "Diseño y plan del home como recorrido"`

### Task 1: Lo que más falta hoy

**Files:**
- Create: `src/components/home/urgent-needs.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `zonesByUrgency`, `needCoverage`, `zoneCoverage`, `urgencyOf`, `urgencyStyles`, `placeOf` de `@/components/donaciones/metrics`; `UrgencyBadge` de `@/components/donaciones/urgency-badge` si sirve tal cual; `AnimatedNumber`; `button` de `@/components/ui/styles`.
- Produces: `export function UrgentNeeds()`.

- [ ] **Step 1:** Crear `UrgentNeeds` (client component). Sección `id="falta-hoy"`, `aria-labelledby`, `bg-white`. Usa `zonesByUrgency.slice(0, 3)`.
  - Izquierda: `h2` "Lo que más falta hoy" (misma escala que el `h2` de `Audiences`), una frase ("Cada comunidad cuenta qué le falta. Aquí se ve cuánto ha llegado."), `ExampleTag`, y botón secundario "Ver todas las zonas" → `/donaciones`.
  - Derecha: la primera zona como tarjeta grande y las otras dos lado a lado debajo. Cada tarjeta: nombre, `placeOf(zone)`, "N familias", etiqueta de urgencia de `urgencyOf(zoneCoverage(zone))`, `zone.needs[0].item`, barra con `needCoverage(zone.needs[0])` en el color `urgencyStyles[...].fill`, "`delivered` de `goal` `unit`" con `AnimatedNumber` en `delivered`, y botón primario "Aportar a esta zona" → `/donar?zona=${zone.slug}`.
  - Movimiento: tarjetas con la variante de entrada de `Audiences` (`y: 60, rotate: 1.5` → 0, escalonadas 0.08 s); barra `scaleX` de 0 al valor con `origin-left`, 1.2 s, `easeSalida`.
- [ ] **Step 2:** En `page.tsx`, montar `<UrgentNeeds />` como primer hijo del `<div>` del segundo `<ViewTransition>`, antes de `<TrackingSection />`.
- [ ] **Step 3:** Verificar: lint y build pasan. En el navegador, las tres zonas son las mismas tres primeras de `/donaciones`; "Aportar a esta zona" abre Donar con esa zona elegida; a 360 px no hay scroll horizontal; con movimiento reducido las barras se ven llenas.
- [ ] **Step 4:** Mostrar al usuario y esperar aprobación.
- [ ] **Step 5:** `git commit -m "Home: lo que más falta hoy"`

### Task 2: Sigue tu ayuda con campo de código

**Files:**
- Create: `src/lib/tracking-code.ts`
- Modify: `src/components/donaciones/tracking-lookup.tsx`, `src/components/tracking/tracking-section.tsx`

**Interfaces:**
- Produces: `export function normalizeTrackingCode(input: string): string | null` y `export const trackingCodeError: string` (se mueven tal cual desde `tracking-lookup.tsx`, que pasa a importarlos).

- [ ] **Step 1:** Mover `normalize` y `formatError` a `src/lib/tracking-code.ts` con los nombres de arriba; actualizar `tracking-lookup.tsx`.
- [ ] **Step 2:** En `tracking-section.tsx`, agregar bajo `<Receipt>` un componente local `TrackForm`: etiqueta "¿Ya donaste? Sigue tu código", `input` (placeholder `GA-24817`, `autoComplete="off"`) y botón "Rastrear" en una fila, sobre fondo oscuro. Al enviar: vacío → "Escribe el código de tu donación."; inválido → `trackingCodeError`; válido → navegar con el telón (`useCurtain` de `@/components/transitions/curtain`) a `/donaciones?codigo=${code}#seguimiento`. El error va en un `<p role="alert">` ligado con `aria-describedby`. Debajo, `NavLink` "Ver el ejemplo GA-24817" al mismo destino con `trackingDemo.code`.
- [ ] **Step 3:** Ajustar la columna para que todo quepa en la hoja fija a 1280×720 (reducir márgenes del comprobante antes que quitar algo). La animación de la ruta no cambia.
- [ ] **Step 4:** Verificar: lint y build. `GA-24817`, `ga24817` y `#GA 24817` llegan a Donaciones con el comprobante de ejemplo abierto; `abc` y vacío muestran su mensaje y no navegan; a 1280×720 el campo se ve completo durante todo el tramo fijo; en móvil el campo queda bajo el comprobante.
- [ ] **Step 5:** Mostrar al usuario y esperar aprobación.
- [ ] **Step 6:** `git commit -m "Home: rastrear una donación desde el seguimiento"`

### Task 3: Si te pasó a ti

**Files:**
- Create: `src/components/home/for-affected.tsx`
- Modify: `src/app/page.tsx`, `src/components/necesito-ayuda/help-wizard.tsx`, `src/app/necesito-ayuda/page.tsx`

**Interfaces:**
- Consumes: `needs`, `type NeedId` de `@/content/necesito-ayuda`; `cifras` de `@/content/desaparecidos`; `emergencyLine` de `@/content/site`.
- Produces: `export function ForAffected()`; `HelpWizard` acepta `initialNeed?: NeedId`.

- [ ] **Step 1:** Asistente: `HelpWizard` recibe `initialNeed` y arranca con `{ ...emptyDraft, needs: initialNeed ? [initialNeed] : [] }`. La página lee `?necesidad=` (según la guía de Next de esta versión para `searchParams`; si exige cliente, con `useSearchParams` dentro de `<Suspense>` como hace `TrackingFromParams`), y solo lo pasa si es un `NeedId` válido distinto de `buscar`. El primer paso del asistente no cambia. "Empezar otra solicitud" sigue reiniciando a `emptyDraft`.
- [ ] **Step 2:** Crear `ForAffected` (client component), `bg-maiz-50`, sin fotos. `h2` "Si te pasó a ti" y la frase "Cuéntanos qué te falta o a quién buscas. No necesitas estar en ningún registro."
  - Tarjeta "Necesito ayuda": "¿Qué te falta?", chips de `needs` sin `buscar` (icono + etiqueta), cada chip un `NavLink` a `/necesito-ayuda?necesidad=${id}`; botón primario "Pedir ayuda" → `/necesito-ayuda`.
  - Tarjeta "Busco a alguien": `cifras[0]` (valor grande + etiqueta) con `ExampleTag`, una línea ("Reporta a quien buscas o cuenta si viste a alguien."), botón "Buscar a alguien" → `/desaparecidos`.
  - Pie: "Si es una emergencia, llama al 123" como `tel:` con `emergencyLine.number`, y el aviso de prototipo con el mismo texto que usan Necesito ayuda/Desaparecidos (buscarlo y reutilizarlo, no redactar otro).
  - Movimiento: las dos tarjetas con `opacity 0→1, y 24→0`, sin rotación, 0.8 s `easeSalida`; chips en cadena cada 0.05 s.
- [ ] **Step 3:** En `page.tsx`, montar `<ForAffected />` después de `<TrackingSection />`.
- [ ] **Step 4:** Verificar: lint y build. Tocar "Agua" abre el asistente y, al pasar el primer paso, "Agua" está marcada; `?necesidad=xyz` y `?necesidad=buscar` abren el asistente vacío; el 123 es un enlace `tel:`; a 360 px los chips envuelven sin desbordar.
- [ ] **Step 5:** Mostrar al usuario y esperar aprobación.
- [ ] **Step 6:** `git commit -m "Home: entrada para quien necesita ayuda"`

### Task 4: Lo último

**Files:**
- Create: `src/components/home/latest-news.tsx`
- Modify: `src/components/noticias/help-options.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `emergencias`, `estados`, `temas` de `@/content/noticias`; `serif` de `@/components/noticias/fonts`.
- Produces: en `help-options.tsx`, `export function HelpLine({ ayuda }: { ayuda: Ayuda })`: una fila compacta (icono, título, flecha) enlazada con `NavLink`, resuelta con el `vista` interno y los mismos hooks de "hoy" que ya usa `HelpPanel`. `export function LatestNews()`.

- [ ] **Step 1:** Agregar `HelpLine` a `help-options.tsx` reutilizando `vista`, `tonos` y la lectura de hoy existentes, sin duplicar lógica.
- [ ] **Step 2:** Crear `LatestNews` (client component), `bg-white`. Encabezado: `h2` "Lo último" y `NavLink` "Ver todas las noticias" → `/noticias`. Noticias: `emergencias[0].noticias.slice(0, 3)` (ya vienen de la más reciente a la más vieja; confirmarlo al leer el contenido).
  - La primera, grande, con `foto` (`next/image`, `sizes` ajustado), fecha · `temas[tema]`, titular en `serif` y su `HelpLine` con `ayudas[0]`.
  - Las otras dos en lista a la derecha, separadas por una línea: fecha · tema, titular en `serif`, `HelpLine`.
  - Cada titular es un `NavLink` a `/noticias?emergencia=${emergencia.id}&noticia=${noticia.id}`.
  - Pie: "Otras emergencias" con una píldora por cada emergencia restante (`nombre` · `estados[estado]`, y `ExampleTag` si `ejemplo`) → `/noticias?emergencia=${id}`.
  - Movimiento: la foto con el desplazamiento interno al hacer scroll que usan las fotos de `HelpCard` (contenedor `overflow-hidden`, imagen a `scale 1.15` con `y` ligado a `useScroll` de la tarjeta); lista escalonada con `opacity/y`.
- [ ] **Step 3:** En `page.tsx`, montar `<LatestNews />` después de `<ForAffected />`.
- [ ] **Step 4:** Verificar: lint y build. Los tres titulares coinciden con los tres primeros del terremoto en `/noticias`; cada titular abre Noticias con esa noticia abierta; cada píldora abre su emergencia; la fila de turno no produce error de hidratación en la consola; a 360 px, una columna sin desbordes.
- [ ] **Step 5:** Mostrar al usuario y esperar aprobación.
- [ ] **Step 6:** `git commit -m "Home: lo último, con cómo ayudar en cada noticia"`

### Task 5: Para quién es, compacta y con enlaces

**Files:**
- Modify: `src/content/site.ts`, `src/components/audiences.tsx`

**Interfaces:**
- Produces: cada entrada de `audiences` gana `action: { label: string; href: string }`:
  - `gobierno`: "Ver el tablero" → `/donaciones`
  - `organizaciones`: "Publicar qué recibes" → `/centros-de-acopio`
  - `ciudadania`: "Ir a mi portal" → `/portal`
  - `comunidades`: "Contar qué falta" → `/necesito-ayuda`

- [ ] **Step 1:** Agregar `action` a `audiences` en `site.ts`.
- [ ] **Step 2:** En `audiences.tsx`, cada tarjeta es un `NavLink` completo (`group`, foco visible) con la etiqueta de acción y una flecha junto al título o al pie; al pasar el cursor la tarjeta sube 4 px y la flecha se corre (transición `duration-500 ease-salida`, solo `transform`). El botón falso "Enviar" de `NeedWidget` deja de parecer un segundo botón dentro del enlace (pasa a `aria-hidden` o a estilo de muestra).
- [ ] **Step 3:** Compactar: `pt-24 md:pt-32` → `pt-20 md:pt-24`, `pb-28` → `pb-20`, `gap-10` → `gap-8`, `mt-14` → `mt-10`; ajustar hasta que título y las cuatro tarjetas quepan en una pantalla de 1280×720 sin apretar.
- [ ] **Step 4:** Verificar: lint y build. Las cuatro tarjetas navegan a su destino con teclado y con clic; Cmd/Ctrl+clic abre otra pestaña; no hay elementos interactivos anidados dentro del enlace.
- [ ] **Step 5:** Mostrar al usuario y esperar aprobación.
- [ ] **Step 6:** `git commit -m "Home: para quién es, con enlace a cada página"`

### Task 6: Recorrido completo

- [ ] **Step 1:** Sobre `npm run build` + `npx next start -p 3211`, recorrer el home entero en escritorio (1280×720 y pantalla grande) y a 360 px: vecinas con fondos distintos, bordes redondeados montando bien, footer revelándose como antes, scroll fluido (medir cuadros con `requestAnimationFrame` en el tramo de las hojas nuevas; sin caídas sostenidas bajo 50 fps).
- [ ] **Step 2:** Revisar los cinco puntos de Review Focus de una pasada.
- [ ] **Step 3:** Mostrar el recorrido completo al usuario. El despliegue a Vercel y la fusión a `main` se hacen solo si el usuario lo pide.
