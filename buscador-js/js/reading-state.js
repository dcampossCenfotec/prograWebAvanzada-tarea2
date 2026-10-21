export const READING_STATUSES = Object.freeze([
  'Pendiente',
  'Leyendo',
  'Leido',
]);

let readingBooks = [];

export function getReadingBooks() {
  return [...readingBooks];
}

export function getNextReadingStatus(currentStatus) {
  const index = READING_STATUSES.indexOf(currentStatus);
  return READING_STATUSES[(index + 1) % READING_STATUSES.length];
}

export function addReadingBook(book) {
  const alreadyExists = readingBooks.some((reading) => reading.id === book.id);

  if (alreadyExists) {
    return null;
  }

  const reading = {
    ...book,
    authors: [...book.authors],
    status: READING_STATUSES[0],
  };

  readingBooks = [...readingBooks, reading];

  return reading;
}

export function changeReadingStatus(bookId) {
  const book = readingBooks.find((reading) => reading.id === bookId);

  if (!book) {
    return null;
  }

  const updatedBook = {
    ...book,
    status: getNextReadingStatus(book.status),
  };

  readingBooks = readingBooks.map((reading) =>
    reading.id === bookId ? updatedBook : reading,
  );

  return updatedBook;
}

export function removeReadingBook(bookId) {
  const book = readingBooks.find((reading) => reading.id === bookId);

  if (!book) {
    return null;
  }

  readingBooks = readingBooks.filter((reading) => reading.id !== bookId);

  return book;
}
