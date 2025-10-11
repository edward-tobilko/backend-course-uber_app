import { paginationAndSortingDefault } from '../middlewares/validation/query-pagination-sorting-validation.middleware';
import { PaginationAndSorting } from '../types/pagination-and-sorting';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: PaginationAndSorting<P>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}

// ? P — generic-функція (тип поля), за яким можна сортуват (наприклад: Available values : createdAt, name, email - див в swagger)
