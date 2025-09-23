import express, { Express, Request, Response } from 'express';

import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './drivers/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json()); // * middleware для парсинга JSON в теле (body) запроса

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  // * Подключаем роутеры
  app.use('/drivers', driversRouter);
  app.use('/testing', testingRouter);

  return app;
};
