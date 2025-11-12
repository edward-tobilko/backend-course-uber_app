import { PaginatedOutput } from '../../../core/types/paginated-type.output';
import { DriverDataTypeOutput } from './driver-data-type.output';

export type DriverListPaginatedTypeOutput = {
  meta: PaginatedOutput;
  data: DriverDataTypeOutput[];
};
