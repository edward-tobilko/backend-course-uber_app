import { Router } from 'express';

import { dataBase } from '../../db/mock-drivers.db';
import { HTTP_STATUS_CODES } from '../../core/types/http-statuses';

export const testingRouter = Router();

testingRouter.delete('/all-data', (_req, res) => {
  dataBase.drivers = [];

  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
});
