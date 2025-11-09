import { PaginationAndSortingType } from '../../../core/types/pagination-and-sorting-type';
import { DriverSortFieldInputEnum } from '../../routes/request-payloads/driver-sort-field-enum';

export type GetDriverListQuery =
  PaginationAndSortingType<DriverSortFieldInputEnum> &
    Partial<{
      searchDriverNameTerm: string;
      searchDriverEmailTerm: string;
      searchVehicleMakeTerm: string;
    }>;
