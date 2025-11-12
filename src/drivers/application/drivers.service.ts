import { RidesRepository } from '../../rides/repositories/rides.repository';
import { ApplicationError } from '../../core/errors/application.error';
import { DriversRepository } from '../repositories/drivers.repository';
import {
  CreateDriverCommand,
  UpdateDriverCommand,
} from './commands/driver-type.commands';
import { WithMeta } from '../../core/types/with-meta-type';
import { ApplicationResult } from '../../core/result/application-result';
import { Driver } from '../domain/driver.domain';
import { createErrorApplicationResult } from '../../core/result/create-error-application-result';
import { DriverErrorCode } from '../routes/request-payloads/driver-errors-request.payload';

class DriversService {
  private driversRepository: DriversRepository;
  private ridesRepository: RidesRepository;

  constructor() {
    this.driversRepository = new DriversRepository();
    this.ridesRepository = new RidesRepository();
  }

  async create(
    command: WithMeta<CreateDriverCommand>,
  ): Promise<ApplicationResult<{ id: string } | null>> {
    // * создаем нового водителя
    const newDriver = Driver.createDriver(command.payload);

    const createdDriver = await this.driversRepository.saveRepo(newDriver);

    return new ApplicationResult({
      data: {
        id: createdDriver._id!.toString(),
      },
    });
  }

  async update(
    command: WithMeta<UpdateDriverCommand>,
  ): Promise<ApplicationResult<null>> {
    const { id, ...driverDomainDto } = command.payload;

    const driver = await this.driversRepository.findDriverByIdOrFailRepo(id);

    driver.updateDriver(driverDomainDto);

    await this.driversRepository.saveRepo(driver);

    return new ApplicationResult({ data: null });
  }

  async delete(
    command: WithMeta<{ id: string }>,
  ): Promise<ApplicationResult<null>> {
    const id = command.payload.id;

    const activeRide =
      await this.ridesRepository.findActiveRideByDriverIdRepo(id);

    if (activeRide) {
      return createErrorApplicationResult(
        'Driver has an active ride. Complete or cancel the ride first',
        DriverErrorCode.HasActiveRide,
        command.meta.throwError,
      );
    }

    await this.driversRepository.deleteRepo(id);

    return new ApplicationResult({ data: null });
  }
}

export const driversService = new DriversService();
