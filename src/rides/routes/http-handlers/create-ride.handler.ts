import { Request, Response } from 'express';
import { log } from 'node:console';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { ridesService } from '../../application/rides.service';
import { CreateRideRequestPayload } from '../request-type-payloads/create-ride.request-payload';
import { createCommand } from '../../../core/helpers/create-command';
import { CreateRideDtoCommand } from '../../application/commands/ride-dto-type.commands';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';

export async function createRideHandler(
  req: Request<{}, {}, CreateRideRequestPayload, {}>,
  res: Response,
) {
  try {
    const command = createCommand<CreateRideDtoCommand>(
      req.body.data.attributes,
    );

    const cratedRide = await ridesService.createNewRide(command);

    log('cratedRide ->', cratedRide);

    res.status(HTTP_STATUS_CODES.CREATED_201).json(cratedRide);
  } catch (error: unknown) {
    if (error instanceof RepositoryNotFoundError) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND_404).json({
        errorsMessages: [
          { message: (error as Error).message, field: 'driverId' },
        ],
      });
    }

    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500).json({
      errorsMessages: [{ message: 'Internal Server Error', field: 'driverId' }],
    });
  }
}

// ? Request<Params, ResBody, ReqBody, Query>
