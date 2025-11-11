import { SortDirection } from './sort-direction-enum';

// * Type for paginationAndSortingDefault and setDefaultSortAndPaginationIfNotExist
export type PaginationAndSorting<S> = {
  pageNumber: number; // Поточний номер сторінки
  pageSize: number; // Кількість елементів на сторінці
  sortBy: S; // Available values -> see RideSortFieldEnumInput or DriverSortFieldInputEnum
  sortDirection: SortDirection;
};

// ? <S> - дженерик, який ми вказуємо, що sortBy у нас буде по дефолту "createdAt" - строка. <S> = DriverSortFieldTypeInput or RideSortFieldEnumInput
// ? return:
// ? ...paginationAndSortingDefault → спочатку додає всі default значення.
// ? ...query → потім поверх дефолтів накладає параметри, які реально прийшли з req.query. (Тобто, якщо користувач щось передав — воно “перекриє” дефолт.)
// ? sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) → гарантує, що sortBy точно не буде undefined. Якщо користувач не передав sortBy, візьме дефолтне з paginationAndSortingDefault.
