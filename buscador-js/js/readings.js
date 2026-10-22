import { getSearchBook } from './render.js';
import {
  addReadingBook,
  changeReadingStatus,
  getReadingBooks,
  removeReadingBook,
} from './reading-state.js';
import {
  animateReadingRow,
  appendReadingRow,
  removeReadingRow,
  renderInitialReadingList,
  setReadingRowBusy,
  showReadingFeedback,
  updateReadingRow,
  updateReadingSummary,
} from './reading-render.js';

const busyBooks = new Set();

function findActionButton(event, container, selector) {
  if (!(event.target instanceof Element)) {
    return null;
  }

  const button = event.target.closest(selector);

  if (
    !button ||
    !container.contains(button) ||
    button.disabled ||
    button.getAttribute('aria-disabled') === 'true'
  ) {
    return null;
  }

  return button;
}

async function runReadingAction(bookId, action) {
  if (busyBooks.has(bookId)) {
    return;
  }

  busyBooks.add(bookId);

  try {
    await action();
  } finally {
    setReadingRowBusy(bookId, false);
    busyBooks.delete(bookId);
  }
}

export function initReadings() {
  const searchResults = document.querySelector('#search-results');
  const readingList = document.querySelector('#reading-list');

  renderInitialReadingList(getReadingBooks());

  searchResults.addEventListener('click', async (event) => {
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

    await runReadingAction(book.id, async () => {
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
      setReadingRowBusy(book.id, true);

      await animateReadingRow(book.id, 'reading-row--entering');

      showReadingFeedback(
        `Agregaste “${book.title}” con estado Pendiente.`,
        'success',
      );
    });
  });

  readingList.addEventListener('click', async (event) => {
    const button = findActionButton(event, readingList, 'button[data-action]');

    if (!button) {
      return;
    }

    const { action, bookId } = button.dataset;

    if (action === 'change-status') {
      await runReadingAction(bookId, async () => {
        const updatedBook = changeReadingStatus(bookId);

        if (!updatedBook) {
          return;
        }

        updateReadingRow(updatedBook);
        setReadingRowBusy(bookId, true);

        await animateReadingRow(bookId, 'reading-row--updating');

        showReadingFeedback(
          `“${updatedBook.title}” ahora está en estado ${updatedBook.status}.`,
        );
      });

      return;
    }

    if (action === 'remove-reading') {
      await runReadingAction(bookId, async () => {
        const book = getReadingBooks().find((reading) => reading.id === bookId);

        if (!book) {
          return;
        }

        setReadingRowBusy(bookId, true);

        await animateReadingRow(bookId, 'reading-row--leaving');

        removeReadingBook(bookId);
        removeReadingRow(bookId);
        updateReadingSummary(getReadingBooks().length);

        showReadingFeedback(
          `Quitaste “${book.title}” de tu lista de lecturas.`,
        );
      });
    }
  });
}
