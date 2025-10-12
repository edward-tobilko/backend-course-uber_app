import { PaginatedTypeOutput } from '../../../core/types/paginated-type.output';
import { DriverDataTypeOutput } from './driver-data-type.output';

export type DriverListPaginatedTypeOutput = {
  meta: PaginatedTypeOutput;
  data: DriverDataTypeOutput[];
};
