import { searchBooks } from './api.js';
import {
  clearSearchResults,
  hideSearchFeedback,
  renderSearchResults,
  setSearchLoading,
  showSearchFeedback,
} from './render.js';

export function initSearch() {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-query');

  let isSearching = false;

  // La validación sigue siendo nativa, pero decidimos cuándo mostrarla.
  form.noValidate = true;

  setSearchLoading(false);

  input.addEventListener('input', () => {
    input.setCustomValidity('');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSearching) {
      return;
    }

    input.value = input.value.trim();
    input.setCustomValidity(
      input.value ? '' : 'Escribe un título o un autor para buscar.',
    );

    if (!form.reportValidity()) {
      return;
    }

    const query = input.value;

    isSearching = true;
    clearSearchResults();
    hideSearchFeedback();
    setSearchLoading(true);

    try {
      const books = await searchBooks(query);

      if (books.length === 0) {
        showSearchFeedback(
          `No encontramos libros para “${query}”. Prueba con otro título o autor.`,
          'warning',
        );
        return;
      }

      renderSearchResults(books);
      showSearchFeedback(`Resultados para “${query}”.`, 'success');
    } catch (error) {
      const message =
        error.name === 'AbortError'
          ? 'La búsqueda tardó demasiado. Inténtalo nuevamente.'
          : 'No pudimos consultar el catálogo. Revisa tu conexión e inténtalo nuevamente.';

      showSearchFeedback(message, 'danger');
    } finally {
      isSearching = false;
      setSearchLoading(false);
    }
  });
}
