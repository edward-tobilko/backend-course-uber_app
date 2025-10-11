import { PaginatedOutput } from '../../../core/types/paginatedOutput';
import { DriverDataTypeOutput } from './driver-data-type.output';

export type DriverListPaginatedTypeOutput = {
  meta: PaginatedOutput;
  data: DriverDataTypeOutput[];
};
