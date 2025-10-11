import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    await driversService.delete(req.params.id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
