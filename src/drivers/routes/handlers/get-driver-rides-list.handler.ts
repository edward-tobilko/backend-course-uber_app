import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/errors/errors.handler';

export function getDriverRidesListHandler(
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
