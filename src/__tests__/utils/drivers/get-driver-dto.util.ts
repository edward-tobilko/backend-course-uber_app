import { DriverInputDto } from '../../../drivers/dto/driver-input-dto.type';
import { VehicleFeature } from '../../../drivers/types/driver.types';

export const getDriverDto = (): DriverInputDto => {
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
