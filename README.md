# GeoAid

Plataforma para ver en un solo lugar qué necesita cada zona afectada por el terremoto del 10 de agosto de 2026, qué ayudas se están recogiendo y a dónde están llegando. Sirve al gobierno, a las fundaciones y a la Cruz Roja para coordinar entregas sin repetir ayudas, y a la gente para saber qué donar, dónde ayudar y a dónde fue lo que dio.

Es un prototipo universitario (Uniandes, curso Intro). No tiene servidor ni base de datos y no procesa pagos. Los formularios validan y confirman de verdad, pero la información no sale del navegador.

## La página de inicio

La página se arma como hojas que suben una sobre otra mientras haces scroll:

1. **Hero**: carrusel a pantalla completa por tema (noticias, donaciones, voluntariado, centros de acopio, desaparecidos). A la derecha, una tarjeta de vidrio cambia con cada tema: titulares de prensa, una necesidad abierta con lo que alcanza un aporte, el próximo turno de voluntariado, los puntos de acopio de una ciudad (incluidos los que abren vecinos en sus garajes y casas) y los reencuentros de la semana. El carrusel se pausa mientras el puntero está sobre la tarjeta. Al bajar, la hoja de "Cómo ayudar" sube encima y la foto se encoge y se oscurece.
2. **Cómo ayudar**: cinco formas de ayudar en tarjetas que se deslizan de lado con el scroll vertical. En móvil es un carrusel deslizable, precedido por la donación rápida.
3. **Sigue tu ayuda**: la ruta de una donación de ejemplo se dibuja con el scroll mientras el comprobante se completa.
4. **Para quién es**: gobierno, fundaciones, ciudadanía y comunidades, cada uno con un pedazo de la interfaz que usaría.
5. **Footer**: se revela por debajo de la página, con las fuentes de los datos.

## Las páginas

Cada página tiene su propia forma según lo que trata, sin dejar de parecer GeoAid.

| Ruta | Qué es | La pieza central |
| --- | --- | --- |
| `/noticias` | **Portal de emergencias.** Puede seguir varias crisis a la vez, con titulares en serif (Newsreader, solo en esta página). | Las emergencias como pestañas, cada una con su estado y su contador de días. La elegida muestra qué está pasando, sus cifras con fuente, cómo ayudar, sus noticias por tema y una línea de días donde cada noticia es un punto. Cada noticia se abre completa, con qué significa para ti y su fuente. El enlace guarda la emergencia y la noticia abiertas (`?emergencia=` y `?noticia=`). |
| `/donaciones` | **Tablero de necesidades.** Lo que le falta a cada zona y cuánto ya llegó. | 14 zonas con urgencia por cobertura, filtros por tipo y departamento, y orden que reacomoda las tarjetas. También "A dónde va cada peso" y el buscador de seguimiento por código. |
| `/donar` | **Un pago tranquilo.** Cuatro pasos: destino, monto, datos y método. | Un recibo de papel que se llena mientras eliges y, al confirmar, se imprime como comprobante con su código. Lee `?zona=`, `?destino=` y `?monto=`. |
| `/voluntariado` | **Una agenda viva.** Los próximos 7 días desde hoy. | Turnos en una línea de tiempo con los cupos como trazos. "Tomar este turno" abre un panel con el formulario y termina en la vista previa del mensaje de texto. |
| `/centros-de-acopio` | **El mapa de lo que recibe cada punto.** Lista a la izquierda y mapa fijo a la derecha. | Mapa real (MapLibre con OpenFreeMap) en 5 ciudades. "¿Qué quieres llevar?" filtra los puntos, y lo que nadie recibe (ropa usada, medicamentos, comida perecedera) muestra la guía de la Cruz Roja. También explica cómo abrir un punto en tu casa. |
| `/desaparecidos` | **Un registro sereno.** Poco color, mucho aire, sin fotos de personas: la foto del hero llega en color y se asienta en gris. | Buscador con filtros, "¿Sabes algo?" en un diálogo y el reporte de una persona en tres pasos. Explica cómo se verifica cada reporte y qué nunca se publica. |
| `/necesito-ayuda` | **Una pregunta a la vez.** Para alguien con miedo, en un celular y con mala señal. | Asistente sobre fondo oscuro con letra y botones grandes, el 123 siempre visible, ubicación del teléfono, revisión con "Editar" y un radicado al final. |
| `/portal` | **Tu historia de ayuda.** Panel personal de Laura, una usuaria de ejemplo. | Resumen con cifras, y pestañas de donaciones con su seguimiento, turnos que se pueden cancelar, y necesidades y reportes. |

### Lo que haces en una página aparece en Mi portal

Donar, tomar un turno, registrar una necesidad, reportar a una persona, dejar una pista o abrir un punto de acopio guarda un registro en el navegador (`src/lib/activity.ts`, con `localStorage`). Mi portal lo muestra junto a la historia de ejemplo, marcado como "Hecho por ti en esta sesión". El código de una donación nueva se puede buscar en el seguimiento de `/donaciones`, y un turno tomado baja el cupo en la agenda. Desde el portal se borra todo con "Borrar mi actividad de este navegador".

## Transiciones

- **Pantalla de carga** (`src/components/intro.tsx`): en la primera visita de la sesión el logo se dibuja (el techo y después la onda sísmica que se aplana), aparece el nombre y la hoja sube para descubrir la página. Es solo HTML y CSS, así que se pinta antes de que cargue el JavaScript y desaparece sola aunque algo falle. Dura 1,9 segundos y no se repite al recargar en la misma pestaña.
- **Telón entre secciones** (`src/components/transitions/`): al navegar desde el menú, el footer, el buscador o un enlace entre páginas, sube una hoja verde con el nombre del destino. La ruta cambia por detrás y la hoja sigue de largo para descubrir la página nueva. Es el mismo gesto de las hojas apiladas del inicio. `NavLink` lo activa y deja pasar sin telón las anclas de la misma página y los clics con Ctrl o Cmd.
- **Morph desde el hero**: los botones del carrusel y de su tarjeta llevan a la sección con `<ViewTransition>` de React. La foto del tema se transforma en la cabecera de la página.

Con "reducir movimiento" activado en el sistema, la pantalla de carga solo se desvanece, el telón no aparece, el carrusel arranca en pausa y Lenis se apaga.

## Datos

Lo **real** viene de las fuentes del planteamiento del problema, listadas en el footer, en `/noticias` y en `src/content/site.ts`: las cifras de la UNGRD, las noticias del terremoto y de La Guajira, y la guía de la Cruz Roja sobre qué no donar.

Lo **de ejemplo** está marcado como tal en cada página:

- Las zonas, necesidades, entregas y porcentajes del tablero de donaciones, y el reparto de cada peso.
- Los turnos, lugares y cupos de voluntariado.
- Los puntos de acopio, su capacidad y lo que reciben.
- Los reportes de personas desaparecidas (nombres ficticios, sin fotos) y las cifras de reencuentros.
- La historia de Laura en Mi portal y el seguimiento de la donación GA-24817.
- Las emergencias de lluvias en el Pacífico e incendios en la Orinoquía, con sus cifras y noticias.
- Las tarjetas del hero, salvo la de noticias.

Cada flujo donde alguien pide ayuda, reporta, se inscribe o dona dice antes de enviar y en la confirmación que es un prototipo, que la información no llega a ninguna entidad y que en una emergencia hay que llamar al 123.

## Desarrollo

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Estructura

- `src/app/<ruta>/page.tsx`: cada página, armada con `PageShell` (`src/components/page-shell.tsx`).
- `src/components/<sección>/`: los componentes de cada página.
- `src/content/<sección>.ts`: los datos y textos de cada página. Lo compartido está en `src/content/site.ts`.
- `src/components/ui/`: botones, campos y opciones compartidos.
- `src/lib/`: registro de actividad, fechas, formatos en español y curvas de animación.

## Stack

- Next.js 16 (App Router, Cache Components) y React 19.3
- Tailwind CSS 4: paleta y curvas de animación en `src/app/globals.css`
- Motion 14 para las animaciones ligadas al scroll y a las interacciones
- Lenis para el scroll con inercia en escritorio (en táctil el scroll sigue siendo nativo)
- MapLibre GL con el estilo libre de OpenFreeMap (datos de OpenStreetMap) para el mapa de centros de acopio. Se carga solo en el cliente y solo cuando el mapa se va a ver
- `<ViewTransition>` de React para el morph desde el hero

## Rendimiento de las animaciones

Todo lo que se mueve con el scroll usa propiedades que compone la GPU (`transform`, `opacity`). Algunas decisiones que no son obvias:

- La tarjeta del hero es 56 px más grande que la pantalla y tiene el radio fijo: al encogerse con `scale`, las esquinas redondeadas aparecen solas, sin animar `border-radius`. La pantalla de carga y el telón usan el mismo truco.
- La cortina entre fotos son dos capas que se desplazan en sentido contrario en vez de un `clip-path`.
- Lo que depende de la fecha de hoy (la agenda de voluntariado, el contador de días) se calcula en el navegador, porque la página se prerenderiza una sola vez.

## Créditos

Las fotos son marcadores tomados de Wikimedia Commons. Autores y licencias en [IMAGE_CREDITS.md](IMAGE_CREDITS.md). El mapa usa datos de © colaboradores de OpenStreetMap, servidos por OpenFreeMap.
