import { getSearchBook } from './render.js';
import {
  addReadingBook,
  changeReadingStatus,
  getReadingBooks,
  removeReadingBook,
} from './reading-state.js';
import {
  appendReadingRow,
  removeReadingRow,
  renderInitialReadingList,
  showReadingFeedback,
  updateReadingRow,
  updateReadingSummary,
} from './reading-render.js';

function findActionButton(event, container, selector) {
  if (!(event.target instanceof Element)) {
    return null;
  }

  const button = event.target.closest(selector);

  if (!button || !container.contains(button) || button.disabled) {
    return null;
  }

  return button;
}

export function initReadings() {
  const searchResults = document.querySelector('#search-results');
  const readingList = document.querySelector('#reading-list');

  renderInitialReadingList(getReadingBooks());

  searchResults.addEventListener('click', (event) => {
    const button = findActionButton(
      event,
      searchResults,
      'button[data-action="add-reading"]',
    );

    if (!button) {
      return;
    }

    const book = getSearchBook(button.dataset.bookId);

    if (!book) {
      return;
    }

    const addedBook = addReadingBook(book);

    if (!addedBook) {
      showReadingFeedback(
        `“${book.title}” ya está en tu lista de lecturas.`,
        'warning',
      );
      return;
    }

    appendReadingRow(addedBook);
    updateReadingSummary(getReadingBooks().length);

    showReadingFeedback(
      `Agregaste “${book.title}” con estado Pendiente.`,
      'success',
    );
  });

  readingList.addEventListener('click', (event) => {
    const button = findActionButton(event, readingList, 'button[data-action]');

    if (!button) {
      return;
    }

    const { action, bookId } = button.dataset;

    if (action === 'change-status') {
      const updatedBook = changeReadingStatus(bookId);

      if (!updatedBook) {
        return;
      }

      updateReadingRow(updatedBook);

      showReadingFeedback(
        `“${updatedBook.title}” ahora está en estado ${updatedBook.status}.`,
      );

      return;
    }

    if (action === 'remove-reading') {
      const removedBook = removeReadingBook(bookId);

      if (!removedBook) {
        return;
      }

      removeReadingRow(bookId);
      updateReadingSummary(getReadingBooks().length);

      showReadingFeedback(
        `Quitaste “${removedBook.title}” de tu lista de lecturas.`,
      );
    }
  });
}
