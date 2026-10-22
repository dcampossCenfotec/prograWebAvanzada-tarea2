export default function AppLayout({ children }) {
  return (
    <>
      <a
        className="visually-hidden-focusable position-absolute top-0 start-0 z-3 bg-white p-3 rounded"
        href="#main-content"
      >
        Saltar al contenido
      </a>

      <header className="bg-primary text-white py-4">
        <div className="container">
          <p className="fw-semibold mb-1">Estantería Común</p>
          <h1 className="h2 mb-0">Tablero de lecturas del club</h1>
        </div>
      </header>

      <main id="main-content" className="container py-4" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
