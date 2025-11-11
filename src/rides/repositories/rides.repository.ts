import { ObjectId, WithId } from 'mongodb';

import { rideCollection } from '../../db/mongo.db';
import { RideTypeAttributes } from '../application/output/ride-data-type.output';
import { RideQueryTypeInput } from '../routes/input/ride-query-type.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';

export class RidesRepository {
  async findRidesByDriverRepo(
    driverId: string,
    queryDto: RideQueryTypeInput,
  ): Promise<{ items: WithId<RideTypeAttributes>[]; totalCount: number }> {
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

    console.log('findRidesByDriverRepo ->', {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      filter,
    });
    console.log('items.length =', items.length, ' totalCount =', totalCount);

    return { items, totalCount };
  }

  async findRideByIdRepo(
    id: string,
  ): Promise<WithId<RideTypeAttributes> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) }); // Если результат поиска равно null или undefined, то вернем null.
  }

  async findRideByIdOrFailRepo(
    id: string,
  ): Promise<WithId<RideTypeAttributes>> {
    const result = await rideCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      throw new RepositoryNotFoundError('Ride not exist');
    }

    return result;
  }

  async createNewRideRepo(newRide: RideTypeAttributes): Promise<string> {
    const insertResult = await rideCollection.insertOne(newRide);

    return insertResult.insertedId.toString(); // ObjectId('66efeaadeb3dafea3c3971fb')
  }

  // * метод для пошуку активної поїздки водія по id
  async findActiveRideByDriverIdRepo(
    driverId: string,
  ): Promise<RideTypeAttributes | null> {
    return rideCollection.findOne({ driverId, finishedAt: null });
  }

  async finishRideRepo(rideId: string, finishedAt: Date) {
    const updateResult = await rideCollection.updateOne(
      {
        _id: new ObjectId(rideId),
      },
      {
        $set: {
          finishedAt,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Ride not exist');
    }

    return;
  }
}
