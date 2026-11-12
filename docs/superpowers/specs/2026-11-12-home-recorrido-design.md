# Home como recorrido por la plataforma

Fecha: 12 de noviembre de 2026

## Para qué

El home debe servir para que quien llega conozca la plataforma, y cada apartado debe invitarlo a hacer algo (un botón o
una acción directa). Hoy solo "Cómo ayudar" cumple: "Sigue tu ayuda hasta que llega" y "Un mismo tablero, cuatro formas
de usarlo" no tienen ningún enlace. Además el home no muestra tres partes centrales de GeoAid: qué le falta a cada
zona, la entrada para quien necesita ayuda y las noticias.

El usuario está contento con cómo se ve y se mueve el home actual (intuitivo, lindo, buenas animaciones) y pidió cuidar
la estética y las animaciones propias de la plataforma.

## Metas

- Cada hoja del home presenta una parte real de la plataforma y termina en al menos una acción.
- Las hojas nuevas se sienten parte del mismo sitio: mismas hojas apiladas con borde redondeado, misma tipografía,
  mismas curvas de animación (`src/lib/motion.ts`).
- El home no se vuelve pesado de recorrer: las hojas nuevas caben, cada una, en más o menos una pantalla de escritorio y
  no fijan el scroll.

## Lo que no se hace

- No se tocan el hero ni "Cómo ayudar".
- No se inventan datos nuevos: todo sale de `src/content/` (Donaciones, Necesito ayuda, Desaparecidos, Noticias).
- No se rediseña el sitio alrededor de varias crisis; solo se enlaza a las que ya existen en Noticias.

## Lo que lo haría fracasar

- Animaciones abstractas o decorativas (partículas, puntos, gráficos generativos). Solo se anima contenido real: tarjetas,
  barras, fotos, textos.
- Que una hoja nueva se vea "hecha rápido" o como plantilla repetida de otra. Cada una tiene su propia composición.
- Que la entrada para quien necesita ayuda se sienta como publicidad o use fotos de víctimas. Va serena, como
  Desaparecidos.
- Pedir plata de forma seca. Donde se invita a donar, se dice a qué zona va y qué le falta.
- Espacio muerto debajo del contenido, o textos largos que desbalanceen las columnas.

## Caminos considerados

- **A. Solo poner acción en lo que ya hay.** Un campo de código en "Sigue tu ayuda" y enlaces en "Para quién es". Rápido,
  pero el home sigue sin mostrar necesidades, noticias ni a quien necesita ayuda.
- **B. El home como recorrido (elegido por el usuario).** Se mantienen las hojas apiladas y se agregan tres hojas cortas
  con contenido real y su acción. Es el único que logra las dos cosas pedidas: conocer la plataforma y actuar en cada
  parte.
- **C. Dos puertas después del hero ("Quiero ayudar" / "Necesito ayuda").** Lo más claro para una emergencia, pero obliga
  a rearmar un recorrido que ya gusta. Descartado.

## El recorrido

```
1. Hero                    (igual)
2. Cómo ayudar             (igual)
3. Lo que más falta hoy    NUEVA
4. Sigue tu ayuda          + campo de código
5. Si te pasó a ti         NUEVA
6. Lo último               NUEVA
7. Para quién es           más compacta, cada tarjeta enlaza
8. Footer                  (igual)
```

Las hojas 3 a 7 van dentro del segundo `<ViewTransition>` de `src/app/page.tsx`, igual que hoy Tracking y Audiences.
Cada hoja monta su borde redondeado sobre la anterior (`relative z-10 -mt-10 rounded-t-[36px]`). Dos hojas vecinas nunca
comparten color de fondo. Propuesta de fondos (decisión mía, el constructor puede ajustar el tono exacto):
papel → blanco → bosque-900 → maiz-50 → blanco → papel.

Los enlaces de las hojas nuevas usan `NavLink` (telón), no el morph del hero.

### 3. Lo que más falta hoy

Muestra el tablero de Donaciones en pequeño.

```
Lo que más falta hoy                    ┌ Vereda X · Morales, Cauca ──── Crítica ┐
Las comunidades cuentan qué les         │ 86 familias                            │
falta y aquí se ve cuánto ha llegado.   │ Kits de agua y aseo ▓▓▓▓▓░░ 220 de 340 │
                                        │ [Aportar a esta zona]                  │
[Ver todas las zonas →]                 └────────────────────────────────────────┘
                                        ┌ (segunda zona) ┐ ┌ (tercera zona) ┐
```

- Datos: las tres primeras de `zonesByUrgency` (`components/donaciones/metrics.ts`). De cada una: nombre, lugar,
  familias, etiqueta de urgencia y su necesidad principal (`needs[0]`) con barra y "entregado de meta". Se muestra la
  principal y no la menos cubierta porque es la misma con la que `/donar?zona=` explica qué alcanza a cubrir la donación:
  así lo que se lee en la tarjeta coincide con lo que se ve al dar clic (decisión mía).
- Acciones: "Aportar a esta zona" → `/donar?zona=<slug>`; "Ver todas las zonas" → `/donaciones`.
- Composición: título y botón a la izquierda; a la derecha la zona más urgente grande y las otras dos más pequeñas debajo.
  En móvil, una columna.
- Movimiento: las tarjetas entran escalonadas al aparecer (como las de "Para quién es"); las barras se llenan y las
  cifras cuentan hasta su valor (existe `AnimatedNumber` en `components/portal/`).
- Lleva la marca de ejemplo (`ExampleTag`), porque las zonas son de ejemplo.

### 4. Sigue tu ayuda (cambio)

Debajo del comprobante se agrega un campo corto: "¿Ya donaste? Escribe tu código" con el botón "Rastrear", y un enlace
"Ver el ejemplo GA-24817".

- Al enviar, navega a `/donaciones?codigo=<código>#seguimiento`, que ya resuelve el código.
- Valida con la misma regla y el mismo mensaje de `TrackingLookup` (la función `normalize` se comparte, no se copia).
- En escritorio la sección está fija a la altura de la pantalla: el campo tiene que caber sin recortarse a 1280×720. Si no
  cabe, se compacta el comprobante antes que quitar el campo.
- La animación de la ruta con el scroll no cambia.

### 5. Si te pasó a ti

La entrada para quien fue afectado. Tono sereno, sin fotos.

```
Si te pasó a ti
Cuéntanos qué te falta o a quién buscas. No necesitas estar en ningún registro.

┌ Necesito ayuda ───────────────────┐  ┌ Busco a alguien ──────────────────┐
│ ¿Qué te falta?                    │  │ 37 reencuentros esta semana       │
│ (Agua)(Comida)(Refugio)(Salud)…   │  │ Reporta o da una pista.           │
│ [Pedir ayuda →]                   │  │ [Buscar a alguien →]              │
└───────────────────────────────────┘  └───────────────────────────────────┘
Si es una emergencia, llama al 123.   Esto es un prototipo.
```

- "Necesito ayuda": las necesidades de `content/necesito-ayuda.ts` como chips. Tocar un chip lleva a
  `/necesito-ayuda?necesidad=<id>` y el asistente llega con esa necesidad ya marcada (decisión mía: hay que agregar la
  lectura de ese parámetro al asistente; si resulta costoso, los chips enlazan a `/necesito-ayuda` sin parámetro). El
  primer paso del asistente ("¿Para quién es la ayuda?") se mantiene; la necesidad aparece marcada en el segundo. El chip
  "Encontrar a alguien" no va aquí, porque esa es la tarjeta de al lado.
- "Busco a alguien": una cifra de `content/desaparecidos.ts` (`cifras`), marcada como ejemplo, y el botón → `/desaparecidos`.
- Debajo: la línea 123 (`emergencyLine`) como enlace `tel:` y el aviso de prototipo, como en las demás páginas que piden
  ayuda.
- Movimiento: calmado. Las dos tarjetas suben con una aparición suave, sin rotación; los chips aparecen en cadena.

### 6. Lo último

Las noticias, con la idea que ya quedó en Noticias: cada una trae algo concreto para hacer.

```
Lo último                                            [Ver todas las noticias →]
┌ foto ─────────────────────────┐   10 oct · Cifras
│ 10 oct · Registro             │   La UNGRD reporta 489.862 damnificados…
│ A dos meses del terremoto…    │   → Aportar a Vereda La Esperanza
│ → Aportar a Vereda El Carmen  │   ─────────────────────────────────────
└───────────────────────────────┘   5 oct · Control
                                    …
Otras emergencias:  (La Guajira · En seguimiento)  (Lluvias del Pacífico · En alerta) …
```

- Datos: las tres noticias más recientes de la emergencia del terremoto (`emergencias[0].noticias`, que son las reales).
  La primera con foto va grande; las otras dos, en lista.
- Cada noticia muestra fecha, tema, titular (en la serif de Noticias) y su primera forma de ayudar como una fila con
  enlace. Para resolver esa fila se reutiliza lo que ya hace `components/noticias/help-options.tsx`.
- Acciones: el titular → `/noticias?emergencia=<id>&noticia=<id>`; "Ver todas las noticias" → `/noticias`; cada píldora de
  "Otras emergencias" → `/noticias?emergencia=<id>`, con su estado. Las de ejemplo llevan la marca de ejemplo.
- Movimiento: la foto entra con un leve desplazamiento interno al hacer scroll (como las fotos de "Cómo ayudar"); la lista
  entra escalonada.

### 7. Para quién es (cambio)

- Se queda el tablero de cuatro tarjetas con sus widgets, pero más compacto (menos aire arriba y abajo, tarjetas más
  bajas).
- Cada tarjeta completa es un enlace, con una flecha y una etiqueta corta de acción, y se levanta un poco al pasar el
  cursor:
  - Gobierno y entidades → `/donaciones` ("Ver el tablero")
  - Fundaciones y Cruz Roja → `/centros-de-acopio` ("Publicar qué recibes")
  - Ciudadanía → `/portal` ("Ir a mi portal")
  - Comunidades → `/necesito-ayuda` ("Contar qué falta")

  (Los destinos y etiquetas son decisión mía.)

## Reglas de estética y movimiento

- Tipografía, radios, botones y tarjetas salen de lo que ya existe (`components/ui/styles.ts`, clases de las secciones
  actuales). No se agregan dependencias.
- Solo se animan `transform` y `opacity`. Curvas de `src/lib/motion.ts`. Las animaciones de entrada ocurren una sola vez.
- Se respeta `prefers-reduced-motion`.
- Por debajo de 1024 px todo va en una columna y nada se fija.
- Lecciones ya aprendidas en este repo: no envolver páginas enteras en `<ViewTransition>`; no animar `border-radius` ni
  `clip-path`; medir el rendimiento sobre `next build` + `next start`, no sobre el servidor dev; usar el puerto 3211.
- `AGENTS.md`: esta versión de Next tiene cambios; leer la guía en `node_modules/next/dist/docs/` antes de escribir código.

## Cómo se comprueba

No hay pruebas automáticas en el repo. Se comprueba con `npm run lint`, `npm run build` y recorriendo el home en el
navegador en escritorio (1280×720 y una pantalla grande) y en ancho de celular: cada hoja tiene su acción y cada enlace
llega a donde dice, con el parámetro aplicado; el scroll se mantiene fluido.

## Lo que queda a criterio de quien lo construye

- Tonos exactos de fondo, tamaños y espaciados dentro del sistema actual.
- Cómo partir los componentes y dónde vive cada archivo (siguiendo `src/components/<sección>/`).
- Los textos finales de cada hoja, siempre cortos y directos.
