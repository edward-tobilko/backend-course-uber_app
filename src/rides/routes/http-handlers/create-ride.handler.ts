import { Request, Response } from 'express';
import { log } from 'node:console';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { ridesService } from '../../application/rides.service';
import { CreateRideRequestPayload } from '../request-type-payloads/create-ride.request-payload';
import { createCommand } from '../../../core/helpers/create-command';

export async function createRideHandler(
  req: Request<{}, {}, CreateRideRequestPayload>,
  res: Response,
) {
  try {
    const command = createCommand(req.body.data.attributes);

    const cratedRide = await ridesService.createNewRide(command);

    log('cratedRide ->', cratedRide);

    res.status(HTTP_STATUS_CODES.CREATED_201).json(cratedRide);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
