import { clearProposalFeedback } from './proposal-form.js';

const MIN_AUTHORS = 1;
const MAX_AUTHORS = 5;

const form = document.querySelector('#proposal-form');
const authorsContainer = document.querySelector('#authors-container');
const authorsHelp = document.querySelector('#authors-help');
const addAuthorButton = document.querySelector('#add-author-button');

let nextAuthorId = 2;

function getAuthorFields() {
  return Array.from(authorsContainer.querySelectorAll('[data-author-field]'));
}

function updateAuthorControls() {
  const fields = getAuthorFields();

  fields.forEach((field, index) => {
    const position = index + 1;
    const input = field.querySelector('input[name="authors"]');
    const label = field.querySelector('label');
    const removeButton = field.querySelector(
      'button[data-action="remove-author"]',
    );

    label.textContent = `Autor ${position}`;
    label.htmlFor = input.id;

    removeButton.disabled = fields.length <= MIN_AUTHORS;
    removeButton.setAttribute('aria-label', `Quitar autor ${position}`);
  });

  addAuthorButton.disabled = fields.length >= MAX_AUTHORS;

  authorsHelp.textContent =
    `Incluye entre uno y cinco autores. ` +
    `Actualmente: ${fields.length} de ${MAX_AUTHORS}.`;
}

function createAuthorField() {
  const inputId = `proposal-author-${nextAuthorId}`;
  const errorId = `${inputId}-error`;

  nextAuthorId += 1;

  const field = document.createElement('div');
  field.dataset.authorField = '';

  const label = document.createElement('label');
  label.className = 'form-label';
  label.htmlFor = inputId;

  const group = document.createElement('div');
  group.className = 'input-group has-validation';

  const input = document.createElement('input');
  input.id = inputId;
  input.name = 'authors';
  input.className = 'form-control';
  input.type = 'text';
  input.minLength = 1;
  input.maxLength = 120;
  input.pattern = '.*\\S.*';
  input.required = true;
  input.setAttribute('aria-describedby', `authors-help ${errorId}`);

  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-outline-secondary';
  removeButton.type = 'button';
  removeButton.dataset.action = 'remove-author';
  removeButton.textContent = 'Quitar';

  const error = document.createElement('div');
  error.id = errorId;
  error.className = 'invalid-feedback';

  group.append(input, removeButton, error);
  field.append(label, group);

  return field;
}

function addAuthor() {
  if (getAuthorFields().length >= MAX_AUTHORS) {
    return;
  }

  const field = createAuthorField();

  authorsContainer.append(field);
  updateAuthorControls();
  clearProposalFeedback();

  field.querySelector('input[name="authors"]').focus();
}

function removeAuthor(button) {
  const fields = getAuthorFields();

  if (fields.length <= MIN_AUTHORS) {
    return;
  }

  const field = button.closest('[data-author-field]');
  const index = fields.indexOf(field);

  if (index === -1) {
    return;
  }

  field.remove();

  updateAuthorControls();
  clearProposalFeedback();

  const remainingFields = getAuthorFields();
  const nextField =
    remainingFields[Math.min(index, remainingFields.length - 1)];

  nextField.querySelector('input[name="authors"]').focus();
}

export function initProposalAuthors() {
  updateAuthorControls();

  addAuthorButton.addEventListener('click', addAuthor);

  authorsContainer.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest('button[data-action="remove-author"]');

    if (!button || !authorsContainer.contains(button) || button.disabled) {
      return;
    }

    removeAuthor(button);
  });

  form.addEventListener('reset', () => {
    getAuthorFields()
      .slice(1)
      .forEach((field) => field.remove());

    updateAuthorControls();
  });
}
