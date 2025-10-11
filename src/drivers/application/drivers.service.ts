import { WithId } from 'mongodb';

import { driversRepository } from '../repositories/drivers.repository';
import { DriverQueryTypeInput } from '../routes/input/driver-query-type.input';
import { DriverDataTypeAttributes } from '../routes/output/driver-data-type.output';
import { DriverDtoTypeAttributes } from './dto/driver-attributes';
import { ridesRepository } from '../../rides/repositories/rides.repository';
import { DomainError } from '../../core/errors/domain.error';

export const driversService = {
  async findAll(queryDto: DriverQueryTypeInput): Promise<{
    items: WithId<DriverDataTypeAttributes>[];
    totalCount: number;
  }> {
    return await driversRepository.findAllRepo(queryDto);
  },

  async findDriverByIdOrFail(
    driverId: string,
  ): Promise<WithId<DriverDataTypeAttributes>> {
    return await driversRepository.findDriverByIdOrFailRepo(driverId);
  },

  async create(dto: DriverDtoTypeAttributes): Promise<string> {
    // * создаем нового водителя
    const newDriver: DriverDataTypeAttributes = {
      name: dto.name, // ті значення, які до нас прийшли від клієнта
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      vehicle: {
        make: dto.vehicleMake,
        model: dto.vehicleModel,
        year: dto.vehicleYear,
        licensePlate: dto.vehicleLicensePlate,
        description: dto.vehicleDescription,
        features: dto.vehicleFeatures,
      },
      createdAt: new Date(),
    };

    return await driversRepository.createRepo(newDriver);
  },

  async update(id: string, dto: DriverDtoTypeAttributes): Promise<void> {
    await driversRepository.updateRepo(id, dto);

    return;
  },

  async delete(id: string): Promise<void> {
    const activeRide = await ridesRepository.findActiveRideByDriverIdRepo(id);

    if (activeRide) {
      throw new DomainError(
        'Driver has an active ride. Complete or cancel the ride first',
      );
    }

    await driversRepository.deleteRepo(id);

    return;
  },
};
