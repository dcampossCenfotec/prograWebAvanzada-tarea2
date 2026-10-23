export default function AppLayout({ children }) {
  return (
    <div className="club-app">
      <a
        className="visually-hidden-focusable position-absolute top-0 start-0 z-3 bg-white p-3 rounded"
        href="#main-content"
      >
        Saltar al contenido
      </a>

      <header className="bg-primary text-white py-4">
        <div className="container">
          <p className="fw-semibold mb-1">Estantería Común</p>
          <h1 className="club-header__title mb-0">
            Tablero de lecturas del club
          </h1>
        </div>
      </header>

      <main
        id="main-content"
        className="club-main container py-4"
        tabIndex={-1}
      >
        {children}
      </main>

      <footer className="border-top py-3">
        <div className="container">
          <p className="small text-body-secondary mb-0">
            Estantería Común · Lecturas compartidas | Tarea 2 | Daniel Campos Sánchez.
          </p>
        </div>
      </footer>
    </div>
  );
}
