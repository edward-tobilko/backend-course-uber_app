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

// ? 1 - Резюме потока данных от сервера к клиенту: (service -> repository -> mapper -> handler -> router):
// ? - Клиент отправляет запрос → GET /drivers
// ? - Контроллер (getDriverListHandler) вызывает driversRepository.findAll()
// ? - Repository получает документы из MongoDB (driverCollection.find().toArray())
// ? - Mapper (mapToDriverViewModelUtil) конвертирует _id → id и убирает технические поля
// ? - Контроллер возвращает JSON клиенту

// ? 2- Поток данных выглядит так (DriverDto -> validation -> DriverType -> DriverViewModelType):
// ? - Клиент отправляет тело запроса в формате DriverDto.
// ? - Контроллер принимает этот DTO, выполняет валидацию.
// ? - Repository/Service преобразует DTO → DriverType (например, группирует vehicle-поля в один объект).
// ? - Сохраняет в MongoDB как DriverType.
// ? - Когда возвращает обратно клиенту → мапит DriverType → DriverViewModelType (чтобы _id стал id).
