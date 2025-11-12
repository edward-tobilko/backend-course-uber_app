// * Paginated output model
export type PaginatedOutput = {
  page: number; // Текущий номер страницы
  pageSize: number; // Количество элементов на странице
  pageCount: number; // Общее количество доступных страниц
  totalCount: number; // Общее количество элементов на всех страницах
};
