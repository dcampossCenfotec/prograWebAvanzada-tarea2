import { useState } from 'react';
import {
  BOOK_FORM_LIMITS,
  parseAuthors,
  validateBookForm,
} from '../../validation/book-validation.js';

const EMPTY_FORM = {
  title: '',
  authors: '',
  proposedBy: '',
};

export default function BookForm({ members, onAddBook }) {
  const [values, setValues] = useState(() => ({ ...EMPTY_FORM }));
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const errors = validateBookForm(values, members);

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([name]) => submitted || touched[name]),
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFeedback('');
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((currentTouched) => ({
      ...currentTouched,
      [name]: true,
    }));
  }

  function resetForm() {
    setValues({ ...EMPTY_FORM });
    setTouched({});
    setSubmitted(false);
    setFeedback('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setFeedback('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    const title = values.title.trim();

    onAddBook({
      title,
      authors: parseAuthors(values.authors),
      proposedBy: values.proposedBy,
    });

    resetForm();
    setFeedback(`Agregaste “${title}” a la colección del club.`);
  }

  function handleReset(event) {
    event.preventDefault();
    resetForm();
  }

  return (
    <section className="card shadow-sm mb-4" aria-labelledby="add-book-title">
      <div className="card-body p-3 p-md-4">
        <h2 id="add-book-title" className="h4" tabIndex={-1}>
          Agrega una lectura
        </h2>

        <p className="text-body-secondary">
          Todos los campos son obligatorios. Los libros nuevos comienzan con
          estado Pendiente.
        </p>

        <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
          {submitted && Object.keys(errors).length > 0 && (
            <p className="alert alert-danger" role="alert">
              Revisa los campos indicados antes de agregar el libro.
            </p>
          )}

          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="club-book-title" className="form-label">
                Título del libro
              </label>

              <input
                id="club-book-title"
                name="title"
                className={
                  visibleErrors.title
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                type="text"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={BOOK_FORM_LIMITS.titleLength}
                aria-invalid={Boolean(visibleErrors.title)}
                aria-describedby="club-book-title-error"
                required
              />

              <div id="club-book-title-error" className="invalid-feedback">
                {visibleErrors.title}
              </div>
            </div>

            <div className="col-12 col-md-8">
              <label htmlFor="club-book-authors" className="form-label">
                Autores
              </label>

              <textarea
                id="club-book-authors"
                name="authors"
                className={
                  visibleErrors.authors
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                rows={3}
                value={values.authors}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(visibleErrors.authors)}
                aria-describedby="club-book-authors-help club-book-authors-error"
                required
              />

              <p id="club-book-authors-help" className="form-text mb-0">
                Un autor por línea, hasta {BOOK_FORM_LIMITS.maxAuthors}. Máximo{' '}
                {BOOK_FORM_LIMITS.authorLength} caracteres por autor.
              </p>

              <div id="club-book-authors-error" className="invalid-feedback">
                {visibleErrors.authors}
              </div>
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="club-book-member" className="form-label">
                Miembro que lo propone
              </label>

              <select
                id="club-book-member"
                name="proposedBy"
                className={
                  visibleErrors.proposedBy
                    ? 'form-select is-invalid'
                    : 'form-select'
                }
                value={values.proposedBy}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(visibleErrors.proposedBy)}
                aria-describedby="club-book-member-error"
                required
              >
                <option value="" disabled>
                  Selecciona un miembro
                </option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <div id="club-book-member-error" className="invalid-feedback">
                {visibleErrors.proposedBy}
              </div>
            </div>

            <div className="col-12 d-flex flex-wrap gap-2">
              <button className="btn btn-primary" type="submit">
                Agregar al club
              </button>

              <button className="btn btn-outline-secondary" type="reset">
                Limpiar formulario
              </button>
            </div>
          </div>
        </form>

        <div role="status" aria-live="polite" aria-atomic="true">
          {feedback && (
            <p className="alert alert-success mt-3 mb-0">{feedback}</p>
          )}
        </div>
      </div>
    </section>
  );
}
