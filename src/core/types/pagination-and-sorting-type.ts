import { SortDirectionEnum } from './sort-direction-enum';

// * Type for paginationAndSortingDefault and setDefaultSortAndPaginationIfNotExist
export type PaginationAndSortingType<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S; // Available values : createdAt, name, email - див в swagger
  sortDirection: SortDirectionEnum;
};

// ? <S> - дженерик, який ми вказуємо, що sortBy у нас буде по дефолту "createdAt" - строка. <S> = DriverSortFieldTypeInput
// ? return:
// ? ...paginationAndSortingDefault → спочатку додає всі default значення.
// ? ...query → потім поверх дефолтів накладає параметри, які реально прийшли з req.query. (Тобто, якщо користувач щось передав — воно “перекриє” дефолт.)
// ? sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) → гарантує, що sortBy точно не буде undefined. Якщо користувач не передав sortBy, візьме дефолтне з paginationAndSortingDefault.
