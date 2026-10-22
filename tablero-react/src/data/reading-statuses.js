export const READING_STATUS = Object.freeze({
  PENDING: 'Pendiente',
  READING: 'Leyendo',
  READ: 'Leído',
});

export const READING_STATUSES = Object.freeze(Object.values(READING_STATUS));

export function getNextReadingStatus(currentStatus) {
  const index = READING_STATUSES.indexOf(currentStatus);
  return READING_STATUSES[(index + 1) % READING_STATUSES.length];
}
