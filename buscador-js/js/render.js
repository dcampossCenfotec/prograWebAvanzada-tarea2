const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-query');
const searchSubmit = document.querySelector('#search-submit');
const searchLoading = document.querySelector('#search-loading');
const searchFeedback = document.querySelector('#search-feedback');
const searchResults = document.querySelector('#search-results');
const searchResultsCount = document.querySelector('#search-results-count');

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
}

export function renderSearchResults(books) {
  clearSearchResults();

  const column = document.createElement('div');
  column.className = 'col-12';

  const list = document.createElement('ul');
  list.className = 'list-group';

  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    const item = document.createElement('li');
    item.className = 'list-group-item';

    const title = document.createElement('h3');
    title.className = 'h6 mb-1';
    title.textContent = book.title;

    const authors = document.createElement('p');
    authors.className = 'text-body-secondary mb-0';
    authors.textContent = book.authors.join(', ') || 'Autor no disponible';

    item.append(title, authors);
    fragment.append(item);
  });

  list.append(fragment);
  column.append(list);
  searchResults.append(column);

  const label = books.length === 1 ? 'libro' : 'libros';
  searchResultsCount.textContent = `Mostrando ${books.length} ${label}.`;
}
