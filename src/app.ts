import express, { Express, Request, Response } from 'express';
import { log } from 'node:console';

import { dataBase } from './db/mock-drivers.db';
import { Driver } from '@/types/drivers.types';
import { HTTP_STATUS_CODES } from './utils/http-codes';
// import { driverSchema } from './config/driver.schema';

export const setupApp = (app: Express) => {
  app.use(express.json()); // * middleware для парсинга JSON в теле запроса

  // * Routes
  // ? method GET
  app.get(['/', '/drivers'], (req: Request<{}>, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).send(dataBase.drivers);
  });

  app.get(
    `/drivers/:driverId`,
    (
      req: Request<{ driverId: string }, Driver, {}, {}>,
      res: Response<Driver | null>,
    ) => {
      // * ищем водителя в бд по id
      const foundDriver = dataBase.drivers.find(
        (driver) => driver.id === +req.params.driverId,
      );

      if (!foundDriver) {
        return res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUS_CODES.OK_200).json(foundDriver);
    },
  );

  // ? method POST
  app.post(`/drivers`, (req: Request<{}>, res: Response) => {
    // * проверяем приходящие данные на валидность

    // // Защита от undefined/null/не-объекта
    // if (!req.body || typeof req.body !== 'object') {
    //   return res
    //     .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
    //     .json({ message: 'Request body must be a JSON object' });
    // }

    // * создаем нового водителя
    const newDriver: Driver = {
      // * проверяем есть ли хоть один элемент в массиве и если массив не пустой ? берем последний елемент, смотрим его driverId  и добавляем + 1 : а иначе возвращаем 1 (будет первый id).
      id: dataBase.drivers.length
        ? dataBase.drivers[dataBase.drivers.length - 1].id + 1
        : 1,
      name: req.body.name,
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

    log(newDriver);

    res.status(HTTP_STATUS_CODES.CREATED_201).json(newDriver);
  });

  app.delete('/testing/all-data', (req: Request, res: Response) => {
    dataBase.drivers = [];

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  // ? method DELETE
  // app.delete("/drivers/:id", (req: Request<{ id: number }>, res: Response) => {
  //   // знаходимо індекс водія, якого ми хочемо видалити
  //   for (let index = 0; index < dataBase.drivers.length; index++) {
  //     let driver = dataBase.drivers[index];

  //     if (driver.driverId === +req.params.id) {
  //       // видаляємо один елемент
  //       const [deletedDriver] = dataBase.drivers.splice(index, 1);

  //       // повертаємо підтвердження
  //       return res.status(HTTP_CODES.OK_200).json({
  //         Message: `Driver id=${+req.params.id} deleted successfully`,
  //         deleted: deletedDriver,
  //       });
  //     }
  //   }

  //   return res
  //     .status(HTTP_CODES.NOT_FOUND_404)
  //     .json({ message: `Driver with id=${+req.params.id} not found` });
  // });

  // // ? method UPDATE
  // app.put(
  //   "/drivers/:id",
  //   (req: Request<{ id: number }, { name: string }>, res: Response) => {
  //     const id = +req.params.id;

  //     // знаходимо індекс водія, якого ми хочемо обновити
  //     const index = dataBase.drivers.findIndex((index) => index.driverId === id);

  //     // перевіряємо, якщо водія не знайдено
  //     if (index === -1) {
  //       return res
  //         .status(HTTP_CODES.NOT_FOUND_404)
  //         .json({ message: `Driver with id=${id} not found` });
  //     }

  //     // отримуємо нову строку
  //     const raw = normalizeDriverName(req.body.name);

  //     log(raw);

  //     // перевіряємо на валідність нову строку
  //     if (!raw)
  //       return res
  //         .status(HTTP_CODES.BAD_REQUEST_400)
  //         .json({ message: "Name cannot be empty or spaces only" });

  //     dataBase.drivers[index].name = raw as DriversName;

  //     res.status(HTTP_CODES.OK_200).json({
  //       message: `Driver id=${id} updated successfully`,
  //       updatedDriver: dataBase.drivers[index],
  //     });
  //   }
  // );

  // app.patch(
  //   "/drivers/:id",
  //   (req: Request<{ id: number }, { name: string }>, res: Response) => {
  //     const id = +req.params.id;

  //     // знаходимо обʼєкт (водія), який ми будемо оновляти
  //     const driver = dataBase.drivers.find((driver) => driver.driverId === id);

  //     // перевіряємо, якщо обʼєкт не знайдено
  //     if (!driver)
  //       return res
  //         .status(HTTP_CODES.NOT_FOUND_404)
  //         .json({ message: `Driver with id=${id} not found` });

  //     // отримуємо нову строку з валідацією
  //     const raw = normalizeDriverName(req.body.name);

  //     // перевіряємо на валідність нову строку
  //     if (!raw)
  //       return res
  //         .status(HTTP_CODES.BAD_REQUEST_400)
  //         .json({ message: "Name cannot be empty or spaces only" });

  //     // оновлюємо лише те, що передали
  //     driver.name = raw as DriversName;

  //     res.status(HTTP_CODES.OK_200).json({
  //       message: `Driver id=${id} updated successfully`,
  //       updatedCourse: driver,
  //     });
  //   }
  // );

  return app;
};
