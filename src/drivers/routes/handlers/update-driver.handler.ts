import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/errors/errors.handler';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { DriverUpdateTypeInput } from '../request-payloads/update-driver-request.payload';

export async function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverUpdateTypeInput>,
  res: Response,
) {
  try {
    await driversService.update(req.params.id, req.body.data.attributes);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
