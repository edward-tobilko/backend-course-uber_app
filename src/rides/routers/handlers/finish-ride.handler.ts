import { Request, Response } from 'express';
import { log } from 'node:console';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { ridesRepository } from '../../repositories/rides.repository';
import { createErrorMessages } from '../../../core/utils/error-messages.util';

export async function finishRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const ride = await ridesRepository.findRideById(req.params.id);

    if (!ride) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
        .json(
          createErrorMessages([{ message: 'Ride is not found', field: 'id' }]),
        );
    }

    if (ride.finishedAt) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json(
        createErrorMessages([
          {
            message: 'Ride already finished',
            field: 'id',
          },
        ]),
      );
    }

    log('ride ->', ride);

    await ridesRepository.finishedRide(req.params.id, new Date());

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
