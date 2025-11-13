import { PaginatedOutput } from '../../../core/types/paginated-type.output';
import { DriverDataOutput } from './driver-data-type.output';

export type DriverListPaginatedOutput = {
  meta: PaginatedOutput;
  data: DriverDataOutput[];
};
