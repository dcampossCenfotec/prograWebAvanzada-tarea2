import BookCard from './BookCard.jsx';

export default function BookList({
  books,
  members,
  onStatusChange,
  onRemove,
  emptyMessage = 'Todavía no hay libros en la colección del club.',
}) {
  const membersById = new Map(members.map((member) => [member.id, member]));

  if (books.length === 0) {
    return (
      <p className="alert alert-info mb-0" role="status">
        {emptyMessage}
      </p>
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
