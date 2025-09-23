import { Request, Response } from 'express';

import { DriverInputDto } from '../../dto/driver.input-dto';
import { driverInputDtoValidation } from '../../validation/driver-validation';
import { HTTP_STATUS_CODES } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/errors.utils';
import { dataBase } from '../../../db/mock-drivers.db';
import { Driver } from '../../types/driver.types';
import { driversRepository } from '../../repositories/drivers.repository';

export function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  // * проверяем приходящие данные на валидность
  const errors = driverInputDtoValidation(req.body);

  // * если есть хоть одна ошибка -> выдаем status 400
  if (errors.length > 0) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .send(createErrorMessages(errors));
  }

  // * проверяем есть ли хоть один элемент в массиве и если массив не пустой ? берем последний елемент, смотрим его driverId  и добавляем + 1 : а иначе возвращаем 1 (будет первый id).
  const nextId = dataBase.drivers.length
    ? dataBase.drivers[dataBase.drivers.length - 1].id + 1
    : 1;

  // * создаем нового водителя
  const newDriver: Driver = {
    id: nextId, // самі генеруємо
    name: req.body.name, // ті значення, які до нас прийшли від клієнта
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    vehicleMake: req.body.vehicleMake,
    vehicleModel: req.body.vehicleModel,
    vehicleYear: req.body.vehicleYear,
    vehicleLicensePlate: req.body.vehicleLicensePlate,
    vehicleDescription: req.body.vehicleDescription,
    vehicleFeatures: req.body.vehicleFeatures,
    createdAt: new Date(),
  };

  driversRepository.create(newDriver);

  res.status(HTTP_STATUS_CODES.CREATED_201).json(newDriver);
}
