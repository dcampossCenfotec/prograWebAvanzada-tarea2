import { getNextReadingStatus } from './reading-state.js';

const readingList = document.querySelector('#reading-list');
const readingCount = document.querySelector('#reading-count');
const readingEmpty = document.querySelector('#reading-empty');
const readingTableWrapper = document.querySelector('#reading-table-wrapper');
const readingFeedback = document.querySelector('#reading-feedback');
const readingTitle = document.querySelector('#reading-title');

const STATUS_CLASSES = {
  Pendiente: 'text-bg-secondary',
  Leyendo: 'text-bg-primary',
  Leido: 'text-bg-success',
};

function findReadingRow(bookId) {
  return Array.from(readingList.children).find(
    (row) => row.dataset.bookId === bookId,
  );
}

function configureStatusBadge(badge, book) {
  badge.className = `badge ${STATUS_CLASSES[book.status]}`;
  badge.textContent = book.status;
}

function configureStatusButton(button, book) {
  const nextStatus = getNextReadingStatus(book.status);

  button.textContent = `Cambiar a ${nextStatus}`;
  button.setAttribute(
    'aria-label',
    `Cambiar “${book.title}” a “${nextStatus}”`,
  );
}

function createActionButton(book, action, className) {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = className;
  button.dataset.action = action;
  button.dataset.bookId = book.id;

  return button;
}

function createReadingRow(book) {
  const row = document.createElement('tr');
  row.dataset.bookId = book.id;

  const titleCell = document.createElement('td');

  const title = document.createElement('span');
  title.className = 'fw-semibold';
  title.textContent = book.title;
  titleCell.append(title);

  const authorsCell = document.createElement('td');
  authorsCell.textContent = book.authors.join(', ') || 'Autor no disponible';

  const statusCell = document.createElement('td');

  const statusBadge = document.createElement('span');
  statusBadge.dataset.role = 'reading-status';
  configureStatusBadge(statusBadge, book);
  statusCell.append(statusBadge);

  const actionsCell = document.createElement('td');

  const actions = document.createElement('div');
  actions.className = 'd-flex flex-wrap gap-2';

  const statusButton = createActionButton(
    book,
    'change-status',
    'btn btn-outline-primary btn-sm',
  );

  configureStatusButton(statusButton, book);

  const removeButton = createActionButton(
    book,
    'remove-reading',
    'btn btn-outline-danger btn-sm',
  );

  removeButton.textContent = 'Quitar';
  removeButton.setAttribute(
    'aria-label',
    `Quitar “${book.title}” de tu lista de lecturas`,
  );

  actions.append(statusButton, removeButton);
  actionsCell.append(actions);

  row.append(titleCell, authorsCell, statusCell, actionsCell);

  return row;
}

export function updateReadingSummary(total) {
  readingCount.textContent = String(total);

  const label = total === 1 ? 'libro' : 'libros';
  readingCount.setAttribute('aria-label', `${total} ${label} en tu lista`);

  readingEmpty.hidden = total > 0;
  readingTableWrapper.hidden = total === 0;
}

export function renderInitialReadingList(books) {
  readingList.replaceChildren(...books.map(createReadingRow));
  updateReadingSummary(books.length);
}

export function appendReadingRow(book) {
  readingList.append(createReadingRow(book));
}

export function updateReadingRow(book) {
  const row = findReadingRow(book.id);

  if (!row) {
    return;
  }

  const badge = row.querySelector('[data-role="reading-status"]');
  const button = row.querySelector('[data-action="change-status"]');

  configureStatusBadge(badge, book);
  configureStatusButton(button, book);
}

export function removeReadingRow(bookId) {
  const row = findReadingRow(bookId);

  if (!row) {
    return;
  }

  const nextButton =
    row.nextElementSibling?.querySelector('button') ??
    row.previousElementSibling?.querySelector('button');

  row.remove();

  if (nextButton) {
    nextButton.focus();
  } else {
    readingTitle.tabIndex = -1;
    readingTitle.focus();
  }
}

export function showReadingFeedback(message, variant = 'info') {
  readingFeedback.className = `alert alert-${variant}`;
  readingFeedback.textContent = message;
  readingFeedback.hidden = false;
}
