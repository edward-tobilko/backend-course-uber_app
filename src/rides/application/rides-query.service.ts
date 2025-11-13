import { RideQueryRepository } from '../repositories/ride-query.repository';
import { GetRideListRequestPayload } from '../routes/request-type-payloads/get-ride-list.request-payload';
import { RideListPaginatedOutput } from './output/ride-list-paginated-type.output';
import { RideOutput } from './output/ride-type.output';

class RidesQueryService {
  private ridesQueryRepo = new RideQueryRepository();

  constructor() {
    this.ridesQueryRepo = new RideQueryRepository();
  }

  async findAllRides(
    queryDto: GetRideListRequestPayload,
  ): Promise<RideListPaginatedOutput> {
    return this.ridesQueryRepo.findAllRidesQueryRepo(queryDto);
  }

  async findRidesByDriver(
    driverId: string,
    queryDto: GetRideListRequestPayload,
  ): Promise<RideListPaginatedOutput> {
    return this.ridesQueryRepo.findRidesByDriverQueryRepo(driverId, queryDto);
  }

  async findRideByIdOrFail(id: string): Promise<RideOutput> {
    return this.ridesQueryRepo.findRideByIdOrFailQueryRepo(id);
  }
}

export const ridesQueryService = new RidesQueryService();
