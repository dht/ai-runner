import { Json } from '../types';

export const sortBy =
  (fieldName: string, direction: 'asc' | 'desc' = 'asc') =>
  (a: Json, b: Json) => {
    const aValue = a[fieldName];
    const bValue = b[fieldName];

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }

    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }

    return 0;
  };
