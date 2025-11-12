import { ObjectId, WithId } from 'mongodb';

import { rideCollection } from '../../db/mongo.db';
import { Ride } from '../domain/ride.domain';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';

export class RidesRepository {
  async findRideByIdOrFailRepo(id: string): Promise<WithId<Ride>> {
    const ride = await rideCollection.findOne({ _id: new ObjectId(id) }); // Если результат поиска равно null или undefined, то вернем null.

    if (!ride) {
      throw new RepositoryNotFoundError('Ride is not exist!');
    }

    return Ride.reconstitute(ride);
  }

  async saveRideRepo(newRide: Ride): Promise<Ride> {
    if (!newRide._id) {
      // или создаем
      const insertResult = await rideCollection.insertOne(newRide);

      newRide._id = insertResult.insertedId;

      return newRide;
    } else {
      // или обновляем уже существующего
      const { _id, ...dtoToUpdate } = newRide;

      const updateResult = await rideCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            ...dtoToUpdate,
          },
        },
      );

      if (updateResult.matchedCount < 1) {
        throw new Error('Ride is not exist');
      }

      return newRide;
    }
  }

  // * метод для поиска активной поездки водителя по id
  async findActiveRideByDriverIdRepo(driverId: string): Promise<Ride | null> {
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
      throw new Error('Ride is not exist');
    }

    return;
  }
}
