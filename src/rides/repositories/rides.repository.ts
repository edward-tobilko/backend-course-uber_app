import { ObjectId, WithId } from 'mongodb';
import { log } from 'node:console';

import { rideCollection } from '../../db/mongo.db';
import { RideTypeAttributes } from '../routers/output/ride-data-type.output';

export const ridesRepository = {
  async findAllRidesRepo(): Promise<WithId<RideTypeAttributes>[]> {
    return rideCollection.find().toArray();
  },

  async findRideById(id: string): Promise<WithId<RideTypeAttributes> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) }); // Если результат поиска равно null или undefined, то вернем null.
  },

  async createNewRide(
    newRide: RideTypeAttributes,
  ): Promise<WithId<RideTypeAttributes>> {
    const createdRideResult = await rideCollection.insertOne(newRide);

    log('createdRideResult ->', createdRideResult); //   acknowledged: true, insertedId: new ObjectId('68e17d24405a39ae4442c337')

    return { ...newRide, _id: createdRideResult.insertedId }; // ObjectId('66efeaadeb3dafea3c3971fb')
  },

  // * метод для пошуку активної поїздки водія по id
  async findActiveRideByDriverIdRepo(
    driverId: string,
  ): Promise<RideTypeAttributes | null> {
    return rideCollection.findOne({ driverId, finishedAt: null });
  },

  async finishedRide(rideId: string, finishedAt: Date) {
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

    log('updateResult ->', updateResult);

    return;
  },
};
