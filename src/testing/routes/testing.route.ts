import { Request, Response, Router } from 'express';

import { HTTP_STATUS_CODES } from '../../core/utils/http-statuses';
import { driverCollection, rideCollection } from '../../db/mongo.db';

export const testingRoute = Router({});

testingRoute.delete(
  '',
  async (_req: Request<{}, {}, {}, {}>, res: Response) => {
    await Promise.all([
      driverCollection.deleteMany(),
      rideCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  },
);
