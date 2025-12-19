import { ApplicationResult } from '../../core/result/application-result';
import { createErrorApplicationResult } from '../../core/result/create-error-application-result';
import { WithMeta } from '../../core/types/with-meta-type';
import { DriversRepository } from '../../drivers/repositories/drivers.repository';
import { DriverErrorCode } from '../../drivers/routes/request-payloads/driver-errors-request.payload';
import { Ride } from '../domain/ride.domain';
import { RidesRepository } from '../repositories/rides.repository';
import { CreateRideDtoCommand } from './commands/ride-dto-type.commands';

class RidesService {
  constructor(
    private driversRepo = new DriversRepository(),
    private ridesRepo = new RidesRepository(),
  ) {}

  async createNewRide(
    command: WithMeta<CreateRideDtoCommand>,
  ): Promise<ApplicationResult<{ id: string } | null>> {
    const dto = command.payload;

    const driver = await this.driversRepo.findDriverByIdOrFailRepo(
      dto.driverId,
    );

    // * Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await this.ridesRepo.findActiveRideByDriverIdRepo(
      dto.driverId,
    );

    if (activeRide) {
      return createErrorApplicationResult(
        `Driver has an active ride. Complete or cancel the ride first`,
        DriverErrorCode.HasActiveRide,
        command.meta.throwError,
      );
    }

    const newRide = Ride.createRide({
      ...dto,
      driverName: driver.name,
      vehicleLicensePlate: driver.vehicle.licensePlate,
      vehicleMake: driver.vehicle.make,
      vehicleModel: driver.vehicle.model,
    });

    const createdRide = await this.ridesRepo.saveRideRepo(newRide);

    return new ApplicationResult({ data: { id: createdRide._id!.toString() } });
  }

  async finishRide(
    command: WithMeta<{ rideId: string }>,
  ): Promise<ApplicationResult<null>> {
    const { payload: dto, meta } = command;

    const ride = await this.ridesRepo.findRideByIdOrFailRepo(dto.rideId);

    if (ride.finishedAt) {
      return createErrorApplicationResult(
        `Ride is already finished at ${ride.finishedAt}`,
        DriverErrorCode.AlreadyFinished,
        meta.throwError,
      );
    }

    ride.finishRide();

    await this.ridesRepo.saveRideRepo(ride);

    return new ApplicationResult({ data: null });
  }
}

export const ridesService = new RidesService();
