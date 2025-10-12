import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { RideCreateTypeInput } from '../input/ride-create-type.input';
import { ridesService } from '../../application/rides.service';
import { mapToRideOutputMapper } from '../mappers/map-to-ride-output.mapper';

export async function createRideHandler(
  req: Request<{}, {}, RideCreateTypeInput>,
  res: Response,
) {
  try {
    const createdRideId = await ridesService.createNewRide(
      req.body.data.attributes,
    );

    const cratedRide = await ridesService.findRideByIdOrFail(createdRideId);

    const rideOutput = mapToRideOutputMapper(cratedRide);

    res.status(HTTP_STATUS_CODES.CREATED_201).json(rideOutput);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
