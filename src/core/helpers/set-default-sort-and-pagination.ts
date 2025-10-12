import { paginationAndSortingDefault } from '../middlewares/validation/query-pagination-sorting-validation.middleware';
import { PaginationAndSortingType } from '../types/pagination-and-sorting-type';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: PaginationAndSortingType<P>,
): PaginationAndSortingType<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}

// ? P — generic-функція (тип поля), за яким можна сортувати, наприклад: Available values : createdAt, name, email - див в swagger
