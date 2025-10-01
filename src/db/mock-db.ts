import { DriverType, VehicleFeature } from '../drivers/types/driver.types';
import { RideType } from '../rides/types/ride.types';

export const dataBase = {
  drivers: <DriverType[]>[
    {
      id: 1,
      name: 'Sam',
      phoneNumber: '123-456-7890',
      email: 'sam.rider@example.com',
      vehicleMake: 'BMW',
      vehicleModel: 'Cabrio',
      vehicleYear: 2020,
      vehicleLicensePlate: 'ABC-32145',
      vehicleDescription: null,
      vehicleFeatures: [],
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Edward',
      phoneNumber: '123-456-7890',
      email: 'edward.rider@example.com',
      vehicleMake: 'Ford',
      vehicleModel: 'Mustang Shelby GT',
      vehicleYear: 2019,
      vehicleLicensePlate: 'XYZ-21342',
      vehicleDescription: null,
      vehicleFeatures: [VehicleFeature.WiFi, VehicleFeature.ChildSeat],
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Bob',
      phoneNumber: '123-456-7890',
      email: 'bob.rider@example.com',
      vehicleMake: 'BMW',
      vehicleModel: '18',
      vehicleYear: 2021,
      vehicleLicensePlate: 'LMN-31234',
      vehicleDescription: null,
      vehicleFeatures: [VehicleFeature.PetFriendly],
      createdAt: new Date(),
    },
  ],

  rides: <RideType[]>[],
};
