import { INITIAL_BOOKS } from './data/books.js';
import { INITIAL_MEMBERS } from './data/members.js';

export default function App() {
  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container">
          <p className="fw-semibold mb-1">Estantería Común</p>
          <h1 className="h2 mb-0">Tablero de lecturas del club</h1>
        </div>
      </header>

      <main className="container py-4">
        <section className="card shadow-sm" aria-labelledby="club-title">
          <div className="card-body p-3 p-md-4">
            <h2 id="club-title" className="h4">
              Cada libro abre una conversación
            </h2>

            <p className="text-body-secondary">
              Organiza las lecturas del club y acompaña su avance.
            </p>

            <p className="mb-0">
              El club reúne a {INITIAL_MEMBERS.length} integrantes y tiene{' '}
              {INITIAL_BOOKS.length} libros en su colección.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
