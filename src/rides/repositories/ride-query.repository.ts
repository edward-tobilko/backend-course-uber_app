import { WithId } from 'mongodb';

import { rideCollection } from '../../db/mongo.db';
import { RideQueryTypeInput } from '../routes/input/ride-query-type.input';
import { RideTypeAttributes } from '../application/output/ride-data-type.output';

export class RideQueryRepository {
  async findAllRidesQueryRepo(
    queryDto: RideQueryTypeInput,
  ): Promise<{ items: WithId<RideTypeAttributes>[]; totalCount: number }> {
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

    return { items, totalCount };
  }
}
