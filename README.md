# GeoAid

Plataforma para ver en un solo lugar qué necesita cada zona afectada por el terremoto del 10 de agosto de 2026, qué ayudas se están recogiendo y a dónde están llegando. Sirve al gobierno, a las fundaciones y a la Cruz Roja para coordinar entregas sin repetir ayudas, y a la gente para saber qué donar, dónde ayudar y a dónde fue lo que dio.

## Estado

- **Inicio**: barra de navegación, hero en carrusel por temas, donación rápida y la sección "Cómo ayudar".
- **Secciones** (Noticias, Donaciones, Voluntariado, Centros de acopio, Desaparecidos, Donar, Necesito ayuda, Mi portal): páginas en construcción con su encabezado y la transición desde el hero.

Las cifras del hero vienen del reporte de la UNGRD del 10 de octubre de 2026. Los valores "Donación sugerida $85.000" y "Duración de un turno 4 horas" son de ejemplo. El contenido vive en `src/content/site.ts`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Stack

- Next.js 16 (App Router, Cache Components) y React 19.3
- Tailwind CSS 4: paleta y curvas de animación en `src/app/globals.css`
- Motion 14 para las animaciones dentro de cada página
- `<ViewTransition>` de React para las transiciones entre páginas: la foto del hero se transforma en el encabezado de su sección

## Animaciones

| Dónde | Qué pasa |
| --- | --- |
| Hero | La foto nueva entra como cortina desde el lado al que se navega; la anterior se corre y se oscurece. El titular sube palabra por palabra. La barra de progreso se puede pausar, y se detiene sola fuera de pantalla, con la pestaña oculta o con foco de teclado. |
| Barra superior | Al bajar, la barra transparente se convierte en una barra blanca flotante con un resaltado que sigue al cursor. |
| Cómo ayudar | La foto de la opción elegida crece desde su píldora hasta la tarjeta, y la anterior se encoge a píldora. Funciona con flechas, clic, teclado y deslizando el dedo. |
| Así llega tu ayuda | La línea entre los pasos se dibuja una sola vez, al entrar en pantalla. |
| Entre páginas | La foto del hero hace un morph hacia el banner de la sección y los textos se desvanecen por encima. El resto del contenido se desliza según la dirección de la navegación. |

Con "reducir movimiento" activado en el sistema, el carrusel arranca en pausa y las transiciones se desactivan.

## Créditos

Las fotos son marcadores tomados de Wikimedia Commons. Autores y licencias en [IMAGE_CREDITS.md](IMAGE_CREDITS.md).
