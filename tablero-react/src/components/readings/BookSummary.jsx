import { READING_STATUSES } from '../../data/reading-statuses.js';

export default function BookSummary({ counts }) {
  const total = READING_STATUSES.reduce(
    (sum, status) => sum + (counts[status] ?? 0),
    0,
  );

  return (
    <section className="mb-4" aria-labelledby="book-summary-title">
      <h3 id="book-summary-title" className="h5">
        Resumen de resultados
      </h3>

      <p
        className="text-body-secondary"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {total} {total === 1 ? 'libro coincide' : 'libros coinciden'} con los
        filtros activos.
      </p>

      <ul className="club-summary">
        {READING_STATUSES.map((status) => (
          <li key={status} className="card h-100">
            <div className="club-summary__body">
              <h4 className="club-summary__label text-body-secondary mb-2">
                {status}
              </h4>

              <p className="club-summary__count">
                <span className="visually-hidden">Cantidad de libros: </span>
                {counts[status] ?? 0}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
