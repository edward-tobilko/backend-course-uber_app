import express, { Express } from 'express';

import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './drivers/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json()); // * middleware для парсинга JSON в теле (body) запроса

  // * Подключаем роутеры
  app.use('/drivers', driversRouter);
  app.use('/testing', testingRouter);

  return app;
};
