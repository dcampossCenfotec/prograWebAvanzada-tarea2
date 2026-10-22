const form = document.querySelector('#proposal-form');
const submitButton = document.querySelector('#proposal-submit');
const feedback = document.querySelector('#proposal-feedback');
const yearInput = document.querySelector('#proposal-year');
const sessionDateInput = document.querySelector('#proposal-session-date');

const REQUIRED_MESSAGES = {
  title: 'Escribe el título del libro.',
  authors: 'Escribe el nombre del autor.',
  publicationYear: 'Ingresa el año de publicación.',
  pageCount: 'Ingresa la cantidad de páginas.',
  genre: 'Selecciona un género.',
  email: 'Ingresa tu correo electrónico.',
  sessionDate: 'Selecciona una fecha para la sesión.',
  reason: 'Escribe el motivo de tu propuesta.',
};

let validationAttempted = false;

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function refreshDateLimits() {
  const today = new Date();

  yearInput.max = String(today.getFullYear());
  sessionDateInput.min = getLocalDateString(today);
}

function getFields() {
  return Array.from(form.querySelectorAll('input, select, textarea')).filter(
    (field) => field.willValidate,
  );
}

function isProposalField(element) {
  return (
    element instanceof Element &&
    element.matches('input, select, textarea') &&
    element.form === form &&
    element.willValidate
  );
}

function getErrorElement(field) {
  const descriptionIds = field.getAttribute('aria-describedby') ?? '';

  return descriptionIds
    .split(/\s+/)
    .map((id) => document.getElementById(id))
    .find((element) => element?.classList.contains('invalid-feedback'));
}

function getValidationMessage(field) {
  const value = field.value.trim();
  const validity = field.validity;

  if (validity.badInput) {
    return field.type === 'date'
      ? 'Ingresa una fecha válida.'
      : 'Ingresa un número válido.';
  }

  if (field.required && value === '') {
    return REQUIRED_MESSAGES[field.name] ?? 'Completa este campo.';
  }

  if (validity.typeMismatch) {
    return field.type === 'email'
      ? 'Ingresa un correo electrónico válido.'
      : 'Revisa el formato de este campo.';
  }

  if (validity.rangeUnderflow) {
    return field.name === 'sessionDate'
      ? 'La fecha de la sesión no puede ser anterior a hoy.'
      : `Ingresa un valor mayor o igual a ${field.min}.`;
  }

  if (validity.rangeOverflow) {
    return field.name === 'publicationYear'
      ? `El año de publicación no puede ser posterior a ${field.max}.`
      : `Ingresa un valor menor o igual a ${field.max}.`;
  }

  if (validity.stepMismatch) {
    return 'Ingresa un número entero, sin decimales.';
  }

  if (validity.patternMismatch) {
    return 'Revisa el formato de este campo.';
  }

  // Comprobamos también las longitudes del texto sin espacios exteriores.
  // Esto cubre valores asignados mediante JavaScript.
  if (field.minLength > 0 && value.length < field.minLength) {
    return `Escribe al menos ${field.minLength} caracteres.`;
  }

  if (field.maxLength >= 0 && value.length > field.maxLength) {
    return `Escribe como máximo ${field.maxLength} caracteres.`;
  }

  if (!validity.valid) {
    return 'Revisa el valor de este campo.';
  }

  return '';
}

function showProposalFeedback(message, variant = 'info') {
  feedback.className = `alert alert-${variant} mt-3 mb-0`;
  feedback.textContent = message;
  feedback.hidden = false;
}

export function clearProposalFeedback() {
  feedback.hidden = true;
  feedback.textContent = '';
}

export function validateProposalField(field) {
  refreshDateLimits();

  // Elimina errores personalizados anteriores antes de revisar las reglas.
  field.setCustomValidity('');

  const message = getValidationMessage(field);
  const hasError = message !== '';

  field.setCustomValidity(message);
  field.classList.toggle('is-invalid', hasError);
  field.setAttribute('aria-invalid', String(hasError));

  const errorElement = getErrorElement(field);

  if (errorElement) {
    errorElement.textContent = message;
  }

  return field.checkValidity();
}

export function validateProposalForm() {
  validationAttempted = true;

  // Primero validamos todos; después comprobamos el resultado conjunto.
  const results = getFields().map(validateProposalField);

  return results.every(Boolean);
}

export function resetProposalValidation() {
  validationAttempted = false;
  refreshDateLimits();
  clearProposalFeedback();

  getFields().forEach((field) => {
    field.setCustomValidity('');
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');

    const errorElement = getErrorElement(field);

    if (errorElement) {
      errorElement.textContent = '';
    }
  });
}

export function initProposalForm() {
  form.noValidate = true;
  refreshDateLimits();

  form.addEventListener('focusout', (event) => {
    const field = event.target;

    if (isProposalField(field)) {
      validateProposalField(field);
    }
  });

  form.addEventListener('input', (event) => {
    const field = event.target;

    if (!isProposalField(field)) {
      return;
    }

    clearProposalFeedback();

    if (validationAttempted || field.classList.contains('is-invalid')) {
      validateProposalField(field);
    } else {
      field.setCustomValidity('');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearProposalFeedback();

    if (!validateProposalForm()) {
      const firstInvalid = getFields().find((field) => !field.validity.valid);
      firstInvalid?.focus();
      return;
    }

    showProposalFeedback('Los datos de tu propuesta son válidos.', 'success');
  });

  form.addEventListener('reset', resetProposalValidation);

  submitButton.disabled = false;
}
