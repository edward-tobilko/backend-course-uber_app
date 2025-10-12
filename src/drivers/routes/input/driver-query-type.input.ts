import { PaginationAndSortingType } from '../../../core/types/pagination-and-sorting-type';
import { DriverSortFieldInputEnum } from './driver-sort-field-enum.input';

export type DriverQueryTypeInput =
  PaginationAndSortingType<DriverSortFieldInputEnum> &
    Partial<{
      searchDriverNameTerm: string;
      searchDriverEmailTerm: string;
      searchVehicleMakeTerm: string;
    }>;
