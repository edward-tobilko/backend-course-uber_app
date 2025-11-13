import { DriverQueryRepository } from '../repositories/driver-query.repository';
import { DriverListPaginatedOutput } from './output/driver-list-paginated-type.output';
import { DriverOutput } from './output/driver-type.output';
import { GetDriverListQuery } from './query-handlers/get-driver-list-type.query';

class DriverQueryService {
  private driverQueryRepository: DriverQueryRepository;

  constructor() {
    this.driverQueryRepository = new DriverQueryRepository();
  }

  async getDriverList(
    queryDto: GetDriverListQuery,
  ): Promise<DriverListPaginatedOutput> {
    return this.driverQueryRepository.findAllQueryRepo(queryDto);
  }

  async findDriverByIdOrFail(driverId: string): Promise<DriverOutput> {
    return this.driverQueryRepository.findDriverByIdOrFailQueryRepo(driverId);
  }
}

export const driversQueryService = new DriverQueryService();
