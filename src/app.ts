import express, { Express, Request, Response } from 'express';

import { driversRoute } from './drivers/routes/drivers.route';
import {
  DRIVERS_PATH,
  RIDES_PATH,
  ROOT_PATH,
  TESTING_PATH,
} from './core/paths/paths';
import { ridesRoute } from './rides/routes/riders.route';
import { setupSwagger } from './core/swagger/setup-swagger';
import { testingRoute } from './testing/routes/testing.route';

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */

export const setupApp = (app: Express) => {
  app.use(express.json()); // * middleware для парсинга JSON в теле (body) запроса

  app.get(ROOT_PATH, (_req: Request, res: Response) => {
    res.status(200).send('Hello back!!!');
  });

  // * Подключаем роутеры
  app.use(DRIVERS_PATH, driversRoute);
  app.use(RIDES_PATH, ridesRoute);
  app.use(TESTING_PATH, testingRoute);

  setupSwagger(app);

  return app;
};

// ? 1 - Резюме потоку даних від сервера до клієнта: (service -> repository -> mapper -> handler -> router):
// ? - Клієнт надсилає запит → GET /drivers
// ? - Контролер (getDriverListHandler) викликає driversRepository.findAll()
// ? - Repository дістає документи з MongoDB (driverCollection.find().toArray())
// ? - Mapper (mapToDriverViewModelUtil) конвертує _id → id і прибирає технічні поля
// ? - Контролер повертає JSON клієнту

// ? 2- Потік даних виглядає так (DriverInputDto -> validation -> DriverType -> DriverViewModelType):
// ? - Клієнт шле тіло запиту у форматі DriverInputDto.
// ? - Контролер приймає цей DTO, робить валідацію.
// ? - Repository/Service перетворює DTO → DriverType (наприклад, групує vehicle-поля в один об’єкт).
// ? - Зберігає у MongoDB як DriverType.
// ? - Коли віддає назад клієнту → мапить DriverType → DriverViewModelType (щоб _id став id).
