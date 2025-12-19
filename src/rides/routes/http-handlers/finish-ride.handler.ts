import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { createCommand } from '../../../core/helpers/create-command';

type Param = { id: string };

export async function finishRideHandler(req: Request<Param>, res: Response) {
  try {
    const command = createCommand<{ rideId: string }>({
      rideId: req.params.id,
    });

    const result = await ridesService.finishRide(command);

    if (result.hasError()) {
      errorsHandler(result.errors, res);

      return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}

// ? Request<Params, ResBody, ReqBody, Query>
