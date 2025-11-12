import { DriverDtoTypeAttributes } from '../../../drivers/domain/driver-dto.domain';
import { VehicleFeatureEnum } from '../../../drivers/application/output/driver-data-type.output';

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
