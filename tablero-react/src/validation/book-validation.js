export const BOOK_FORM_LIMITS = Object.freeze({
  titleLength: 180,
  authorLength: 120,
  maxAuthors: 5,
});

export function parseAuthors(value) {
  return value
    .split(/\r?\n/)
    .map((author) => author.trim())
    .filter(Boolean);
}

export function validateBookForm(values, members) {
  const errors = {};
  const title = values.title.trim();
  const authors = parseAuthors(values.authors);

  if (!title) {
    errors.title = 'Escribe el título del libro.';
  } else if (title.length > BOOK_FORM_LIMITS.titleLength) {
    errors.title =
      `El título puede tener como máximo ` +
      `${BOOK_FORM_LIMITS.titleLength} caracteres.`;
  }

  if (authors.length === 0) {
    errors.authors = 'Escribe al menos un autor.';
  } else if (authors.length > BOOK_FORM_LIMITS.maxAuthors) {
    errors.authors = `Puedes incluir como máximo ${BOOK_FORM_LIMITS.maxAuthors} autores.`;
  } else if (
    authors.some((author) => author.length > BOOK_FORM_LIMITS.authorLength)
  ) {
    errors.authors =
      `Cada autor puede tener como máximo ` +
      `${BOOK_FORM_LIMITS.authorLength} caracteres.`;
  }

  if (!members.some((member) => member.id === values.proposedBy)) {
    errors.proposedBy = 'Selecciona un miembro del club.';
  }

  return errors;
}
