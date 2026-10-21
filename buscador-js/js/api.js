const SEARCH_URL = 'https://openlibrary.org/search.json';
const SEARCH_LIMIT = 12;
const REQUEST_TIMEOUT = 20000;

function normalizeBook(book) {
  return {
    id: book.key.split('/').pop(),
    title:
      typeof book.title === 'string' && book.title.trim()
        ? book.title.trim()
        : 'Título no disponible',
    authors: Array.isArray(book.author_name)
      ? book.author_name
          .filter((author) => typeof author === 'string' && author.trim())
          .map((author) => author.trim())
      : [],
    firstPublicationYear: Number.isInteger(book.first_publish_year)
      ? book.first_publish_year
      : null,
    coverId:
      Number.isInteger(book.cover_i) && book.cover_i > 0 ? book.cover_i : null,
  };
}

export async function searchBooks(query) {
  const url = new URL(SEARCH_URL);

  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(SEARCH_LIMIT));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Open Library respondió con HTTP ${response.status}.`);
    }

    const data = await response.json();

    if (!Array.isArray(data.docs)) {
      throw new Error('Open Library devolvió una respuesta inesperada.');
    }

    return data.docs
      .filter(
        (book) =>
          book !== null &&
          typeof book === 'object' &&
          typeof book.key === 'string' &&
          book.key.trim(),
      )
      .map(normalizeBook);
  } finally {
    clearTimeout(timeoutId);
  }
}
