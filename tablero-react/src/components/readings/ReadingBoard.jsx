import { useState } from 'react';
import { INITIAL_BOOKS } from '../../data/books.js';
import { INITIAL_MEMBERS } from '../../data/members.js';
import {
  getNextReadingStatus,
  READING_STATUS,
  READING_STATUSES,
} from '../../data/reading-statuses.js';
import BookForm from '../forms/BookForm.jsx';
import BookFilters from './BookFilters.jsx';
import BookList from './BookList.jsx';
import BookSummary from './BookSummary.jsx';

const INITIAL_FILTERS = Object.freeze({
  status: 'all',
  memberId: 'all',
});

export default function ReadingBoard() {
  const [books, setBooks] = useState(() =>
    INITIAL_BOOKS.map((book) => ({
      ...book,
      authors: [...book.authors],
    })),
  );

  const [filters, setFilters] = useState(() => ({ ...INITIAL_FILTERS }));

  const filteredBooks = books.filter((book) => {
    const matchesStatus =
      filters.status === 'all' || book.status === filters.status;

    const matchesMember =
      filters.memberId === 'all' || book.proposedBy === filters.memberId;

    return matchesStatus && matchesMember;
  });

  const summary = Object.fromEntries(
    READING_STATUSES.map((status) => [
      status,
      filteredBooks.filter((book) => book.status === status).length,
    ]),
  );

  const bookCount = books.length;
  const bookLabel = bookCount === 1 ? 'libro registrado' : 'libros registrados';

  const emptyTitle =
    books.length === 0 ? 'La colección está vacía' : 'No hay coincidencias';

  const emptyMessage =
    books.length === 0
      ? 'Agrega tu primera lectura con el formulario superior.'
      : 'Ningún libro coincide con los filtros seleccionados. Prueba con otros filtros.';

  function handleAddBook(draft) {
    const newBook = {
      id: `book-${crypto.randomUUID()}`,
      title: draft.title,
      authors: [...draft.authors],
      proposedBy: draft.proposedBy,
      status: READING_STATUS.PENDING,
    };

    setBooks((currentBooks) => [...currentBooks, newBook]);
  }

  function handleStatusChange(bookId) {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              status: getNextReadingStatus(book.status),
            }
          : book,
      ),
    );
  }

  function handleRemove(bookId) {
    setBooks((currentBooks) =>
      currentBooks.filter((book) => book.id !== bookId),
    );
  }

  function handleFilterChange(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleResetFilters() {
    setFilters({ ...INITIAL_FILTERS });
  }

  return (
    <>
      <BookForm members={INITIAL_MEMBERS} onAddBook={handleAddBook} />

      <section aria-labelledby="reading-board-title">
        <h2 id="reading-board-title" className="h3">
          Colección del club
        </h2>

        <p className="text-body-secondary">
          Lecturas compartidas por los {INITIAL_MEMBERS.length} integrantes del
          club. Actualiza su avance o quita los libros que ya no formarán parte
          de la colección.
        </p>

        <p className="fw-semibold">
          {bookCount} {bookLabel} en la colección.
        </p>

        <BookFilters
          filters={filters}
          members={INITIAL_MEMBERS}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <BookSummary counts={summary} />

        <BookList
          books={filteredBooks}
          members={INITIAL_MEMBERS}
          onStatusChange={handleStatusChange}
          onRemove={handleRemove}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
          onResetFilters={books.length > 0 ? handleResetFilters : undefined}
        />
      </section>
    </>
  );
}
