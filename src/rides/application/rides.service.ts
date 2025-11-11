import { WithId } from 'mongodb';

import { RideQueryTypeInput } from '../routes/input/ride-query-type.input';
import { RideTypeAttributes } from './output/ride-data-type.output';
import { ridesRepository } from '../repositories/rides.repository';
import { driversRepository } from '../../drivers/repositories/drivers.repository';
import { RideDtoTypeAttributes } from './dto/ride-dto-type.attributes';
import { DomainError } from '../../core/errors/application.error';

export const ridesService = {
  async findAllRides(
    queryDto: RideQueryTypeInput,
  ): Promise<{ items: WithId<RideTypeAttributes>[]; totalCount: number }> {
    return ridesRepository.findAllRidesRepo(queryDto);
  },

  async findRidesByDriver(
    driverId: string,
    queryDto: RideQueryTypeInput,
  ): Promise<{ items: WithId<RideTypeAttributes>[]; totalCount: number }> {
    await driversRepository.findDriverByIdOrFailRepo(driverId);

    return ridesRepository.findRidesByDriverRepo(driverId, queryDto);
  },

  async findRideByIdOrFail(id: string): Promise<WithId<RideTypeAttributes>> {
    return ridesRepository.findRideByIdOrFailRepo(id);
  },

  async createNewRide(dto: RideDtoTypeAttributes): Promise<string> {
    const driver = await driversRepository.findDriverByIdOrFailRepo(
      dto.driverId,
    );

    // * Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await ridesRepository.findActiveRideByDriverIdRepo(
      dto.driverId,
    );

    if (activeRide) {
      throw new DomainError(
        `Driver has an active ride. Complete or cancel the ride first`,
      );
    }

    const newRide: RideTypeAttributes = {
      clientName: dto.clientName,
      driver: {
        id: dto.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} - ${driver.vehicle.model}`,
      },
      price: dto.price,
      currency: dto.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: dto.fromAddress,
        to: dto.toAddress,
      },
    };

    return await ridesRepository.createNewRideRepo(newRide);
  },

  async finishRide(rideId: string) {
    const ride = await ridesRepository.findRideByIdOrFailRepo(rideId);

    if (ride.finishedAt) {
      throw new DomainError(`Ride is already finished at ${ride.finishedAt}`);
    }

    await ridesRepository.finishRideRepo(rideId, new Date());
  },
};
