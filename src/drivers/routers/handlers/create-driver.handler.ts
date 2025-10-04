import { Request, Response } from 'express';

import { DriverInputDto } from '../../dto/driver-input-dto.type';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverType } from '../../types/driver.types';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverViewModelUtil } from '../mappers/map-to-driver-view-model.util';

export async function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  try {
    // * создаем нового водителя
    const newDriver: DriverType = {
      name: req.body.name, // ті значення, які до нас прийшли від клієнта
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      vehicle: {
        make: req.body.vehicleMake,
        model: req.body.vehicleModel,
        year: req.body.vehicleYear,
        licensePlate: req.body.vehicleLicensePlate,
        description: req.body.vehicleDescription,
        features: req.body.vehicleFeatures,
      },
      createdAt: new Date(),
    };

    const createdDriver = await driversRepository.create(newDriver);

    const driverViewModelResponse = mapToDriverViewModelUtil(createdDriver); // додаємо id з mongoDB (_id: Object("someIdString"))

    res.status(HTTP_STATUS_CODES.CREATED_201).json(driverViewModelResponse);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
