import { DriverDtoTypeAttributes } from '../../../drivers/application/dto/driver-dto-type-attributes';
import { VehicleFeatureEnum } from '../../../drivers/routes/output/driver-data-type.output';

export const getDriverDtoUtil = (): DriverDtoTypeAttributes => {
  return {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeatureEnum.ChildSeat],
  };
};
