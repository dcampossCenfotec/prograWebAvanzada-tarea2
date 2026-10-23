import BookCard from './BookCard.jsx';

export default function BookList({
  books,
  members,
  onStatusChange,
  onRemove,
  emptyTitle = 'La colección está vacía',
  emptyMessage = 'Agrega tu primera lectura con el formulario superior.',
  onResetFilters,
}) {
  const membersById = new Map(members.map((member) => [member.id, member]));

  if (books.length === 0) {
    return (
      <section className="club-empty-state" aria-labelledby="book-empty-title">
        <h3 id="book-empty-title" className="h5">
          {emptyTitle}
        </h3>

        <p className="text-body-secondary mb-0" role="status">
          {emptyMessage}
        </p>

        {onResetFilters ? (
          <button
            className="btn btn-outline-primary mt-3"
            type="button"
            onClick={onResetFilters}
          >
            Mostrar todos los libros
          </button>
        ) : (
          <a className="btn btn-primary mt-3" href="#add-book-title">
            Agregar un libro
          </a>
        )}
      </section>
    );
  }

  return (
    <ul className="row g-3 list-unstyled mb-0">
      {books.map((book) => (
        <li key={book.id} className="col-12 col-md-6 col-xl-4">
          <BookCard
            book={book}
            memberName={
              membersById.get(book.proposedBy)?.name ?? 'Miembro no disponible'
            }
            onStatusChange={onStatusChange}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  );
}
