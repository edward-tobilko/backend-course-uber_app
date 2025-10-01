import { Request, Response, Router } from 'express';

import { dataBase } from '../../db/mock-db';
import { HTTP_STATUS_CODES } from '../../core/utils/http-statuses';

export const testingRouter = Router({});

testingRouter.delete('', (_req: Request, res: Response) => {
  dataBase.drivers = [];

  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
});
