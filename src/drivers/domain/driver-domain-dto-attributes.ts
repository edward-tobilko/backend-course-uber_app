import { VehicleFeatureEnum } from './driver';

export type DriverDomainDtoAttributes = {
  name: string;
  phoneNumber: string;
  email: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeatureEnum[];
};

// ? dto (Data Transfer Object) - то, что присылает клиент.
