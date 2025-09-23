import express, { Express, Request, Response } from 'express';

import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './drivers/routers/testing.router';
import { DRIVERS_PATH, ROOT_PATH, TESTING_PATH } from './core/paths/paths';

export const setupApp = (app: Express) => {
  app.use(express.json()); // * middleware для парсинга JSON в теле (body) запроса

  app.get(ROOT_PATH, (_req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  // * Подключаем роутеры
  app.use(DRIVERS_PATH, driversRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
