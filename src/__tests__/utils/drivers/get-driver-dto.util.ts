import { DriverInputDto } from '../../../drivers/application/dto/driver-dto-type-attributes';
import { VehicleFeature } from '../../../drivers/types/driver.types';

export const getDriverDtoUtil = (): DriverInputDto => {
  return {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };
};
