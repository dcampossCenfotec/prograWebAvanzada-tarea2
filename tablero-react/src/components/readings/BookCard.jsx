import {
  getNextReadingStatus,
  READING_STATUS,
} from '../../data/reading-statuses.js';

const STATUS_CLASSES = {
  [READING_STATUS.PENDING]: 'text-bg-secondary',
  [READING_STATUS.READING]: 'text-bg-primary',
  [READING_STATUS.READ]: 'text-bg-success',
};

export default function BookCard({
  book,
  memberName,
  onStatusChange,
  onRemove,
}) {
  const titleId = `club-book-${book.id}`;
  const nextStatus = getNextReadingStatus(book.status);
  const statusClass = STATUS_CLASSES[book.status] ?? 'text-bg-secondary';

  return (
    <article className="card h-100 shadow-sm" aria-labelledby={titleId}>
      <div className="card-body d-flex flex-column">
        <h3 id={titleId} className="card-title h5 text-break">
          {book.title}
        </h3>

        <p className="card-text text-body-secondary">
          {book.authors.join(', ') || 'Autor no disponible'}
        </p>

        <p className="card-text">
          Propuesto por <span className="fw-semibold">{memberName}</span>
        </p>

        <p className="mb-4">
          <span className={`badge ${statusClass}`} aria-live="polite">
            {book.status}
          </span>
        </p>

        <div className="d-flex flex-wrap gap-2 mt-auto">
          <button
            className="btn btn-outline-primary btn-sm"
            type="button"
            onClick={() => onStatusChange(book.id)}
            aria-label={`Cambiar “${book.title}” a “${nextStatus}”`}
          >
            Cambiar a {nextStatus}
          </button>

          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() => onRemove(book.id)}
            aria-label={`Quitar “${book.title}” de la colección`}
          >
            Quitar
          </button>
        </div>
      </div>
    </article>
  );
}
