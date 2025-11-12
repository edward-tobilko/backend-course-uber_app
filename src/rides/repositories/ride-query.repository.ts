import { ObjectId } from 'mongodb';

import { rideCollection } from '../../db/mongo.db';
import { RideListPaginatedOutput } from '../application/output/ride-list-paginated-type.output';
import { GetRideListRequestPayload } from '../routes/request-type-payloads/get-ride-list.request-payload';
import { mapToRideListPaginatedOutput } from '../application/mappers/map-to-ride-list-paginated-output.mapper';
import { RideOutput } from '../application/output/ride-type.output';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { mapToRideOutput } from '../application/mappers/map-to-ride-output.mapper';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';

export class RideQueryRepository {
  async findAllRidesQueryRepo(
    queryDto: GetRideListRequestPayload,
  ): Promise<RideListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const filter = {};

    const [items, totalCount] = await Promise.all([
      rideCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray(),

      rideCollection.countDocuments(filter),
    ]);

    return mapToRideListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findRideByIdOrFailQueryRepo(id: string): Promise<RideOutput> {
    const ride = await rideCollection.findOne({ _id: new ObjectId(id) });

    if (!ride) {
      throw new RepositoryNotFoundError('Ride is not exist');
    }

    return mapToRideOutput(ride);
  }

  async findRidesByDriverQueryRepo(
    driverId: string,
    queryDto: GetRideListRequestPayload,
  ): Promise<RideListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const page = Number(pageNumber) || DEFAULT_PAGE_NUMBER;
    const size = Number(pageSize) || DEFAULT_PAGE_SIZE;

    const filter = { 'driver.id': driverId };

    const [items, totalCount] = await Promise.all([
      rideCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * size)
        .limit(page)
        .toArray(),

      rideCollection.countDocuments(filter),
    ]);

    console.log('findRidesByDriverQueryRepo ->', {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      filter,
    });
    console.log('items.length =', items.length, ' totalCount =', totalCount);

    return mapToRideListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }
}
