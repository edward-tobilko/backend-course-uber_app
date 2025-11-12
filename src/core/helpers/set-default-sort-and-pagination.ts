import { paginationAndSortingDefault } from '../middlewares/validation/query-pagination-sorting-validation.middleware';
import { PaginationAndSorting } from '../types/pagination-and-sorting-type';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: PaginationAndSorting<P>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}

// ? P — generic-функция (тип поля), по которому можно сортировать, например: Available values : createdAt, name, email - см. в swagger.
