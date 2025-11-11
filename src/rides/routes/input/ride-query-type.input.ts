import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting-type';
import { RideSortField } from '../request-type-payloads/ride-sort-field-enum';

export type RideQueryInput = PaginationAndSorting<RideSortField>;
