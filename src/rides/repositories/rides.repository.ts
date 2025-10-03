import { dataBase } from '../../db/mongo.db';
import { RideType } from '../types/ride.types';

export const ridesRepository = {
  findAllRides(): RideType[] {
    return dataBase.rides;
  },

  findRideById(id: number): RideType | null {
    return dataBase.rides.find((ride) => ride.id === id) ?? null;
  },

  createNewRide(newRide: RideType): RideType {
    dataBase.rides.push(newRide);

    return newRide;
  },
};
