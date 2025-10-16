// * Paginated output model
export type PaginatedTypeOutput = {
  page: number; // Поточний номер сторінки
  pageSize: number; // Кількість елементів на сторінці
  pageCount: number; // Загальна кількість доступних сторінок
  totalCount: number; // Загальна кількість елементів на всіх сторінках
};
