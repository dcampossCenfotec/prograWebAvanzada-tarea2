const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-query');
const searchSubmit = document.querySelector('#search-submit');
const searchLoading = document.querySelector('#search-loading');
const searchFeedback = document.querySelector('#search-feedback');
const searchResults = document.querySelector('#search-results');
const searchResultsCount = document.querySelector('#search-results-count');

const bookDetailModal = document.querySelector('#book-detail-modal');
const bookDetailTitle = document.querySelector('#book-detail-title');
const bookDetailContent = document.querySelector('#book-detail-content');

const searchBooksById = new Map();

const FALLBACK_COVER = new URL(
  '../../assets/book-placeholder.svg',
  import.meta.url,
).href;

function formatAuthors(book) {
  return book.authors.join(', ') || 'Autor no disponible';
}

function formatPublicationYear(book) {
  return book.firstPublicationYear === null
    ? 'Año no disponible'
    : String(book.firstPublicationYear);
}

function createBookCover(book, className, loading = 'lazy') {
  const image = document.createElement('img');

  image.className = className;
  image.width = 240;
  image.height = 360;
  image.loading = loading;
  image.decoding = 'async';

  if (book.coverId === null) {
    image.src = FALLBACK_COVER;
    image.alt = `Portada no disponible para “${book.title}”.`;
    return image;
  }

  image.alt = `Portada de “${book.title}”.`;

  image.addEventListener(
    'error',
    () => {
      image.src = FALLBACK_COVER;
      image.alt = `Portada no disponible para “${book.title}”.`;
    },
    { once: true },
  );

  image.src =
    `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg` +
    '?default=false';

  return image;
}

function createBookCard(book) {
  const column = document.createElement('div');
  column.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';

  const card = document.createElement('article');
  card.className = 'card book-card h-100 shadow-sm';

  const cover = createBookCover(book, 'card-img-top book-card__cover');

  const body = document.createElement('div');
  body.className = 'card-body d-flex flex-column';

  const title = document.createElement('h3');
  title.className = 'card-title h5 book-card__title';
  title.textContent = book.title;

  const authors = document.createElement('p');
  authors.className = 'card-text text-body-secondary mb-2';
  authors.textContent = formatAuthors(book);

  const year = document.createElement('p');
  year.className = 'card-text small text-body-secondary mb-3';
  year.textContent = `Primera publicación: ${formatPublicationYear(book)}`;

  const actions = document.createElement('div');
  actions.className = 'book-card__actions d-grid gap-2 mt-auto';

  const detailsButton = document.createElement('button');
  detailsButton.type = 'button';
  detailsButton.className = 'btn btn-outline-primary';
  detailsButton.textContent = 'Ver detalles';
  detailsButton.dataset.bookId = book.id;
  detailsButton.dataset.bsToggle = 'modal';
  detailsButton.dataset.bsTarget = '#book-detail-modal';
  detailsButton.setAttribute('aria-label', `Ver detalles de “${book.title}”`);

  actions.append(detailsButton);
  body.append(title, authors, year, actions);
  card.append(cover, body);
  column.append(card);

  return column;
}

function createDefinition(label, value) {
  const fragment = document.createDocumentFragment();

  const term = document.createElement('dt');
  term.textContent = label;

  const description = document.createElement('dd');
  description.textContent = value;

  fragment.append(term, description);

  return fragment;
}

function renderBookDetails(book) {
  bookDetailTitle.textContent = book.title;

  const layout = document.createElement('div');
  layout.className = 'row g-3';

  const coverColumn = document.createElement('div');
  coverColumn.className = 'col-12 col-sm-4';

  const cover = createBookCover(book, 'book-detail-cover', 'eager');
  coverColumn.append(cover);

  const informationColumn = document.createElement('div');
  informationColumn.className = 'col-12 col-sm-8';

  const information = document.createElement('dl');
  information.className = 'mb-3';

  information.append(
    createDefinition('Autores', formatAuthors(book)),
    createDefinition('Primera publicación', formatPublicationYear(book)),
  );

  const sourceLink = document.createElement('a');
  sourceLink.href = `https://openlibrary.org/works/${encodeURIComponent(book.id)}`;
  sourceLink.textContent = 'Consultar en Open Library';
  sourceLink.target = '_blank';
  sourceLink.rel = 'noopener noreferrer';

  informationColumn.append(information, sourceLink);
  layout.append(coverColumn, informationColumn);

  bookDetailContent.replaceChildren(layout);
}

export function initBookDetails() {
  bookDetailModal.addEventListener('show.bs.modal', (event) => {
    const bookId = event.relatedTarget?.dataset.bookId;
    const book = searchBooksById.get(bookId);

    if (!book) {
      event.preventDefault();
      return;
    }

    renderBookDetails(book);
  });

  bookDetailModal.addEventListener('hidden.bs.modal', () => {
    bookDetailTitle.textContent = 'Detalle del libro';
    bookDetailContent.replaceChildren();
  });
}

export function setSearchLoading(isLoading) {
  searchLoading.hidden = !isLoading;
  searchSubmit.disabled = isLoading;
  searchInput.disabled = isLoading;

  searchForm.setAttribute('aria-busy', String(isLoading));
  searchResults.setAttribute('aria-busy', String(isLoading));
}

export function showSearchFeedback(message, variant = 'info') {
  searchFeedback.className = `alert alert-${variant}`;
  searchFeedback.textContent = message;
  searchFeedback.hidden = false;
}

export function hideSearchFeedback() {
  searchFeedback.hidden = true;
  searchFeedback.textContent = '';
}

export function clearSearchResults() {
  searchResults.replaceChildren();
  searchResultsCount.textContent = '';
  searchBooksById.clear();
}

export function renderSearchResults(books) {
  clearSearchResults();

  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    searchBooksById.set(book.id, book);
    fragment.append(createBookCard(book));
  });

  searchResults.append(fragment);

  const label = books.length === 1 ? 'libro' : 'libros';
  searchResultsCount.textContent = `Mostrando ${books.length} ${label}.`;
}
