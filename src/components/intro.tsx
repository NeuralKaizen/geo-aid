/*
 * Pantalla de carga de la primera visita de la sesión. Es solo HTML y CSS (ver .intro en globals.css) para que se
 * pinte antes de que cargue el JavaScript y desaparezca sola aunque algo falle. El logo se dibuja: primero el techo,
 * después la onda sísmica que se aplana. Luego la hoja sube y descubre la página.
 *
 * El script corre antes de pintar: si la persona ya la vio en esta pestaña, la oculta para no repetirla al recargar.
 */
const skipIfSeen = `try{var k="geoaid:intro";if(sessionStorage.getItem(k))document.documentElement.dataset.intro="visto";else sessionStorage.setItem(k,"1")}catch(e){}`;

export function Intro() {
  return (
    <>
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: skipIfSeen }}
      />
      <div className="intro" aria-hidden>
        <div className="intro-hoja">
          <div className="intro-contenido">
            <div className="intro-marca">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="intro-techo" pathLength={1} d="M6 14.5 16 6l10 8.5" />
                <path className="intro-onda" pathLength={1} d="M3.5 22h5l2.4-5 3.2 9 3.1-7 2.1 3h9.2" />
              </svg>
              <span className="intro-palabra">
                <span>GeoAid</span>
              </span>
            </div>
            <p className="intro-nota">Ayuda coordinada tras el terremoto del 10 de agosto</p>
          </div>
        </div>
      </div>
    </>
  );
}
