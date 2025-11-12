import { SortDirection } from './sort-direction-enum';

// * Type for paginationAndSortingDefault and setDefaultSortAndPaginationIfNotExist
export type PaginationAndSorting<S> = {
  pageNumber: number; // Текущий номер страницы
  pageSize: number;
  sortBy: S; // Available values -> see RideSortFieldEnumInput or DriverSortFieldInputEnum
  sortDirection: SortDirection;
};

// ? <S> - дженерик, который мы указываем, что sortBy у нас будет по умолчанию «createdAt» - строка. <S> = DriverSortField или RideSortField
// ? return:
// ? ...paginationAndSortingDefault → сначала добавляет все значения по умолчанию.
// ? ...query → затем поверх дефолтов накладывает параметры, которые реально пришли из req.query. (То есть, если пользователь что-то передал — оно «перекроет» дефолт.)
// ? sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) → гарантирует, что sortBy точно не будет undefined. Если пользователь не передал sortBy, возьмет дефолтное из paginationAndSortingDefault.
