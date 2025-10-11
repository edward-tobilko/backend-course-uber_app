import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { DriverSortFieldTypeInput } from './driver-sort-field-type.input';

export type DriverQueryTypeInput =
  PaginationAndSorting<DriverSortFieldTypeInput> &
    Partial<{
      searchDriverNameTerm: string;
      searchDriverEmailTerm: string;
      searchVehicleMakeTerm: string;
    }>;
