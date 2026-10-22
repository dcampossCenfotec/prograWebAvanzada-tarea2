import { READING_STATUS } from './reading-statuses.js';

export const INITIAL_BOOKS = [
  {
    id: 'book-001',
    title: 'Cien años de soledad',
    authors: ['Gabriel García Márquez'],
    proposedBy: 'member-001',
    status: READING_STATUS.PENDING,
  },
  {
    id: 'book-002',
    title: 'El principito',
    authors: ['Antoine de Saint-Exupéry'],
    proposedBy: 'member-002',
    status: READING_STATUS.READING,
  },
  {
    id: 'book-003',
    title: 'Orgullo y prejuicio',
    authors: ['Jane Austen'],
    proposedBy: 'member-003',
    status: READING_STATUS.READ,
  },
  {
    id: 'book-004',
    title: 'La metamorfosis',
    authors: ['Franz Kafka'],
    proposedBy: 'member-002',
    status: READING_STATUS.PENDING,
  },
  {
    id: 'book-005',
    title: 'Don Quijote de la Mancha',
    authors: ['Miguel de Cervantes'],
    proposedBy: 'member-003',
    status: READING_STATUS.READING,
  },
  {
    id: 'book-006',
    title: 'Frankenstein',
    authors: ['Mary Shelley'],
    proposedBy: 'member-001',
    status: READING_STATUS.READ,
  },
];
