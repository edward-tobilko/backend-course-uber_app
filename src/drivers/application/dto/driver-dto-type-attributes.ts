import { VehicleFeatureEnum } from '../../routes/output/driver-data-type.output';

export type DriverDtoTypeAttributes = {
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

// ? dto (Data Transfer Object) - те, що присилає клієнт.
