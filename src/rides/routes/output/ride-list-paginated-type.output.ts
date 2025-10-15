import { PaginatedTypeOutput } from '../../../core/types/paginated-type.output';
import { RideDataTypeOutput } from './ride-data-type.output';

export type RideListPaginatedOutput = {
  meta: PaginatedTypeOutput;
  data: RideDataTypeOutput[];
};
