import { VehicleFeature } from '../types/driver.types';

export type DriverAttributes = {
  name: string;
  phoneNumber: string;
  email: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};

// ? Пояснення:
// * dto (Data Transfer Object) - те, що присилає клієнт.
