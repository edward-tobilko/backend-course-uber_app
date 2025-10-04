import { WithId } from 'mongodb';

import { rideCollection } from '../../db/mongo.db';
import { RideType } from '../types/ride.types';

export const ridesRepository = {
  async findAllRides(): Promise<WithId<RideType>[]> {
    return rideCollection.find().toArray();
  },

  async findRideById(id: string): Promise<WithId<RideType> | null> {
    return rideCollection.findOne({ _id: new Object(id) }); // Если результат поиска равно null или undefined, то вернем null.
  },

  async createNewRide(newRide: RideType): Promise<WithId<RideType>> {
    const createdRideResult = await rideCollection.insertOne(newRide);

    return { ...newRide, _id: createdRideResult.insertedId }; // ObjectId('66efeaadeb3dafea3c3971fb')
  },

  // * метод для пошуку активної поїздки водія по id
  async findActiveRideByDriverId(driverId: string): Promise<RideType | null> {
    return rideCollection.findOne({ driverId, finishedAt: null });
  },

  async finishedRide(rideId: string, finishedAt: Date) {
    const updateResult = await rideCollection.updateOne(
      {
        _id: new Object(rideId),
      },
      {
        finishedAt,
        updatedAt: new Date(),
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Ride not exist');
    }

    return;
  },
};
