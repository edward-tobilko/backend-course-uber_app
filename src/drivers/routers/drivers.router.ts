import { Request, Response, Router } from 'express';
import { log } from 'node:console';

import { HTTP_STATUS_CODES } from '../../core/types/http-statuses';
import { dataBase } from '../../db/mock-drivers.db';
import { createErrorMessages } from '../../core/utils/errors.utils';
import { driverInputDtoValidation } from '../validation/driver-validation';
import { DriverInputDto } from '../dto/driver.input-dto';
import { Driver } from '../types/driver.types';
import { normalizeDriverName } from '../../core/utils/normalize';

export const driversRouter = Router({});

// * Routes
// ? method GET
driversRouter.get('', (req: Request, res: Response) => {
  res.status(HTTP_STATUS_CODES.OK_200).send(dataBase.drivers);
});

driversRouter.get(
  `/:driverId`,
  (req: Request<{ driverId: string }>, res: Response) => {
    // * ищем водителя в бд по id
    const foundDriver = dataBase.drivers.find(
      (driver) => driver.id === +req.params.driverId,
    );

    if (!foundDriver) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND_404)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );
    }

    res.status(HTTP_STATUS_CODES.OK_200).json(foundDriver);
  },
);

// ? method POST
driversRouter.post(
  '',
  (req: Request<{}, {}, DriverInputDto>, res: Response) => {
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
      name: req.body.name, // ті значення які до нас прийшли
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

    // * добавляем newDriver в БД
    dataBase.drivers.push(newDriver);

    res.status(HTTP_STATUS_CODES.CREATED_201).json(newDriver);
  },
);

// ? method DELETE
driversRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  // * знаходимо індекс водія, якого ми хочемо видалити
  for (let index = 0; index < dataBase.drivers.length; index++) {
    let driver = dataBase.drivers[index];

    if (driver.id === +req.params.id) {
      // * видаляємо один елемент
      const [deletedDriver] = dataBase.drivers.splice(index, 1);

      // * повертаємо підтвердження
      return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).json({
        Message: `Driver id=${+req.params.id} deleted successfully`,
        deleted: deletedDriver,
      });
    }
  }

  return res
    .status(HTTP_STATUS_CODES.NOT_FOUND_404)
    .json({ message: `Driver with id=${+req.params.id} not found` });
});

// ? method UPDATE
driversRouter.put(
  '/:id',
  (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
    const id = +req.params.id;

    if (!Number.isInteger(id)) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
        .send(createErrorMessages([{ field: 'id', message: 'Invalid id' }]));
    }

    // * знаходимо індекс водія, якого ми хочемо обновити
    const index = dataBase.drivers.findIndex((driver) => driver.id === id);

    // * перевіряємо, якщо водія не знайдено
    if (index === -1) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND_404)
        .send(
          createErrorMessages([
            { field: `${id}`, message: 'Vehicle not found' },
          ]),
        );
    }

    const errors = driverInputDtoValidation(req.body);

    if (errors.length > 0) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
        .send(createErrorMessages(errors));
    }

    //   * знаходимо нам потрібного драйвера
    const driver = dataBase.drivers[index];

    log('driver ->', driver);

    // * змінюємо поля, які нам потрібні, але обʼєкт потрібно надсилати весь
    driver.name = req.body.name;
    driver.phoneNumber = req.body.phoneNumber;
    driver.email = req.body.email;
    driver.vehicleMake = req.body.vehicleMake;
    driver.vehicleModel = req.body.vehicleModel;
    driver.vehicleYear = req.body.vehicleYear;
    driver.vehicleLicensePlate = req.body.vehicleLicensePlate;
    driver.vehicleDescription = req.body.vehicleDescription;
    driver.vehicleFeatures = req.body.vehicleFeatures;

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  },
);

driversRouter.patch('/:id', (req: Request<{ id: number }>, res: Response) => {
  const id = +req.params.id;

  // * знаходимо обʼєкт (водія), який ми будемо оновляти
  const index = dataBase.drivers.find((driver) => driver.id === id);

  // * перевіряємо, якщо обʼєкт не знайдено
  if (!index)
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND_404)
      .json({ message: `Driver with id=${id} not found` });

  // * отримуємо нову строку з валідацією
  const raw = normalizeDriverName(req.body.name);

  // * перевіряємо на валідність нову строку
  if (!raw)
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .json({ message: 'Name cannot be empty or spaces only' });

  // * оновлюємо лише те, що передали
  index.name = raw;

  res.status(HTTP_STATUS_CODES.OK_200).json({
    message: `Driver id=${id} updated successfully`,
    updatedCourse: index,
  });
});
