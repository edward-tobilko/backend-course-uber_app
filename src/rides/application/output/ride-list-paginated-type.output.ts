import { PaginatedOutput } from '../../../core/types/paginated-type.output';
import { RideDataOutput } from './ride-data-type.output';

export type RideListPaginatedOutput = {
  meta: PaginatedOutput;
  data: RideDataOutput[];
};
