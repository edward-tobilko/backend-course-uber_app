import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting-type';
import { RideSortField } from '../../routes/request-type-payloads/ride-sort-field-enum';

export type GetRideListQuery = PaginationAndSorting<RideSortField>;
