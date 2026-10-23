import { READING_STATUSES } from '../../data/reading-statuses.js';

export default function BookFilters({
  filters,
  members,
  onFilterChange,
  onResetFilters,
}) {
  const hasActiveFilters =
    filters.status !== 'all' || filters.memberId !== 'all';

  return (
    <section
      className="card shadow-sm mb-4"
      aria-labelledby="book-filters-title"
    >
      <div className="card-body">
        <h3 id="book-filters-title" className="h5">
          Filtrar lecturas
        </h3>

        <div className="row g-3 align-items-end">
          <div className="col-12 col-md">
            <label htmlFor="reading-status-filter" className="form-label">
              Estado
            </label>

            <select
              id="reading-status-filter"
              className="form-select"
              value={filters.status}
              onChange={(event) => onFilterChange('status', event.target.value)}
            >
              <option value="all">Todos los estados</option>

              {READING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md">
            <label htmlFor="reading-member-filter" className="form-label">
              Miembro proponente
            </label>

            <select
              id="reading-member-filter"
              className="form-select"
              value={filters.memberId}
              onChange={(event) =>
                onFilterChange('memberId', event.target.value)
              }
            >
              <option value="all">Todos los miembros</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-auto">
            <button
              className="btn btn-outline-primary w-100"
              type="button"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
