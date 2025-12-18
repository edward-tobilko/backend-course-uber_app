import { paginationAndSortingDefault } from '../middlewares/validation/query-pagination-sorting-validation.middleware';
import { PaginationAndSorting } from '../types/pagination-and-sorting-type';
import { SortDirection } from '../types/sort-direction-enum';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  queryParam: PaginationAndSorting<P>,
): PaginationAndSorting<P> {
  return {
    ...queryParam,
    pageNumber: queryParam.pageNumber ?? paginationAndSortingDefault.pageNumber,
    pageSize: queryParam.pageSize ?? paginationAndSortingDefault.pageSize,
    sortBy: (queryParam.sortBy ?? paginationAndSortingDefault.sortBy) as S,
    sortDirection:
      queryParam.sortDirection ??
      (paginationAndSortingDefault.sortDirection as SortDirection),
  };
}

// ? P — generic-функция (тип поля), по которому можно сортировать, например: Available values : createdAt, name, email - см. в swagger.
