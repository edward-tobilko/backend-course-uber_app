import { query } from 'express-validator';

import { PaginationAndSorting } from '../../types/pagination-and-sorting-type';
import { SortDirection } from '../../types/sort-direction-enum';

// * Дефолтные значения
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_DIRECTION = SortDirection.Desc; // "desc"

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>, // Record<string, T> - тип объекта, где ключи типа string, значения типа Т
) {
  return [
    query('pageNumber')
      .customSanitizer((value) =>
        value === undefined || value === '' ? DEFAULT_PAGE_NUMBER : value,
      )
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Page number must be a positive integer'),

    query('pageSize')
      .customSanitizer((value) =>
        value === undefined || value === '' ? DEFAULT_PAGE_SIZE : value,
      )
      .isInt({ min: 1, max: 100 })
      .toInt()
      .withMessage('Page size must be between 1 and 100'),

    query('sortBy')
      .customSanitizer((value) =>
        value === undefined || value === ''
          ? Object.values(sortFieldsEnum)[0] // Дефолтное значение - первое поле
          : value,
      )
      .isIn(Object.values(sortFieldsEnum))
      .withMessage(
        `Allowed sort fields: ${Object.values(sortFieldsEnum).join(', ')}`,
      ),

    query('sortDirection')
      .customSanitizer((value) =>
        value === undefined || value === ''
          ? DEFAULT_SORT_DIRECTION
          : String(value).toLowerCase(),
      )
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
      ),
  ];
}
