import { useState } from 'react';
import { INITIAL_BOOKS } from '../../data/books.js';
import { INITIAL_MEMBERS } from '../../data/members.js';
import { getNextReadingStatus } from '../../data/reading-statuses.js';
import BookList from './BookList.jsx';

export default function ReadingBoard() {
  const [books, setBooks] = useState(() =>
    INITIAL_BOOKS.map((book) => ({
      ...book,
      authors: [...book.authors],
    })),
  );

  const bookCount = books.length;
  const bookLabel = bookCount === 1 ? 'libro registrado' : 'libros registrados';

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

  return (
    <section aria-labelledby="reading-board-title">
      <h2 id="reading-board-title" className="h3">
        Colección del club
      </h2>

      <p className="text-body-secondary">
        Lecturas compartidas por los {INITIAL_MEMBERS.length} integrantes del
        club. Actualiza su avance o quita los libros que ya no formarán parte de
        la colección.
      </p>

      <p
        className="fw-semibold"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {bookCount} {bookLabel}.
      </p>

      <BookList
        books={books}
        members={INITIAL_MEMBERS}
        onStatusChange={handleStatusChange}
        onRemove={handleRemove}
      />
    </section>
  );
}
