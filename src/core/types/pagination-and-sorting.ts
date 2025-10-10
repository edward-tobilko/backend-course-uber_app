import { SortDirection } from './sort-direction';

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};

// ? <S> - дженерик, який ми вказуємо, що sortBy у нас буде по дефолту "createdAt" строка.
