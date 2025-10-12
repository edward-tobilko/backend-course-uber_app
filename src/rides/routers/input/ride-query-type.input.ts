import { PaginationAndSortingType } from '../../../core/types/pagination-and-sorting-type';
import { RideSortFieldEnumInput } from './ride-sort-field-enum.input';

export type RideQueryTypeInput =
  PaginationAndSortingType<RideSortFieldEnumInput>;
