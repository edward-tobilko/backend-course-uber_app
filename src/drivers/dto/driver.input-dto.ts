import { VehicleFeature } from '../types/driver.types';

export type DriverInputDto = {
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

// ? dto (Data Transfer Object) - то, что присылает клиент.
