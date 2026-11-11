# GeoAid

Plataforma para ver en un solo lugar qué necesita cada zona afectada por el terremoto del 10 de agosto de 2026, qué ayudas se están recogiendo y a dónde están llegando. Sirve al gobierno, a las fundaciones y a la Cruz Roja para coordinar entregas sin repetir ayudas, y a la gente para saber qué donar, dónde ayudar y a dónde fue lo que dio.

## La página de inicio

La página se arma como hojas que suben una sobre otra mientras haces scroll:

1. **Hero**: carrusel a pantalla completa por tema (noticias, donaciones, voluntariado, centros de acopio, desaparecidos). A la derecha, una tarjeta de vidrio cambia con cada tema: titulares de prensa, una necesidad abierta con lo que alcanza un aporte, el próximo turno de voluntariado, los puntos de acopio de una ciudad (incluidos los que abren vecinos en sus garajes y casas) y los reencuentros de la semana. El carrusel se pausa mientras el puntero está sobre la tarjeta. Al bajar, la hoja de "Cómo ayudar" sube encima y la foto se encoge y se oscurece.
2. **Cómo ayudar**: cinco formas de ayudar en tarjetas que se deslizan de lado con el scroll vertical. En móvil es un carrusel deslizable, precedido por la donación rápida.
3. **Sigue tu ayuda**: la ruta de una donación de ejemplo se dibuja con el scroll mientras el comprobante se completa.
4. **Para quién es**: gobierno, fundaciones, ciudadanía y comunidades, cada uno con un pedazo de la interfaz que usaría.
5. **Footer**: se revela por debajo de la página, con las fuentes de los datos.

Las secciones del menú (Noticias, Donaciones, Voluntariado, Centros de acopio, Desaparecidos, Donar, Necesito ayuda, Mi portal) son páginas en construcción con la transición desde el hero.

## Datos

Las cifras del hero vienen de las fuentes del planteamiento del problema (listadas en el footer y en `src/content/site.ts`). Estos datos son de ejemplo y están marcados como tal en la página:

- La donación sugerida de $85.000 y el turno de 4 horas.
- El seguimiento de la donación #GA-24817.
- Las zonas, porcentajes y nombres de las tarjetas de "Para quién es".
- Las tarjetas del hero, salvo la de noticias: sus titulares vienen de las fuentes listadas en el footer.

## Desarrollo

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Stack

- Next.js 16 (App Router, Cache Components) y React 19.3
- Tailwind CSS 4: paleta y curvas de animación en `src/app/globals.css`
- Motion 14 para las animaciones ligadas al scroll y a las interacciones
- Lenis para el scroll con inercia en escritorio (en táctil el scroll sigue siendo nativo)
- `<ViewTransition>` de React para las transiciones entre páginas: la foto del hero se transforma en el encabezado de su sección

## Rendimiento de las animaciones

Todo lo que se mueve con el scroll usa propiedades que compone la GPU (`transform`, `opacity`). Algunas decisiones que no son obvias:

- La tarjeta del hero es 56 px más grande que la pantalla y tiene el radio fijo: al encogerse con `scale`, las esquinas redondeadas aparecen solas, sin animar `border-radius`.
- La cortina entre fotos son dos capas que se desplazan en sentido contrario en vez de un `clip-path`.

Con "reducir movimiento" activado en el sistema, el carrusel arranca en pausa, Lenis se apaga y las transiciones se desactivan.

## Créditos

Las fotos son marcadores tomados de Wikimedia Commons. Autores y licencias en [IMAGE_CREDITS.md](IMAGE_CREDITS.md).
