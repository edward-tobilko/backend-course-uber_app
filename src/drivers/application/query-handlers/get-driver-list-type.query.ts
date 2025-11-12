import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting-type';
import { DriverSortField } from '../../routes/request-payloads/driver-sort-field-enum';

export type GetDriverListQuery = PaginationAndSorting<DriverSortField> &
  Partial<{
    searchDriverNameTerm: string;
    searchDriverEmailTerm: string;
    searchVehicleMakeTerm: string;
  }>;
