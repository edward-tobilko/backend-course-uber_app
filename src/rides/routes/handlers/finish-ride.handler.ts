import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { ridesService } from '../../application/rides.service';

export async function finishRideHandler(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
) {
  try {
    await ridesService.finishRide(req.params.id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
